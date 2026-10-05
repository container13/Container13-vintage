# Lina Gen14 — PLAN PROPOSAL ONLY

Status: PROPOSAL_NOT_APPROVED · research EJ startad · Handel/Forward AV
Created: 2026-10-05
Source: frozen Gen13 immutable evidence only. No Gen13 rerun.

## Why Gen13 closed NO_CANDIDATE
Locked Gen13 runnerspec: e8cd7a717f3240f3650c326e610457d122a3b144a2c5494036f0618db4afbb42.
RANK_TO_CAPACITY and CONTROL produced byte-identical accepted trades/equity in all four folds.
Capacity conflicts existed in 2021/2023/2024, but ranking only renamed rejected events (POSITION_CAP -> RANK_CAPACITY); it did not change accepted trades.
2022 had no capacity conflict at all: 18 trades, P/L -5229.7466, PF 0.0419341, win rate 11.11%.
Therefore Gen13 falsified capacity-priority as the explanation for the robustness failure.

## Frozen-evidence diagnosis
2021: 100 trades, PF 1.8631, P/L +8410.30.
2022: 18 trades, PF 0.0419, P/L -5229.75.
2023: 87 trades, PF 1.8518, P/L +7143.07.
2024: 115 trades, PF 1.1407, P/L +1839.97.
2022 entries were sparse and broadly unsuccessful across symbols. This is consistent with an entry/regime failure, not a capacity-selection failure.

## Gen14 hypothesis
Test one preregistered REGIME_GUARD candidate against unchanged CONTROL.
The guard must use information available at previous close only and must be independent of future fold outcomes.
Purpose: suppress otherwise-valid breakout entries when the broad market/regime is hostile to this strategy, while leaving sizing, exits, costs, maxPositions, universe and all other locked mechanics unchanged.

## Before runnerspec lock
A separate design step must choose ONE economically defensible regime observable and ONE fixed rule from prior rationale, not from a grid over 2021-2024.
No threshold sweep, Top-N sweep, rescue variant, symbol exclusion, year-specific rule, or post-result tuning is allowed.
The chosen observable/rule must be documented and human-approved before any Gen14 engine or research run.

## Gates
Keep the existing robustness gates unchanged unless separately justified before research.
Gen10-Gen13 remain permanently frozen.
2021-2024 remain observed development data, never unseen holdout.
Trade OFF. Forward CLOSED.

## Next human decision
Approve only the Gen14 design direction (REGIME_GUARD), not research.
After approval: identify the single regime observable/rule, preregister exact runnerspec, synthetic engine verification, executable Release Gate, then require a separate explicit research-start decision.
