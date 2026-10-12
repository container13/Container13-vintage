// Remember webmaster API candidate. NOT DEPLOYED.
// Requires a separate verified Supabase environment and reviewed migration.
import { rememberClients } from "../_shared/remember-supabase.ts";

const cors = {
  "Access-Control-Allow-Origin": Deno.env.get("REMEMBER_ALLOWED_ORIGIN") || "https://container13.se",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};
const respond = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "no-store" } });
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
  try { input = await req.json(); } catch { return respond({ error: "Invalid JSON" }, 400); }
  if (input.action === "installation_status" || input.action === "list") {
    const { data, error } = await admin.rpc("remember_webmaster_read", {
      p_actor: userData.user.id, p_action: input.action,
    });
    if (error) return respond({ error: "Remember gateway unavailable" }, 503);
    if (!data?.authorized) return respond({ error: "Forbidden" }, 403);
    return respond(data);
  }
  // Writes intentionally disabled until a reviewed transactional RPC is deployed.
  // Never perform schedule update and audit as separate unprotected HTTP writes.
  return respond({ error: "Schedule editing is not enabled yet" }, 501);
});
