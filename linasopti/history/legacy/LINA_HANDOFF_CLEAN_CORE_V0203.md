# LINA HANDOFF – CLEAN CORE V0.2.3

## Status
V0.2.3 bygger vidare på fungerande Clean Core V0.2.2.

### Ändring i V0.2.3
- Permanent startregel: varje ny start/inloggning börjar alltid på index/Dashboard.
- En gammal route-hash, t.ex. `#g2`, får inte styra första vyn efter login.
- Intern navigation kan fortfarande använda hash medan appen är igång.
- Ingen G2-strategi, datalogik eller forskningsregel är ändrad.

### Aktuellt blockerande fel för G2
G2-körningen startar korrekt men DEV-data för AMD 2020-01 saknas i live Worker:
- `/yahoo-bars`: endpoint saknas i live Worker.
- EODHD .US: 0 dagsrader.
- Alpaca daily: 0 dagsrader.

Nästa tekniska steg är därför att deploya den sparade kompletta Worker V0.58.8 med `/yahoo-bars`, verifiera `/health`, och därefter testa AMD januari 2020 innan G2 A–O körs igen.

## Fasta regler
- V0.58.8 COMPLETE är permanent legacy-facit/checkpoint före Clean Core.
- Tidigare bevisat fungerande funktion ska undersökas och testas först.
- Ingen strategiändring för att lösa transport/datafel.
- Handel AV.
- Robotmognad 48/100.
- Alla Lina-filer ligger platt i samma mapp.
