# Remember permission audit — 2026-10-16

Read-only findings in project wykvztfmfbboxiqvuvwr:

- remember_owner_album_list(uuid) returns only an empty JSON array. No album records are exposed by this function.
- Neither anon nor authenticated has USAGE on schema remember.
- All eight remember tables have RLS enabled.
- Deployed owner-manager v3 validates bearer token with auth.getUser and scopes list, rename, delete to owner_user_id.
- Deployed guest upload v2 validates guest token through a service-role RPC. The reservation RPC checks unrevoked token, album time window, photo limit and idempotency under album row lock.
- Deployed webmaster v2 validates bearer identity before calling privileged RPC. Webmaster RPC checks membership in remember.webmasters.
- rls_auto_enable is an active event trigger and PUBLIC EXECUTE is flagged by Supabase advisor. Review before changing.

Not yet verified: negative end-to-end tests using separate users, every RPC body, storage policies, or iPhone device acceptance. Do not run migration or change production permissions without review.
