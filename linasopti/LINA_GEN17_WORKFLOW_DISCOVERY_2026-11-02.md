# Gen17 staging workflow discovery – 2026-11-02

Branch: ccc-demo-public-test only. No deployment authorized or performed.

Verified by GitHub readback: manual-only .github/workflows/lina-gen17-sse-staging-deploy.yml exists and contains workflow_dispatch, branch guard, staging-only config, tests and explicit Wrangler config. GitHub Actions UI may not expose a workflow_dispatch workflow present only on a non-default branch. Do not use main to fix discoverability.

Safe next design: separate push-triggered **NO DEPLOY** staging readiness workflow restricted to ccc-demo-public-test and its own file path, with static checks/tests/dry-run only. A live staging deploy requires a separate explicit user approval and a narrowly guarded one-shot mechanism; do not introduce a push-triggered live deploy in advance. Existing preflight PASS run 41370551566 proves secrets presence and dry-run, not Cloudflare permission scope.

Current state: staging Worker still Hello World per handoff; Gen17 DRAFT_ONLY/PIT_UNVERIFIED, trading/Forward OFF; production linas-opti-api untouched.
