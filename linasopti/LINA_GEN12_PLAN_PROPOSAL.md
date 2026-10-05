# LINA GEN12 — PREREGISTRERAD PLANFÖRSLAG

Status: LOCK_CANDIDATE_PRE_RESEARCH
Datum: 2026-10-05
Källa: frysta Gen10/Gen11-resultat. Ingen Gen10/Gen11 får köras om.

## Observation som motiverar hypotesen
Gen10 och Gen11 misslyckade båda samma robusta gates: symbolkoncentration och worst-fold. Gen11:s sektortak förbättrade DD/fold-share marginellt men ändrade inte 2022-folden: 18 trades, PF 0.04193405056618428. Detta talar emot ytterligare sektorspecifik räddning och för en separat marknadsregim-hypotes.

## Enda Gen12-hypotes
En binär, universumsbaserad breadth-regim-gate kan undvika nya long entries när den breda marknadsregimen är svag utan att ändra signal, ranking, sizing, exit eller kostnadsmodell.

## Låst kandidatregel
- CONTROL: exakt Gen11 CONTROL, diagnostisk och aldrig kandidatberättigad.
- Kandidat: BREADTH_50_GATE.
- På varje signaldag beräknas breadth från föregående stängning: antal av de 16 låsta symbolerna vars föregående close är strikt över sin SMA180 beräknad endast med data till och med föregående stängning.
- Ny entry tillåts endast om breadth >= 8 av 16 (50%).
- Vid breadth 0–7: hoppa över samtliga nya entries den dagen.
- Befintliga positioner, exits och fold-end liquidation påverkas inte.
- Ingen graderad sizing. Ingen sektorgate. Ingen parametergrid. Ingen alternativ threshold får provas efter observation.

## Oförändrat från Gen11/Gen10-bas
Universum, dataset/hash, 2021–2024 folds, lookback 50, trend/SMA180, hold 12, volDays 20, volTarget 0.12, volMin 0.35, capital 100000, costSide 0.001, maxPositions 8, maxPositionPct 0.125, baseRiskPerTrade 0.005, sizingDistance 0.05, simultaneous ranking/order, next-open entry, mark-to-market equity och gates är oförändrade.

## Gates
minOosTrades 100; minPf 1.2; maxDd 0.12; positiveOos true; maxConcentration 0.4; minPositiveFolds 3; minFoldPf 0.8; maxFoldGrossProfitShare 0.55.

## Forskningsintegritet
2021–2024 är observerad utvecklingsdata, aldrig unseen holdout. Gen12 är en ny preregistrerad hypotes, inte en räddning av Gen11. Efter observation får threshold, regel eller gates inte ändras inom Gen12. FAIL => NO_CANDIDATE. PASS => endast candidate review; Handel/Forward förblir AV tills separat beslut.
