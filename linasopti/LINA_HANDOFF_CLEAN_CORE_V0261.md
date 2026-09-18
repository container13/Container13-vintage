# Lina Clean Core V0.2.61 — handoff

V0.2.61 follows locked Gen4 plan `8d51311d`. It adds the Gen4 runnerspec and engine verification gate without opening research execution.

## Fixed workflow
1. Gen4 plan is already locked and must not be changed.
2. Lock Gen4 runnerspec.
3. Verify Gen4 engine.
4. Export `LINA_GEN4_DIAGNOSTIK_*.json` and send it to ChatGPT before research execution is opened.

## Safety / research invariants
- Handel AV.
- Gen4 research hard-stop: 2024-12-31.
- 2025-01-01 through 2026-09-10 is already observed and is not a new holdout.
- True Gen4 Forward may begin only after a future candidate freeze; never backdate it.
- No threshold rescue, no rerun after observed result, preserve negative results, save all variants before continuation.
- Gen2 and Gen3 frozen evidence/state are not modified by this release.

## Export rule — permanent
Whenever exact Lina state/diagnostics are needed, Lina should expose a button that saves the requested information to a TXT/JSON file in Downloads. Prefer this over screenshots, console copying, or long manual text. The global `📥 Exportera Lina-status` remains permanent and each research step may add a focused export button.
