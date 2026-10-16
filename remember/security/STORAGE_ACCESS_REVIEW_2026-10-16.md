# Remember storage and access review — 2026-10-16

Supabase project: wykvztfmfbboxiqvuvwr. Read-only verification; no live changes.

- Buckets `remember-photos` and `remember-private-photos` are both private, with 10 MiB bucket file-size limits.
- `storage.objects` has RLS enabled and zero policies. Ordinary anon/authenticated roles have SQL SELECT privilege on storage.objects but without matching RLS policies cannot read rows through their normal role.
- Neither anon nor authenticated has USAGE on schema remember, and both lack SELECT on remember.albums.
- Deployed gallery v3 checks owner bearer identity and album ownership or validates a guest token through a server RPC; it generates private storage signed URLs valid 120 seconds.
- RPC remember_photo_gallery_read checks webmaster membership for actor+album path, or an unrevoked guest token hash for guest path; only ready photos are returned.
- Non-mutating negative check `remember_photo_gallery_read(null,null,null)` returned authorized:false.
- Non-mutating invalid reservation check `remember_guest_photo_reserve(null,null)` returned accepted:false, reason:invalid.

These checks do not replace tests with two real independent users, a revoked guest token, expired album, and direct Storage API calls. Signed URLs remain usable until expiry even after link revocation. Review access design before moderation features.
