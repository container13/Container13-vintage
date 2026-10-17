# Remember Test — photo upload security gate v2 (2026-10-17)

Only isolated Supabase project `kauxrvshxgpbvptdwhog` changed. Original Remember untouched.

## Deployment
`remember-photo-upload` deployed ACTIVE v2, verify_jwt=false (guest-token authentication handled in function). Live code was fetched back and verified.

For guest requests, after token hash calculation and **before** `remember_guest_photo_reserve`:
1. Call service-only `remember_security_guest_album_read` to resolve valid link to album ID.
2. Call service-only `remember_security_effective_feature_read` for `verified_guest_email` and `photo_approval`.
3. On resolver/read error: fail closed (503), no reservation.
4. On invalid link: deny 403, no reservation.
5. On either feature enabled: deny 403 until the required email verification or photo approval workflow exists.
6. When both are OFF: continue unchanged legacy upload flow.

Owner-mode path remains unchanged.

## Read-back checks
- Live function status ACTIVE, version 2.
- Guest resolver and effective reader occur before reservation in deployed source.
- Feature flags: 0; eligibility: 0.
- Ready photo records: 7; stored photo objects: 7.

## Remaining verification
- Real guest browser upload after v2 deployment.
- Invalid/revoked guest token HTTP tests and no-mutation check.
- Separate TEST-enabled denial tests and full end-to-end photo-approval implementation.
Do not enable flags or deploy to original Remember.
