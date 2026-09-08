# Linas Opti V0.39.4 – Day mekanik + delningsfix

Byggd direkt från V0.39.3. Swing, dagsdatahämtning, Worker/API och Lina Selection 16 är orörda.

Ändringar i denna version:

- Versionsnummer är V0.39.4 i både app och rapport. JS/CSS får nytt cache-buster-värde `0.39.4` så iPhone/Safari inte återanvänder en gammal fil och visar fel version.
- Day Jägaren använder fortfarande signal på avslutad 5-minutersbar och köp på nästa bars öppning.
- Konservativ entrybar-regel: stop/mål får börja utvärderas först från 5-minutersbaren efter entrybaren. Det tar bort köp+sälj på samma 5-minutersbar och undviker beroende av okänd intrabar-ordning.
- Day-revisionens kapitaltest jämför nu positionsstorleken med det faktiska kontoequityt vid respektive entry, inte med det ursprungliga startkapitalet. `entryEquity` lagras i varje Day-affär för revision.
- Delningskortet lämnas inte kvar på `Öppnar delning…`. Efter att native iOS-delningen startats ändras status till `✓ Rapporten är klar · Dela igen vid behov`.
- DAY REVISION rapporteras som V0.39.4.

## Avsikt

Detta är en mekanisk korrigering, inte strategioptimering. Stop, mål, signalfilter, max position, kostnadsmodell och max antal affärer är inte trimmade för bättre resultat. Resultatet kan därför ändras jämfört med V0.39.3 på grund av den konservativa entrybar-regeln.

## Test

1. Välj Lina Selection 16.
2. Hämta 20 dagar 5-minutersdata.
3. Kör Lina Day Jägaren.
4. Kontrollera att `DAY REVISION V0.39.4` helst visar PASS.
5. Dela Full testdata och kontrollera att appens delningsstatus återgår till färdigt läge efter AirDrop.
