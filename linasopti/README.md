# Linas Opti V0.38.5 – Golden Rebuild

Bas: verifierat fungerande V0.36.7-dataflöde.

## Ändrat
- Behåller UI-förbättringarna från senare versioner.
- Återställer `getBars()` till V0.36.7:s fungerande fetch-/slutförandeflöde.
- Tar bort anropet till `v0368UpdateContextUI()` från MutationObservern.
- Data-klar-rutan uppdateras i stället exakt en gång när `paintBridgeDone()` körs efter lyckad dagsdatahämtning.
- Ingen ändring av Worker, API-nycklar, strategi eller handelslogik.

## Varför
V0.38.4 hade en MutationObserver som anropade en funktion som själv ändrade observerad DOM-text. Det kunde skapa en självutlösande UI-loop efter att data kommit tillbaka. Cloudflare-loggen visade samtidigt HTTP 200 / outcome ok på `/bars`.

## Testordning
1. Ladda upp filerna i testmapp.
2. Logga in med befintlig kod.
3. Välj 2026.
4. Hämta dagsdata.
5. Kontrollera att status går till klart/data-klar och därefter kör test.
