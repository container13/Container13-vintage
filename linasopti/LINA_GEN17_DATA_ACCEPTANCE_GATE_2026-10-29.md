# Gen17 corporate-action data acceptance gate — 2026-10-29

Status: BLOCKED_DATA / DRAFT_ONLY / NO_BACKTEST / NOT_LOCKED.

## What is already verified
Gen17 V3 draft integrity 7/7 PASS, synthetic self-tests 5/5 PASS. These do not validate historical adjusted prices. Existing raw dataset digest and calendar checks are retained without rerunning Gen16.

## Required evidence before historical research
1. Identify exact vendor, instrument identifiers, download timestamp, endpoints and dataset version for every OHLC bar, 2020–2024, for all 16 symbols.
2. Establish whether OHLC prices are raw, split-adjusted or total-return-adjusted, and how volume is adjusted. Obtain dated split events and dividend events with ex-dates, factors, sources, and as-of availability.
3. Produce an independent corporate-action reconciliation: compare each split boundary's pre/post OHLC and split factor, plus dividend treatment, against at least one independent authoritative event source. Record mismatches rather than silently correcting.
4. Specify as-of adjustment policy, adjusted-bar construction, and point-in-time availability. Do not allow post-event knowledge to influence earlier simulated signals except through a declared historically valid convention. Explain impact on breakout, SMA180, position sizing, next-open fills, P/L, and cash dividends.
5. Recalculate source digests and calendar/alignment checks on the accepted dataset; preserve raw files and immutable provenance receipts. Fail closed for unknown or inconsistent symbols/events.
6. After all checks, require explicit approval for exact plan lock and historical backtests. Gen7/8 prior-art remains a separate open review item.

## Acceptance decision
No vendor/event evidence attached to this gate. Decision BLOCKED_DATA. No observed-data simulations, no deployment, no trading, no Forward. Gen16 frozen and untouched.
