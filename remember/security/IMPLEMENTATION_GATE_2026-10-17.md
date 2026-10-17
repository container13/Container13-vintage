# Security settings – implementation gate

Status: REVIEW ONLY. No Supabase changes.

## Candidate contract
- A new server-only transactional write operation receives a verified actor, UUID request ID, action, album ID (when relevant), setting key and typed value.
- Album owners may change only their own album settings. Global modes and TEST eligibility require verified webmaster membership.
- Only OFF and TEST modes are eligible for the initial implementation. ON is blocked until upload and gallery enforcement are independently tested.
- A request ledger deduplicates retries and rejects reuse of a request ID with different input.
- The setting update, audit entry and request ledger must commit or roll back together.
- New settings must be isolated from current album/gallery/upload behavior until explicitly activated.

## Technical review still required
1. Use parameterized SQL with a strict setting-key allowlist; do not trust client-supplied actor IDs.
2. Validate Supabase Auth token in the Edge Function, and check ownership or webmaster role in the transaction.
3. Verify SQL function ownership, schema grants and service-role-only execution.
4. Verify row locks, concurrent requests, rollback on audit failure and replay behavior.
5. Verify TEST eligibility by exact album ID, and deny ON.
6. Define audit retention when album is deleted.
7. Check SQL syntax and function dependencies in a disposable transaction before applying migrations.
8. Run negative HTTP tests before declaring any security feature operational.

## Current boundary
The schema and rollback candidates exist in this folder. Transactional server code is NOT deployed. The next deliverable is a reviewed SQL implementation and separate Edge Function candidate. No change to production Remember.
