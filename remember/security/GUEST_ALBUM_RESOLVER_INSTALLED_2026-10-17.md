# Remember Test — guest album resolver installed (2026-10-17)

Project: isolated Supabase `kauxrvshxgpbvptdwhog`. Original Remember unchanged.

## Source verification
Inspected live SQL definitions of `public.remember_guest_photo_reserve(bytea,uuid)`, `public.remember_photo_gallery_read(uuid,uuid,bytea)`, and `public.remember_guest_metadata_read(bytea)`. Each checks SHA-256 guest token and `revoked_at IS NULL`. None rejects solely because `rotated_at` is populated. Upload additionally enforces window/forced closure and quota **after** resolving the link; this resolver does not claim upload permission.

## Migration
`remember_test_security_guest_album_read_v1` succeeded. Installed `public.remember_security_guest_album_read(bytea)`: SECURITY DEFINER, STABLE, fixed empty search_path, SQL join to existing album, token digest length check, revoked link rejection, returns UUID or NULL. EXECUTE denied to PUBLIC/anon/authenticated, granted to service_role.

## Verified
- NULL token digest → NULL: PASS
- Unknown digest → NULL: PASS
- Existing guest link digest resolves exact album: PASS
- anon EXECUTE: false PASS
- authenticated EXECUTE: false PASS
- service_role EXECUTE: true PASS
- Security feature flag rows: 0
- Ready photos: 7

## Remaining
- Revoked link scenario test (rollback-only).
- Wire reader into `remember-photo-upload` before reservation; don't alter behavior while flags are OFF.
- HTTP incognito regression after upload endpoint change.
