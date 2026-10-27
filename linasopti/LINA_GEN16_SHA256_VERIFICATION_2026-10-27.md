# Gen16 raw data integrity - verified

Read-only GitHub fetch_blob of SOURCE_gen9-data.json (blob 5ac082c346db53fabccb9ab5009bb99527f764e1) returned 8446807 bytes. Independently computed SHA-256: cb84e436a0527b44262949994306dcb85eaf5f10ad88fc7906d443833cc6589c. Exact match to frozen Gen16 manifest and Gen9 gate. 16 symbols, 1258 rows each, 20128 total; range 2020-01-02 to 2024-12-31.

Provenance: Yahoo chart, OHLC adjusted by adjustedClose / close; raw values retained. 11322 rows have non-unit adjustmentFactor. SHOP provenance includes a 10:1 split. calendarVerified=false, corporateActionsVerified=false, adjustmentStatus=PROVIDER_ADJUSTED_OHLC_REQUIRES_VERIFICATION. Data integrity PASS; point-in-time validity and corporate-action correctness UNVERIFIED. No research rerun, trade/forward OFF.

Next: read-only inspect raw vs adjusted prices near split/dividend events and Gen16 engine use of adjusted fields; investigate data provenance, then Worker receipts and historical G2/G3 evidence.
