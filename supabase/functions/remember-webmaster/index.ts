// Remember webmaster API candidate 0.1.3. New create action NOT DEPLOYED.
// Requires a separate verified Supabase environment and reviewed migration.
import { rememberClients } from "../_shared/remember-supabase.ts";

const cors = {
  "Access-Control-Allow-Origin": Deno.env.get("REMEMBER_ALLOWED_ORIGIN") || "https://container13.se",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};
const respond = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "no-store", "X-Remember-Version": "0.1.3" } });
const uuid = (s: unknown) => typeof s === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return respond({ error: "Method not allowed" }, 405);
  const origin = req.headers.get("origin");
  if (origin && origin !== cors["Access-Control-Allow-Origin"]) return respond({ error: "Origin not allowed" }, 403);
  const authHeader = req.headers.get("authorization") || "";
  if (!authHeader.startsWith("Bearer ")) return respond({ error: "Authentication required" }, 401);
  const clients = rememberClients(Deno.env.get);
  if (!clients) return respond({ error: "Service not configured" }, 503);
  const auth = clients.identity;
  const token = authHeader.slice(7);
  const { data: userData, error: userError } = await auth.auth.getUser(token);
  if (userError || !userData.user) return respond({ error: "Invalid session" }, 401);
  const admin = clients.privileged;
  const { data: gate, error: gateError } = await admin.rpc("remember_webmaster_read", {
    p_actor: userData.user.id, p_action: "role_check",
  });
  if (gateError) return respond({ error: "Role lookup unavailable" }, 503);
  if (!gate?.authorized) return respond({ error: "Forbidden" }, 403);
  let input: Record<string, unknown>;
  try {
    if (!req.body) return respond({ error: "Missing JSON body" }, 400);
    const reader = req.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 8192) { await reader.cancel(); return respond({ error: "Request too large" }, 413); }
      chunks.push(value);
    }
    const joined = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { joined.set(chunk, offset); offset += chunk.byteLength; }
    const parsed = JSON.parse(new TextDecoder().decode(joined));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return respond({ error: "Expected JSON object" }, 400);
    input = parsed;
  } catch { return respond({ error: "Invalid JSON" }, 400); }
  if (input.action === "installation_status" || input.action === "list") {
    const { data, error } = await admin.rpc("remember_webmaster_read", {
      p_actor: userData.user.id, p_action: input.action,
    });
    if (error) return respond({ error: "Remember gateway unavailable" }, 503);
    if (!data?.authorized) return respond({ error: "Forbidden" }, 403);
    return respond({ ...data, capabilities: { createAlbum: true } });
  }
  if (input.action === "create_album") {
    const allowed = new Set(["action", "requestId", "title", "eventType", "startsAt", "endsAt", "timezone"]);
    if (Object.keys(input).some(key => !allowed.has(key)))
      return respond({ error: "Unexpected fields" }, 400);
    const exactUtc = (value: unknown) => {
      if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) return false;
      const parsed = new Date(value);
      return Number.isFinite(parsed.getTime()) && parsed.toISOString() === value;
    };
    const party = input.eventType === "party" || input.eventType === "wedding";
    if (!uuid(input.requestId) || typeof input.requestId !== "string" || input.requestId[14] !== "4" ||
      typeof input.title !== "string" || input.title.trim().length < 1 || Array.from(input.title.trim()).length > 100 ||
      !["party", "wedding", "trip", "fishing"].includes(String(input.eventType)) ||
      !exactUtc(input.startsAt) ||
      (party ? input.endsAt != null : !exactUtc(input.endsAt)) ||
      (!party && new Date(String(input.endsAt)).getTime() < new Date(String(input.startsAt)).getTime()) ||
      typeof input.timezone !== "string" || input.timezone.length < 1 || input.timezone.length > 100)
      return respond({ error: "Invalid album input" }, 400);
    const { data, error } = await admin.rpc("remember_webmaster_create_album", {
      p_actor: userData.user.id,
      p_request_id: input.requestId, p_title: input.title.trim(), p_event_type: input.eventType,
      p_starts_at: input.startsAt, p_ends_at: party ? null : input.endsAt,
      p_timezone: input.timezone,
    });
    if (error) {
      if (error.code === "22023" || error.code === "23505")
        return respond({ error: "Album request rejected" }, 409);
      return respond({ error: "Album creation unavailable; retry with the same request ID" }, 503);
    }
    if (!data?.authorized) return respond({ error: "Forbidden" }, 403);
    return respond(data);
  }
  // Schedule writes intentionally disabled until a reviewed transactional RPC is deployed.
  // Never perform schedule update and audit as separate unprotected HTTP writes.
  return respond({ error: "Schedule editing is not enabled yet" }, 501);
});
