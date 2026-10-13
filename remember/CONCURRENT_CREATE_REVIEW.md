# Concurrent create and API deployment review

Status: prepared, NOT executed/deployed. Migration 2 already installed and single-transaction tests PASS.

## Exact disposable test
Use two separate SQL Editor connections in container13-remember (wykvztfmfbboxiqvuvwr):
1. 013_concurrent_create_A_REVIEW_FIRST.sql: commit one named disposable album while holding its insert transaction open for 12 seconds.
2. Start 014_concurrent_create_B_REVIEW_FIRST.sql before A finishes. Same verified actor, request ID and defaults. B must return created=false and the same album ID after A commits.
3. Read back exactly one test album, then execute 015_concurrent_create_CLEANUP_REVIEW_FIRST.sql. Cleanup refuses mismatched ownership/title/windows or any dependent data. Verify exact test ID absent and totalAlbums=0 afterward.

This differs from previous rollback-only tests: one temporary row is COMMITTED and then DELETED. Obtain explicit approval before A/B/C. No arbitrary album deletion or schema change is allowed. If results are ambiguous, inspect actual rows/active transactions before retrying.

## Candidate 0.1.3
The existing remember-webmaster handler adds create_album after JWT and webmaster checks, strict input validation, 8KB body cap and a single RPC call. Identity and 10-photo baseline cannot be supplied by a browser. Other writes remain disabled. Public read responses include a creation capability only in the new deployed version.

remember/login.html includes the bounded pilot form, hidden until the authenticated server advertises creation capability. A stable request/payload is kept in the current tab for safe retries. UI/GitHub changes alone do not enable API writes.

Syntax and mocked validation tests PASS. Real creation API/UI tests and device test still pending. Approve deployment only after concurrency/cleanup PASS; server deployment introduces a new HTTP write path. Reuse the existing function and shared adapter. No service key in client, no Micke50 changes.

After approved deployment: verify version header, no-session/invalid-session denial, input errors and a real authorized create+retry with explicit test-album scope. Capture actual row count/title/time/owner and browser list response. Mobile pinch preference remains enforced. No public guest link, storage upload, schedule editing, payment or true upload-quota enforcement yet.
