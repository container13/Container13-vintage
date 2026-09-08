# Linas Opti V0.40.0 – Lina Day PRO

Byggd direkt ovanpå V0.39.4, vars Day-revision gav PASS.

## Nytt
- Baseline `daytrade()` är orörd och körs parallellt som kontrollgrupp.
- Ny `daytradePro()` Challenger med kvalitetsranking: momentum på flera tidsfönster, acceleration, relativ volym, close-location, trend och översträckningsfilter.
- PRO har samma maxposition (20 %), kostnadsmodell, stop/mål, konservativa nästa-bar-exekvering och ingen övernattning som baseline.
- Resultat visar Baseline och PRO sida vid sida inklusive skillnad mot baseline.
- Full testdata exporterar PRO-affärer och händelselogg.
- Test-fliken märks `REDO` när dags- eller 5-min-data finns.
- Version: V0.40.0.

## Forskningsdisciplin
V0.39.4-resultatet är fryst baseline. PRO är en Challenger, inte en bevisad strategi. Första 20-dagarsperioden används som utvecklingsprov; lovande regler ska därefter frysas och testas på andra, tidigare osedda perioder innan slutsatser dras. Ingen livehandel är aktiverad.

## Orört
- Swing-strategin
- Worker/API och hemligheter
- dagsdatahämtningen
- V0.39.4 baseline-Day-motorn
