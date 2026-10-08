# CCC Vision Worker release protocol

Canonical production entrypoint: cloudflare-worker.js
Candidate: WORKER_PENDING.js
Verified copy: WORKER_CURRENT.js (create only after verified runtime PASS)
Rollback copy: WORKER_PREVIOUS.js (create on the next verified promotion)

## Transition safety
The deployed cloudflare-worker.js is the active production entrypoint and must not be silently replaced by a candidate. The initial WORKER_PENDING.js is a candidate snapshot of the 2.10.185 schema; it is not verified as a functioning live AI analysis. Do not label it CURRENT.

The existing workflow .github/workflows/ccc-vision-worker-deploy.yml currently deploys cloudflare-worker.js on changes to that file/config/workflow. Editing WORKER_PENDING.js alone does not deploy it. This is intentional until promotion is gated.

## Required next implementation
1. Add syntax and schema validation for WORKER_PENDING.js, without contacting OpenAI.
2. Add a guarded candidate deployment or verification step with a separate non-production Worker name; never publish an unverified candidate over production.
3. Verify the actual AI response in the Vinted UI on iPhone.
4. Promote the verified candidate to cloudflare-worker.js and WORKER_CURRENT.js, rotate former verified CURRENT to WORKER_PREVIOUS.js, only after real runtime PASS.
5. Preserve Cloudflare OPENAI_API_KEY, optional variables, and project-scoped GitHub credentials.
6. Verify GitHub readback, Actions deploy, Cloudflare live behavior, then record commit/version.

No automatic rotation may mark an unverified candidate as CURRENT. If a deploy or runtime test fails, stop and preserve CURRENT/PREVIOUS.

## Implemented PENDING validation
GitHub Actions `.github/workflows/ccc-vision-pending-check.yml` runs on changes to WORKER_PENDING.js or the validation workflow. It performs a Node syntax check and static contract checks. It does not deploy or prove live behavior. A green validation check must not trigger CURRENT/PREVIOUS rotation. Production workflow remains separate.

## Isolated candidate deployment
`.github/workflows/ccc-vision-pending-deploy.yml` automatically deploys WORKER_PENDING.js to the separate Cloudflare script `ccc-vision-pending-test` on candidate changes. It uses the existing CCC-scoped GitHub deployment credentials but does not copy production Worker secrets. A successful test deployment is not an AI runtime PASS. Keep `ccc-vision-api` production and its source `cloudflare-worker.js` unchanged until verified promotion.
