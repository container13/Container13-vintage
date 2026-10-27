# Gen16 – skrivskyddad dataintegritetsgranskning, del 1
Datum 2026-10-27. Utgår från uppladdad chatt28okt.txt; ingen rerun eller ändring av fryst forskning.

## Verifierat direkt i GitHub
- `gen16-workflow-data.js` `prepareData()` hämtar `SOURCE_gen9-data.json` och `evidence/GEN9_DATASET_GATE_2026-10-05.json`, kräver SHA-256 för källtexten lika med `C.DATA_SHA`, gate PASSED, kandidat-SHA lika med C.DATA_SHA och 20128 rader; därefter 16 symboler × 1258 bars och manifest. `restoreDataCheckpoint()` tillåter inte automatisk nyförberedelse.
- `gen16-workflow-core.js` definierar DATA_SHA = `cb84e436a0527b44262949994306dcb85eaf5f10ad88fc7906d443833cc6589c`.
- `evidence/GEN9_DATASET_GATE_2026-10-05.json` har `datasetGate:PASSED`, `candidateSha256` samma SHA, `rowCount:20128`.
- Fryst `evidence/2026-10-06/LINAS_GEN16_DATA_cb84e436a0527b44262949994306dcb85eaf5f10ad88fc7906d443833cc6589c.json` är ett **manifest** med `source:SOURCE_gen9-data.json`, samma SHA, `rowCount:20128`, `historyHardStop:2024-12-31`, `reusedFromFrozenDataset:true`. Det innehåller **inte OHLC-rådata**.
- `SOURCE_gen9-data.json` finns på rätt branch och GitHub returnerar blob-SHA `5ac082c346db53fabccb9ab5009bb99527f764e1`, men connectorns `fetch_file` gav **tomt content** för denna fil. Det kan vara en storleks-/connectorbegränsning; **inte bevis för tom rådatafil**.
- `readImmutableEvidence()` kräver Worker-receipt-schema och SHA256 av returnerad text; faktiska Worker-kvitton har inte hämtats/verifierats i denna kontroll.

## Bedömning
**PARTIAL / UNVERIFIED** för rådata: manifest, gate och kodens kontrollkrav är samstämmiga, men det saknas oberoende bytebaserad SHA-256-kontroll av själva `SOURCE_gen9-data.json` mot det låsta värdet. Git blob SHA-1 och SHA-256 för filinnehåll är olika mått. Att koden innehåller verifieringsvillkor bevisar inte att en ny readback gjorts.

## Nästa exakta steg
Skrivskyddad åtkomst till rådata via fungerande byte-/raw-blob-metod; beräkna SHA-256 av exakta bytes och jämför med `cb84e4...`. Kontrollera struktur och tidsstopp utan att omgenerera eller backtesta. Därefter spåra oberoende källa/proveniens (inklusive justerade kurser, tidsstämplar och survivorship) samt immutable Worker receipts och Forward-historik. Behåll Handel/Forward AV och Gen17 DRAFT_ONLY.
