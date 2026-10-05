# Lina Gen15 Postmortem — frozen

Status: **GEN15_COMPLETE_NO_CANDIDATE**  
Spec SHA-256: `726b1631365c5df4880dd926b32461f870eacd1bdf2f610f00b5ad844c61b43c`  
Candidate: `TREND_INVALIDATION_EXIT`  
Dataset SHA-256: `cb84e436a0527b44262949994306dcb85eaf5f10ad88fc7906d443833cc6589c`  
Rows: 20,128  
History hard stop: 2024-12-31  
Trade/Forward: OFF

## Permanent evidence verification
Verified in GitHub under `linasopti/evidence/2026-10-05/`: dataset evidence, 8/8 immutable fold files (CONTROL + TREND_INVALIDATION_EXIT, 2021–2024), and frozen Gen15 summary, all under the exact locked Gen15 spec SHA.

## Frozen aggregate result
| Metric | CONTROL | TREND_INVALIDATION_EXIT |
|---|---:|---:|
| Trades | 320 | 76 |
| P/L | +12,163.59 | +30,588.17 |
| PF | 1.3318 | 3.5088 |
| Max DD | -5.7402% | -7.4901% |
| Concentration | 66.2880% | 100.0000% |
| Positive folds | 3 | 3 |
| Worst-fold PF | 0.041934 | 0.052129 |
| Max fold gross-profit share | 37.1822% | 36.7177% |

Candidate failed unchanged preregistered gates: minimum 100 OOS trades, maximum 40% concentration, and minimum fold PF 0.8. Decision is permanently **NO_CANDIDATE**.

## 2022 diagnosis
CONTROL: 18 trades, P/L -5,229.75, PF 0.041934, DD -5.2297%.  
TREND_INVALIDATION_EXIT: 18 trades, P/L -4,814.15, PF 0.052129, DD -5.0318%.

The candidate improved the 2022 loss and drawdown slightly but did not repair the hostile fold. Of its 18 2022 exits, 17 were TREND_INVALIDATION and one was FOLD_BOUNDARY. Only NFLX contributed positive gross profit; all other symbol groups were net negative. Thus the fold remained structurally weak and its gross-profit concentration was 100%.

## Interpretation
The exit hypothesis materially changed payoff shape: total P/L and PF rose strongly, but positions remained open much longer, reducing completed trades from 320 to 76 and causing many later signals to be skipped while symbols/portfolio capacity were occupied. This concentrated realized profits rather than producing the required broad robustness.

This is useful negative evidence: replacing the fixed 12-session exit with SMA180 trend invalidation can improve aggregate payoff, but under the locked entry/sizing/capacity architecture it does not meet robustness requirements.

## Permanent research rule
Gen15 must never be rerun, rescued, threshold-tuned, or reinterpreted after observation. Do not create a Gen16 by changing the SMA length, adding a maximum holding period, weakening gates, or combining Gen15 with previously failed Gen10–14 filters merely to rescue this result.

Any Gen16 proposal must be a separately preregistered, genuinely orthogonal hypothesis justified from frozen evidence before any new observation. No Gen16 research is authorized by this document.
