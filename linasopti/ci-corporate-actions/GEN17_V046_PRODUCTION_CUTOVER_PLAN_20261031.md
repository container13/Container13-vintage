# Gen17 V0.4.46: minimal production cutover plan (2026-10-31)

Status: REVIEW ONLY. No production push, Cloudflare change, or live Alpaca request.

## Verified evidence
- Isolated workflow run 41154981913 SUCCESS on commit 638c77a3; offline Miniflare, Wrangler dry run, SHA identity, candidate gate and blocked-production release guard all PASS.
- Workflow committed the generated candidate to `linasopti/worker/WORKER_V046_PREBUNDLED.js` on isolated branch. Current GitHub blob SHA: `2fdebfb1b5279e895c0da0ffb5a04c7225d4109e` (60414 characters returned by connector; do not confuse with SHA-256).
- Production `ccc-demo-public-test` Wrangler config blob SHA `f8c36aba7d549b585f6c183592b5739fb1834276`, main `./WORKER_PENDING_RUNTIME_REPORT.js`. Isolated Wrangler config blob SHA `30b42ee4a0e39a0cc1805fd6edf6c637f586a70d`, main `./WORKER_V046_PREBUNDLED.js`.
- Cloudflare dashboard Build command None; root `/linasopti/worker`; deploy command `npx wrangler deploy`. The prebundled approach avoids a dashboard build-command change.

## Minimal reviewed deployment candidate, NOT authorized
1. Record current production branch HEAD, Worker source SHA, Wrangler SHA, deployment settings and last known good deployed version. Check drift again immediately before cutover.
2. Prepare a narrow reviewed production change with the exact tested prebundled Worker file plus Wrangler main pointer. No bulk merge of isolated history.
3. Update release/version/cache metadata and release integrity checks without weakening any safety guard; confirm production UI and runtime consistency. Ensure the immutable original Worker source remains for rollback.
4. Validate actual production candidate with offline tests, SHA-256 equality, Wrangler dry run, old /bars and /health regressions, auth/secret redaction and a deployment NO-GO check before requesting explicit release approval.
5. On approved release only, deploy and validate /health, /bars, then one bounded authenticated POST to /corporate-actions-diagnostic. Never include secrets in logs. Roll back to original Wrangler pointer and original source if any regression.
6. Record sanitized provider schema and entitlement; PIT/as-of and license remain independent blockers. Do not promote Gen17.

## Safety
No live release approval yet. Gen17 DRAFT_ONLY/BLOCKED_DATA, Gen8–16 frozen, trading/Forward OFF.
