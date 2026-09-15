# Lina Forward Evidence Phase – V0.2.28

Efter Research Review G2–G12 flyttas huvudfokus från fler historiska tester till riktig Real Forward.

- G2 Real Forward: statisk kandidat `15efd75a`, anchor 2026-09-11.
- G3 Real Forward: fryst metod `75838ed5`, anchor 2026-09-11, månadsval endast med då känd data.
- Första formella forward-milstolpe: 60 nya stängda affärer per modell. Därefter 120 och 250.
- Historiska G2–G12 är frysta och får inte rescue-ändras.
- Robotmognad ligger kvar 48/100 tills ny forward-evidens motiverar ändring.
- Handel AV.
- Forward Evidence Center uppdaterar G2 och G3 sekventiellt med en knapp och kan exportera ett gemensamt snapshot.
- Persistent forward-state är kompakt localStorage. Hämtad warmup/rå marknadsdata sparas inte där.
- Cloudflare Worker: INGEN ÄNDRING.
