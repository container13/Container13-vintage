# Gen17 SSE candidate CI PASS and deployment gate — 2026-11-02

## Verified GitHub Actions (commit da75a9d416144c9a15b7a8f8f4d4b746fbc7bfbb)
- SSE Candidate Tests: **SUCCESS**, run 41367665513, https://github.com/container13/Container13-vintage/actions/runs/41367665513 . Ten isolated tests passed (security, date validation, SSE envelope, event/byte bounds and sanitized errors).
- Lina Release Integrity: **SUCCESS**, run 41367665512.
- Pages build and deployment: **SUCCESS**, run 41367666023.

## Current scope
- Candidate: `linasopti/ci-corporate-actions/sse_diagnostic_candidate.mjs`.
- Tests: `linasopti/ci-corporate-actions/sse_diagnostic_candidate.test.mjs`.
- Existing Worker entry in `linasopti/worker/wrangler.jsonc` is still `./WORKER_V046_PREBUNDLED.js`; candidate is **not imported or routed**. Therefore no SSE production endpoint is yet available.
- No live Alpaca SSE query has been run; CI uses mocked upstream and no provider secrets.

## Next gate before live test
1. Review remaining risks: timeout while upstream fetch hangs, SSE framing split across chunks, malformed/non-JSON event handling, partial event on EOF, bounded memory on long no-delimiter input, and cancellation. Add focused tests where necessary.
2. Prepare separate prebundled Worker artifact with only `POST /corporate-actions-sse-diagnostic` and existing login auth, preserving all other routes, existing secret bindings and trading-disabled state.
3. Verify no changes to other Worker behavior; CI syntax + route checks + existing integrity checks; review deployment/rollback and require controlled deployment decision.
4. Only after deployment run bounded historical emission-day tests; distinguish provider denial, empty replay and confirmed PIT.

## Invariants
Gen17 DRAFT_ONLY/PIT_UNVERIFIED. Gen8–16 frozen. Trading and Forward OFF. No provider secrets stored in repository or chat.
