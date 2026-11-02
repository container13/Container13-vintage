# Gen17 manual staging deployment plan – 2026-11-02

Branch: ccc-demo-public-test ONLY. No deploy executed or authorized by this document.

Verified on branch by GitHub readback:
- .github/workflows/lina-gen17-sse-staging-deploy.yml exists; workflow_dispatch only, branch guard refs/heads/ccc-demo-public-test, staging name assertion, explicit staging config, isolated tests, Cloudflare secrets presence and Wrangler deploy command.
- .github/workflows/lina-gen17-staging-readiness-no-deploy.yml CI PASS (green GitHub Actions screenshot, run 25s, trigger commit 6969899).
- staging config name linas-opti-gen17-sse-staging, entry ./WORKER_GEN17_SSE_CANDIDATE.mjs.
- production config name linas-opti-api; must remain untouched.

Manual dispatch discoverability:
- GitHub Actions UI did not list manual-only deploy workflow on non-default branch.
- Do not modify, use, or merge main.
- Superseded by user-approved policy revision 2 (2026-11-02): a strictly guarded ONE-SHOT push-started staging publication is allowed on ccc-demo-public-test, pinned to the approved candidate SHA and unique deliberate start marker. Ordinary/subsequent pushes must not deploy. Disarm after execution and inspect outcome before retries. See LINA_GEN17_BRANCH_AND_DEPLOY_SAFETY_RULES.md. The existing workflow has not yet been changed.
- GitHub workflow_dispatch REST/API normally requires workflow registered on default branch; do not assume direct API dispatch will work for branch-only workflow.
- Safe fallback AFTER explicit deployment approval: a one-time local/ephemeral invocation of Wrangler with exact staging config and credentials, or another separately reviewed manual staging-only route. Do not store credentials in code or logs. Confirm Cloudflare permissions and isolated bindings before execution.
- Existing Cloudflare secret presence and dry-run PASS do not prove live staging deploy permission.

Preflight gate before live staging deploy:
1. SATISFIED in current session: user explicitly authorized FIRST REAL DEPLOY to linas-opti-gen17-sse-staging and approved policy revision 2. No repeated approval required for this same scope.
2. Confirm branch ccc-demo-public-test and immutable commit SHA for candidate.
3. Recheck staging name, entrypoint, vars/bindings/routes and absence of production resource references.
4. Run tests and Wrangler dry-run against that exact SHA.
5. Use only wrangler.gen17-sse-staging.jsonc for staging; never wrangler.jsonc.
6. Verify staging URL and diagnostics; do not interpret SSE as PIT verification.
7. Save outcome and readback on same branch.

Current state: CI readiness PASS, deployment NOT STARTED. Gen17 DRAFT_ONLY/PIT_UNVERIFIED; trading and Forward OFF; Gen8–16 frozen.
