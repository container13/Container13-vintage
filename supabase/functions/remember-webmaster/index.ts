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
  const { data: role, error: roleError } = await admin.schema("remember").from("webmasters")
    .select("user_id").eq("user_id", userData.user.id).maybeSingle();
  if (roleError) return respond({ error: "Role lookup unavailable" }, 503);
  if (!role) return respond({ error: "Forbidden" }, 403);
  let input: Record<string, unknown>;
  try { input = await req.json(); } catch { return respond({ error: "Invalid JSON" }, 400); }
  if (input.action === "installation_status") {
    const tables = ["schema_migrations", "albums", "webmasters", "schedule_audit", "album_photos"];
    const checks = [];
    for (const table of tables) {
      const { error } = await admin.schema("remember").from(table).select("*", { head: true, count: "exact" }).limit(0);
      checks.push({ name: table, status: error ? "unavailable" : "reachable" });
    }
    const { data: versions, error: versionError } = await admin.schema("remember")
      .from("schema_migrations").select("version").order("version", { ascending: false }).limit(1);
    const version = !versionError && versions?.length ? versions[0].version : null;
    const ready = checks.every(c => c.status === "reachable") && version === 1;
    return respond({ ready, schemaVersion: version, expectedVersion: 1, checks,
      note: "Connectivity and table presence only; permissions, policies, storage and uploads need separate verification." });
  }
  if (input.action === "list") {
    const { data, error } = await admin.schema("remember").from("albums")
      .select("id,slug,title,event_timezone,default_opens_at,default_closes_at,override_opens_at,override_closes_at,forced_closed,revision")
      .order("created_at", { ascending: false }).limit(100);
    if (error) return respond({ error: "Unable to list albums" }, 503);
    return respond({ albums: data });
  }
  // Writes intentionally disabled until a reviewed transactional RPC is deployed.
  // Never perform schedule update and audit as separate unprotected HTTP writes.
  return respond({ error: "Schedule editing is not enabled yet" }, 501);
});
