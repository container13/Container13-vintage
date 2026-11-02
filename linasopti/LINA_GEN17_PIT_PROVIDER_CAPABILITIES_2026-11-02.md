# Gen17 – provider PIT capability assessment 2026-11-02
Status: READ_ONLY_DOC_REVIEW / PIT_UNVERIFIED. No live vendor calls, research, Worker or engine changes.
## Findings
Alpaca historical stock bars: adjustment supports raw, split, dividend, spin-off, all; the documented asof parameter maps historical ticker identity, NOT the vintage or publication time of historical bar values. Docs: https://docs.alpaca.markets/us/reference/stockbars
Massive historical aggregates: split-adjusted by default, adjusted=false requests unadjusted, no dividend-adjusted prices according to vendor FAQ. Neither setting by itself certifies historical availability. Docs: https://massive.com/knowledge-base/article/is-massives-stock-data-adjusted-for-splits-or-dividends
Sharadar SEP: unadjusted, split-adjusted and broader adjusted price fields; active/delisted ticker coverage and corporate actions. Documented lastupdated date is not, by itself, a verified complete historic as-of snapshot revision chain. Docs: https://sharadar.com/docs/stocks ; https://sharadar.com/docs/actions
## Decision
None of these reviewed docs proves exact historic first-availability timestamps and reconstructible 2020–2024 vendor vintages for the full Gen17 input. NOT EVIDENCED is not proof unavailable; do not buy/switch sources on that assumption.
## Next safe step
Check whether any existing timestamped original archive or vendor product contract actually offers immutable historical snapshots, first-seen timestamps and revision history. If absent, propose prospective collection of raw bars plus event revisions with append-only UTC ingestion timestamp and content hashes. Such collection validates future periods only; never reclassify 2021–2024 as unseen holdout.
## Guards
Gen8–16 frozen; Gen17 DRAFT_ONLY/PIT_UNVERIFIED; Trade/Forward OFF. Only ccc-demo-public-test. No Alpaca live requests or new research.
