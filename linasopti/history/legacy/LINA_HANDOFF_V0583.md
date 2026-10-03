# LINA HANDOFF – V0.58.3

## G2 run error fixed
Observed live error:
`AMD 2020-01-01–2020-01-31: 0 rader`

## Root cause
G2 is a daily swing strategy, but v0560FetchSymbol requested 5Min history and v0560FetchChunked aggregated that to daily.

This unnecessarily tied 2020–2022 research to old intraday availability.

## Fix
G2 now fetches:
`/bars?...&timeframe=1Day...`

No aggregation is needed.

Checkpoint mode changed:
`g2-symbol-month-1` → `g2-symbol-month-daily-2`

This intentionally resets any old partial 5-minute G2 checkpoint to avoid mixing data types.

## Unchanged
- Lina Selection 16 + SPY
- DEV 2020-01-01 → 2022-12-31
- pseudo-forward 2023-01-01 → 2026-09-10
- 648 variants
- A–M DEV only
- M candidate freeze
- N opens pseudo-forward
- no rescue
- strategy/risk/cost rules unchanged
- Handel AV
- maturity 48/100

## Permanent rule
Daily research should fetch daily bars directly unless the hypothesis explicitly requires intraday data.
