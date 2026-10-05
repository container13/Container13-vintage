# LINA GEN14 — PLAN PROPOSAL

Status: PROPOSAL_NOT_APPROVED
Datum: 2026-10-05
Research: EJ STARTAD
Handel: AV
Forward: AV

## Fryst källa
Gen10–Gen13 är permanent frysta och får aldrig köras om. Gen14-planen bygger endast på redan sparad immutable evidence och tidigare preregistrerade mekanismer.

Gen13 stängde NO_CANDIDATE. CONTROL och RANK_TO_CAPACITY hade identiska accepterade trades och equity i samtliga folds. 2022 hade endast 18 trades, P/L -5229.7466, PF 0.0419341 och win rate 11.11 %, utan någon kapacitetskonflikt. Kapacitetsprioritering är därför falsifierad som förklaring till worst-fold-problemet.

## Hypotesfamiljer som redan är prövade
- Gen10: graderad breadth/exponering.
- Gen11: sektordiversifiering/sektortak.
- Gen12: binär breadth-regimgate, 8/16 över SMA180.
- Gen13: cross-sectional RANK_TO_CAPACITY.

Gen14 får därför inte återanvända en ny breadth/regimtröskel, sektorgate, sizingregel eller kapacitetsranking som förtäckt rescue.

## Enda föreslagna Gen14-hypotes — PERSISTENCE_CONFIRMATION
Ett enskilt previous-close breakout kan vara för känsligt för kortlivade utbrott. En temporal bekräftelse kan pröva om signaler som kvarstår till nästa beslutstidpunkt är robustare utan att introducera en marknads-, sektor- eller symbolspecifik filterregel.

### Föreslagen princip
- CONTROL: exakt ofiltrerad fryst basmotor, endast diagnostisk.
- Kandidat: PERSISTENCE_CONFIRMATION.
- Kandidaten får endast använda information som är känd vid respektive previous close.
- En annars giltig breakout-signal får inte entry vid första möjliga next-open.
- Den måste fortfarande uppfylla exakt samma redan låsta breakout/trendvillkor vid nästa beslutstidpunkt innan entry får ske på därefter följande open.
- Ingen ny pris-, breadth-, score-, percentile- eller symboltröskel införs.
- Signalens befintliga lookback 50 och SMA180-trendvillkor ändras inte.
- Sizing, volTarget, volMin, maxPositions, maxPositionPct, risk, kostnader och exitprincip ska inte ändras som del av hypotesen.
- Ingen alternativ persistence-längd får provas efter observation.

## Viktig designfråga före preregistrering
Exakt semantik för hold/exit efter den fördröjda entryn måste väljas ex ante och maskinverifieras. Ingen implementation eller research får starta innan det finns en entydig regel för entry-index, 12-sessioners hold, fold-end liquidation och samtidighet.

## Oförändrade robusthetsgates
minOosTrades 100; minPf 1.2; maxDd 0.12; positiveOos true; maxConcentration 0.4; minPositiveFolds 3; minFoldPf 0.8; maxFoldGrossProfitShare 0.55.

## Forskningsintegritet
- 2021–2024 är observerad utvecklingsdata, aldrig unseen holdout.
- Ingen grid, alternativ bekräftelselängd, rescue, symbolrensning eller parameterändring efter observation.
- FAIL => NO_CANDIDATE.
- PASS => endast CANDIDATE_REVIEW_REQUIRED.
- Handel/Forward förblir AV.
- Detta dokument är endast ett planförslag. Det skapar ingen runnerspec, engine, research-state eller research-start.

## Nästa mänskliga beslut
Godkänn eller förkasta PERSISTENCE_CONFIRMATION som Gen14-designriktning.
Vid godkännande: formulera exakt semantik, bygg canonical runnerspec/hash och isolerad engine, kör synthetic Engine Verification + executable Release Gate och kräv därefter ett separat uttryckligt research-startbeslut.
