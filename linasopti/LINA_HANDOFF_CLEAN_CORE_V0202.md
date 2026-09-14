# Lina Clean Core V0.2.2 – Handoff

## Bas
Byggd från fungerande Clean Core V0.2.0. Login/Enter/Uppdatera från V0.1.6 lämnas orörda.

## Fix
V0.2.0 hade ett tyst fel i G2-UI:t: `catch(e){}` svalde undantaget från G2-motorn och en omrendering ersatte live-felmeddelandet. Resultatet såg ut som att knappen inte gjorde något.

V0.2.2:
- visar exakt `KÖRFEL` i G2-vyn,
- sparar `runStatus`, `runStartedAt`, `lastError`,
- loggar `RUN_ERROR` i `trialLedger`,
- ändrar ingen forskningsregel.

## Nästa test
Lås plan -> Kör G2 A–O. Om data/Worker fallerar ska felet nu stå kvar synligt och även finnas i Raw JSON.


## V0.2.2 korrigering
V0.2.1 hade ett release/cache-fel: runtimefilerna refererades med `?v=0.2.0` och `APP_VERSION` var 0.2.0 trots synlig V0.2.1. V0.2.2 synkroniserar samtliga runtime-versioner/cache-busters och gör kontrollen permanent release-blocker. Ingen G2-strategilogik ändrad.
