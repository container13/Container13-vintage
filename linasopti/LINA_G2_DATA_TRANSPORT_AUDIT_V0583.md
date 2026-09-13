# G2 DATA TRANSPORT AUDIT – V0.58.3

## Live failure
AMD Jan 2020 returned zero rows from the G2 loader.

## Previous path
G2:
1. request 5Min bars
2. aggregate 5Min → 1Day
3. run a daily breakout strategy

## V0.58.3 path
G2:
1. request 1Day bars directly
2. normalize daily rows
3. run the same daily breakout strategy

## Why this is safer
- less data volume
- fewer API calls/rows
- no dependency on deep intraday history for a daily hypothesis
- no aggregation ambiguity
- identical strategy input granularity

No strategy logic changed.
