# Remember Test – guest regression baseline (2026-10-17)

Environment: isolated Supabase project `kauxrvshxgpbvptdwhog`. No production changes.

## Verified via direct Supabase SQL
- Albums: 1.
- Photo records: 6, all in `ready` state.
- Objects in `remember-private-photos`: 6.
- Guest links: 1.
- Photo records without an existing parent album: 0.
- Security audit rows: 4.
- Security request ledger rows: 4.
- Globally active security feature flags: 0.

## HTTP negative tests (user browser screenshot)
5/5 PASS: missing Authorization (401), invalid bearer (401), invalid setting (400), invalid album ID (400), non-owned/nonexistent album (403). Separate SQL readback verified no audit or ledger growth after the browser tests.

## Test panel fix
Fixed literal backslash-n display in `remember-test/security-test.html`; HTTP results should now show one per line. Commit `7c1ff9bb40e3db5887464a78d2f6879ed44fd7ba`.

## Remaining gate
These database checks **do not establish** that a guest can currently open the link, retrieve signed image URLs or upload a new photo. Browser guest regression is still pending. Do not enable security feature flags before completing that test.
