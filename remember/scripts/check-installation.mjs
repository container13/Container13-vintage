// Remember source-only preflight. No network or database writes.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const read = path => readFileSync(resolve(root, path), 'utf8');
const schema = read('remember/sql/001_schema_DRAFT.sql');
const marker = read('remember/sql/002_version_marker_DRAFT.sql');
const gateway = read('remember/sql/005_private_webmaster_gateway_DRAFT.sql');
const security = read('remember/sql/006_security_verification_READ_ONLY.sql');
const api = read('supabase/functions/remember-webmaster/index.ts');
const adapter = read('supabase/functions/_shared/remember-supabase.ts');
const tables = ['albums', 'webmasters', 'schedule_audit', 'album_photos'];
const checks = [
  ...tables.map(t => [`table ${t}`, schema.includes(`create table if not exists remember.${t} (`)]),
  ...tables.map(t => [`RLS ${t}`, schema.includes(`alter table remember.${t} enable row level security`)]),
  ['schema restricted', schema.includes('revoke all on schema remember from public, anon, authenticated')],
  ['version marker', marker.includes('create table if not exists remember.schema_migrations') && marker.includes("values (1, 'Remember baseline schema')")],
  ['JWT verified', api.includes('auth.auth.getUser(token)')],
  ['role checked through RPC', api.includes('p_action: "role_check"') && api.includes('!gate?.authorized')],
  ['RPC access path', api.includes('admin.rpc("remember_webmaster_read"')],
  ['private schema not directly queried', !api.includes('admin.schema("remember")')],
  ['RPC security definer', gateway.includes('security definer set search_path')],
  ['RPC service-only grant', gateway.includes('grant execute on function public.remember_webmaster_read(uuid,text) to service_role')],
  ['RPC denies anon', gateway.includes('revoke all on function public.remember_webmaster_read(uuid,text) from public, anon, authenticated')],
  ['SQL RLS verification', security.includes('five required tables with RLS enabled')],
  ['write endpoints disabled', api.includes('Schedule editing is not enabled yet')],
  ['service key server-only', adapter.includes('SUPABASE_SERVICE_ROLE_KEY')],
];
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
const failed = checks.filter(([,ok]) => !ok).length;
console.log(`Static preflight: ${checks.length - failed}/${checks.length}. No Supabase or runtime test performed.`);
if (failed) process.exitCode = 1;
