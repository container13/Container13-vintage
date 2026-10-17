# Remember Test — TEST-mode decision check and HTTP limitation (2026-10-17)

Only isolated Supabase project `kauxrvshxgpbvptdwhog`.

## Transactional test
Within BEGIN/ROLLBACK:
- Insert `verified_guest_email` mode TEST for the test album.
- Insert exact album eligibility.
- Temporarily set `require_verified_email=true`.
- `remember_security_effective_feature_read(album,'verified_guest_email')` returned true, which the deployed upload v2 source maps to a pre-reservation 403 denial.
- Unrelated `photo_approval` decision returned false.
- Photos remained 8.
- ROLLBACK executed.

Afterward verified: flags 0, eligibility 0, ready photos 8, require_verified_email false.

## HTTP limitation
Attempted direct HTTP multipart POST with an unknown guest token against test `remember-photo-upload`. Runtime DNS resolution failed before any HTTP request was sent. **No HTTP result obtained**. Therefore negative HTTP denial and no-mutation HTTP E2E are still unverified; do not mark PASS.

Do not enable flags or modify original Remember.
