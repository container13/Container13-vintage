# Gen17 non-duplicate evidence decision — 2026-10-29

Status: REVIEW_COMPLETE_FOR_THESE_PRIOR_FINDINGS; DRAFT_ONLY; NO_BACKTEST.

## Reused verified historical findings
- Gen10 and Gen12 already investigated 16-symbol SMA180 market breadth. Do not offer this as a novel Gen17 generation. Evidence: LINA_HANDOFF_CURRENT.md section "2026-10-29 – SPY alternative inventory".
- PYPL: prior Gen9 reconstruction attributed historical factor approximately 0.988971 to four later (2025–26) USD 0.14 dividends; reconstructed factor 0.9889710882 vs median 0.9889711061. This closes *factor reconstruction*, not historical as-of adjusted-bar validation. Evidence: LINA_HANDOFF_CURRENT.md 2026-10-27 "Gen9 historical corporate-action evidence reused".
- FDX: historical provider dividend amount 1.112006 versus issuer nominal 1.38 on 2024-12-09; provider/issuer ratio ~0.8058 across 20 events. Existing analysis links possible 2026 FedEx Freight spinoff and approximate factor ~0.805258, but exact Yahoo adjustment basis is not independently demonstrated. Do not label FDX solved. Evidence: LINA_GEN17_FDX_BASIS_REUSE_CHECK_2026-10-29.json and handoff.
- 16-symbol calendar and corporate action inventory already completed; 1258 aligned sessions each, 135 dividends, 5 splits. Do not rerun that inventory.
- SPY issuer dividend reconciliation 20/20 PASS in Actions run 40937080764. This does not validate FDX or 16-symbol point-in-time OHLC.

## Explicit technical decision for next step
Avoid the need to prove *historical as-of availability of present-day retro-adjusted prices* by using only unadjusted price bars for candidate signal features, with ex-date handling and split-safe normalization specified and tested. This is a **proposed data contract**, not an approval: the existing Gen9 Yahoo candidate file cannot simply be relabeled RAW, because the source basis is known to differ from nominal quotes. Raw daily OHLC must be retrieved and immutably hashed per symbol from an identified source. Splits require an explicit event-time state transformation; raw split jumps cannot be treated as market returns. Cash dividends require an economic ledger for positions held across ex-date and separation of price-only signals from total-return P/L. No synthetic signal may use a bar before its completion, and no same-close execution.

## Acceptance order, without repeat work
1. Confirm a truly raw historical OHLC dataset for the 16 instruments (not the old Yahoo candidate and not Alpaca adjustment=all), immutable hashes, exact 2020–24 calendar and source rights. Existing Alpaca Worker /bars route and test infrastructure may be reused; do not assume 16-symbol access from SPY access.
2. Verify split events against independent issuer/exchange records and test split-safe signal/position accounting.
3. Reconcile in-period dividend events and ex-date cash accounting. FDX is a targeted exception requiring independent vendor factor provenance if old Yahoo history is reused; alternatively do not use that history for economic P/L.
4. Reconcile only remaining missing independent issuer evidence, especially ADBE and historical event completeness. Do not redo already matched issuer tables.
5. Check Gen7/8 and Gen10/12 prior art, with no novel-generation claim until comparison complete.
6. Obtain explicit approval for research and historical simulations. 2020–24 is observed development history, not an untouched holdout.

## Safety
No Gen16 changes, no backtests, no deployment, no trading, no Forward. Gen17 stays DRAFT_ONLY/BLOCKED_DATA.
