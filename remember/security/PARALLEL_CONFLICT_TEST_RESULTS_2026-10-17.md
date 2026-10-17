# Remember Test – parallel conflicting requests (2026-10-17)

Environment: isolated Supabase project `kauxrvshxgpbvptdwhog`; original Remember untouched.

Two SQL RPC calls were issued in parallel with the **same fresh request UUID**, same valid test owner and album, same `allow_reports` setting, but opposite boolean values.

## Observed
- `enabled=true`: succeeded, returned `ok=true`.
- `enabled=false`: rejected with SQLSTATE `23505` / `Request conflict`.
- Before test: 3 audit rows and 3 request ledger rows.
- After test: **4 audit rows and 4 ledger rows**.
- Exactly **one** ledger row for the shared request UUID.
- Stored `allow_reports=true`; globally active feature flags: **0**.

**PASS:** A conflicting concurrent replay did not overwrite the winning request or create a duplicate audit/ledger record.

## Remaining
HTTP authentication tests with invalid/expired bearer and other account, failure injection during audit insert, and guest upload/gallery regression. SQL connector tests do not substitute for those.
