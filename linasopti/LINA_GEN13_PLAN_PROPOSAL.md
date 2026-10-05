# LINA GEN13 — PLAN PROPOSAL

Status: PROPOSAL_ONLY_NOT_APPROVED_NOT_LOCKED
Datum: 2026-10-05
Källa: frysta Gen10–Gen12-resultat och permanent research boundary. Ingen tidigare generation får köras om.

## Problemklass
Gen10–Gen12 visar att sizing-, sektor- och breadthfilter ovanpå samma breakout-entry inte löser de återkommande robusthetsproblemen symbolkoncentration och worst-fold. Gen12 ökade aggregate PF men försämrade concentration till 1.0 och minFoldPf till 0.0. Nästa hypotes ska därför ändra urvalsmekanismen, inte trimma ännu ett filter eller threshold.

## Enda föreslagna Gen13-hypotes
Cross-sectional konkurrens mellan samtidiga redan giltiga breakout-signaler kan ge en robustare portfölj än att behandla varje giltig signal som en oberoende entry.

## Föreslagen kandidatregel — RANK_TO_CAPACITY
- CONTROL ska vara exakt ofiltrerad basmotor enligt föregående fasta signal/entry/exit/sizing/kostnadsregler och är endast diagnostisk.
- Kandidatnamn: RANK_TO_CAPACITY.
- På varje signaldag skapas exakt samma giltiga breakout-kandidater som i basmotorn med endast information till och med föregående close.
- Kandidater sorteras med det redan befintliga och tidigare definierade strength-måttet: 50-dagars prisförändring, fallande; symbol stigande som deterministisk tie-break.
- Ledig kapacitet definieras utan ny parameter: maxPositions (8) minus antal redan öppna positioner före dagens nya entries.
- Endast de högst rankade kandidaterna upp till ledig kapacitet får gå vidare till den oförändrade entry/sizing-logiken.
- Övriga giltiga kandidater den dagen får SKIP reason RANK_CAPACITY.
- Om ledig kapacitet är 0 tas inga nya entries.
- Om antalet kandidater är mindre än eller lika med ledig kapacitet påverkar regeln ingenting.
- Ingen Top-N-parameter införs. Ingen percentile, score-threshold, breadth-threshold, sektorgate eller alternativ strength-definition får provas inom Gen13.

## Varför denna regel väljs ex ante
Regeln använder två storheter som redan är låsta före Gen13: befintlig strength-ranking och maxPositions=8. Den skapar därför ingen ny numerisk hyperparameter som kan väljas från observerade 2021–2024-resultat. Regeln formaliserar endast konkurrens om faktisk portföljkapacitet.

## Ska förbli oförändrat
Universum med 16 symboler, dataset/hash, folds 2021–2024, breakout lookback 50, SMA180-trendvillkor, hold 12, volDays 20, volTarget 0.12, volMin 0.35, capital 100000, costSide 0.001, maxPositions 8, maxPositionPct 0.125, baseRiskPerTrade 0.005, sizingDistance 0.05, next-open entry, daily mark-to-market, fold-end liquidation och samtliga robusthetsgates ska förbli oförändrade.

## Gates
minOosTrades 100; minPf 1.2; maxDd 0.12; positiveOos true; maxConcentration 0.4; minPositiveFolds 3; minFoldPf 0.8; maxFoldGrossProfitShare 0.55.

## Forskningsintegritet
- 2021–2024 är redan observerad utvecklingsdata och får aldrig beskrivas som unseen holdout.
- Ingen parametergrid eller alternativ rankregel får testas efter observation.
- FAIL innebär NO_CANDIDATE. PASS innebär endast CANDIDATE_REVIEW_REQUIRED; Handel/Forward förblir AV tills separat beslut.
- Gen10, Gen11 och Gen12 är permanent frysta och får aldrig rerunnas.
- Denna fil är endast ett planförslag. Den skapar inte runnerspec, engine, research-state eller starttillstånd.
- Nästa genuina beslut är mänskligt godkännande eller avslag av denna plan. Först efter uttryckligt godkännande får canonical runnerspec/hash och isolerad engine byggas. Research kräver därefter fortfarande separat startbeslut efter synlig Engine/Release Gate-verifiering.
