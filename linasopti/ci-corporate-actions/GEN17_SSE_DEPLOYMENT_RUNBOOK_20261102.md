# Gen17 SSE — controlled deployment runbook (2026-11-02)

## Verified preflight
- CI PASS for SSE code + integration tests: https://github.com/container13/Container13-vintage/actions/runs/41368034379
- Candidate: `linasopti/worker/WORKER_GEN17_SSE_CANDIDATE.mjs`
- Active config: `linasopti/worker/wrangler.jsonc` still points to `./WORKER_V046_PREBUNDLED.js`. The candidate has NOT been deployed.
- Existing production Worker name: `linas-opti-api`.

## Deployment safety gate
1. **Do not change production automatically**. Review current Cloudflare Builds triggers and whether a push to `ccc-demo-public-test` would deploy the Worker.
2. Prefer an isolated staging Worker with its own name and route, never overwrite production for initial provider tests. Configure only necessary credentials and login secret via Cloudflare secrets; do not commit or print secrets. Ensure `keep_vars` does not unexpectedly import production configuration.
3. Before staging deploy, validate the candidate bundle with Wrangler dry-run and test exact `/health`, existing diagnostic route, and `POST /corporate-actions-sse-diagnostic` auth behavior. Verify no changes to trading/Forward controls.
4. Execute a bounded, authenticated SSE query for one historical emission date. Log only response metadata; no raw provider payloads or secrets. HTTP 200, an empty stream, or event timestamps do **not** independently prove PIT completeness.
5. Roll back staging by deleting/disabling its isolated route or redeploying the known-good staging artifact. If production ever changes, restore `main: ./WORKER_V046_PREBUNDLED.js` and deploy the verified original artifact.

## Stop conditions
Any CI failure, unauthorized endpoint exposure, missing provider credentials, unknown Cloudflare trigger, unexpectedly enabled trading/Forward, or missing rollback verification => STOP. No live deployment authorized by this document alone.

## State
Gen17 DRAFT_ONLY; PIT unverified; trading and Forward OFF.
