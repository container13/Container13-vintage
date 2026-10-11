import { createClient } from "npm:@supabase/supabase-js@2";

const BUCKET = "Micke50bilder";
const ORIGIN = "https://container13.se";
const cors = {
  "Access-Control-Allow-Origin": ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
  "Vary": "Origin",
  "Cache-Control": "no-store",
};
const reply = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

function constantTimeEqual(a: string, b: string): boolean {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let difference = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) difference |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return difference === 0;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (request.method !== "POST") return reply({ error: "Method not allowed" }, 405);
  if (request.headers.get("origin") !== ORIGIN) return reply({ error: "Forbidden origin" }, 403);
  try {
    const body = await request.json();
    const pin = body?.pin;
    const expected = Deno.env.get("MICKE50_ADMIN_PIN");
    if (!expected || !/^\d{10}$/.test(expected)) return reply({ error: "Admin not configured" }, 503);
    if (typeof pin !== "string" || !/^\d{10}$/.test(pin) || !constantTimeEqual(pin, expected)) {
      return reply({ error: "Fel PIN-kod" }, 401);
    }
    if (body.action === "check") return reply({ ok: true });
    const url = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !serviceKey) return reply({ error: "Storage not configured" }, 503);
    const client = createClient(url, serviceKey, { auth: { persistSession: false } });
    if (body.action === "list") {
      const files: { name: string; url: string }[] = [];
      for (let offset = 0; offset < 10000; offset += 100) {
        const { data, error } = await client.storage.from(BUCKET).list("", { limit: 100, offset, sortBy: { column: "name", order: "desc" } });
        if (error) return reply({ error: "Could not list images" }, 500);
        for (const f of data ?? []) {
          if (!f.id) continue;
          const { data: publicUrl } = client.storage.from(BUCKET).getPublicUrl(f.name);
          files.push({ name: f.name, url: publicUrl.publicUrl });
        }
        if (!data || data.length < 100) break;
      }
      return reply({ files });
    }
    if (body.action === "delete") {
      const names = body.names;
      if (!Array.isArray(names) || names.length < 1 || names.length > 100 ||
          names.some((n: unknown) => typeof n !== "string" || !/^[a-zA-Z0-9_.-]{1,180}$/.test(n) || n.startsWith("."))) {
        return reply({ error: "Invalid file selection" }, 400);
      }
      const { data, error } = await client.storage.from(BUCKET).remove([...new Set(names)]);
      if (error) return reply({ error: "Could not delete images" }, 500);
      return reply({ deleted: data?.length ?? 0 });
    }
    return reply({ error: "Unknown action" }, 400);
  } catch {
    return reply({ error: "Invalid request" }, 400);
  }
});
