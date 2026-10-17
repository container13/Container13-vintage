// REVIEW ONLY — NOT DEPLOYED.
// Target: Remember Test Supabase kauxrvshxgpbvptdwhog.
// Depends on reviewed security tables and public.remember_security_owner_setting_write.
// Never copy SUPABASE_SERVICE_ROLE_KEY to frontend.
import { createClient } from "npm:@supabase/supabase-js@2";

const allowedOrigin = "https://container13.se";
const allowedSettings = new Set([
  "require_verified_email",
  "require_photo_approval",
  "allow_reports",
  "notify_reports",
  "pause_new_slideshow_photos",
]);
const headers = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Headers": "authorization,apikey,content-type",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Cache-Control": "no-store",
  "Content-Type": "application/json",
};
const respond = (status: number, data: unknown) =>
  new Response(JSON.stringify(data), { status, headers });
const isUuid = (v: unknown): v is string =>
  typeof v === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

Deno.serve(async (request) => {
  const origin = request.headers.get("origin");
  if (origin && origin !== allowedOrigin) return respond(403, { error: "Forbidden origin" });
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (request.method !== "POST") return respond(405, { error: "Method not allowed" });

  const authorization = request.headers.get("authorization") || "";
  if (!/^Bearer [^ ]+$/.test(authorization))
    return respond(401, { error: "Login required" });

  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return respond(503, { error: "Unavailable" });

  let payload: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 2048) return respond(413, { error: "Payload too large" });
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return respond(400, { error: "Invalid JSON object" });
    payload = parsed as Record<string, unknown>;
  } catch {
    return respond(400, { error: "Invalid JSON" });
  }

  const keys = Object.keys(payload);
  if (keys.some((key) => !["action", "requestId", "albumId", "setting", "enabled"].includes(key)) ||
      payload.action !== "set_album_setting" ||
      !isUuid(payload.requestId) || !isUuid(payload.albumId) ||
      typeof payload.setting !== "string" || !allowedSettings.has(payload.setting) ||
      typeof payload.enabled !== "boolean") {
    return respond(400, { error: "Invalid settings request" });
  }

  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: identity, error: authError } =
    await admin.auth.getUser(authorization.slice(7));
  if (authError || !identity.user) return respond(401, { error: "Invalid session" });
  if (!identity.user.email_confirmed_at)
    return respond(403, { error: "Email verification required" });

  // Defense in depth: the SQL function repeats ownership verification.
  const { data: owned, error: ownerError } = await admin.schema("remember")
    .from("albums").select("id")
    .eq("id", payload.albumId).eq("owner_user_id", identity.user.id)
    .maybeSingle();
  if (ownerError) return respond(503, { error: "Ownership lookup failed" });
  if (!owned) return respond(403, { error: "Forbidden" });

  const { data, error } = await admin.rpc("remember_security_owner_setting_write", {
    p_actor: identity.user.id,
    p_request_id: payload.requestId,
    p_album: payload.albumId,
    p_setting: payload.setting,
    p_enabled: payload.enabled,
  });
  if (error) {
    if (error.code === "23505") return respond(409, { error: "Request ID conflict" });
    if (error.code === "42501") return respond(403, { error: "Forbidden" });
    if (error.code === "22023") return respond(400, { error: "Invalid request" });
    return respond(503, { error: "Could not save setting" });
  }
  return respond(200, data);
});
