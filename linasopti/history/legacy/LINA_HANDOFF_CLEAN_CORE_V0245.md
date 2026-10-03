# Lina Clean Core V0.2.45 – Handoff

## Fast läge
- REGEL 1: frångå aldrig fastställda regler.
- Handel AV. Robotmognad 48/100.
- Original G2/G3 Real Forward fortsätter oförändrade.
- Gen2-planhash: `1d5f8bc1`.

## V0.2.45
Planlåset är nu verkligt verifierbart: planens beräknade hash måste exakt vara `1d5f8bc1` innan Gen2 Research Engine kan initieras.

Research Engine tillåter endast DEV 2020-01-01–2022-12-31 och Validation 2023-01-01–2024-12-31. Holdout 2025-01-01–2026-09-10 är SEALED och har varken runner eller resultatyta i denna release.

Fyra familjer är registrerade: Trend/momentum, Mean reversion, Volatility breakout, Regime ensemble. Minimikrav före holdout är oförändrade: minst 80 affärer, PF >=1.20, DD <=12 %, positiv validation och koncentrationsskydd. Högsta historiska P/L vinner inte automatiskt.

## Nästa steg
Live-verifiera: Forskning → Lina Generation 2 → Lås Generation 2-plan → status `LÅST & VERIFIERAD` → `Verifiera Research Engine` → PASS med Holdout SEALED. Därefter implementeras/körs de faktiska familjerunners mot DEV/Validation bakom detta lås. Kandidatfrysning måste ske före holdout.

Cloudflare Worker: INGEN ÄNDRING. Använd live-verifierad V0.2.43 Worker.
