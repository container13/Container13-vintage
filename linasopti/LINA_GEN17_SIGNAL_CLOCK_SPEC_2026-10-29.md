# Gen17 signal clock – exact draft
Date 2026-10-29. DRAFT_ONLY; no simulation, lock, trading or Forward.

Gen16 source inspected: simulate day index i calls signalAt(by,i-1,variant), then enters at open i. Thus signal index s=i-1, and entry index e=s+1.

Gen17 contraction gate uses only bars strictly before the breakout signal bar s:
recent = mean((H[k]-L[k])/C[k] for k=s-20,...,s-1), 20 bars;
previous = mean((H[k]-L[k])/C[k] for k=s-40,...,s-21), 20 bars.
Allow Gen16 PRICE_CHANNEL_BREAKOUT candidate only if recent < previous; equality or invalid/missing bar => skip. No candidate signal may be added. The gate applies before candidate ranking/capacity, not after entry, so the remaining Gen16 candidates retain their original relative ranking and capacity priority. No extra day of execution lag: entry remains at open s+1. Minimum 40 prior sessions for the gate; existing Gen16 warmup of 180 days dominates.

R=(H-L)/C is invariant to a common positive multiplicative factor applied to all three OHLC values of a single bar; this does not establish overall Gen16 point-in-time correctness. Reuse prior Gen16 integrity evidence, do not rerun frozen Gen16 or reopen completed audit.

Remaining: deterministic runner implementation/specification, provenance decision for baseline comparability, exact predeclared acceptance and future validation. Seek explicit plan approval before any Gen17 backtest. Gen17 DRAFT_ONLY; trade/Forward OFF.
