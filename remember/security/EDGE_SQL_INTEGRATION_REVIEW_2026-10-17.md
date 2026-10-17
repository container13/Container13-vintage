# Remember security settings – integration review (2026-10-17)

Scope: isolated test project kauxrvshxgpbvptdwhog only. Original remains unchanged.

## Files now prepared
- SETTINGS_SCHEMA_V2_REVIEW_ONLY.sql
- OWNER_SETTINGS_RPC_REVIEW_ONLY.sql
- SETTINGS_V2_ROLLBACK_REVIEW_ONLY.sql
- edge/remember-security-settings/index.ts

## Interface match
Edge handler invokes public.remember_security_owner_setting_write with p_actor, p_request_id, p_album, p_setting and p_enabled. This matches the five-argument SQL candidate. Both share the exact five-key allowlist.

## Security gates
1. Handler validates bearer token via Supabase Auth getUser and checks verified email.
2. Handler checks owner_user_id against verified identity, SQL repeats ownership check.
3. SQL grants function execution only to service_role, revoking PUBLIC/anon/authenticated.
4. Retry ledger, setting update and audit must be in one transaction.
5. Deployment must configure verify_jwt=true and preserve secure service-role secret. Code-level token validation is additional protection.
6. No browser direct RPC or service-role key exposure.
7. Feature flags remain OFF and runtime upload/gallery behavior unchanged.

## Known limitations – must resolve before deployment
- No SQL migration, no HTTP tests, no atomicity/concurrency tests have run.
- Rollback is intentionally destructive and refuses nonempty audit/ledger.
- The schema permits mode ON at the CHECK constraint level. ON must be prohibited in the eventual webmaster API until runtime enforcement is implemented.
- This handler only supports owner settings. Webmaster mode and eligibility APIs are separate future work.
- CORS Origin check is not authentication; only bearer verification plus ownership grants access.
- Test Supabase function deployment settings and actual request handling remain unverified.
- Validate the Postgres function syntax and permissions with an isolated migration and negative tests before enabling use.
- Because the settings tables are not installed, deploying this handler now would cause errors. Deployment must be gated after approved migration.

## Acceptance checklist
- [x] GitHub source saved and read back
- [x] Edge and SQL parameter names reviewed
- [ ] SQL syntax and migration tests
- [ ] Edge deployed to isolated test
- [ ] Missing/expired token HTTP tests
- [ ] Wrong-owner and direct RPC rejection
- [ ] Idempotency and audit rollback tests
- [ ] Guest flow regression test
- [ ] Explicit authorization for enabling any feature
