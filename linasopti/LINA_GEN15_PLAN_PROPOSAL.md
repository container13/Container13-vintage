# LINA GEN15 — PLAN PROPOSAL

Status: PROPOSAL_NOT_APPROVED
Datum: 2026-10-05
Research: EJ STARTAD
Handel: AV
Forward: AV

## Frozen source
Gen10–Gen14 are permanently frozen and must never rerun.
Gen14 closed NO_CANDIDATE under runnerspec SHA-256 5792360ae36b56390f480a9b846ed2a15b504145a06b8a03a36e676247e03fc5.

## Why Gen15 changes hypothesis family
Gen10–Gen14 tested exposure/breadth, sector diversification, binary regime gating, cross-sectional capacity ranking and temporal entry persistence. None solved the locked worst-fold and concentration requirements. Gen14 persistence reduced DD and concentration but 2022 remained severely negative.
No further entry filter, breadth threshold, sector rule, ranking rule or persistence length may be introduced as a rescue.

## Single proposed hypothesis — TREND_INVALIDATION_EXIT
The existing long thesis requires previous close > SMA180. Gen15 proposes testing the symmetric exit principle: remain in the position while that trend thesis remains valid; when a close is <= SMA180, exit at the next available open.

This reuses the already locked 180-session trend definition. It introduces no new numeric exit parameter and is not selected from a grid.

### Candidate semantics proposed for preregistration
- CONTROL: unchanged frozen base engine with original 12-session close exit; diagnostic only.
- Candidate: TREND_INVALIDATION_EXIT.
- Entry: unchanged original one-signal next-open breakout entry. Gen14 persistence is NOT carried forward.
- For each open candidate position, evaluate only information known at each session close.
- If close(t) <= SMA180(t), mark trend invalidated and exit at open(t+1), including ordinary exit cost.
- If close(t) > SMA180(t), remain open; there is no 12-session time exit in the candidate.
- No stop-loss, take-profit, trailing stop, ATR rule, maximum-hold parameter or alternate SMA length.
- Fold-end: any still-open candidate position is liquidated at the final available fold close with ordinary exit cost. No post-fold price may be read.
- New entries, sizing, volTarget, volMin, maxPositions, maxPositionPct, baseRisk, costs, universe, breakout lookback, SMA180, simultaneous ordering and mark-to-market equity remain unchanged.
- Pending next-open exit caused by a fold's final close cannot read outside the fold; fold-end liquidation takes precedence at that final close.

## Existing gates remain unchanged
minOosTrades 100; minPf 1.2; maxDd 0.12; positiveOos true; maxConcentration 0.4; minPositiveFolds 3; minFoldPf 0.8; maxFoldGrossProfitShare 0.55.

## Research integrity
- 2021–2024 are observed development data, never unseen holdout.
- No comparison of multiple exit rules before choosing this rule.
- No threshold grid, alternate SMA length, stop parameter, rescue or post-result adjustment.
- FAIL => NO_CANDIDATE.
- PASS => CANDIDATE_REVIEW_REQUIRED only.
- Handel/Forward remain OFF.
- This document is plan proposal only. It creates no runnerspec, engine or research permission.

## Next human gate
Approve or reject TREND_INVALIDATION_EXIT as the Gen15 design direction.
Approval means preregistration work only. Research requires a later separate explicit human start decision.
