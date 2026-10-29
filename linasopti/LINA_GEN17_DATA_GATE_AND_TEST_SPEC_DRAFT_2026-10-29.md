# Gen17 data gate and test specification — draft

Date: 2026-10-29. Status: DRAFT_ONLY. No backtest, trading, Forward, deploy or plan lock.

Prior-art: User approved continuing despite unresolved Gen7/Gen8 overlap. Record PRIOR_ART_UNVERIFIED, never claim unique.

Candidate: At signal close t, calculate R=(high-low)/close from consistent, completed OHLC bars. Recent=mean(R[t-20..t-1]); previous=mean(R[t-40..t-21]). Allow otherwise unchanged Gen16 breakout entry only when recent < previous. Missing/invalid bars => skip entry. No grid or retuning.

Baseline: preserve Gen16 locked spec SHA256 a065ce8ad2285010493f8491c86116f01025ed3554be18744471de394dbdeafa, 16 symbols, next-open execution, sizing, 12-session exits, costs, folds, capacity and gates. Never rewrite frozen experiments.

Data checks before running: verify original raw OHLC files and hashes for all 16 symbols; calendar completeness, duplicate sessions, positive OHLC and high/low consistency; splits and dividends; consistent adjustment convention and point-in-time availability. A historically back-adjusted price is not automatically an as-of price. If provenance fails, mark BLOCKED_DATA.

Research checks after data PASS and explicit plan approval: deterministic hashed runner specification, input manifest, baseline parity, trade ledger, daily equity, costs, risk, PF, drawdown, concentration and fold breakdown. Apply locked Gen16 thresholds without rescue optimization. Years 2021–2024 are already observed, not unseen holdout. Record multiple-testing risk across generations and require future validation.

Next: verify underlying data and corporate-action provenance; update LINA_CURRENT_STATE.json and LINA_HANDOFF_CURRENT.md with verified findings; request exact plan approval before Gen17 backtest. Trade OFF, Forward OFF.
