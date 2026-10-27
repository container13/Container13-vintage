# Lina – återhämtning av fryst generationsforskning (RUNBOOK)

Dokumenterad 2026-10-27. Operativ instruktion; **ingen forskningsstart, ingen kodändring och ingen ny runtime-version**.

## Varför denna rutin finns
Vid förberedelse av Gen17 tappade vi bort den tidigare fungerande vägen till Gen16-resultaten. Vi hänvisade felaktigt användaren till Forskning och Generation Engine, trots att Gen16 visas på **Dashboard** (V0.4.43). Vi gissade GitHub-filsökvägar och föreslog en ny exportfunktion innan vi hade spårat befintlig synk. Upprepa inte detta.

## Fastställd arkitektur – verifierad i källkod
1. `linasopti/github-sync.js`: `LinaGitHubSync.get()` anropar **GET https://linas-opti-api.mangaj73.workers.dev/app-state**. Svaret innehåller `state.entries['lina_generation_engine_v0273'].value` (JSON-sträng); tolka `JSON.parse(value).gen16`. `get()` är läsning; **anropa aldrig** `bootstrap()`, `syncAll()` eller `put()` i en felsökningsläsning: dessa kan skriva/merga.
2. Gen16-fält som bör kontrolleras: `summary`, `summaryFreeze.frozen`, `summaryFreeze.evidence`, `checkpoints` (8 för CONTROL/PRICE_CHANNEL_BREAKOUT × 2021–2024), `runnerSpecSha256`, `tradeEnabled:false`, `forwardOpened:false`. App-state är återställnings-/indexkälla, **inte** ensam bevisning för immutable-resultat.
3. `linasopti/gen16-workflow-data.js`: `readImmutableEvidence(name)` anropar **GET https://linas-opti-api.mangaj73.workers.dev/evidence-read?name=…**. Kräver `receipt.schema === 'LINA-GITHUB-COMMIT-RECEIPT-1'`, att `content` är sträng och att dess SHA-256 matchar `receipt.contentSha256`. Svaret anger `path` = **verklig GitHub-sökväg**, som ska användas ordagrant, aldrig gissas.
4. `linasopti/evidence-sync.js`: `LinaEvidence.syncApproved()` använder POST `/evidence` med inloggningskod för att frysa/synka. **Använd inte POST** vid enbart inspektion. `githubPath` och `verificationReceipt` kan redan finnas i synkad status/evidenskö.
5. Gen16 immutable-identitet: runnerspec-SHA `a065ce8ad2285010493f8491c86116f01025ed3554be18744471de394dbdeafa`; summary-namn `LINAS_GEN16_SUMMARY_a065ce8ad2285010493f8491c86116f01025ed3554be18744471de394dbdeafa.json`. Fold-namn `LINAS_GEN16_<specSha>_<variant>_<year>.json`. Datasetnamn härleds från `C.DATA_SHA` i Gen16-kärnan; gissa inte.
6. `recoverFinalStateFromImmutableEvidence()` i gen16-workflow-data.js är en befintlig återställningsfunktion, **men den skriver lokal state/checkpoints**. Den ska inte anropas för en read-only inventering. Använd endast GET och fristående hashkontroll.

## Säkert arbetsflöde vid nästa generationsplan
1. Läs `LINA_CURRENT_STATE.json`, `LINA_HANDOFF_CURRENT.md`, `LINA_MASTER_RULES.md`, denna runbook och föregående låsta runnerspec. Kontrollera att Gen8–Gen16 är frysta; Handel/Forward AV.
2. Läs **GET /app-state** via tillgänglig nätanslutning/connector. Notera `branch`, `path`, `source`, `exists` och `state.entries['lina_generation_engine_v0273']`. Extrahera Gen16:s `summaryFreeze.evidence.githubPath` eller motsvarande receipt/path.
3. Läs **GET /evidence-read?name=LINAS_GEN16_SUMMARY_...json**; verifiera SHA-256, receipt-schema, specSha och `decision`. Läs och verifiera alla åtta fold-evidensfiler samt DATA-evidens vid behov. Spara kontrollerad resultatöversikt och de verkliga GitHub-sökvägarna i arbetsdokumentation (inte genom att kopiera/ändra immutable-filer).
4. Om Worker inte kan nås från ChatGPT-miljön: använd **GitHub-connectorns fetch_file på faktisk path**, om den är känd från tidigare receipt/state. Annars sök befintliga projektfiler/Worker-konfiguration efter sökvägsregler. **Stanna med UNVERIFIED** om läsning inte lyckas. Be inte användaren leta i fel vy eller skicka skärmbilder som standardväg.
5. Först efter verifiering: färdigställ en enda förhandsbestämd Gen17-förändring, kontroll, gates och oberoende framtida data. Be om uttryckligt godkännande före planlås. **Ingen Gen16-rerun, ingen retroaktiv holdout, ingen automatisk Gen17-start.**

## Aktuellt läge 2026-10-27
- Koden för GET /app-state och GET /evidence-read är granskad på `ccc-demo-public-test`. Den faktiska Worker-responsen, GitHub-sökvägen och Gen16:s exakta siffror är **INTE VERIFIERADE** från denna arbetsmiljö.
- Dashboard visar Gen16 enligt `status-order.js`; det finns inget krav att Gen16 ska finnas som separat kort under Forskning/Generation Engine.
- `LINA_GEN17_PLAN_PROPOSAL.md` är DRAFT_ONLY. Handel/Forward AV.

## Förebyggande regel
**READ-ONLY FIRST, USE EXISTING PATHS, VERIFY RECEIPTS, NEVER RERUN.** Sök alltid denna runbook och tidigare fungerande återställningskod innan nya UI-funktioner, exportsystem eller manuella användarsteg föreslås.
