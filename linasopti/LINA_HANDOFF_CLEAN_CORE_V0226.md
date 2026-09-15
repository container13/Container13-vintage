# LINA HANDOFF – CLEAN CORE V0.2.26

## Nytt
G7–G12 levereras som ett förregistrerat Research Battery i en release.

Planer: {"G7": "247c474a", "G8": "46c80eee", "G9": "c82b5c2a", "G10": "80385a7e", "G11": "0cc6ede6", "G12": "403fef49"}

- G7 Time/Regime
- G8 Symbol Concentration
- G9 Trade Sequence Monte Carlo, 10 000 seeded runs
- G10 Parameter Neighborhood Stability proxy (diagnostik, ej optimering)
- G11 Entry/Exit Execution Robustness
- G12 Portfolio/Capital Stress

Alla använder fryst kandidat 15efd75a och fryst G4 trade ledger. Resultat får inte ändra andra planer. Handel AV. G2/G3 Real Forward har högre evidens.

## Permanent workflow-regel
När flera kommande forskningssteg kan förregistreras oberoende ska de paketeras i samma release med planer+runners, följt av gemensam evidence-freeze, för att minimera separata uppladdningar. Resultatberoende steg hålls separata.

Cloudflare Worker: INGEN ÄNDRING.
