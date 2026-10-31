# Gen17 V0.4.46 — live Alpaca corporate actions readback (2026-10-31)

## Source and verification scope
User executed an authenticated, read-only PowerShell POST against the production Cloudflare Worker `linas-opti-api.mangaj73.workers.dev/corporate-actions-diagnostic` after deployment of release commit `fd0538ca8f50e7ce75995ea8a9dcdf03663c0756`. The user pasted the complete sanitized JSON response into chat. No credentials or raw event values were provided or stored here. This is a **user-observed live readback**, not an independent server-side replay.

## Observed response
- `ok: true`; `pages: 1`; `complete: true`.
- `forward_splits.count: 1`, fields: cusip, due_bill_redemption_date, ex_date, id, new_rate, old_rate, payable_date, process_date, record_date, symbol.
- `cash_dividends.count: 4`, fields: cusip, ex_date, foreign, id, payable_date, process_date, rate, record_date, special, symbol.
- `classification.ok: true`; `classification.complete: true`.
- `classification.counts.validated.forward_splits: 1`; `validated.cash_dividends: 4`.
- `classification.counts.incomplete.forward_splits: 0`; `incomplete.cash_dividends: 0`.
- Both semantic markers: `STRUCTURAL_ONLY_NOT_POINT_IN_TIME`.
- Explicit warning: `Historical result does not establish point-in-time availability.`

## Conclusion / decision
**LIVE_READONLY_STRUCTURAL_PASS** for a narrowly scoped AAPL 2020 sample: 5 of 5 returned events structurally validated; one page, complete. This demonstrates production routing, secret-backed provider connectivity and response schema validation for this sample. It does **not** establish point-in-time/as-of data availability, publication timing, full-universe coverage, data licensing, or permission to use these events for a historical trading simulation. No live trading or Forward enabled. Gen17 remains DRAFT_ONLY/BLOCKED_DATA; Gen8–16 frozen. Do not rerun completed checks without a specific reason.

## Next evidence gate
Investigate authoritative Alpaca documentation or provider evidence for historical event **availability timestamps/as-of semantics**; if absent, explicitly mark PIT unavailable and design a conservative research-only methodology. Do not infer as-of from `ex_date`, `record_date`, `process_date`, or `payable_date`. Keep read-only checks bounded and credential-safe.
