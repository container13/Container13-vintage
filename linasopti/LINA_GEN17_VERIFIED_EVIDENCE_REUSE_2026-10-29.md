# Gen17 — evidence reuse and fail-closed data decision (2026-10-29)

Status: EVIDENCE_RECONCILED / DRAFT_ONLY / BLOCKED_DATA / NO_BACKTEST.

This record supersedes the implication in LINA_GEN17_DATA_ACCEPTANCE_GATE_2026-10-29.md that SPY dividend work needs to start from scratch. It does not supersede any original test receipts.

## Existing verified evidence (reuse, do not repeat)
- SPY 2020–2024 raw daily SIP date coverage: exact XNYS calendar match, isolated GitHub Actions success (documented in LINA_HANDOFF_CURRENT.md).
- SPY provider adjustment consistency: Actions run 40934258148 SUCCESS, 1258 sessions; raw vs split mismatches 0; dividend vs all mismatches 0. This is internal provider consistency only.
- Official State Street SPY dividend workbook: SHA256 6b65cbf956b5d25705d08470006a0e97e6a7d2a0d5cfd08b63f6f79783b06320; 20 cash distributions 2020–2024, Actions run 40936450213 SUCCESS.
- Independent issuer amounts vs Alpaca dividend adjustment factors: 20/20 within absolute tolerance 0.0005; max error ~0.00002731; Actions run 40937080764 SUCCESS. This proves factor consistency at those ex-dates, NOT the Alpaca event-feed history or as-of timestamp.
- VIX user-supplied CSV SHA256 b0d2e90197b4b5403fd689fc580eb2506f07c867f0115034810c7218fc986b7f. FRED overlap exact closes 1288/1288, 0 mismatches, including 19 non-XNYS observation dates. VIX observation calendar is not XNYS execution calendar. Earlier claim of invalid holiday rows was retracted.
- Gen17 V3 draft verify 7/7 and synthetic 5/5 PASS; receipt LINA_GEN17_V3_INTEGRITY_RECEIPT_2026-10-29.md.

## Immediate policy decision (does not require re-downloading data)
1. Do not use retrospectively dividend-adjusted or split-adjusted backfill as a historically point-in-time feature unless reconstructed as-of evidence exists. Today's adjusted price series is not a historical vintage.
2. SPY raw closes are permissible for **read-only source validation**, not automatically for Gen17 backtesting. Raw prices are price-only and ex-dividend gaps must be modeled explicitly if returns are assessed.
3. A two-completed-XNYS-session lag is a conservative proposed feature timing rule, **not** proof of actual publication/receipt or authorization for research.
4. Corporate-action ex-date and payout amount do not establish announcement/availability timestamps. Alpaca event-feed and timestamp evidence remain unverified.
5. SPY evidence cannot certify all 16 Gen16/Gen17 trading symbols. No blanket corporate-action approval from SPY tests.
6. Preserve VIX Cboe observation dates separately; stock execution dates must follow XNYS. Do not auto-delete VIX holiday rows.

## Nonduplicate acceptance target
For each of 16 symbols, link immutable raw OHLC snapshot/hash, source/version and as-of symbol identity to a corporate-action ledger, with split and dividend treatment explicitly accounted for. Reconcile event coverage against primary/independent records. Record publication/receipt evidence where available; otherwise choose and justify an auditable fail-closed exclusion policy, not a guessed timestamp. Confirm source rights and provider entitlement. These are evidence tasks, not permission to run backtests.

Gen7/8/10/12 prior-art review remains distinct. Gen16 frozen. No simulations, historical backtests, plan lock, deployment, trading, or Forward.
