# Gen17 PIT field inventory – 2026-11-02
Status: READ_ONLY_EVIDENCE / PIT_UNVERIFIED. This document is an inventory, not a new research result or approval.
## Verified from GitHub
- Frozen SOURCE_gen9-data.json blob 5ac082c346db53fabccb9ab5009bb99527f764e1: 8,446,807 bytes; SHA-256 cb84e436a0527b44262949994306dcb85eaf5f10ad88fc7906d443833cc6589c (previously verified, not rerun).
- 16 symbols x 1258 bars = 20128, 2020-01-02 through 2024-12-31.
- Yahoo chart provenance, raw OHLC retained, adjusted OHLC constructed from adjustedClose/close; 11322 nonunit adjustment-factor rows. calendarVerified=false, corporateActionsVerified=false.
- Previous factor audit: 129/129 >1bp factor steps align with embedded dividend dates; this is only internal consistency. Split basis cannot be inferred from factor=1. PYPL historical basis reflects later dividends.
## Field assessment
| Requirement | Assessment | Reason |
|---|---|---|
| symbol/session date/OHLCV | VERIFIED | frozen dataset and verification report |
| source vendor and adjustment method | VERIFIED | documented Yahoo chart provenance |
| immutable source hash | VERIFIED | previously verified SHA-256 |
| explicit per-bar price_basis and vendor-specific basis semantics | PARTIAL | adjustment method known; executable raw basis not independently certified |
| snapshot_id and historical vendor as-of vintage | NOT EVIDENCED | no historical vintage chain documented |
| observed_at_utc per historical bar | NOT EVIDENCED | cannot infer first seen from present file |
| vendor_published_at_utc per historical bar | NOT EVIDENCED | no historical publication chronology |
| split/dividend event dates | PARTIAL | embedded events, not independently PIT-verified |
| announcement_at / first_seen_at per event | NOT EVIDENCED | later retrieved events do not prove earlier availability |
| append-only event revision chain | PARTIAL | SSE engine tests PASS, historical completeness not certified |
| cash-dividend ledger / split accounting reconciliation | NOT VERIFIED | existing adjusted-price backtest not equivalent to cash ledger |
| delisting and survivorship completeness | UNKNOWN | no supporting audit in inspected evidence |
## Conclusion
PIT remains UNVERIFIED. Do not equate absence of evidence with proof that vendor fields do not exist. No retroactive backdating or reclassification of 2021–2024 as unseen holdout.
## Next
Read-only assessment of whether a provider or existing timestamped archive can supply actual historical as-of vintages and independently verifiable first-availability chronology. If not, design prospective snapshot capture for future observations, clearly distinct from historical PIT proof. Do not rerun Gen8–16, make new Alpaca requests, or alter Worker/engine. Trade/Forward OFF. Only branch ccc-demo-public-test.
