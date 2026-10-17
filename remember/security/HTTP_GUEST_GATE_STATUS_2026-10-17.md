# Remember Test – HTTP and guest regression gate (2026-10-17)

Scope: isolated Supabase project `kauxrvshxgpbvptdwhog`. No production changes.

## Directly verified via Supabase connector
- `remember-security-settings` is ACTIVE, version 2, `verify_jwt=true`.
- `remember-photo-gallery` is ACTIVE, version 1, `verify_jwt=false`; source validates a guest token separately and resolves it via `remember_photo_gallery_read`. This is a **source review**, not a successful guest HTTP test.
- `remember.albums`, `album_photos`, `guest_links`, `security_album_settings`, `security_settings_audit`, and `security_request_ledger` all have RLS enabled.
- Test album count: 1. Photo records: 6; all 6 are `ready`, and no photo has a missing parent album.
- Security audit rows: 4, ledger rows: 4, global feature flags in TEST/ON: 0.

## HTTP execution limitation
A direct unauthenticated POST from the execution environment to the Supabase Edge Function failed DNS resolution; no HTTP status was obtained. **Do not mark HTTP authorization as passed** on this basis. Prior browser test established missing authorization header is denied, but not expired token / another authenticated account.

## Still required before enabling security features
1. Real HTTP requests: missing, malformed and expired JWT; valid verified owner; other authenticated account; invalid JSON; invalid setting; conflict 409.
2. Guest link open, gallery signed URLs, guest upload and owner view in browser.
3. Confirm gallery and upload restrictions when security settings are actually integrated and feature mode TEST is enabled for an eligible account.

No new test data or active feature flags were created by this inspection.
