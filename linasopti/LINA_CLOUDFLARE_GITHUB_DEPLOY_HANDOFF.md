# Linas Opti – Cloudflare/GitHub deployment handoff (2026-11-02)

READ THIS FIRST in every new chat working on Lina Gen17 staging deployment. Also read LINA_MASTER_RULES.md, LINA_SYSTEM_MANUAL.md, LINA_CURRENT_STATE.json and the latest LINA_HANDOFF_CURRENT.md. This document is a deployment-specific handoff, not permission to deploy or modify production.

## Verified state
- GitHub repo: container13/Container13-vintage. Development branch: ccc-demo-public-test.
- Production Cloudflare Worker: linas-opti-api. Do NOT change or deploy it; do not alter its wrangler.jsonc, secrets, trading or Forward controls.
- New isolated Cloudflare Worker **linas-opti-gen17-sse-staging** was manually created in the Cloudflare dashboard on 2026-11-02 with Hello World code. Cloudflare screenshot showed it Ready, manually deployed, at linas-opti-gen17-sse-staging.mangaj73.workers.dev. This is NOT yet evidence that Gen17 candidate code is deployed.
- Staging config in repo: linasopti/worker/wrangler.gen17-sse-staging.jsonc. Its name is linas-opti-gen17-sse-staging, main is ./WORKER_GEN17_SSE_CANDIDATE.mjs, workers_dev=true.
- Staging candidate entry: linasopti/worker/WORKER_GEN17_SSE_CANDIDATE.mjs; diagnostic endpoint /corporate-actions-sse-diagnostic. Gen17 remains DRAFT_ONLY / PIT_UNVERIFIED; trading and Forward OFF.
- GitHub Actions SSE candidate tests and Wrangler **dry-run** passed, e.g. https://github.com/container13/Container13-vintage/actions/runs/41368786330. Dry-run is NOT a live deployment.
- Existing GitHub workflow .github/workflows/ccc-vision-worker-deploy.yml uses cloudflare/wrangler-action@v3 and references repository secrets CCC_CLOUDFLARE_API_TOKEN and CCC_CLOUDFLARE_ACCOUNT_ID. Their references are verified in GitHub; actual presence, current validity, and permission scope of secrets have NOT been verified. Do not assume CCC credentials can deploy Lina Worker.
- Existing workflow .github/workflows/lina-worker-promote.yml is audit-only, NOT deployment.

## Next action (avoid repeated dashboard work)
Investigate whether existing GitHub Actions Cloudflare credentials are usable for the separate staging Worker, without exposing secret values and without deploying production. Prefer a dedicated **manual workflow_dispatch** workflow on ccc-demo-public-test with a hard guard verifying exact staging Worker name/config and command: cd linasopti/worker && npx wrangler deploy --config wrangler.gen17-sse-staging.jsonc. Verify permissions before enabling actual deploy. Keep production config untouched. If credentials cannot deploy, request the minimum required Cloudflare action from user; never ask them to paste secrets into chat.
Do not repeat setup already completed. Preserve results in GitHub handoff after important changes and verify readback.
