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


## 2026-10-28 – CI-trigger förbättrad, resultat fortsatt OBEKRÄFTAT
- Workflow ändrad **endast i isolerad gren** via commit `9ec9cac19862f29aa89a7a8e76fc1530a6e2005f`: installerar nu testberoenden i `linasopti/ci-corporate-actions`, tillåter manuell `workflow_dispatch`, begränsar körning till isolerad gren, har bara `contents: read` och inget deploy-kommando eller kopplade hemligheter. Exakt GitHub-readback PASS.
- Nya commitens combined statuses och PR-filterbaserade workflow-run lookup returnerar båda tomma listor. Detta är **inte** kvitto på att push-körningen har misslyckats, lyckats eller ens startat. Ingen Actions-logg har kunnat hämtas med tillgängliga verktyg.
- Lokal originalfil `corporate_probe_v3_1.mjs` SHA-256 `b134f2f54a6fe140217c008bd31ef1891a4a0e3b977a4cbe1907943b686f59ef`, Git blob `42ed77d5878030e3ef3b641d2afbbdfe0ffbd1d6`. Den isolerade GitHub-filens blob SHA var `aabede4a872e8aed9d0c234db53cad8aad92ce79`. **De är inte byte-identiska**; filöverföring till CI är en implementation med förenklad/överförd källkod. Ett CI-PASS skulle därför inte ensamt validera den tidigare exakta lokala V3.1-versionen.
- Nästa obligatoriska grind: synligt workflow run/job log-kvitto, därefter byte-identitet eller explicit granskad diff mellan lokal V3.1 och CI-version, samt verkligt integrationsupplägg för full Worker-router. Får inte mergeas/deployas till produktionsgrenen.
- Gen8–16 frysta, Gen16 NO_CANDIDATE, Gen17 DRAFT_ONLY; handel och ny Forward AV, inga riktiga Alpaca-anrop.


## 2026-10-28 – Originalfiler byte-identiska på isolerad testgren
- V3.1 lokalt original `/mnt/data/lina_diagnostic/corporate_probe_v3_1.mjs` Git blob `42ed77d5878030e3ef3b641d2afbbdfe0ffbd1d6`; GitHub-testgrenens V3.1 efter commit `a89fa3d1ff64cc3b40c91f8228cd8b4021feecaa` lästes på exakt commit och gav **samma blob-SHA: PASS**.
- V2 lokalt original `/mnt/data/lina_diagnostic/corporate_probe.mjs` Git blob `51a957fab9185c4a7970a0387cfe0aa26c670443`; GitHub-testgrenens V2 vid commit `d3420947cf5597318f7cd17a4370cd33b09241c2` lästes exakt och gav **samma blob-SHA: PASS**.
- Nuvarande Miniflare-testprogram använder således rätt lokala V2 och V3.1-källfiler på testgrenen, men **ingen GitHub Actions-jobblogg är verifierad ännu**. GitHub-verktygets commit-workflow-lookup filtrerar PR-körningar och är inte tillräcklig kontroll av push-workflows. Även vanlig commit-status har varit tom.
- Ingen production-Worker eller releasegrind har ändrats; inget verkligt Alpaca-anrop har gjorts. Testgrenens CI kan endast räknas PASS när jobblogg bevisar exakt körning. Kvar att granska: om runtime-testet använder original Worker-router eller bara en wrapper. Ingen merge till produktionsgrenen.
- Gen8–16 frysta, Gen16 NO_CANDIDATE, Gen17 DRAFT_ONLY, Handel och ny Forward AV.
