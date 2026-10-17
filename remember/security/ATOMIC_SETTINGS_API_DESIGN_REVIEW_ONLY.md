# Atomic security settings API – design review only

## Decision
Use one **server-only** transactional PostgreSQL function for settings mutations, invoked only by a new authenticated Edge Function. No direct browser RPC access. Keep all features OFF until enforcement is implemented in upload and gallery services.

## Request contract
POST JSON `{action,albumId?,featureKey?,settingKey?,value?,requestId}`.
- `requestId` must be a UUID and stable across retries.
- `action`: `set_album_setting`, `set_feature_mode`, `set_test_eligibility`.
- Album settings allowlist: `require_verified_email`, `require_photo_approval`, `allow_reports`, `notify_reports`, `pause_new_slideshow_photos`. Value must be boolean.
- Feature keys allowlist matches `SETTINGS_SCHEMA_V2_REVIEW_ONLY.sql`; mode must be OFF, TEST or ON.
- A new `security_request_ledger` table should have primary key `request_id`, immutable actor ID, action fingerprint, and result. Same ID and same payload returns stored result; different payload returns conflict.

## Authentication and authorization
- Edge handler verifies the bearer token with `auth.getUser`, obtains actor ID from verified identity, and never accepts client-supplied actor ID.
- Owner may update settings for own album only. Webmaster may set global modes and TEST eligibility after verifying `remember.webmasters` membership.
- Transactional function should use `SECURITY DEFINER` only if necessary, with fixed `search_path`, restricted EXECUTE to `service_role`, explicit actor authorization in SQL, and no dynamic SQL.
- **Critical:** passing `p_actor` from an Edge Function using `service_role` is insufficient by itself: the SQL cannot prove that the actor was authenticated. The Edge token check and tightly controlled server invocation are part of the trust boundary. Review whether a verified JWT can be carried into SQL transaction context safely before implementation.

## Transaction
1. Lock or reserve request ledger entry, validate replay fingerprint.
2. Verify actor and ownership or webmaster membership using database records.
3. Validate mode/eligibility and current values, lock affected rows.
4. Update setting/feature/eligibility.
5. Insert append-only audit with before and after values.
6. Commit result into ledger; return result. Any failure rolls back the entire transaction.

## Required decisions before SQL implementation
- Whether webmaster may override per-album owner settings, and how owner is notified.
- Audit retention and behavior when album is deleted.
- Whether a TEST eligibility row may be set while feature is OFF (recommended yes, no runtime effect).
- Define immutable request payload canonicalization/fingerprint; do not hash ambiguous JSON representations.
- Define server access to tables under current schema privilege model and regression tests for existing Edge Functions.

## Gate
This document is NOT an executable migration or deployed endpoint. Implement SQL and Edge Function as separate reviewed candidates; verify with negative tests and backup/rollback plan before deployment. Never apply to original Remember.
