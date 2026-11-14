# Flyg runtime0.1.15 — deployed

Worker: https://flyg-search-api.mangaj73.workers.dev. Only flyg-search-api / SearchGate modified; CCC,Lina,Remember,DNS and account plans unchanged. Provider secret injected from existing Actions secret without exposing its value. Workers Free user screenshot $0 Current plan verified2026-11-14. Earlier subscription API403 is historical, not a current blocker.

Owner: worker.mjs / SearchGate. SQLite Durable Object schema1 holds opaque selection records,30-minute response cache and persistent usage ledger.180 requests/month,20/hour; failures count before account check. Each uncached stage verifies SerpApi Free,monthly price0,quota>0. No upgrade or retry. Origin restriction is browser policy, NOT user authentication; public clients can exhaust bounded free quota. No booking/payment endpoint. No raw source errors, provider tokens or keys in browser. Separate tickets excluded from combined price output. Baggage remains UNVERIFIED until exact passenger/direction/weight scope is proven; generic Standard rule not sufficient.

Root cause fixed: Workers rejects redirect:error before I/O. Use redirect:manual and reject non-2xx. Official Request docs confirm.13 Node tests include regression. Actual browser outbound->return->details and cached replay PASS on0.1.14. Node tests alone cannot establish Workers runtime compatibility. CLI health path returned403 while browser succeeded; do not equate that with Worker failure.

UI: exact dates and single destination roundtrip, two adults ARN/SEK, user-selected connections. Existing requirements summary retained. No automated week/openjaw comparison or verified ground transfer. Next gate: installed iPhone0.1.14. Rollback disable isolated Worker via FLYG_ENABLED=false; preserve ledger; public previous deployment recorded in canonical state.


##0.1.15
Multi-airport groups of1–3 unique whitelisted codes accepted; source sort_by2, cheapest30 per batch retained and client merged/sorted globally. Outbound selection stores actual selected destination while preserving original multi-airport context for provider token lookup. Browser coverage23/23 with94 offers, cheapestBGY return/details PASS.15 backend tests and all15 deployed assets verified. Unknown-baggage section explicitly labels quoted prices; no verified complete bag-inclusive totals available.8 groups for23 destinations consume up to8 searches before chosen return/details; Free caps unchanged. Groups may take up to70sec; progress/partial coverage visible. Installed iPhone acceptance still pending.
