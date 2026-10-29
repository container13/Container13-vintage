# Gen17 V2 draft refactor receipt — 2026-10-29

Status: V2_SYNTHETIC_PASS / NOT_LOCKED / NO_BACKTEST.

Created `gen17-generation-engine.V2.DRAFT.js` on isolated branch, commit dab66c10f4489c0cbc6ab136a03060b01fc06171. Replaced duplicated inline 20+20 range logic with a call to the shared `gen17-volatility-contraction-gate.js` module; Node resolves via CommonJS require, browser requires the gate script loaded first. Replaced legacy Gen16 synthetic self-test with Gen17-specific assertions.

Fetched V2 and gate from GitHub, executed `LinaGen17DraftEngine.verifySynthetic()` in isolated JavaScript context. Result PASS 5/5: contraction accepted, 16 candidate signals accepted, expanding AMD denied, candidate removed before sorting, trade/Forward OFF. No observed historical dataset or simulate() used.

Outstanding: V2 still embeds Gen16 SPEC and invalid draft SHA, so `verify()` is not a Gen17 integrity PASS; Gen17-specific spec/hash integration and independent verification remain. V2 has not replaced prior draft or frozen Gen16. No deploy, no trade, no Forward, no backtest, no plan lock.
