# LINA GEN15 — DIRECTION REVIEW

Status: POSTMORTEM_ONLY_NO_PLAN_APPROVAL
Datum: 2026-10-05
Research: EJ STARTAD
Handel: AV
Forward: AV

## Frozen source
Gen14 runnerspec SHA-256: 5792360ae36b56390f480a9b846ed2a15b504145a06b8a03a36e676247e03fc5.
Gen14 immutable evidence: 8 fold files + dataset evidence + frozen summary.
Decision: NO_CANDIDATE. Gen14 must never rerun.

## Gen14 result
CONTROL: 320 trades; P/L +12163.5946; PF 1.33176; DD -5.7402%; concentration 66.288%; min-fold PF 0.041934.
PERSISTENCE_CONFIRMATION: 241 trades; P/L +7296.1751; PF 1.26476; DD -4.6766%; concentration 51.868%; min-fold PF 0.061829.
Persistence reduced trade count and DD and reduced concentration, but failed the unchanged concentration <=40% and worst-fold PF >=0.8 gates.

## 2022 failure remains structural
CONTROL 2022: 18 trades; P/L -5229.7466; PF 0.041934.
PERSISTENCE 2022: 11 trades; P/L -3202.5947; PF 0.061829.
Persistence removed seven trades but retained a broadly losing set. The failure is not explained by one symbol: multiple symbols lost materially.

## Hypothesis families already tested and closed
- Gen10: graded breadth/exposure.
- Gen11: sector cap/diversification.
- Gen12: binary breadth regime gate.
- Gen13: cross-sectional capacity ranking.
- Gen14: temporal persistence confirmation.

These mechanisms must not be recycled with new thresholds or lengths as Gen15 rescue variants.

## Methodological conclusion
The evidence does not justify another filter layered on the same fixed breakout + fixed 12-session exit architecture.
A legitimate Gen15 must be orthogonal and economically motivated before any result is observed. The remaining major structural dimension is the exit/risk-realization architecture, not another entry-selection filter.

## Candidate direction for discussion only — EXIT_ARCHITECTURE
Potential hypothesis family: replace the unconditional fixed 12-session time exit with one single preregistered economically defensible exit principle while leaving entry, universe, sizing, costs and capacity unchanged.
NO exit rule, threshold, parameter, runnerspec or engine is approved by this document.
Do not test multiple exits against 2021-2024 to choose a winner.
A separate design step must establish one rule from prior rationale before preregistration.

## Next human gate
Decide whether to investigate EXIT_ARCHITECTURE as a Gen15 design direction.
This is not approval for a rule, runnerspec, engine or research.
