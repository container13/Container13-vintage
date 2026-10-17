# Guest link resolver — review before deployment

Target only isolated Remember Test `kauxrvshxgpbvptdwhog`.

The guest upload function receives a 43-character token, hashes it, then calls the reservation RPC. A new server-only resolver must return an album ID for a valid, non-revoked guest link **without creating any reservation**.

## Required checks
- Match SHA-256 digest in `remember.guest_links.token_sha256`; never store or log the raw token.
- Reject missing, revoked and rotated links; verify exact existing album.
- Compare guest metadata, gallery and upload RPC link validity rules before deploying: these may have further restrictions that are not yet verified.
- Service-role-only execution; revoke PUBLIC, anon and authenticated.
- Return no album ID to the browser; resolver is internal to the upload Edge Function.
- In the upload handler resolve before `remember_guest_photo_reserve`, then read effective `verified_guest_email` / `photo_approval` flags before mutation.
- When flags are OFF, preserve existing behavior; when active, deny unsupported flows safely.
- Test valid, invalid, revoked and rotated links and privilege grants; then rerun incognito upload.

## Status
Schema for `remember.guest_links` inspected: `album_id`, `token_sha256`, `revoked_at`, `rotated_at`. Existing photo count 7. No change to guest upload/gallery was made. Deployment of resolver attempted but blocked by tooling; not installed.

**Important**: The semantics of `rotated_at` must be checked against the live reservation and gallery RPCs before choosing the exact SQL predicate. Do not deploy a guessed resolver.
