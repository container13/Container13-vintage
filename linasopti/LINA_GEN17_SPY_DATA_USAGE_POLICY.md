# Gen17 SPY research data safeguards

Status: DRAFT_ONLY / BLOCKED_DATA. Trading and Forward OFF.

Verified by user screenshots: live SPY SIP/raw access, 2020-2024 history sanity and exact XNYS session calendar PASS.

Dividend adjustment audit PASS (run 40934258148). Independent State Street SPY dividend-factor comparison PASS for 20/20 ex-dates in 2020-2024 (run 40937080764). Alpaca corporate-action event records and point-in-time availability remain unverified.

Point-in-time decision: use raw SPY closes for price-only research until historical as-of availability of adjusted prices is demonstrated. Do not calculate historical Gen17 signals from today's dividend-adjusted backfill. A two-completed-session execution lag prevents same-close execution but does not by itself remove future dividend adjustments. Keep price-only metrics distinct from total-return performance. No backtest or live trading authorized by this policy.

Research rules:
- Raw closes may support a price-only trend signal, not a total-return claim.
- Raw close-to-close volatility includes ex-dividend price gaps; validate their effect.
- Present-day dividend-adjusted historical prices may reflect later information. Never assume historical as-of availability.
- Use completed trading sessions only. Apply conservative two-completed-session lag until timestamps are verified.
- Do not trade at a close used to compute that same signal.
- 2020-2024 has been inspected and is not an untouched holdout.

Remaining gates: Alpaca corporate-action event feed reconciliation, historical as-of availability, provider entitlement and data rights, reproducible raw-data snapshots, previous Gen10/12 research review, explicit approval before Gen17 experiments.

No production deployment authorized.
