# Linas Opti V0.41.3

- Synlig Robotmognad 38/100 i toppytan, klickbar med dynamisk förklaring.
- Kumulativ simuleringsräknare, seed 6 300 dokumenterade automatiska Testlab-simuleringar.
- Räknaren ökar automatiskt vid nya kontroll-, Exit Lab- och Exit Lab 2-simuleringar.
- Testlab har snabbval högst upp; senaste labbet är förvalt.
- Exit Lab 2 och PRO2-strategilogik är oförändrade från V0.41.2.
- Worker/API och hemligheter är oförändrade.

# Linas Opti V0.41.2 – Exit Lab 2

Byggd från verifierade V0.41.1.

## Nytt
- Exit Lab 2 / Parameterkarta.
- 625 förregistrerade exitkombinationer:
  - stop: 0,4 / 0,6 / 0,8 / 1,0 / 1,2 %
  - stop-delay: 0 / 5 / 10 / 15 / 20 min
  - mål: 0,6 / 0,8 / 1,0 / 1,2 / 1,5 %
  - max hålltid: 20 / 30 / 40 / 50 / 60 min
- 10 historiska 20-handelsdagarsfönster = 6 250 simuleringar.
- Samma frysta PRO2-entries återspelas; entry/signal/shares/friktion ändras inte.
- Topp 20 visas i appen; full rapport innehåller topp 50 + alla 625 kombinationer.
- Enkel robusthetsindikator räknar hur många närmaste parametergrannar som också har positiv P/L och PF >= 1.

## Forskningsdisciplin
De 10 perioderna är utvecklingsdata för Exit Lab 2 efter denna körning. En vald PRO3-kandidat måste frysas och testas på nya orörda perioder innan den kan kallas oberoende validerad.

Ingen livehandel.
