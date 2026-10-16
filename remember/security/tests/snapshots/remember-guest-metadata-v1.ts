// Remember guest metadata read endpoint. Deploy as Edge Function: remember-guest-metadata
// Requires migration 5. Read-only: no photos, uploads, or administrative fields.
import { createClient } from "npm:@supabase/supabase-js@2";

const allowedOrigin = Deno.env.get("REMEMBER_ALLOWED_ORIGIN") || "https://container13.se";
const headers = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Headers": "content-type, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "Vary": "Origin",
};
function reply(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status, headers: { ...headers, "Content-Type": "application/json" },
  });
}
function hex(bytes: Uint8Array) {
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}
Deno.serve(async request => {
  const origin = request.headers.get("origin");
  if (origin && origin !== allowedOrigin) return reply({ error: "Forbidden" }, 403);
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (request.method !== "POST") return reply({ error: "Method not allowed" }, 405);
  if (Number(request.headers.get("content-length") || 0) > 1024) return reply({ error: "Too large" }, 413);

  let input: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 1024) return reply({ error: "Too large" }, 413);
    input = JSON.parse(raw);
  } catch { return reply({ error: "Invalid request" }, 400); }
  if (!input || typeof input !== "object" || Array.isArray(input)) return reply({ error: "Invalid request" }, 400);
  const payload = input as Record<string, unknown>;
  if (Object.keys(payload).length !== 1 || typeof payload.token !== "string" ||
      !/^[A-Za-z0-9_-]{43}$/.test(payload.token)) return reply({ found: false }, 200);

  const projectUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!projectUrl || !serviceKey) return reply({ error: "Unavailable" }, 503);
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(payload.token)));
  const db = createClient(projectUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await db.rpc("remember_guest_metadata_read", { p_token_hash: "\\x" + hex(digest) });
  if (error) return reply({ error: "Unavailable" }, 503);
  if (!data?.found) return reply({ found: false });
  return reply({ found: true, title: data.title, uploadsOpen: data.uploadsOpen === true });
});