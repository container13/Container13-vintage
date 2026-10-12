// Remember server-only connection settings; never expose service keys to browsers.
import { createClient } from "npm:@supabase/supabase-js@2";
export function rememberClients(env: (key: string) => string | undefined) {
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
