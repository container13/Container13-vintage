# Remember — photo upload and viewer acceptance criteria

Status: specification only; upload endpoint and end-to-end tests NOT yet implemented. Preserve existing Bergeforsen 2026 album and guest link. Micke50 remains unchanged.

## Upload first
- Reuse Micke50's camera selection, multi-image selection and upload queue UX, not its direct public browser-to-storage authorization.
- A guest with a valid, non-revoked capability link can upload without login only during the album's effective open window.
- A server-authenticated flow validates token hash, album schedule, forced closure, file type/size, and atomically reserves an available slot before upload. Concurrent clients must not exceed the album's photo_limit (default 10). Idempotent retries must not consume another slot.
- Only server-generated object keys in private remember-photos bucket; no public storage policies or service-role key in client. Verify uploaded content and mark ready only after successful storage; expire/reconcile failed reservations safely.
- Test revoked/invalid link, closed album, 11th photo, concurrent last-slot race, interrupted upload/retry, allowed MIME and oversize files, and actual mobile upload before marking PASS.

## Viewer after verified upload
- Reuse Micke50's fullscreen image viewer and vertical swipe/photo slideshow behavior as baseline.
- Pinch zoom only on fullscreen image; never enable page-level pinch zoom. Maximum 8x.
- Increase pinch sensitivity initially about 2x so shorter finger movement produces useful magnification; tune with real-device tests.
- While zoomed, one-finger drag pans the image in any direction; a drag must not switch photos.
- After lifting fingers, retain zoom for 3 seconds of inactivity. Touching/panning restarts countdown. Reset zoom after timeout, then restore normal photo navigation.
- Test pinch-to-one-finger handoff, release-and-retouch within 3 seconds, drag bounds, no accidental swipe, reset after inactivity, and iOS/Android behavior.

## Release order
1. Secure backend upload + real-photo verification.
2. Viewer port and improved gestures.
3. Device testing and user approval.

## Duplicate image protection (approved)
- Within the same album, reject a second upload of identical image content with a friendly Swedish message: "Den här bilden finns redan i albumet." Do not consume another quota slot or show a duplicate in gallery.
- Different albums may contain the same image.
- Distinguish transport idempotency (retrying the same upload request) from content deduplication (choosing the same photo in a new request).
- Compute a stable SHA-256 content digest over canonical upload bytes after client-side normalization/compression. Persist and enforce album-scoped uniqueness on the server, including concurrent requests; never rely solely on client comparison.
- Avoid false claims: exact-byte deduplication cannot reliably detect crops, edits or recompression differences. Decide separately whether perceptual similarity should be supported.
- Test repeat selection, renamed identical file, same file in two albums, concurrent duplicate submissions, retry after interruption, and no extra slot consumed.

## V1 decision — 2026-10-13 (approved)
- Use **exact SHA-256 content deduplication only**. No perceptual hashing, similarity warnings, AI image comparisons, or blocking of photos merely because they look alike.
- Two photos taken seconds apart, even if nearly identical, must remain independently uploadable.
- Crops, zoomed screenshots, and edited/re-encoded versions count as distinct if their canonical uploaded bytes differ.
- Show a simple duplicate notice only when identical canonical image bytes already exist in the same album. Never silently replace an existing photo.
- Keep computation lightweight and avoid unnecessary server processing. This decision supersedes any earlier optional perceptual comparison proposals.
