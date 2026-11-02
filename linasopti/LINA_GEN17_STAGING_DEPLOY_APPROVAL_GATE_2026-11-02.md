# Gen17 staging deployment approval gate – 2026-11-02

Branch: ccc-demo-public-test. No live deploy authorized or executed.

Readiness workflow commit 6969899b44352b7ac61f94df84f2cf793d362098; exact GitHub file readback PASS. User replied "pass", but technical GitHub Actions run success was NOT independently established. GitHub connector fetch_commit_workflow_runs returned [] for that SHA; endpoint is limited to pull-request-triggered runs and cannot prove absence or success of push runs. Status CI_UNVERIFIED.

Existing manual staging deployment workflow .github/workflows/lina-gen17-sse-staging-deploy.yml remains uninvoked and may not be visible in Actions UI due to workflow_dispatch registration rules. Do not touch main. Do not turn a normal push into live deployment. A push-triggered deployment would violate the user's no-automatic-deploy requirement.

Before first real staging deploy: (1) verify readiness CI PASS using GitHub Actions run/logs; (2) verify token scope or expect bounded failure; (3) confirm exact staging config name linas-opti-gen17-sse-staging and entry WORKER_GEN17_SSE_CANDIDATE.mjs; (4) verify isolated staging secrets/bindings and no production resources; (5) obtain separate explicit approval for the live staging deployment and its exact invocation. No use of production wrangler.jsonc or linas-opti-api.

Gen17 remains DRAFT_ONLY/PIT_UNVERIFIED; trading and Forward OFF; Gen8–16 frozen.

Next safe step: obtain authoritative Actions run result for readiness workflow (not PR-only commit-run endpoint), then investigate a branch-only manual dispatch mechanism without deploying or using main. Do not claim PASS without evidence.
