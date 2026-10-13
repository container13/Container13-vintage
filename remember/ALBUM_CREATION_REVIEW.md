# Album creation pilot – review gate

Status: candidate only; SQL NOT executed; no API write action or UI enabled.

Reuse the installed Remember database and remember-webmaster JWT/role gate. No second backend, no Micke50 project/bucket changes.

## Proposed smallest step
- Confirmed webmaster creates an album owned by their verified JWT identity; arbitrary owner IDs are not accepted from the browser.
- Caller retains one cryptographically random v4 request UUID across retries. It becomes the album ID and opaque locator. No guest access link is issued yet.
- Same UUID and defaults return the existing row; changed defaults/owner fail. Existing schedules, photo quotas and data are never overwritten by create retries.
- Party/wedding: start + 24 absolute hours. Trip/fishing: end + 24 absolute hours. UTC timestamps plus validated IANA timezone; one fixed 10-photo baseline.
- Migration 2 adds a service-only create RPC, advances schema_migrations and atomically updates read-gateway expectedVersion to 2. Existing tables/data and role grants remain intact.

## Review and test files
- sql/010_create_album_REVIEW_FIRST.sql: install only after explicit approval and fresh identity check (container13-remember, wykvztfmfbboxiqvuvwr).
- sql/011_create_album_ROLLBACK_TEST.sql: disposable test writes with ROLLBACK. Must be approved with the migration. Verify the test UUID is absent after rollback.

## Remaining gates
SQL is manually reviewed, not PostgreSQL-runtime tested yet. No migration, test write or server API deployment has occurred.

After SQL approval: install once; run transactional assertions; check rollback cleanup, migration version2, read readiness, privileges/RLS, and rejected roles. Also test trip/fishing defaults and timezone/input errors, plus concurrent requests from two clients before treating idempotency as concurrency-verified.

Only then extend the current Edge Function with a JWT-derived actor and strict create input validation, and connect a bounded pilot create form. Keep schedule writes, public guest sharing and uploads disabled until their own gates pass.

photo_limit=10 is metadata, NOT enforcement of a ten-photo upload cap. Atomic reservation/finalization, private storage, link revocation, abuse limits and payments remain separate unfinished work.

Rollback of migration must be separately reviewed; never casually delete albums or version markers. The pilot is not a production release.
