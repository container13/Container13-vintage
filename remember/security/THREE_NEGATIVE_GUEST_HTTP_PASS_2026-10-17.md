# Remember Test — three negative guest HTTP uploads PASS (2026-10-17)

Scope: isolated Supabase project `kauxrvshxgpbvptdwhog`. Original Remember untouched.

## Browser evidence
User supplied screenshot from the updated security test panel, showing:
- PASS: unknown guest token → HTTP 403 (expected 403)
- PASS: malformed guest token → HTTP 400 (expected 400)
- PASS: missing guest token → HTTP 400 (expected 400)

## Independent database readback
After the three HTTP requests, `SELECT state, count(*) FROM remember.album_photos GROUP BY state` returned only `ready: 8`. No new reservations, uploads or failed photo rows.

## Conclusion
Three negative HTTP requests rejected with expected status codes; zero new photo rows. PASS.

Not yet verified: HTTP revoked guest token; HTTP denial under an enabled TEST feature. Neither test should modify the working guest link permanently.
