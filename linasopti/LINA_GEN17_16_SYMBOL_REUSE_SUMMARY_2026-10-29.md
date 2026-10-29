# Gen17 — sixteen-symbol prior evidence inventory, 2026-10-29

Read-only inventory of existing Gen9 evidence. No new historical price or corporate-action data fetched.

| Symbol | Recorded cash dividends | Recorded splits | Existing independent dividend evidence |
|---|---:|---:|---|
| AMD | 0 | 0 | Later handoff records absence check; original receipt not inspected here |
| SHOP | 0 | 1 | Issuer cash-dividend absence evidence |
| ADBE | 0 | 0 | Full issuer absence evidence not established in inspected ledger |
| MU | 14 | 0 | All received events matched to issuer declarations |
| FDX | 20 | 0 | Issuer dates match; dividend amounts differ by adjustment basis |
| TSLA | 0 | 2 | Issuer cash-dividend absence evidence |
| LUV | 10 | 0 | All received events matched to issuer declarations |
| NFLX | 0 | 0 | Issuer cash-dividend absence evidence |
| C | 20 | 0 | Full issuer dividend table match |
| NOW | 0 | 0 | Later handoff records absence check; original receipt not inspected here |
| QCOM | 20 | 0 | All received events matched to issuer declarations |
| BAC | 20 | 0 | All received events matched to issuer declarations |
| GM | 11 | 0 | Full issuer dividend table match |
| DDOG | 0 | 0 | Issuer cash-dividend absence evidence |
| PYPL | 0 | 0 | Issuer absence evidence; later handoff documents post-2024 factor reconstruction |
| NVDA | 20 | 2 | All received events matched to issuer declarations |

Totals: 16 symbols, 135 recorded dividend events, 5 recorded splits, 1258 calendar-matched sessions per symbol. Internal dividend-factor arithmetic was previously checked, not independently proven as historical point-in-time correct. Split counts are recorded, not a complete independent split audit.

Original evidence: `linasopti/evidence/LINA_GEN9_DATA_AUDIT_V2.json` and `linasopti/evidence/LINA_GEN9_CORPORATE_ACTION_EVIDENCE.json`. Later corrections and PYPL/AMD/NOW research are recorded in `linasopti/LINA_HANDOFF_CURRENT.md`. Source dataset SHA256 `cb84e436a0527b44262949994306dcb85eaf5f10ad88fc7906d443833cc6589c`.

This closes the **inventory/reuse** task for all sixteen, not the historical data acceptance gate. No claim that all events, historical vendor basis, as-of release time or licensing have passed. Gen17 DRAFT_ONLY/BLOCKED_DATA, no backtests, trade OFF, Forward OFF.
