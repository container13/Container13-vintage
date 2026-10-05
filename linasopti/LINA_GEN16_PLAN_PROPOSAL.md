# LINA GEN16 — PLAN PROPOSAL

Status: **PROPOSAL_NOT_APPROVED**
Datum: 2026-10-06
Research: EJ STARTAD
Handel: AV
Forward: AV

## Frozen source
Gen10–Gen15 are permanent observed history and may never be rerun or rescued. Gen15 is frozen NO_CANDIDATE under SHA `726b1631365c5df4880dd926b32461f870eacd1bdf2f610f00b5ad844c61b43c`.

The approved direction review identified SIGNAL_ARCHITECTURE as the next genuinely untested structural dimension. This proposal chooses one ex-ante signal principle only; it does not create a runnerspec, engine or research permission.

## Single proposed Gen16 hypothesis — PRICE_CHANNEL_BREAKOUT
The existing CONTROL defines breakout as current close strictly above the highest **close** of the preceding 50 sessions, with close also above the existing SMA180 trend condition.

Proposed candidate changes only the breakout reference:
- Candidate name: `PRICE_CHANNEL_BREAKOUT`.
- On signal close t, candidate requires `close(t) > max(high[t-50 ... t-1])`.
- The current bar's high is never included in its own threshold.
- The existing `close(t) > SMA180(t)` trend condition remains unchanged.
- Entry remains at open(t+1), using only information known by close(t).
- Existing 50-session lookback is retained; no new lookback is introduced.
- No breakout buffer, ATR multiplier, percentile, confirmation delay or alternative channel length is permitted.
- Existing strength ordering, sizing, volDays/volTarget/volMin, capacity, costs, 12-session CONTROL-style exit, fold-end liquidation and mark-to-market remain unchanged.
- CONTROL remains the original close-channel breakout and is diagnostic only.

## Ex-ante rationale
A close above the prior 50-session maximum **high** requires the market to close beyond the full observed trading range, not merely beyond the highest prior closing print. This is a stricter definition of price discovery and directly changes the economic signal rather than filtering the same signal after it fires.

The rule reuses the already locked 50-session horizon and OHLC data. It introduces zero new numeric parameters and avoids selecting a new lookback from the observed 2021–2024 history.

## Why this is orthogonal to Gen10–15
It does not change market breadth/exposure (Gen10), sector diversification (Gen11), regime gating (Gen12), capacity ranking (Gen13), temporal confirmation (Gen14), or exit architecture (Gen15). It changes the base breakout event itself.

## Unchanged gates
minOosTrades 100; minPf 1.2; maxDd 0.12; positiveOos true; maxConcentration 0.4; minPositiveFolds 3; minFoldPf 0.8; maxFoldGrossProfitShare 0.55.

## Research integrity
- No parameter grid.
- No alternate 20/50/100 channel lengths.
- No close-vs-high variants after observation.
- No rescue combination with Gen10–15 mechanisms.
- No gate weakening.
- 2021–2024 remains observed development history, never unseen holdout.
- FAIL means NO_CANDIDATE; PASS means candidate review only.
- Handel/Forward remain OFF.

## Next human gate
Human review must approve or reject **this exact principle** before any canonical Gen16 runnerspec/hash or engine is built.

Approval of this plan would authorize preregistration only, not research. A later executable Release Gate and separate explicit human research-start decision remain mandatory.
