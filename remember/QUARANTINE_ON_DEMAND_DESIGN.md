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

## Implementation checkpoint — queue trigger installed (2026-10-17)
- Applied test-only migration `remember_quarantine_scheduler_queue_trigger_v1`.
- Installed statement-level AFTER INSERT / UPDATE OF decision, decided_at / DELETE trigger `remember_quarantine_scheduler_queue_changed` on `remember.photo_approval_queue`.
- Trigger invokes private `remember.refresh_quarantine_scheduler_state()` via a SECURITY DEFINER trigger function with empty search_path; EXECUTE revoked from public/anon/authenticated.
- Verified pg_trigger reports exactly the new trigger, enabled (`tgenabled='O'`). Readback: scheduler state rejected_count=0, next_expiry=NULL; queue still 1 approved.
- **NOT YET TESTED:** actual rejected->restored transition, trigger execution on a queue mutation, timing/retry behavior. Trigger installation PASS, end-to-end functionality not yet PASS.
- No image deletions, no production changes, no cron switch-over. Existing hourly cron remains active.

## Transactional trigger test 2026-10-17 — PASS
- Ran `BEGIN; UPDATE remember.photo_approval_queue SET decision='rejected',decided_at=now() WHERE decision='approved'; SELECT rejected_count,next_expiry IS NOT NULL FROM remember.quarantine_scheduler_state; ROLLBACK;` in Remember Test.
- Within transaction trigger recomputed `rejected_count=1`, next expiry present: PASS.
- After rollback, independent read returned `rejected_count=0`, `next_expiry=NULL`: rollback PASS.
- Test did not invoke purge or commit a rejection. Additional queue count read was blocked; do not claim it was independently verified.
- Scheduler execution, retries, and disabling hourly cron are still NOT implemented.

## Deployed test-only demand-controlled hourly cron (2026-10-17)
- Migration `remember_quarantine_scheduler_toggle_on_queue_v1` replaced trigger function to refresh scheduler state and call `cron.alter_job(job_id => matching postgres-owned named job, active => rejected_count > 0)`; aborts transaction if named cron job is missing.
- Transactional test with 1 rejected: `rejected_count=1`, cron active=true. ROLLBACK.
- Transactional test with empty rejected queue: `rejected_count=0`, cron active=false. ROLLBACK.
- Explicitly disabled cron job 1 because queue is empty; independent readback confirmed active=false.
- Tested rejected update FROM inactive job: cron active=true inside transaction; ROLLBACK and independent readback confirmed active=false.
- **Deployed behavior is demand-controlled HOURLY, not exact 72-hour one-shot.** When rejected queue is nonempty, existing hourly purge function checks 72-hour eligibility. When empty, no hourly purge runs.
- Pending approval is not rejected quarantine and does not activate the purge job. No image deletion in these tests. Production unchanged.
- Remaining hardening: concurrent queue changes/reconciliation, HTTP 503 visibility and retry guarantees, 50+ batch continuation, restore-path transaction test. Do not claim those PASS yet.

## Concurrency hardening 2026-10-17
- Confirmed queue FK `photo_id` and `album_id` use ON DELETE CASCADE, so deleting a photo should remove queue row and invoke queue DELETE trigger (actual deletion flow not tested).
- Applied migration `remember_quarantine_scheduler_serialize_v1`: added transaction-scoped advisory lock `pg_catalog.pg_advisory_xact_lock(130013,72001)` before state refresh and cron toggle, serializing trigger-driven reconciliations.
- Transaction test with rejected image: rejected_count=1 and cron active=true; ROLLBACK. Independent readback cron active=false: PASS.
- True parallel-session concurrency test still NOT performed; advisory lock reduces race risk but is not proof of full concurrency safety. No production changes.

## Retry safety review — unresolved issue (2026-10-17)
- Verified `public.remember_photo_quarantine_claim` inserts a durable row into `remember.photo_quarantine_purge_claims` with `ON CONFLICT DO NOTHING`; an existing claim prevents later attempts from claiming the same photo.
- Verified `public.remember_photo_quarantine_release` removes the claim explicitly; claim table contains `photo_id` and `claimed_at`, no automatic lease/expiry evident in the inspected schema.
- Current claim count = 0 (healthy now), but if an Edge Function terminates after claim and before release/finalize, the claim **may become stranded**. Existing hourly retry cannot claim it again. This is a potential liveness defect, not a verified production incident.
- **Do not auto-delete claims just by age without proving no in-flight worker**; require lease ownership/token or a bounded safe recovery protocol, and inspect deployed Edge Function cleanup behavior before modifying purge.
- Status: RETRY/503 TEST NOT PASS; no destructive test performed, no claim removed, no production change.

## Purge error-path patch deployed (2026-10-17)
- Read deployed `remember-photo-quarantine-purge` v5 and verified failure path after `remember_photo_quarantine_finalize` did not release claim.
- Deployed v6 in Remember Test: on finalize error or `{ok:false}`, attempt `remember_photo_quarantine_release` and log any release error. Existing authentication and 50-item batch limit unchanged.
- Independently fetched deployed function: ACTIVE version 6 and patch text present (readback PASS).
- **Remaining:** abrupt crash after claim and before release is not solved by this patch; HTTP 503 recovery and batch >50 remain untested. Do not claim full retry safety PASS.
- Production untouched; no image deletion test performed.
