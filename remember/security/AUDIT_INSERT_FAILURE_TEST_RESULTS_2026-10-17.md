# Remember Test – real audit insert failure injection (2026-10-17)

Target: isolated Supabase project `kauxrvshxgpbvptdwhog` only.

## Test performed
In a single explicit `BEGIN ... ROLLBACK` transaction:
1. Create a temporary trigger function in `pg_temp` raising SQLSTATE `P0001`, message `SIMULATED_AUDIT_INSERT_FAILURE`.
2. Attach a transactional `BEFORE INSERT` trigger to `remember.security_settings_audit`.
3. Call the installed owner-settings RPC with a fresh request UUID, valid owner and album, setting `allow_reports=false`.
4. Catch only the expected simulated audit-insert exception; assert the audit count is unchanged, `allow_reports=true` remains stored, and the request UUID is absent from the ledger.
5. Explicitly `ROLLBACK` the entire transaction, including the test trigger.

**PASS**: SQL completed and all assertions succeeded.

## Independent readback
- Audit rows: 4, unchanged.
- Request ledger rows: 4, unchanged.
- `allow_reports`: true, unchanged.
- Test trigger still present: **0**.
- Active global feature flags: **0**.

## Boundaries
This validates SQL transaction atomicity when the audit INSERT actually fails. It does not validate Edge HTTP authorization, token expiry, or guest workflow regression.
