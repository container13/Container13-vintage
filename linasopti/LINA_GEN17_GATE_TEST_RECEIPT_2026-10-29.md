# Gen17 gate synthetic test receipt — 2026-10-29

Status: GATE_SYNTHETIC_PASS / ENGINE_UNVERIFIED / PLAN_NOT_LOCKED.

Source files fetched from isolated GitHub branch: `gen17-volatility-contraction-gate.js` and `test-gen17-gate.synthetic.js`. Their contents were recreated locally and the test was executed using Node.js v22.16.0. Output: `PASS: 7 synthetic gate assertions`. Assertions cover contracting, expanding, equal ranges, exclusion of signal bar, insufficient lookback, invalid OHLC, and positive per-bar multiplicative scaling.

Scope limitation: this was a local execution of recreated source text, not GitHub Actions and not a byte-for-byte independently hashed download. The integrated `gen17-generation-engine.DRAFT.js` was not exercised in this test. No observed historical data, backtest, Forward, trading, deployment, or frozen Gen16 results were touched.

Next: build integration-specific synthetic tests, independent Gen17 runnerspec hash, and verify engine parity excluding the gate. Historical corporate-action as-of provenance remains an explicitly documented limitation. Request explicit authorization of exact research plan before locking/backtesting.
