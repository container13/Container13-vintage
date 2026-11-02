# Gen17 staging readiness – 2026-11-02

Scope: ccc-demo-public-test ONLY. No real deployment authorized or executed.

New workflow: .github/workflows/lina-gen17-staging-readiness-no-deploy.yml
Commit: 6969899b44352b7ac61f94df84f2cf793d362098
GitHub readback: exact file content verified.

Workflow push trigger limited to its own path on ccc-demo-public-test. Job guard checks exact branch. Checks staging target, existing candidate tests and Wrangler --dry-run with explicit staging config. No Cloudflare secrets, no live deployment command, no production Worker changes.

Prior manual-only workflow remains in place but is not exposed in Actions UI according to earlier user screenshot. This readiness workflow does not resolve live manual deployment dispatch. It validates safe branch-specific Actions execution without using main.

Next: inspect actual GitHub Actions run for commit 6969899b44352b7ac61f94df84f2cf793d362098 and log PASS/FAIL. If no run appears, diagnose trigger/Actions registration without changing main. Do not enable any live deploy without explicit user authorization.

Research remains Gen17 DRAFT_ONLY / PIT_UNVERIFIED, trading and Forward OFF; Gen8–16 frozen.
