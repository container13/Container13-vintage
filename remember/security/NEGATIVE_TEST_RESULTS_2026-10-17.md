# Remember Test – negative test execution 2026-10-17

Target: isolated Supabase project `kauxrvshxgpbvptdwhog`. No changes to original Remember.

## Tests performed directly against database RPC
1. **Missing arguments**: invoke `public.remember_security_owner_setting_write` with null UUID arguments; PL/pgSQL exception handler asserts SQLSTATE `22023`. **PASS**.
2. **Wrong album owner**: invoke RPC with synthetic non-owner UUID and an existing test album; exception handler asserts SQLSTATE `42501`. **PASS**.

The DO blocks explicitly raise an error on unexpected success, so successful execution indicates the expected rejection. No valid owner write was attempted.

## Post-test readback
- Security audit rows: **2**, unchanged.
- Request ledger rows: **2**, unchanged.
- Existing album setting `allow_reports`: **true**, unchanged.
- Global feature flags with mode other than OFF: **0**.

## Still pending
- Reuse same request UUID with identical/different payloads, asserting idempotency and conflict.
- Authenticated HTTP negative tests (invalid bearer, another account).
- Audit failure rollback and concurrent request test.
- End-to-end runtime enforcement and guest flow regression.

Do not enable any global feature flags. This is a partial negative test PASS, not full security release approval.
