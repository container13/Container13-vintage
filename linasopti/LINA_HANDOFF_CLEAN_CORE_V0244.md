# Lina Clean Core V0.2.44 – Handoff

## Fast läge
- REGEL 1: frångå aldrig fastställda regler.
- Handel AV. Robotmognad 48/100.
- Original G2/G3 Real Forward fortsätter oförändrade.
- V0.2.43 safe-close/cross-device/permanent GitHub-master är live verifierad PASS 2026-09-16: completedThrough 2026-09-15, G2/G3 lastMarketDate 2026-09-15.

## V0.2.44
Startar separat Lina Generation 2-labb. Denna release låser endast forskningsdesignen; inga nya resultat produceras.

### Förregistrerad datadelning
- DEV: 2020-01-01–2022-12-31
- Validation: 2023-01-01–2024-12-31
- Sealed holdout: 2025-01-01–2026-09-10
- Real Forward: först efter kandidatfrysning

### Familjer
1. Trend/momentum
2. Mean reversion
3. Volatility breakout
4. Regime ensemble

### Urvalsregel före holdout
Minst 80 affärer, PF >=1.20, DD <=12 %, positiv validation och koncentrationsskydd. Robust riskjusterad prestation prioriteras framför högsta historiska P/L.

### Nästa steg
Implementera datalås och runners för de fyra familjerna. Holdout får inte öppnas, användas för ranking eller tuning innan kandidatfrysning. Alla negativa resultat/testantal bevaras.

Cloudflare Worker: INGEN ÄNDRING. Använd verifierad V0.2.43 Worker.
