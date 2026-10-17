# Remember Security – server authorization review (2026-10-17)

**Scope:** Read-only inspection of deployed `remember-owner-manager` in test Supabase `kauxrvshxgpbvptdwhog`, plus the proposed security schema. No runtime or SQL migration deployed. Original unchanged.

## Observed deployed pattern
- Function `remember-owner-manager` is ACTIVE, version 1, with `verify_jwt=false`; handler nevertheless checks Bearer header and calls `db.auth.getUser(token)` before protected actions.
- Actor identity is derived from the verified token's `identity.user.id`, **not** the caller's claimed user ID.
- Owner operations check `remember.albums.owner_user_id=actor`.
- Input is limited to 2048 bytes, POST-only and a fixed action allowlist.
- `remember-webmaster` is a separate active function with `verify_jwt=true`; inspect its actual role authorization before reuse.
- Existing RPC `public.remember_owner_album_list(uuid)` returns constant `[]`; its broad EXECUTE grants do not currently disclose albums. Do not reuse it as an authorization oracle.
- Security feature tables do not yet exist.

## Required contract for NEW module
1. New endpoint must verify session with Supabase Auth `getUser(token)`, require confirmed email where appropriate, and derive actor from token.
2. Album settings: require existing album and `owner_user_id=actor`; webmaster override must separately verify membership in `remember.webmasters` server-side.
3. Reject anonymous calls, invalid/expired tokens, forged actor fields, wrong-owner album IDs, unknown action/feature/setting keys and malformed JSON. No client-supplied `service_role` or arbitrary SQL.
4. Feature flags: default OFF. TEST requires a server-maintained `security_test_eligibility` row for the exact album; ON requires explicit webmaster approval. Only webmaster can change global mode or TEST eligibility.
5. Apply settings change and audit row **atomically in one database transaction**. Require idempotency key to prevent duplicate actions on retry. Current draft schema does not yet include an idempotency ledger.
6. Runtime enforcement must exist on upload and gallery paths BEFORE enabling a feature; otherwise feature flags must remain OFF.
7. Existing guests, QR codes, upload/gallery gestures and photos must remain unchanged with flags OFF.
8. New tables must use default-deny RLS and no browser grants; limit server privileges and avoid accidental SECURITY DEFINER access.
9. For deletion of an album, ensure new settings/eligibility cascade safely and audit retention behavior is defined.

## Findings / blockers before migration
- `SETTINGS_SCHEMA_V2_REVIEW_ONLY.sql` creates schema objects but intentionally no write API; do not install as an operational feature.
- `SETTINGS_V2_ROLLBACK_REVIEW_ONLY.sql` blocks rollback when settings, eligibility or audit history exist; back up before any future destructive rollback.
- The security module needs a reviewed atomic SQL RPC or equivalent transaction mechanism and idempotency ledger, plus explicit webmaster role validation.
- No negative HTTP tests of the new endpoint are possible until a candidate is deployed. Do not claim runtime PASS.
- **Review concern:** current deployed owner manager uses service-role client after token validation; each new action must still constrain the album query by verified actor. Never use the client role as evidence of user authorization.

## Negative test matrix (future isolated test)
- No Bearer token -> 401.
- Malformed/expired token -> 401.
- Valid user, another user's album -> 403.
- Valid owner, unknown setting or invalid mode -> 400.
- Valid owner attempts to change global feature flag -> 403.
- Webmaster action with valid non-webmaster token -> 403.
- TEST mode for ineligible album -> remains disabled.
- Replayed idempotency key -> no duplicate audit or state transition.
- Audit insert failure -> settings update rolled back.
- Feature OFF -> upload/gallery behavior byte-for-byte equivalent at API contract level.
- All endpoints reject invalid Origin and unsupported HTTP methods.

## Next safe implementation
Draft a transactional RPC with role verification, exact setting allowlist and idempotency table; keep REVIEW ONLY. After independent review, request explicit approval for isolated test migration and subsequent deployment. Never alter original Remember.
