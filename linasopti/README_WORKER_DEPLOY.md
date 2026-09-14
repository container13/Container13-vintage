# Lina Worker V0.58.8 – deploypaket

Denna Worker är det kompletta sparade V0.58.8-facitet med `/yahoo-bars` för historisk dagsdata.

## Varför den behövs
Clean Core G2 når live Worker men får idag:
- Yahoo daily: endpoint finns inte
- EODHD .US: 0 dagsrader
- Alpaca daily: 0 dagsrader för AMD januari 2020

Frontend ska inte ändras för att maskera detta. Worker behöver först få den endpoint som redan byggdes i V0.58.8.

## Deploy
1. Öppna Worker-repot på datorn.
2. Ta backup/commit av nuvarande Worker.
3. Ersätt den aktiva Worker-källan med innehållet i `worker.js` i detta paket.
4. Kör från Worker-repots katalog:
   `npx wrangler deploy`
5. Verifiera därefter `/health` på Worker-adressen. Den ska visa:
   - `version: "0.58.8"`
   - `yahooHistoricalConfigured: true`
   - handel/trading fortfarande av
6. Testa `/yahoo-bars` med AMD, 1Day, 2020-01-01 till 2020-01-31.
7. Kör först därefter G2 A–O igen.

## Säkerhet
Ingen livehandel aktiveras av denna Worker. Befintliga Alpaca/EODHD-rutter behålls.
