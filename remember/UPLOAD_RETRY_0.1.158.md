# Remember upload retry 0.1.158

Status: CODE TESTED, INSTALL/PUBLISH PENDING. Ordinary Remember DEVELOPMENT, wykvztfmfbboxiqvuvwr.

Shared uploader retains request UUID and prepared bytes for the same File+album; automatic network/408/429/500/502/503/504 retries bounded to 3 attempts (45s per transfer, 1s/2s waits), then manual retry retains identity. Permanent denial/duplicate/limit never retries. Queue remains in memory, not across page reload/app termination.

New additive service-only RPC remember_photo_upload_request serializes by album lock, checks owner or active guest token and album activation, binds SHA256, returns ready idempotently, resumes uploading and safely re-arms released slots with quota recheck. New guest writes and completion check schedule; owners preserve their prior schedule exception. Already-ready acknowledgement can succeed after guest window closes but still requires active album and valid authorization. Existing six RPCs/ACLs/tables remain unchanged.

Upload Edge verifies user identity or token, uses upsert=false at original random object key, reads and compares exact bytes even after ambiguous upload errors/AlreadyExists, then invokes idempotent complete. It never deletes objects or releases uploading quota on timeout. It does not clean older abandoned requests automatically. New helper cannot reconstruct an ID/file after app termination or resume old client attempts created with different IDs.

Tests: node remember/tests/upload-retry.cjs: 29 PASS (mocked network/Storage, actual uploader, Edge and four queue functions); node --experimental-vm-modules remember/tests/album-owner-access.cjs: 5 PASS. Candidate SQL+rollback assertions: 8 PASS including 10-limit, dedup, digest mismatch, ID replay, revoked/closed/inactive complete and RPC grants. No physical-device or live-concurrency PASS claimed.

Backup: remember/upload-retry-checkpoint-2026-10-21-0157, commit 64d0c8541ca41a7bdd80581a254268187f94f57f; actual before-source/RPC/ACL/counts. Rollback selectively restores .157 frontend + Edge v3; new unused service-only RPC may remain, no database drops needed. .137 safety reference preserved. No existing album/photo rows changed in prospective tests (2 albums, 10 photos, 10 Storage objects; identical digests, zero fixtures).

Next: install/readback RPC and Edge, rerun actual SQL tests with ROLLBACK, compare advisors, publish and verify version. Then targeted iPhone interruption/retry test only. CURRENT/PREVIOUS null.

Docs consulted 2026-10-21: https://supabase.com/docs/guides/storage/uploads/standard-uploads (upsert=false/AlreadyExists/concurrency); https://supabase.com/changelog (.md fetch unavailable; HTML checked; no relevant change to pinned JS2.118.0 upload/readback API identified). CLI 2.121.0 generated 20261021143400_remember_upload_retry.sql before scratch reset; same filename/source retained.
