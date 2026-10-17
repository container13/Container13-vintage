# Remember Test – idempotency execution 2026-10-17

Target: isolated Supabase `kauxrvshxgpbvptdwhog`. Original untouched.

## Executed tests
- **Identical retry:** Invoked `public.remember_security_owner_setting_write` using an existing request ID and identical owner, album, setting and enabled value. Asserted the returned JSON contained `setting=allow_reports` and `enabled=true`. **PASS**.
- **Conflicting retry:** Reused that request ID with `enabled=false`. PL/pgSQL handler asserted SQLSTATE `23505` and raised an exception on unexpected success. **PASS**.

## Database readback after tests
- Audit rows: 2 (unchanged)
- Request ledger rows: 2 (unchanged)
- Album `allow_reports`: true (unchanged)

## Boundaries
These tests exercise the installed SQL RPC directly. They do **not** prove HTTP token handling, concurrent request behavior, audit failure rollback, or guest-flow regression. No global security feature was enabled.
