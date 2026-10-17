# Remember Test — guest enforcement integration review (2026-10-17)

## Verified live code
Read actual deployed Edge Functions in isolated Supabase project `kauxrvshxgpbvptdwhog`:
- `remember-photo-upload` v1 (guest/owner upload)
- `remember-photo-gallery` v1 (guest/owner gallery)
- `remember-guest-metadata` v1

The source of `remember-photo-upload` still carries a stale "REVIEW ONLY / DO NOT DEPLOY" comment even though Supabase reports it ACTIVE v1. Do not mistake the comment for runtime status.

## Security-critical observation
The guest upload function accepts a guest token, hashes it, and invokes `remember_guest_photo_reserve` to resolve authorization. **It does not know the album UUID before this reservation**. The new `remember_security_effective_feature_read(album,feature)` needs the album UUID. Calling the reader only after reservation would be too late to reject an upload without side effects. Do not integrate by reserving first.

## Safe integration contract
1. Implement a *server-only, read-only* guest-token-to-album resolver, reusing the same guest-link validity/expiry checks as the reservation and gallery RPCs. Never expose the album UUID to an unauthorized caller.
2. In `remember-photo-upload`, after token validation and hashing but **before** any reserve/claim/storage mutation, resolve authorized album ID and call the effective-feature reader for `verified_guest_email` and `photo_approval`.
3. When both decisions are OFF, preserve existing behavior exactly. When verified email is TEST-active, deny anonymous upload until verified-email guest identity flow is implemented; do not pretend token possession is email verification.
4. Photo approval needs an atomic upload-state and gallery filtering design. Do not enable TEST until pending photos cannot leak into slideshow or guest gallery.
5. Gallery already filters to `ready`; still audit both owner and guest paths and signed URL behavior before adding a feature gate.
6. Fail closed on errors **when a feature is active**, while keeping a tested OFF fallback. Never expose service-role keys.
7. Make test-only changes, deploy one endpoint at a time, run owner + incognito guest E2E and negative tests, and verify seven baseline objects/photos remain unchanged.

## Current decision
**No guest Edge Function redeployed yet.** This is intentional: blindly adding the reader to the upload function would introduce an authorization ordering bug. The safe prerequisite is a validated read-only guest-link resolver. No global security feature flag has been enabled. Original Remember untouched.
