## V0.2.59 – Gen3 rule-by-rule summary + evidence freeze

Builds on V0.2.58 without changing the frozen Gen3 plan (`fa55540a`) or runnerspec (`427a8742`). Existing V0.2.58 Gen3 local state is deliberately reused.

- Shows every locked gate for every completed Gen3 family and the exact FAIL reason(s).
- After 4/4 families are complete, creates one immutable Gen3 research summary and syncs it through the existing Evidence/GitHub path.
- If no family clears every preregistered gate, Gen3 is closed as `NO_CANDIDATE_FOR_FORWARD`; no rerun/rescue and Forward remains blocked.
- If an eligible family exists, Forward still remains closed until a separate candidate freeze is GitHub-verified.
- Handel AV. Cloudflare Worker unchanged.


## V0.2.60 – Global export + Lina Generation 4 preregistration

Builds on V0.2.59. Gen3 remains frozen and unchanged (`NO_CANDIDATE_FOR_FORWARD`).

- Adds a permanent global `📥 Exportera Lina-status` button in the header that downloads a complete analysis JSON to Downloads without exporting login secrets.
- Adds focused `📥 Exportera Gen3-resultat` and `📥 Exportera Gen4-plan` exports for future diagnostics and handoff.
- Introduces Lina Generation 4 by reusing the proven generation framework while keeping research state, hashes and evidence separate from Gen3.
- Gen4 is plan-review only in this release: plan hash `8d51311d`, four preregistered diversification hypotheses, unchanged quality gates, no runnerspec, no engine, no research runs.
- Handel AV. Cloudflare Worker unchanged.

## V0.2.61 — Gen4 runnerspec + engine gate
- Gen4 plan `8d51311d` remains immutable and uses the existing V0.2.60 plan-lock state.
- Added separate Gen4 runnerspec/engine state and deterministic runnerspec hash.
- Hard research-data stop remains `2024-12-31`; 2025-01-01–2026-09-10 is observed and cannot become a new holdout.
- Forward remains sealed until a future Gen4 candidate is frozen; no backdating.
- Research execution is intentionally still closed in V0.2.61. Human sequence: lock runnerspec → verify engine → export diagnostics.
- Permanent project rule: when ChatGPT needs exact Lina information, provide a download/export button for that diagnostic instead of relying on screenshots/manual copying. Global `📥 Exportera Lina-status` remains available; Gen4 also has `📥 Exportera Gen4-diagnostik`.
