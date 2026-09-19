# Lina Clean Core — Handoff V0.2.87

V0.2.87 is a recovery/sync-only release after the already observed and frozen Gen6 run from V0.2.86.

## Immutable research state
- Gen6 plan hash: `206c11d7`.
- Gen6 runnerspec hash: `768e8d3e`.
- Gen6 is already frozen; candidate is already locked by the deterministic pre-registered rule.
- This release MUST NOT rerun Gen6, fetch market data for research, start Gen7, or open Forward.
- Handel remains AV. Robotmognad model remains `6e8908ca`.

## V0.2.87 change
- `evidence-sync.js` now reconciles GitHub-verified Gen6 family, summary and candidate evidence back into `lina_generation_engine_v0273` monotonically.
- Generation Engine exposes one recovery action after Gen6 freeze: `Slutför + verifiera Gen6-evidenssynk`.
- The action calls only the existing evidence queue sync/reconcile path. It does not call Gen6 `runAll`, data preflight or market-data endpoints.
- Completion requires 4/4 family evidence + frozen summary + locked candidate evidence (if candidate exists) to be `FROZEN · GITHUB ✓`.
- The stale orange completion text from V0.2.85/V0.2.86 is replaced with a frozen/recovery message.
- Evidence sync runtime release identity now reads `window.LinaVersion` instead of its old hardcoded current release constant.

## Verification before packaging
- `LINA_MASTER_RULES.md`, V0.2.86 handoff and affected base code inspected.
- `LINA_RELEASE_CHECKLIST.md` applied; V0.2.87 gate appended.
- Gen6 plan/runnerspec constants unchanged.
- JS syntax checked.
- Active `index.html` cache tokens checked against `version.js` cache `0.2.87`.
- ZIP integrity checked after packaging.
