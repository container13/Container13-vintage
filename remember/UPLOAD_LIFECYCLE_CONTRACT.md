# Remember upload lifecycle — implementation contract (not deployed)

Status: design checkpoint only. Migration 6 is NOT installed. No guest uploads or storage are enabled.

## States
- reserved: a server-locked quota slot, expires after 15 minutes if no upload starts.
- uploading: server has started an authenticated storage transfer. The slot remains counted until a server reconciler checks storage; never expire solely based on client clock.
- ready: server verified a complete, valid private storage object and committed the database state. Counts against quota.
- failed: transfer failed, object removed or proven absent, and slot released.
- deleted: authorized deletion completed, object removed, and slot released.

## Required server-only sequence
1. Validate active guest token, upload window and quota, then reserve under an album row lock.
2. Validate file signature, type, dimensions and byte limit before accepting it. Reject SVG and executable content; use random object keys.
3. Transition reserved -> uploading only if the reservation is valid and not expired.
4. Write to a private bucket using privileged server credentials, never expose service role or public object paths to guests.
5. Read back object metadata and verify bytes and content before changing uploading -> ready.
6. On failure, remove partial objects and set failed only after confirming the object is absent. Do not count failed/deleted.
7. Reconcile abandoned uploading entries against actual storage state before releasing quota. Never delete a confirmed object on a timeout alone.
8. Enforce server-side deadline at final commit as well as reservation. Handle deadline closure by removing unfinished uploads.
9. All state transitions must be atomic and restricted to service_role; idempotency prevents duplicate images.
10. Guest gallery/download requires separate token verification; webmaster uses verified login and role. No permanent public object URLs.

## Safety gaps to close before enabling uploads
- Add private bucket and storage RLS configuration.
- Add privileged transition RPC with exact state predicates and verified-object proof at the Edge Function boundary.
- Define max upload size, accepted image formats, image metadata stripping and malware checks.
- Add idempotent cleanup/reconciliation and concurrency tests, including token revocation mid-upload.
- Add real end-to-end mobile upload and download tests.

## Existing migration 6 limitations
- Reservation is the only database operation prepared; there is no upload/complete/cleanup endpoint yet.
- Retrying an expired reservation returns not accepted, so clients must start a new request ID.
- Uploading reservations remain counted intentionally until storage-aware reconciliation exists.
- Do not execute migration 6 as a substitute for a complete upload implementation.
