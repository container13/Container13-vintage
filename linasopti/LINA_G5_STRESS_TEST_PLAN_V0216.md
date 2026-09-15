# LINA G5 STRESS TEST PLAN – V0.2.16
Datum: 2026-09-15
Planhash: `6ec36eb2`

## Syfte
Förregistrerat stresstest av frysta G2-kandidaten `15efd75a` efter G4 PASS/FROZEN. G5 försöker slå sönder edgen med realistiskt sämre exekvering. Ingen parameterjakt.

## Fryst bas
- Kandidat: `15efd75a`
- Period: 2020-01-01 → 2026-09-10
- Universum: samma 16 symboler som G4.
- G2-parametrar, signalregler, stop/target/hold och regimfilter får inte ändras.

## Stresscenarier
1. Extra kostnad 0,10 % per sida.
2. Extra kostnad 0,25 % per sida.
3. Extra kostnad 0,50 % per sida.
4. Entry fördröjd 1 handelsdag.
5. Kombinerat: 0,25 % extra per sida + 1 handelsdags entryfördröjning.

## Gate låst före resultat
PASS: minst 4/5 scenarier har P/L > 0, PF >= 1,05 och DD >= -10 %. COMBINED måste dessutom ha P/L > 0, PF >= 1,00 och DD >= -12 %.

HOLD: minst 3/5 scenarier har P/L > 0 och PF >= 1,00, och inget scenario har DD < -15 %. Annars FAIL.

## Förbud efter resultat
Ingen rescue, parameterändring, symbolrensning eller omdefinition av gate. G2/G3/G4 och Real Forward ändras inte för att förbättra G5.

## Evidensbegränsning
G5 är ett historiskt stresstest, inte ny oberoende OOS. G2/G3 Real Forward efter anchor 2026-09-11 har högre evidens.
