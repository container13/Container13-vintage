# Gen17 – reuse of existing SSE and archive infrastructure (2026-11-02)

Status: READ_ONLY_CODE_AUDIT / DESIGN_ONLY / PIT_UNVERIFIED.

## Verified current branch files
- worker/wrangler.jsonc: main=./WORKER_V047_SSE.mjs, name=linas-opti-api, keep_vars=true. This supersedes older documentation claiming prebundled V046 remains the current entry.
- worker/WORKER_V047_SSE.mjs: only /corporate-actions-sse-diagnostic is routed to sseDiagnostic; all other routes and OPTIONS delegate to V046 base.
- ci-corporate-actions/sse_diagnostic_candidate.mjs: authenticated read-only bounded SSE query; limits 20 events, 65536 bytes, 9 seconds; returns 3 sanitized samples, event counts, provider 'at', stopReason, completeness and pitVerified=false. It does not continuously ingest or archive full event payloads.
- gen17-sse-diagnostic.js: manual UI, sessionStorage phase guard (pending/uncertain/received/saved), observedAt assigned when response received, /runtime-report saves sanitized report to GitHub and requires verified receipt. No automatic retry on uncertainty.
- Existing saved diagnostic reports: 2020-08-31 empty/incomplete, 2026-09-15 and 2026-09-16 20-event capped/incomplete. Already run; do not repeat.

## Gap analysis
1. Current diagnostics only sample 3 event payloads, not complete event histories.
2. Current client sessionStorage is not durable cross-device storage or a continuous ingest ledger.
3. GitHub runtime-report receipt proves that a diagnostic report was saved later, not that each historical event was observed at its 'at' timestamp.
4. No continuous collector, durable append-only event journal, checkpoint/replay continuity or immutable bar snapshot chain was identified in these inspected files. This is a scoped code finding, not a claim about all possible connected systems.
5. The current SSE diagnostic can remain unchanged; a separate future-only collector must have explicit design and approval before code/deploy.

## Proposed future-only contract (not implemented)
- One immutable envelope per received provider event: provider event_id, provider at, local first_observed_at_utc, ingestion sequence, source endpoint, sanitized raw payload hash, payload archive pointer, action, corporate-action id and revision lineage.
- Durable append-only journal, idempotent dedup by provider event ID + payload hash, restart checkpoint and gap/retention alarms; failed or uncertain writes never silently advance checkpoints.
- For bars, store original response, feed, adjustment, requested asof semantics, fetch time, market session and SHA-256; do not rewrite prior snapshots when provider history changes.
- Operational gates: credential isolation, limits, immutable write verification, failure injection, replay and recovery tests, explicit no-trade/no-forward isolation, cost and retention review.
- Prospective first_observed timestamps apply only from actual collector launch; no retroactive PIT certification of 2020–2024.

## Next
Inspect existing runtime-report persistence and other storage paths before deciding whether to reuse that storage for a prospective collector. No Worker edits or new provider calls in this step.

Guards: only ccc-demo-public-test; Gen8–16 frozen; Gen17 DRAFT_ONLY/PIT_UNVERIFIED; trade/Forward OFF.
