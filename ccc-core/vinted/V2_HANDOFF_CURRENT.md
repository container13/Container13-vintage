# CCC Vinted V2 — handoff 2026-10-08

## Locked live baseline
- CCC Vinted live baseline v2.10.216. Do not bump version or change live app/production Worker until V2 copy is editorially approved.
- Branch: ccc-demo-public-test, repo container13/Container13-vintage.
- Keep user's broad hashtag bank unchanged.

## Work completed
- COPY_ENGINE_V2_DRAFT.md: independent Neutral / Säljande / Maxad editorial specification.
- copy-engine-v2-test.mjs: isolated Node test script for 4 fixtures × 3 styles = 12 samples.
- .github/workflows/vinted-v2-copy-test.yml: GitHub Actions smoke test.
- GitHub Actions run 37823555169 failed at 'Check AI key is configured': repository secret OPENAI_API_KEY absent. No AI samples generated, no editorial test passed.
- WORKER_V2_ISOLATED_TEST.js: isolated Cloudflare Worker source committed (38faf37aa6f9b6cf4e6f4bd05748486b3705563a). Requires secrets OPENAI_API_KEY and VINTED_TEST_TOKEN. NOT deployed or tested.

## Next session
1. Inspect existing Cloudflare/GitHub deployment automation and identify a safe way to deploy an entirely separate test Worker, without touching production or existing pending deployment.
2. Set up separate Worker credentials securely in Cloudflare; never expose or commit keys. Existing Cloudflare secret is not automatically accessible in GitHub.
3. Deploy and verify test Worker endpoint; require Bearer test token.
4. Generate 12 AI listings (Lee jeans, black jacket, green knit, white sneakers × neutral/selling/max), review style separation, accuracy and writing quality.
5. Only after user approves results consider integration and a release with verification.

## Release safeguards
- No claim of passing tests before real outputs have been inspected.
- Do not modify WORKER_PENDING.js, production cloudflare-worker.js, active Vinted files or version.js during isolated test preparation.
- Preserve the latest working deployment and user hashtag preferences.
