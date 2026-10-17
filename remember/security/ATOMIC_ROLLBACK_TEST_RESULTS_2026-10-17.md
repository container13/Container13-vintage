# Remember Test – atomic rollback test 2026-10-17

**Environment:** isolated Supabase `kauxrvshxgpbvptdwhog` only. Original Remember untouched.

## Executed
Within a PL/pgSQL nested exception block:
1. Call installed `public.remember_security_owner_setting_write` as the existing test album owner, with a fresh request UUID and `allow_reports=false`.
2. Assert the returned result indicates false.
3. Raise an intentional exception `FORCED_TEST_ROLLBACK`.
4. Catch only that expected exception. PostgreSQL rolls back all changes inside the nested exception block.
5. Assert audit count is unchanged, stored `allow_reports` remains true, and the test request UUID does not exist in the request ledger.

**Result: PASS.** The SQL block returned successfully after its assertions.

## Independent readback
- Audit rows: 2
- Ledger rows: 2
- Stored `allow_reports`: true
- Active global flags: 0

## Limitations
This proves rollback for a deliberately aborted transaction *after* a successful RPC write. It does not simulate a real audit-table constraint failure or concurrency. HTTP authorization and guest-flow regression tests remain pending.
