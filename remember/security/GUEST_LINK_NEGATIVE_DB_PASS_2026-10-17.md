# Remember Test — guest link negative database checks (2026-10-17)

Project `kauxrvshxgpbvptdwhog` only. Original Remember unchanged.

## Executed
- Transactional test: set `remember.guest_links.revoked_at=now()` for test album, call `public.remember_security_guest_album_read(token_sha256)`, confirm NULL, then `ROLLBACK`.
- After rollback: valid link resolves album, unknown 32-byte digest returns NULL.
- Confirmed original link not revoked after rollback.
- Confirmed total photo rows 8 and ready photo rows 8; feature flag rows 0.

## Results
Revoked denied PASS; unknown denied PASS; valid link PASS; rollback PASS; 8 ready photos PASS; flags remain OFF PASS.

## Scope limit
These are database-level resolver checks, **not** HTTP upload attempts using invalid/revoked links. HTTP no-reservation and active TEST-mode blocking remain to be tested. Do not claim full negative HTTP E2E coverage yet.
