// Remember guest-link webmaster candidate. NOT DEPLOYED.
// Deploy ONLY after migration 4 review + negative security tests.
// Server generates capability token. Token is returned once; database receives SHA-256 only.
// This endpoint MUST require JWT verification and album ownership checked by service-only RPC.
import { createClient } from "npm:@supabase/supabase-js@2";

function rememberClients(env: (key: string) => string | undefined) {
  const url = env("SUPABASE_URL");
  const publicKey = env("SUPABASE_ANON_KEY") || env("SUPABASE_PUBLISHABLE_KEY");
  const serviceKey = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !publicKey || !serviceKey) return null;
  const parsed = new URL(url);
  if (parsed.protocol !== "https:" && parsed.hostname !== "localhost") return null;
  const opts = { auth: { persistSession: false, autoRefreshToken: false } };
  return {
    identity: createClient(url, publicKey, opts),
    privileged: createClient(url, serviceKey, opts),
  };
}

const origin = Deno.env.get("REMEMBER_ALLOWED_ORIGIN") || "https://container13.se";
const cors = {
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "no-store",
    "Referrer-Policy": "no-referrer", "X-Content-Type-Options": "nosniff" },
});
const uuid = (v: unknown): v is string =>
  typeof v === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
const hex = (bytes: Uint8Array) => Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
const base64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes))
  .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");

Deno.serve(async req => {
  if (req.method === "OPTIONS") {
    const preflightOrigin = req.headers.get("origin");
    if (preflightOrigin && preflightOrigin !== origin) return reply({ error: "Forbidden" }, 403);
    return new Response(null, { status: 204, headers: cors });
  }
  if (req.method !== "POST") return reply({ error: "Method not allowed" }, 405);
  const requestOrigin = req.headers.get("origin");
  if (requestOrigin && requestOrigin !== origin) return reply({ error: "Forbidden" }, 403);
  const bearer = req.headers.get("authorization") || "";
  if (!bearer.startsWith("Bearer ")) return reply({ error: "Authentication required" }, 401);
  const clients = rememberClients(Deno.env.get);
  if (!clients) return reply({ error: "Unavailable" }, 503);
  const { data: identity, error: identityError } = await clients.identity.auth.getUser(bearer.slice(7));
  if (identityError || !identity.user) return reply({ error: "Invalid session" }, 401);

  let input: Record<string, unknown>;
  try {
    if (Number(req.headers.get("content-length") || 0) > 2048) return reply({ error: "Too large" }, 413);
    if (!req.body) return reply({ error: "Missing body" }, 400);
    const reader = req.body.getReader();
    const parts: Uint8Array[] = [];
    let bytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 2048) { await reader.cancel(); return reply({ error: "Too large" }, 413); }
      parts.push(value);
    }
    const payload = new Uint8Array(bytes);
    let position = 0;
    for (const part of parts) { payload.set(part, position); position += part.byteLength; }
    const raw = new TextDecoder("utf-8", { fatal: true }).decode(payload);
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw Error();
    input = parsed;
  } catch { return reply({ error: "Invalid JSON" }, 400); }
  if (Object.keys(input).some(k => !["action", "albumId"].includes(k)) ||
      !uuid(input.albumId) || !["issue", "rotate", "revoke"].includes(String(input.action))) {
    return reply({ error: "Invalid input" }, 400);
  }
  const action = input.action as "issue" | "rotate" | "revoke";
  const tokenBytes = action === "revoke" ? null : crypto.getRandomValues(new Uint8Array(32));
  const token = tokenBytes ? base64url(tokenBytes) : null;
  const hashBytes = tokenBytes
    ? new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token!)))
    : null;
  const { data, error } = await clients.privileged.rpc("remember_webmaster_guest_link_write", {
    p_actor: identity.user.id, p_album: input.albumId, p_action: action,
    p_token_hash: hashBytes ? "\\x" + hex(hashBytes) : null,
  });
  if (error) return reply({ error: "Write unavailable" }, 503);
  if (!data?.authorized) return reply({ error: "Forbidden" }, 403);
  if (!data.success) return reply({ success: false, reason: data.reason || "Not changed" }, 409);
  // Never log token. Only the successful authorized issue/rotate response contains it.
  return reply({ success: true, action, ...(token ? { token } : {}) });
});