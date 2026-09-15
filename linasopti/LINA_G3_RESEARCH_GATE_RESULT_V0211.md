# LINA G3 RESEARCH GATE RESULT – V0.2.11
Datum: 2026-09-15

## Beslut
**PASS – METOD FRYST.**

G3 Walk-Forward kördes enligt låst plan `75838ed5` utan rescue/efteroptimering. Resultat: 181 affärer, P/L +18 446,11, PF 1,4851, WR 51,38 %, DD -3,38 %, slutkapital 118 446,11.

G3 är ett walk-forward-metodtest, inte ny oberoende OOS-evidens, eftersom 2023–2026 redan delvis observerats i tidigare Lina/G2-arbete. PASS betyder därför att metoden får gå vidare till Real Forward; det betyder inte att G3 ersätter fryst G2.

## Fryst metod
- Tränings/poolperiod 2020-01-01–2022-12-31.
- 648 G2-gridvarianter rankas på träningsperioden.
- Topp 12 är permanent kandidatpool.
- Från 2023 väljs modell månadsvis endast ur denna pool och endast med data t.o.m. föregående handelsdag.
- Öppna positioner behåller reglerna från entry.
- Ingen rescue eller parametertrimning efter observerat resultat.

## Real Forward
Gemensam anchor: **2026-09-11**.
G2 fortsätter statiskt med kandidat `15efd75a`.
G3 fortsätter med fryst walk-forward-metod. September 2026 använder redan låst månadsmodell `69147890`, tränad t.o.m. 2026-08-31. Framtida månadsval görs först när föregående månad är avslutad i tillgänglig marknadsdata.

Milstolpar: 60 / 120 / 250 stängda affärer. Handel AV.
