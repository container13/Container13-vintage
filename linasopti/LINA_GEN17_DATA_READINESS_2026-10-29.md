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


## 2026-10-29 – named FRED series screening (documentation only)
- VIXCLS: CBOE VIX daily close, a directly relevant independent equity-volatility series; FRED page https://fred.stlouisfed.org/series/VIXCLS/ . FRED example shows a previous day's close updated next morning; observation date is not verified availability timestamp for Gen17 next-open execution. Copyright/licensing must be reviewed.
- T10Y2Y: US Treasury 10y minus 2y daily interest-rate spread, an independent macro regime candidate; https://fred.stlouisfed.org/series/T10Y2Y/ . Published FRED daily update is not evidence of exact historical as-of timestamps.
- ALFRED API provides vintage dates and realtime observation queries: https://fred.stlouisfed.org/docs/api/fred/series_vintagedates.html and https://fred.stlouisfed.org/docs/api/fred/series_observations.html . API documentation is not actual verified vintage coverage for either named series.
- Gate still missing: retrieve 2020-2024 vintages for chosen series; prove signal-day publication timing or apply predeclared safe lag; inspect missing days, licensing, data provenance and immutable hash; then independently pre-register hypothesis and validation. No historical series payload acquired, no backtest. Gen17 remains DRAFT_ONLY/BLOCKED_DATA.


## 2026-10-29 – VIXCLS official-source gate check
- Cboe official historical VIX daily close download is described as 1990-present, covering the requested 2020–2024 calendar period in principle, but the historical payload was NOT downloaded or hashed in this check. https://www.cboe.com/tradable_products/vix/vix_historical_data
- FRED VIXCLS is daily closing index data sourced from Cboe; its displayed updated timestamp can be next morning, and it carries copyright/licensing notes. Do not equate observation date, ALFRED vintage date, FRED update date and intraday receipt timestamp. https://fred.stlouisfed.org/series/VIXCLS/
- FRED observations and vintage-dates API require a registered API key. Their historical realtime_start/realtime_end and vintages describe date-level knowledge, NOT guaranteed exact market-session publication time. https://fred.stlouisfed.org/docs/api/fred/series_observations.html and https://fred.stlouisfed.org/docs/api/fred/series_vintagedates.html
- Strict data gate: obtain legally usable historical series payload; check actual 2020–2024 coverage, holidays/missingness, provenance and SHA256; verify as-of release clock or predeclare a conservatively delayed signal policy before research; preserve independent validation and do not infer it from observed 2021–2024. No data payload fetched, no research, no production/Cloudflare/Forward/trading changes. Gen17 stays DRAFT_ONLY/BLOCKED_DATA.


## 2026-10-29 – actual Cboe CSV acquisition attempt: BLOCKED
- Official page confirms VIX daily historical CSV: https://www.cboe.com/tradable_products/vix/vix_historical_data ; requested original https://cdn.cboe.com/api/global/us_indices/daily_prices/VIX_History.csv .
- Direct container download and Python requests both failed (network/name resolution). Web fetch reported redirect to https://cdn-api.cboe.com/api/global/us_indices/daily_prices/VIX_History.csv and inability to access that destination. Direct web fetch of redirected URL also failed. NO original CSV bytes acquired, NO row audit and NO SHA-256 calculated. Do not claim dataset verified.
- Third-party copies located, but intentionally NOT substituted as authoritative source. Next safe action: fetch exact original Cboe CSV in a network-enabled environment or obtain verifiable Cboe-origin artifact, preserve byte hash and capture retrieval metadata, then validate 2020–2024 date coverage/duplicates/missing sessions and conservative availability lag before any research.
- Gen17 stays DRAFT_ONLY/BLOCKED_DATA. No strategy backtest, production deployment, trading or Forward.


## 2026-10-29 – user-supplied VIX_History.csv byte audit
- User supplied CSV file, not independently downloaded by assistant. File size 474247 bytes; SHA256 b0d2e90197b4b5403fd689fc580eb2506f07c867f0115034810c7218fc986b7f. Filename VIX_History.csv. CSV header DATE,OPEN,HIGH,LOW,CLOSE.
- 9304 rows, chronological 1990-01-02 through 2026-10-28. Zero malformed dates, duplicate dates, empty cells, weekends, invalid/nonpositive numeric OHLC.
- 2020:253 rows, 2021:252, 2022:256, 2023:257, 2024:259; total 1277. Zero OHLC high/low consistency violations in 2020-2024. Whole file contains 47 OHLC high/low violations, all outside target 2020-2024 period; investigate if older dates ever used.
- Important: byte hash authenticates this supplied snapshot only, not independent Cboe provenance or historical as-of availability. Exchange calendar completeness, publication/receipt timestamp, redistribution/license and point-in-time vintages remain unverified. NO research or backtest authorized. Gen17 DRAFT_ONLY/BLOCKED_DATA pending these gates.
