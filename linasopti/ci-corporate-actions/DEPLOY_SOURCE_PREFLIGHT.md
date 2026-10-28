# V0.4.46 – deploy-source preflight (2026-10-28)

Status: BLOCKED – NO PRODUCTION DEPLOY.

Verified: wrangler.jsonc still points at ./WORKER_PENDING_RUNTIME_REPORT.js. That file has no V4 diagnostic route. The isolated CI builds .candidate-build/WORKER_V4_RELEASE_CANDIDATE.js, but Wrangler does not point at this generated artifact.

A successful offline bundle test does NOT prove that Cloudflare will deploy V4. Before a release, use an explicit, deterministic package step that puts the exact tested bytes at the configured Worker entrypoint; verify SHA-256 byte identity, packaging and existing endpoint regressions on the deploy artifact. Avoid relying on CI temp files excluded from deployment.

The static release integrity check also remains intentionally blocked while canonical CURRENT_STATE.release is V0.4.45, not-yet-live V0.4.46. Do not falsify canonical live release to obtain a green result.

Needed before release: explicit deployment approval, version/cache and rollback gate, exact deploy artifact test, real live health and source version verification after release. Alpaca entitlement, actual provider schema, historical point-in-time evidence not established.

Gen17 DRAFT_ONLY. Trading and new Forward OFF. Production branch unchanged.
