# LINA G2 LIVE FAILURE AUDIT – V0.58.7

## Observed in V0.58.6
- KÖRFEL: AMD 2020-01-01–2020-01-31: 0 dagsrader
- `← Forskning` visible but not functional

## Data finding
V0.58.3 correctly switched G2 from 5Min aggregation to 1Day, but the loader still used `/bars` (Alpaca) as its only source. The generic app already has a separate `/eod-bars` historical daily route.

## Fix
G2 uses EOD historical daily first, with plain-ticker and `.US` forms, then Alpaca daily as fallback. Checkpoint generation bumped to daily-3.

## Navigation finding
Context/back code has several historical clone/rebind layers. Delegation alone did not prove sufficient in the live page.

## Fix
G2 back gets a persistent inline onclick attribute which is copied by cloneNode.

No strategy logic changed.
