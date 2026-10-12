// Read-only Remember source preflight. No network, credentials, or migrations.
// Usage: node remember/scripts/check-installation.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const read = p => readFileSync(resolve(root, p), 'utf8');
const schema = read('remember/sql/001_schema_DRAFT.sql');
const marker = read('remember/sql/002_version_marker_DRAFT.sql');
const api = read('supabase/functions/remember-webmaster/index.ts');
const adapter = read('supabase/functions/_shared/remember-supabase.ts');
const requiredTables = ['albums','webmasters','schedule_audit','album_photos'];
const checks = [
  ...requiredTables.map(t => [`table ${t}`, new RegExp(`create table if not exists remember\\.${t}\\s*\\(`, 'i').test(schema)]),
  ...requiredTables.map(t => [`RLS ${t}`, new RegExp(`alter table remember\\.${t} enable row level security`, 'i').test(schema)]),
  ['client role revoke', /revoke all on schema remember from public, anon, authenticated/i.test(schema)],
  ['version marker table', /create table if not exists remember\\.schema_migrations/i.test(marker)],
  ['version marker 1', /values\\s*\\(1,\\s*'Remember baseline schema'\\)/i.test(marker)],
  ['webmaster authentication', /auth\\.auth\\.getUser\\(token\\)/.test(api)],
  ['webmaster authorization', /from\\("webmasters"\\)/.test(api)],
  ['installation status', /input\\.action === "installation_status"/.test(api)],
  ['writes disabled', /Schedule editing is not enabled yet/.test(api)],
  ['shared connection adapter', /rememberClients\\(Deno\\.env\\.get\\)/.test(api)],
  ['server secrets', /SUPABASE_SERVICE_ROLE_KEY/.test(adapter)],
];
for (const [name, pass] of checks) console.log(`${pass ? 'PASS' : 'FAIL'} ${name}`);
const failed = checks.filter(([,pass]) => !pass);
console.log(`Static preflight: ${checks.length - failed.length}/${checks.length} checks passed. No database connection or deployment tested.`);
if (failed.length) process.exitCode = 1;
