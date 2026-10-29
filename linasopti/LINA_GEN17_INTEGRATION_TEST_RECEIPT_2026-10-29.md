# Gen17 integration test receipt — 2026-10-29

Status: SYNTHETIC_INTEGRATION_PASS / GEN17_DRAFT_ONLY / NOT_LOCKED.

GitHub sources fetched from `lina-corporate-actions-ci-isolated`: `gen17-generation-engine.DRAFT.js`, `gen17-volatility-contraction-gate.js`, `test-gen17-integration.synthetic.js`.

The engine and gate source were evaluated in an isolated JavaScript execution context and the assertions from the test file were reproduced directly. 11/11 PASS: engine export, 16 candidates when contraction holds, standalone/integrated gate parity, AMD expansion denial, 15 candidates after filtering, AMD excluded, hold=12, costSide=0.001, maxPositions=8, tradeEnabled=false, forwardOpened=false. Previous description of '10' was incorrect: actual file has 11 assertions.

Limitation: test assertions were reproduced using fetched source in a JS sandbox, not invoked through Node.js CLI and not executed by GitHub Actions. No `simulate()` call, real market data, backtest, deploy, or trading occurred. Draft engine still embeds Gen16 spec and invalid placeholder SHA; independent Gen17 canonical spec/hash remains pending. Gen16 original untouched. Trade and Forward OFF.
