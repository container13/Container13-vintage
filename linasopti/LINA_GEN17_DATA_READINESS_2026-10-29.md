# Gen17 data readiness – targeted decision, 2026-10-29

Status: READ-ONLY ANALYSIS, DRAFT_ONLY, NO RESEARCH AUTHORIZATION.

## Evidence, not assumptions
- Gen17 draft already identifies Gen10's graded exposure using 16-symbol prior-close/SMA180 breadth and Gen12's BREADTH_50_GATE (8 of 16). Reusing the same breadth gate or tuning its threshold after seeing 2021–2024 is NOT a new defensible Gen17 experiment.
- Gen16's immutable input manifest covers 16 aligned OHLC histories (1258 bars per symbol), without a verified independent market index, market-regime series or contemporaneous membership history.
- Alpaca Corporate Actions V4 candidate: off-line structural tests passed, but authenticated entitlement, genuine provider payload and availability at historical decision time have not been verified.
- The Alpaca API's present-day returned split/dividend dates do not prove when those events were known historically. Process/ex-dates are not as-of timestamps. Do not retrofit them into past decisions without archival publication-time evidence.
- Gen16 fold period 2021–2024 and its observed results cannot be treated as unseen out-of-sample for Gen17.

## Hard distinction
Corporate-action adjustment correctness is a DATA-INTEGRITY gate for any historical price-based test, but V0.4.46 publication is not itself evidence that Gen17's proposed regime signal is novel or point-in-time valid. Gen17 readiness requires both data integrity AND an independently justifiable single-change hypothesis.

## Next research gate — one targeted inventory, no engine execution
1. Compare already-documented Gen9–16 regime/entry protections against any proposed Gen17 signal. Explicitly rule out Gen10 graded breadth and Gen12 threshold breadth.
2. Locate evidence of an independent market-state input with point-in-time observation times and a frozen universe, or record MISSING without guessing.
3. Specify the minimum dataset contract before plan lock: symbol and membership as-of, price adjustment policy, corporate-action effective date, earliest provable publication/receipt timestamp, source/version/hash, missingness handling; signals can use only observations available before decision cut-off.
4. If independent data/source is unavailable, stop as BLOCKED_DATA. Do not substitute backfilled current metadata.
5. Only after this inventory propose ONE distinct, economically motivated Gen17 change, a single locked comparator and pre-registered forward validation window; obtain explicit approval before PLAN_LOCKED.

No new live Alpaca call, no V4 deployment, no Gen8–16 reruns, no trading/Forward. Production V0.4.45 remains unchanged.


## External data source screen – 2026-10-29
ALFRED official documentation supports historical real-time periods and vintages: https://fred.stlouisfed.org/docs/api/fred/realtime_period.html and https://fred.stlouisfed.org/docs/api/fred/series_observations.html . Candidate only; no specific series, timing or 2020–2024 coverage verified. Alpaca historical bars have adjustment and asof symbol mapping, not historical release-time proof: https://docs.alpaca.markets/us/reference/stockbars . Next verify one named ALFRED series, vintage coverage, observation release cutoff and daily suitability. No data fetched or research run. Gen17 remains DRAFT_ONLY / BLOCKED_DATA.
