// Remember upload 0.1.159: authenticated replay, immutable Storage, no deletion.
import { createClient } from "npm:@supabase/supabase-js@2.118.0";
const ORIGIN = Deno.env.get("REMEMBER_ALLOWED_ORIGIN") || "https://container13.se";
const BUCKET = "remember-private-photos";
const MAX_BYTES = 2 * 1024 * 1024;
const MAX_REQUEST_BYTES = MAX_BYTES + 8192;
const headers = {
  "Access-Control-Allow-Origin": ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, apikey, authorization",
  "Cache-Control": "no-store",
  "X-Remember-Version": "0.1.159",
  "Vary": "Origin",
};
function reply(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), { status, headers: { ...headers, "Content-Type": "application/json" } });
}
function hex(bytes: Uint8Array) {
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}
async function readBounded(req: Request): Promise<Uint8Array> {
  if (!req.body) throw new Error("empty");
  const reader = req.body.getReader();
  const parts: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_REQUEST_BYTES) throw new Error("too_large");
      parts.push(value);
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  const result = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) { result.set(part, offset); offset += part.byteLength; }
  return result;
}
function signature(bytes: Uint8Array): string | null {
  if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return "image/jpeg";
  if (bytes.length >= 8 && [137,80,78,71,13,10,26,10].every((b,i) => bytes[i] === b)) return "image/png";
  if (bytes.length >= 12 && String.fromCharCode(...bytes.slice(0,4)) === "RIFF" &&
      String.fromCharCode(...bytes.slice(8,12)) === "WEBP") return "image/webp";
  return null;
}
Deno.serve(async req => {
  if (req.headers.get("origin") !== ORIGIN) return reply({ error: "Forbidden" }, 403);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "POST") return reply({ error: "Method not allowed" }, 405);
  const length = Number(req.headers.get("content-length") || 0);
  if (length > MAX_REQUEST_BYTES) return reply({ error: "Too large" }, 413);
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return reply({ error: "Unavailable" }, 503);
  let form: FormData;
  try {
    const body = await readBounded(req);
    const contentType = req.headers.get("content-type") || "";
    if (!/^multipart\/form-data;\s*boundary=/i.test(contentType)) return reply({ error: "Invalid content type" }, 415);
    form = await new Response(body, { headers: { "content-type": contentType } }).formData();
  } catch (error) {
    if (error instanceof Error && error.message === "too_large") return reply({ error: "Too large" }, 413);
    return reply({ error: "Invalid multipart body" }, 400);
  }
  const token = form.get("token"), albumId = form.get("albumId"), requestId = form.get("requestId"), file = form.get("file");
  const ownerMode = typeof albumId === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(albumId);
  const guestMode = typeof token === "string" && /^[A-Za-z0-9_-]{43}$/.test(token);
  if (ownerMode === guestMode) return reply({ error: "Choose exactly one upload authorization" }, 400);
  if (typeof requestId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId) ||
      !(file instanceof File) || file.size < 32 || file.size > MAX_BYTES) return reply({ error: "Invalid upload" }, 400);
  const bytes = new Uint8Array(await file.arrayBuffer());
  const detected = signature(bytes);
  if (!detected || detected !== file.type) return reply({ error: "Invalid image type" }, 415);
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  let actorId: string | null = null;
  let digest: Uint8Array | null = null;
  if (ownerMode) {
    const bearer = req.headers.get("authorization") || "";
    if (!/^Bearer [^ ]+$/.test(bearer)) return reply({ error: "Webmaster login required" }, 401);
    const { data: identity, error: identityError } = await db.auth.getUser(bearer.slice(7));
    if (identityError || !identity.user) return reply({ error: "Invalid webmaster login" }, 401);
    actorId = identity.user.id;
  } else {
    digest = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token as string)));
  }
  const contentDigest = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  const args = { p_actor: actorId, p_album_id: ownerMode ? albumId : null,
    p_token_hash: guestMode ? "\\x" + hex(digest!) : null, p_request_id: requestId,
    p_content_sha256: "\\x" + hex(contentDigest) };
  function denied(result: { reason?: string } | null) {
    const reason = result?.reason || "denied";
    const message = reason === "duplicate" ? "Den här bilden finns redan i albumet."
      : reason === "album_inactive" ? "Albumet är tillfälligt avstängt."
      : reason === "closed" ? "Uppladdningen är stängd för albumet."
      : reason === "limit" ? "Albumet har nått sin bildgräns."
      : reason === "forbidden" ? "Du saknar behörighet att ladda upp i det här albumet." : "Uppladdningen kunde inte godkännas.";
    return reply({error:message,reason}, ["invalid","forbidden","album_inactive","closed"].includes(reason) ? 403 : 409);
  }
  const { data: started, error: startError } = await db.rpc("remember_photo_upload_request", {...args,p_action:"prepare"});
  if (startError) return reply({ error: "Uppladdningen kan inte kontrolleras just nu." }, 503);
  if (!started?.accepted) return denied(started);
  const photoId = started.photoId;
  if (started.state === "ready") return reply({ok:true,photoId,bytes:bytes.length,replayed:true});
  if (started.state !== "uploading" || typeof started.objectKey !== "string") return reply({error:"Uppladdningen väntar på kontroll."},503);
  const keyPath = started.objectKey;
  // Immutable path: concurrent identical retries never overwrite or release a slot.
  try {
    await db.storage.from(BUCKET).upload(keyPath, bytes, {
      contentType: detected, cacheControl: "private, max-age=0", upsert: false
    });
  } catch { /* Ambiguous outcome: always inspect the object below. */ }
  const { data: stored, error: readError } = await db.storage.from(BUCKET).download(keyPath);
  if (readError || !stored) return reply({ error: "Verification pending" }, 503);
  const persisted = new Uint8Array(await stored.arrayBuffer());
  if (persisted.length !== bytes.length || !persisted.every((value,i)=>value===bytes[i])) return reply({error:"Verification failed"},503);
  const { data: completed, error: completeError } = await db.rpc("remember_photo_upload_request",{...args,p_action:"complete"});
  if (completeError) return reply({error:"Completion pending"},503);
  if (!completed?.accepted) return denied(completed);
  return reply({ok:true,photoId,bytes:persisted.length});
});
