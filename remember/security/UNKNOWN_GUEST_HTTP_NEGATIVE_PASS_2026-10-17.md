# Remember Test — unknown guest HTTP negative PASS (2026-10-17)

Only test Supabase project kauxrvshxgpbvptdwhog; original untouched.

User browser screenshot of security-test.html?v=8 showed PASS: unknown guest token HTTP 403, response `Invalid guest link`.

Independent database verification after HTTP request: 8 photo rows, all state `ready`; no reserved/uploading/failed rows. This confirms the invalid-token request did not create a reservation.

Next: test a separately revoked synthetic guest link by HTTP without revoking the real guest link. TEST-mode enabled HTTP denial is not yet proven.
