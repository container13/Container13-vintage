# LINA G6 EXECUTION COST BOUNDARY PLAN – V0.2.23

Datum: 2026-09-15
Plan hash: `1567bbbe`
Kandidat: `15efd75a`
Status: **LÅST · RESULTAT EJ ÖPPNAT**
Handel: **AV**

## Forskningsfråga
G5 visade att kandidaten tålde +0,10 % extra kostnad per sida och en handelsdags entry-delay, men inte +0,25 % extra kostnad eller COMBINED. G6 ska därför mäta var exekveringskostnadsgränsen ligger. G6 ändrar inte strategin och försöker inte rädda G5.

## Fryst setup
- Period: 2020-01-01 → 2026-09-10.
- Universum: samma 16 symboler som G4/G5.
- Bas-kostnad: 0,10 % per sida.
- Extra kostnad per sida: 0,00; 0,05; 0,10; 0,15; 0,20; 0,25; 0,30; 0,40; 0,50 %.
- Entry delay: 0 dagar.
- Parametrar: breakout 55, SMA200 trend, volume 1,5, SPY200 regime, stop 7 %, target 15 %, max hold 10 handelsdagar.

## Boundary
Högsta **testade** extra kostnad per sida där P/L > 0 och PF ≥ 1,00. Ingen interpolation används för gate.

## Förregistrerad gate
- **PASS:** boundary ≥ 0,20 % extra per sida och DD ≥ −10 % vid varje testpunkt till och med boundary.
- **HOLD:** boundary ≥ 0,10 % men < 0,20 %, och ingen testad DD < −15 %.
- **FAIL:** boundary < 0,10 %, eller någon testad DD < −15 %.

## Forskningsregler
Ingen parameterändring, symbolrensning eller rescue av G5. G6 är diagnostisk robusthetsforskning, inte ny oberoende OOS. G2/G3 Real Forward har högre evidens.

Runner byggs först i nästa version.
