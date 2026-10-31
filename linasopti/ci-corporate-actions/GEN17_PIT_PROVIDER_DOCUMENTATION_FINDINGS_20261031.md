# Gen17 corporate actions PIT evidence — provider documentation review (2026-10-31)

## Verified source statements
1. Alpaca market-data Corporate Actions endpoint explicitly states: **no guarantees on the creation time of corporate actions**; data-provider receipt and Alpaca processing may be delayed, so events may not be available immediately after announcement. Source: https://docs.alpaca.markets/us/reference/corporateactions-1
2. Alpaca's older Announcements API is **deprecated** in favor of the new endpoint. It offers declaration_date, but declaration_date is not proof of API ingestion or first visibility. Source: https://docs.alpaca.markets/us/reference/getcorporateannouncements
3. Alpaca documents a corporate-actions SSE mutation stream (insert/update/delete), with historical replay when using since/since_id/Last-Event-Id. Source: https://docs.alpaca.markets/us/reference/subscribetocorporateactionseventssse . The docs alone do not establish historical retention length, accessible replay horizon, timestamp fidelity, account entitlement or coverage back to Gen17's required dates.
4. Historical product blog (2022) says legacy announcements were typically ingested by the next trading day, but that is descriptive, not a timestamp guarantee or proof of availability for individual events. Source: https://alpaca.markets/blog/introducing-corporate-actions-api-announcements/

## Decision
The live AAPL 2020 response is a **STRUCTURAL PASS only**. Current endpoint is **NOT VALIDATED FOR POINT-IN-TIME BACKTESTING**. Do not substitute ex_date, record_date, payable_date, process_date or declaration_date for first-seen/ingested_at. Do not retroactively infer first availability from today's API snapshot. Keep Gen17 DRAFT_ONLY / PIT BLOCKED, Gen8–16 frozen, trading and Forward OFF.

## Next bounded investigation
Read SSE documentation in detail for event timestamp semantics and historical replay window. If historical replay with a trustworthy event timestamp and coverage can be verified, run a separately reviewed read-only sample with safe limits and no secret exposure; otherwise seek provider confirmation or independently archived timestamped source. Document whether historical PIT is feasible rather than repeatedly querying the same current snapshot.
