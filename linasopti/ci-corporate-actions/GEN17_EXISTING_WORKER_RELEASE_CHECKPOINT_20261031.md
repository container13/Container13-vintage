# Gen17: existing Worker release checkpoint, 2026-10-31

Decision: REUSE existing Cloudflare Worker `linas-opti-api`. No new permanent Worker, no new GitHub Actions API secrets, no production deployment yet.

## Verified implementation
- `corporate_probe.mjs`: POST only; requires `LINA_LOGIN_CODE` via `X-Lina-Login-Code`; uses existing Worker environment Alpaca keys. Hard-coded AAPL, 2020-01-01 through 2020-12-31, data_quality=all, maximum 5 pages and 500 events. This is not a SPY-2024 provider check.
- `build-v4-release-candidate.mjs` inserts `/corporate-actions-diagnostic` into the existing Worker router and creates an offline bundle. No live request/deploy.
- Isolated branch Wrangler main: `WORKER_V046_PREBUNDLED.js`. Production deployment source documented as `WORKER_PENDING_RUNTIME_REPORT.js`. Cloudflare dashboard Build command confirmed None, root `/linasopti/worker`, deploy command `npx wrangler deploy`, branch `ccc-demo-public-test`.
- Existing offline V4 CI PASS does not establish real provider response, entitlement, historical point-in-time/as-of, or data storage/license rights.
- Separate GitHub Actions Alpaca probe run 41153966190 BLOCKED_CREDENTIALS; no upstream request sent.

## Minimal next release gate
1. Verify exact committed prebundled Worker bytes match tested V4 bundle; preserve existing endpoints and authentication in tests.
2. Capture immutable production source/config rollback baseline.
3. Prepare narrowly scoped reviewed change on production branch only after explicit release authorization; do not merge isolated branch history or enable a Cloudflare build command alone.
4. After verified live deployment, run exactly one bounded authenticated read-only AAPL 2020 provider diagnostic and record sanitized schema/counts; SPY 2024 requires separately reviewed parameter change.
5. Keep PIT/as-of and license gates blocked regardless of a successful API response.

No production write or deploy, no live Alpaca request. Gen17 DRAFT_ONLY/BLOCKED_DATA. Trading and Forward OFF.
