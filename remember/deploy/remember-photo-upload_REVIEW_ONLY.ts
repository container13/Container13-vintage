// Remember photo upload Edge Function - REVIEW ONLY, NOT DEPLOYED.
// Requires private bucket, migrations 6 and 7, and an explicit security review.
import { createClient } from "npm:@supabase/supabase-js@2";
const ORIGIN = Deno.env.get("REMEMBER_ALLOWED_ORIGIN") || "https://container13.se";
const BUCKET = "remember-private-photos";
const MAX_BYTES = 2 * 1024 * 1024;
const MAX_REQUEST_BYTES = MAX_BYTES + 8192;
const headers = {
  "Access-Control-Allow-Origin": ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, apikey",
  "Cache-Control": "no-store",
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
  const token = form.get("token"), requestId = form.get("requestId"), file = form.get("file");
  if (typeof token !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(token) ||
      typeof requestId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId) ||
      !(file instanceof File) || file.size < 32 || file.size > MAX_BYTES) return reply({ error: "Invalid upload" }, 400);
  const bytes = new Uint8Array(await file.arrayBuffer());
  const detected = signature(bytes);
  if (!detected || detected !== file.type) return reply({ error: "Invalid image type" }, 415);
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token)));
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: reservation, error: reserveError } = await db.rpc("remember_guest_photo_reserve", {
    p_token_hash: "\\x" + hex(digest), p_request_id: requestId
  });
  if (reserveError) return reply({ error: "Unavailable" }, 503);
  if (!reservation?.accepted || reservation.reason === "existing") return reply({ error: "Reservation denied", reason: reservation?.reason || "denied" }, 409);
  const photoId = reservation.photoId;
  const { data: started, error: startError } = await db.rpc("remember_photo_begin_upload", { p_photo_id: photoId });
  if (startError || !started?.accepted || typeof started.objectKey !== "string") return reply({ error: "Upload not started" }, 409);
  const keyPath = started.objectKey;
  // Private storage; service-role upload, never a client-signed public URL.
  const { error: storeError } = await db.storage.from(BUCKET).upload(keyPath, bytes, {
    contentType: detected, cacheControl: "private, max-age=0", upsert: false
  });
  if (storeError) {
    // An upload error can still leave an object behind. Inspect storage before
    // releasing the reservation; otherwise keep it pending for reconciliation.
    const { data: uncertain } = await db.storage.from(BUCKET).download(keyPath);
    if (!uncertain) {
      await db.rpc("remember_photo_fail_upload", { p_photo_id: photoId });
    }
    return reply({ error: "Storage failed" }, 503);
  }
  // Do not mark ready until stored bytes have been read back and checked.
  const { data: stored, error: readError } = await db.storage.from(BUCKET).download(keyPath);
  if (readError || !stored) return reply({ error: "Verification pending" }, 503);
  const persisted = new Uint8Array(await stored.arrayBuffer());
  const same = persisted.length === bytes.length &&
    persisted.every((value, i) => value === bytes[i]);
  if (!same) return reply({ error: "Verification failed" }, 503);
  const { data: completed, error: completeError } = await db.rpc("remember_photo_complete_upload", { p_photo_id: photoId, p_token_hash: "\\x" + hex(digest) });
  if (completeError || !completed?.accepted) return reply({ error: "Completion pending" }, 503);
  return reply({ ok: true, photoId, bytes: persisted.length });
});
