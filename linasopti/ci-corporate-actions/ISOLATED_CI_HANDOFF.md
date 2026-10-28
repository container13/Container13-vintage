# Lina corporate actions – isolerad Workers-runtime CI, 2026-10-28

Status: FÖRBEREDD, INTE CI-VERIFIERAD. Ingen riktig Alpaca-begäran, ingen produktion.

Bas: ccc-demo-public-test; separat branch `lina-corporate-actions-ci-isolated`. Endast på denna gren:
- `linasopti/ci-corporate-actions/corporate_probe.mjs` – V2 testimplementation.
- `linasopti/ci-corporate-actions/corporate_probe_v3_1.mjs` – V3.1 semantisk kontroll.
- `linasopti/ci-corporate-actions/miniflare-test.mjs` – bygger en *lokal wrapper* runt original `../worker/WORKER_PENDING_RUNTIME_REPORT.js`, testar V3.1 med Miniflare och blockerade riktiga externa anrop.
- `.github/workflows/lina-corporate-actions-isolated.yml` – GitHub push-trigger enbart på denna gren, read-only permissions, npm installerar miniflare/esbuild och kör ovanstående test. **Ingen deploy** och **inga produktionshemligheter**.

GitHub-readback av källfilerna PASS. För commit `4a7d5cd44dac44cbe52c2f237688377b7b99514c` returnerade tillgänglig fetch_commit_workflow_runs tom lista, men verktyget filtrerar till PR-triggade körningar; det är alltså **inte bevis** för att push-jobbet inte körts. CI-resultat okänt.

VIKTIGA BEGRÄNSNINGAR:
1. V3.1 på denna testgren är en överförd/testanpassad källkopia av tidigare lokalt utkast, ännu inte byte-jämförd med lokal originalfil. Riktigt full Worker runtime-test PASS får inte påstås utan Github Actions-logg.
2. Miniflare-härvan använder en wrapper runt original Worker.fetch, inte en ändring av originalroutern. Full produktionsintegration kräver ytterligare test.
3. Enbart lokal strukturell eventklassificering, inte autentisk Alpaca-response, broker entitlement, punkt-i-tid eller Gen17-forskning.
4. Cloudflare auto-build är kopplat till produktionsgrenen `ccc-demo-public-test`, som inte skrevs i denna etapp. Dubbelkolla triggers innan någon merge, och slå INTE samman isolerad CI eller diagnostik med produktionsgren.
5. Gen8–16 frysta, Gen16 NO_CANDIDATE; Gen17 DRAFT_ONLY. Handel och ny Forward AV.

Nästa: kontrollera GitHub Actions körningssidan för denna branch och samla jobbkvitto/logg. Om workflow aldrig startade, gör en ny testgren-commit (utan att ändra produktion). Vid PASS kan vi gå vidare till strikt full Worker router-integrations- och säkerhetsgate; annars åtgärda testhärvan på isolerad gren.
