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
