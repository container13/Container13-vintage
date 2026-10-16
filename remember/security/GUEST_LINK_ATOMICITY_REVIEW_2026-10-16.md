# Remember guest-link rotation review — 2026-10-16

Read-only review of deployed Supabase functions. No production changes.

## Confirmed findings
- `remember-share-manager` v2 validates the bearer token with `auth.getUser` and verifies `owner_user_id` before reading or replacing an album guest link.
- Rotation updates `remember.guest_links` and then separately upserts encrypted token data in `remember.guest_link_vault`. This is not atomic: if the vault write fails, the newly activated link may not be retrievable in the owner UI. The error response can return the newly created token.
- The vault encryption key is derived from `SUPABASE_SERVICE_ROLE_KEY`. Key rotation therefore needs a dedicated migration/recovery procedure.
- `remember-photo-gallery` v3 validates album ownership for owners or checks a guest token through `remember_photo_gallery_read`. Signed private image URLs expire after 120 seconds.
- `remember-guest-metadata` v1 checks token shape and returns only `found`, `title`, and `uploadsOpen` through its RPC.

## Proposed actions, not deployed
1. Design a single transactional operation for guest token rotation and encrypted vault storage, with rollback on failure.
2. Introduce a separate versioned vault encryption key and a controlled migration plan for existing ciphertext.
3. Test negative access scenarios in isolation: unrelated owner, revoked token, closed album, invalid gallery token, direct storage access, and simulated vault-write failure.
4. Keep the optional security module OFF pending review and approval.

This document records findings only; no SQL, Edge Function, or client changes were made.
