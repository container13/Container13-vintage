# Remember Test — behovsstyrd karantänrensning (byggspecifikation)

Status: DESIGN / NOT DEPLOYED. Production unchanged. Existing hourly cron remains enabled until tests PASS.

## Verified baseline
- Test project `kauxrvshxgpbvptdwhog`.
- Existing cron job 1: `0 * * * *`, active; calls `remember-photo-quarantine-purge` using Vault secret.
- Eligibility in deployed SQL: queue decision `rejected`, `decided_at + interval '72 hours' <= now()`, matching photo `state='ready'`. Claim and finalize recheck eligibility.
- Queue currently: 1 approved, 0 rejected; 4 ready photos.
- `pg_net` HTTP POST is asynchronous: successful cron execution does not prove successful Edge Function response.

## Intended behavior
1. A rejection transaction schedules or reconciles the earliest `rejected` expiry (`decided_at + 72h`), using a durable DB-side trigger, not client code.
2. Restoring/approving/deleting a rejected photo reconciles the next expiry. Pending approvals are NOT quarantine and must not schedule deletion.
3. When no rejected photos remain, the purge job is disabled or unscheduled. Never disable it before replacement passes all tests.
4. At expiry, invoke the existing secret-protected purge function. Observe the asynchronous HTTP result, not merely the cron SQL result; on failure, retain a durable retry at bounded backoff.
5. Multiple simultaneous decisions, function restarts, repeated requests, and overlapping executions must be idempotent. Use transaction-level serialization/advisory locking and stable named cron job, avoiding duplicate jobs.
6. When one batch exceeds 50 items, schedule further batches until empty. If an item cannot be deleted, preserve it for retry and never incorrectly mark it purged.
7. Add a reconciliation recovery path for missed trigger execution, database restarts, and lost HTTP responses. A once-daily lightweight *database-only* safety check is acceptable only if strictly needed for reliability, and must not invoke image purge when the queue is empty.
8. Preserve the existing restore-before-expiry rule; no deletion of approved images. Review public SECURITY DEFINER execute grants before deploying new functions.

## Test gates (Remember Test only)
- Empty queue -> no active purge job; no deletion.
- Reject -> one scheduled job at correct deadline; duplicate rejects -> no duplicate job.
- Restore before deadline -> job rescheduled/disabled; image intact.
- Expiry -> existing claim/storage/finalize pipeline succeeds; correct image removed.
- HTTP 503/timeout -> response recognized, retry scheduled, image not falsely finalized.
- 51+ expired -> subsequent batches scheduled.
- Race: restore vs purge -> existing claim lock prevents inappropriate restore/deletion.
- Verify job status, HTTP response, DB rows and Storage objects separately.
- Only after PASS: disable cron job 1; read back new job state. Never change production without separate approval.

## Next implementation task
Inspect deployed rejection/restore function and DB triggers for insertion points; choose exact scheduling primitive and retry persistence, then implement in a separate test-only migration with rollback. Do not deploy speculative SQL or deactivate job 1 prematurely.

## Integration verification 2026-10-17
- Direct pg_catalog read found **zero user-defined triggers** on `remember.photo_approval_queue` in Remember Test.
- Both `pg_cron` and `pg_net` extensions are installed.
- Decision RPC `public.remember_photo_approval_owner_decide` writes pending->approved/rejected; restore RPC `public.remember_photo_quarantine_restore` writes rejected->approved. Both are valid integration paths for an AFTER UPDATE trigger.
- No scheduler SQL has been deployed; cron job 1 remains active. Next implementation must first validate scheduling semantics and reliable retry/response handling, then test without affecting real photos.

## Implementation checkpoint 2026-10-17 — preview deployed, PASS
- Test-only Supabase migration `remember_quarantine_scheduler_preview_v1` applied successfully.
- Created `remember.quarantine_schedule_preview()` as SQL STABLE SECURITY INVOKER, read-only; revoked EXECUTE from PUBLIC, anon and authenticated.
- Function derives rejected_count, earliest `decided_at + 72 hours`, and expired_count by joining approval queue with ready photos.
- Verified direct execution result: rejected_count=0, next_expiry=NULL, expired_count=0 (PASS for current empty queue).
- **NOT YET IMPLEMENTED:** automatic scheduling trigger, one-shot job, retry/result handling, and switching off hourly cron. Do not confuse preview PASS with full scheduler PASS.
- Existing hourly cron remains enabled. Production unchanged.

## Implementation checkpoint — scheduler state (2026-10-17)
- Applied test-only migration `remember_quarantine_scheduler_state_v1`: private singleton table `remember.quarantine_scheduler_state` and internal `remember.refresh_quarantine_scheduler_state()`.
- EXECUTE/table access revoked from public/anon/authenticated; refresh derives values from deployed read-only preview.
- Verified state row: `rejected_count=0`, `next_expiry=NULL`, refreshed timestamp present. PASS for empty queue.
- This is passive state only. No trigger, one-shot scheduling, retry mechanism, or cron replacement deployed yet. Existing hourly cron must remain active.
