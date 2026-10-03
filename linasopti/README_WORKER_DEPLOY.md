# Automatisk GitHub-överföring — användarbeslut 2026-10-03

Dokumentationsrevision: **1.1** · Uppdaterad: **2026-10-03**. Revisionen gäller README-rutinen; appens release anges fortsatt i `linasopti/version.js`.

Användaren har godkänt att samtliga färdiga filer som assistenten skapar eller ändrar för användarens projekt automatiskt förs över till GitHub, utan ny bekräftelse för varje uppladdning. Detta gäller även filer som tidigare överfördes manuellt och publicering i det godkända offentliga projekt-repot.

- Identifiera rätt repo, gren och sökväg för respektive projekt före skrivning. För Lina: `container13/Container13-vintage`, gren `ccc-demo-public-test`, katalog `linasopti/`.
- Kontrollera färdiga filer före överföring; vid koduppdateringar överförs endast nya eller ändrade filer. Bevara samtidiga ändringar och använd aldrig force-push för denna rutin.
- Läs tillbaka uppladdade filer och verifiera exakt innehåll; rapportera commit och eventuella blockerade överföringar. Påstå inte att en fil är sparad innan överföringen är verifierad.
- Befintlig fryst evidence får aldrig skrivas över. Ny evidence sparas separat med sin faktiska status.
- GitHub-lagring av Worker-kod är inte en Cloudflare-deploy. Behåll leverans med ett-klick-kopiering när manuell inklistring behövs.
- Tillståndet gäller filöverföring; det ändrar inte forskningsbeslut, Gen8-frysning, Gen9-godkännande eller Handel/Forward-gates. Hemligheter och inloggningsuppgifter ska inte ingå i projektfiler.

Detta dokumenterar arbetsrutinen i projektet; det är inte en bekräftelse på att ChatGPTs globala minne har uppdaterats.

---

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


- **Cloudflare Worker-leverans:** När komplett Worker-kod ska lämnas till användaren ska en nedladdningsbar HTML-hjälpare skapas med knappen **Kopiera Worker-kod**. Hela Worker-koden ska ligga dold i HTML-filen och kopieras till urklipp med ett knapptryck; de tusentals kodraderna ska inte visas i chatten. HTML-hjälparen ska alltid byggas från den senast verifierade kompletta live-Worker-basen, inte från en kort/ofullständig repo-kopia.
