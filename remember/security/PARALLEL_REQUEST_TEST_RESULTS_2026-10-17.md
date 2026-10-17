# Remember Test – parallel identical-request test (2026-10-17)

Target: isolated Supabase project `kauxrvshxgpbvptdwhog`. Original untouched.

Two calls to `public.remember_security_owner_setting_write` were launched in parallel through the Supabase SQL connector using the **same fresh request UUID**, same verified test-owner UUID, same album UUID, `allow_reports=true`.

## Observed
- Both calls returned `ok=true`, `enabled=true`.
- Before: 2 audit rows, 2 ledger rows.
- After: **3 audit rows, 3 ledger rows**.
- Exactly one ledger row exists for the shared request UUID.
- Stored `allow_reports` remains true.
- Global flags in TEST/ON: 0.

**PASS:** Parallel identical requests did not produce duplicate audit or ledger records. This test exercises the SQL RPC directly and does not establish Edge HTTP concurrency, wrong-owner HTTP handling, or a simulated audit-write failure.

## Remaining gates
- HTTP negative tests with expired/malformed bearer and different authenticated user.
- Parallel requests with conflicting payloads, asserting one success and one conflict.
- Real audit-write failure injection with rollback verification.
- Guest upload/gallery regression after integration.
