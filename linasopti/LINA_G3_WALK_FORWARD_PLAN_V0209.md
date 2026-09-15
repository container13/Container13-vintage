# LINA G3 WALK-FORWARD PLAN – V0.2.9

Status: FÖRREGISTRERAD METOD – måste låsas i UI innan körning.

Syfte: testa om en robot som först lär på 2020–2022 och därefter uppdaterar sitt modellval utan framtidsdata kan vara stabilare än helt statiska G2.

Metod:
- Initial grid: exakt G2-grid, 648 varianter.
- Initial träning: endast 2020–2022.
- Kandidatpool: topp 12 från initial träning, därefter låst.
- Walk-forward: 2023-01-01 → 2026-09-10.
- Omträning: månadsvis.
- Träningsfönster: expanderande, från 2020-01-01 t.o.m. sista kända handelsdagen före aktuell månad.
- Val: endast bland de 12 låsta kandidaterna.
- Execution: dagligen.
- Kostnad/risk/kapital: samma grundmodell som G2.
- Ingen rescue.

Forskningsbegränsning:
Vi känner redan historiska resultat för 2023–2026. G3-perioden kan därför inte återställas till verkligt orörd OOS. Metoden låses före körning för att minska efterhandsanpassning, men riktig ny forward efter 2026-09-11 är fortfarande högre evidens.
