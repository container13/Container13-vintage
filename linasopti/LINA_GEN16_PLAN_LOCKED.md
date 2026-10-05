# LINA GEN16 — LOCKED PLAN

Status: **PLAN_LOCKED_PRE_RESEARCH**
Datum: 2026-10-06
Human approval: exact PRICE_CHANNEL_BREAKOUT principle approved for preregistration
Research: EJ STARTAD
Handel: AV
Forward: AV

## Frozen source
Gen10–Gen15 remain immutable observed history. Gen15 remains permanent NO_CANDIDATE under spec SHA `726b1631365c5df4880dd926b32461f870eacd1bdf2f610f00b5ad844c61b43c`.

## Gen16 candidate
`PRICE_CHANNEL_BREAKOUT` changes only the base breakout reference.

CONTROL signal on close t:
`close(t) > SMA180(t) && close(t) > max(close[t-50 ... t-1])`

Candidate signal on close t:
`close(t) > SMA180(t) && close(t) > max(high[t-50 ... t-1])`

The current bar is excluded from the 50-session channel. Entry is next open. The existing 50-session horizon and SMA180 are retained. Zero new numeric parameters.

## Unchanged machinery
Universe, 2021–2024 folds, next-open execution, strength ordering, volatility sizing, capacity, costs, 12-session exit, fold-boundary liquidation, mark-to-market equity and robustness gates remain unchanged from the original CONTROL machinery. Gen15 trend-invalidation exit is NOT inherited.

## Locked prohibitions
No alternate channel length; no 20/50/100 grid; no breakout buffer; no ATR multiplier; no percentile; no confirmation delay; no combination with failed Gen10–15 mechanisms; no gate weakening; no rescue after observation.

## Gates
minOosTrades 100; minPf 1.2; maxDd 0.12; positiveOos true; maxConcentration 0.4; minPositiveFolds 3; minFoldPf 0.8; maxFoldGrossProfitShare 0.55.

## Decision boundary
This plan lock authorizes deterministic runnerspec construction and engine verification only. It does NOT authorize reading Gen16 results or starting Gen16 research. A separate explicit human research-start decision and executable release gate are mandatory.

Handel/Forward remain OFF.
