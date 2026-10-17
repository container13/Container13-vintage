# Remember Test – activation gate after guest regression (2026-10-17)

## Verified state
- Five browser HTTP negative authorization tests passed.
- Browser incognito guest view and guest photo upload passed; Supabase confirmed seven ready photos and seven stored objects.
- SQL retry, conflict, parallel and rollback tests passed.
- `remember.security_feature_flags` contains **zero rows**; therefore no feature is active.
- Test panel now supports `#token=` guest links (commit `4f629f38eaed363bdf1d44c80084cec9b3ff58ea`).

## Critical separation: stored preference is not enforcement
An album owner's `allow_reports=true` in `security_album_settings` is only a stored preference. It must not enable reporting while global `guest_reports` is OFF. The existing guest upload and gallery functions do not yet enforce the new security settings.

## Effective feature decision contract
For a given album and feature:
1. Missing feature flag => OFF.
2. `mode='OFF'` => OFF.
3. `mode='TEST'` => eligible **only** if an exact `(feature_key,album_id)` row exists in `security_test_eligibility`.
4. `mode='ON'` => BLOCKED until independent enforcement testing and explicit approval.
5. Effective action also requires the matching album setting, when applicable.
6. All guest entry points must apply the decision server-side, never trust the browser.
7. Existing behavior must remain unchanged when OFF, including guest gallery and upload.

Mapping:
- `verified_guest_email` → `require_verified_email` → guest upload/auth flows.
- `photo_approval` → `require_photo_approval` → upload and gallery visibility.
- `guest_reports` → `allow_reports` → report submission endpoint (not yet implemented).
- `report_notifications` → `notify_reports` → server notification workflow (not yet implemented).
- `slideshow_pause` → `pause_new_slideshow_photos` → slideshow reader (not guest upload).
- `quota_notifications` → no owner setting; server quota notification workflow.

## Implementation sequence
1. Add a server-only **read** operation for effective feature status, with strict allowlist and exact-album eligibility, default OFF.
2. Unit-test missing flags, OFF, TEST with/without eligibility, ON-block and wrong album.
3. Integrate one feature at a time into the **test-only** server endpoint(s), with rollback to OFF and guest regression after each.
4. Add webmaster-only audited writes for OFF↔TEST and eligibility; block ON.
5. Only then consider any TEST activation for the designated test album.

**No feature mode is enabled by this document. No original Remember code or Supabase data should be changed.**
