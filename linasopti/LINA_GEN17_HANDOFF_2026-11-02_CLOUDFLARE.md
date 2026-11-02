# ÖVERLÄMNING – LINAS OPTI GEN17 – 2026-11-02

## STARTA HÄR I NÄSTA CHATT
Fortsätt Linas Opti från denna verifierade överlämning i GitHub. Läs först:
1. linasopti/LINA_GEN17_BRANCH_AND_DEPLOY_SAFETY_RULES.md
2. linasopti/LINA_CLOUDFLARE_GITHUB_DEPLOY_HANDOFF.md
3. linasopti/LINA_MASTER_RULES.md
4. linasopti/LINA_SYSTEM_MANUAL.md
5. linasopti/LINA_CURRENT_STATE.json
6. senaste avsnitten i linasopti/LINA_HANDOFF_CURRENT.md
7. denna fil.

## ABSOLUTA REGLER
- Repo container13/Container13-vintage; arbeta endast på ccc-demo-public-test.
- main får INTE ändras, användas, mergas eller deployas. Inga genvägar via main för GitHub Actions.
- Produktions-Worker linas-opti-api får INTE ändras/deployas; produktionens wrangler.jsonc och secrets ska förbli orörda.
- Enda möjliga staging-mål: linas-opti-gen17-sse-staging via linasopti/worker/wrangler.gen17-sse-staging.jsonc.
- Ingen automatisk deploy; kontrollera mål och be om uttryckligt godkännande före första verkliga staging-deploy.
- Gen17 DRAFT_ONLY / PIT_UNVERIFIED, handel och Forward OFF; Gen8–16 frysta.
- Dokumentera viktiga fynd direkt och verifiera GitHub-readback. Gör inte om redan avslutat arbete.

## VERIFIERAT NULÄGE
- Cloudflare Worker linas-opti-gen17-sse-staging skapad manuellt 2026-11-02 i Cloudflare dashboard med Hello World. Dashboard visade Ready och URL linas-opti-gen17-sse-staging.mangaj73.workers.dev. Gen17-kod är INTE ännu publicerad dit.
- Gen17 staging config finns: linasopti/worker/wrangler.gen17-sse-staging.jsonc, name linas-opti-gen17-sse-staging, main ./WORKER_GEN17_SSE_CANDIDATE.mjs, workers_dev true.
- Gen17 kandidat: linasopti/worker/WORKER_GEN17_SSE_CANDIDATE.mjs och linasopti/ci-corporate-actions/sse_diagnostic_candidate.mjs. Endpoint /corporate-actions-sse-diagnostic, SSE diagnostik, inte PIT-bevis.
- GitHub Actions SSE tests och Wrangler dry-run PASS: https://github.com/container13/Container13-vintage/actions/runs/41368786330.
- Existerande GitHub Actions workflow .github/workflows/ccc-vision-worker-deploy.yml använder cloudflare/wrangler-action@v3, secrets CCC_CLOUDFLARE_API_TOKEN och CCC_CLOUDFLARE_ACCOUNT_ID.
- Nytt isolerat preflight-workflow .github/workflows/lina-gen17-cloudflare-credentials-preflight.yml på ccc-demo-public-test. PASS https://github.com/container13/Container13-vintage/actions/runs/41370551566 : båda Cloudflare secrets PRESENT, staging target guards PASS, Wrangler dry-run PASS. Detta bevisar INTE att token har tillräckliga rättigheter för staging deploy.
- Manuellt staging-only workflow .github/workflows/lina-gen17-sse-staging-deploy.yml finns på ccc-demo-public-test, commit d9fb88b2. Det visas INTE i GitHub Actions sidopanel enligt användarens screenshot; troligen pga workflow_dispatch på icke-defaultgren. DETTA ÄR INTE SKÄL ATT ÄNDRA MAIN.
- Säkerhetsregler separat sparade i linasopti/LINA_GEN17_BRANCH_AND_DEPLOY_SAFETY_RULES.md commit 186b605b.
- Cloudflare GitHub handoff separat sparad i linasopti/LINA_CLOUDFLARE_GITHUB_DEPLOY_HANDOFF.md commit 80266e1a.

## NÄSTA KONKRETA STEG
Undersök hur en säker, branch-isolerad, manuellt godkänd staging deploy kan startas via befintlig GitHub Actions-kapacitet UTAN att använda main. En möjlig väg är ett strikt avgränsat push-triggat workflow på ccc-demo-public-test med hårdkodad staging-config och kontroller, men det kräver separat godkännande före någon live deploy. Alternativt verifiera om ett existerande workflow kan användas säkert utan att röra produktionsmål. Använd aldrig standard wrangler.jsonc eller npx wrangler deploy utan explicit --config wrangler.gen17-sse-staging.jsonc. Bekräfta att staging-Worker har nödvändiga separata secrets före att köra SSE endpoint; be aldrig om hemliga värden i chatten.

## ANVÄNDARENS ÖNSKEMÅL
- Var konkret, utför GitHub-arbete själv där det går, minimera klick och onödiga frågor.
- Ett steg i taget vid Cloudflare UI; undvik upprepningar och main-diskussioner.
- Överlämningar ska vara helt kopieringsbara med ett klick.


## SENASTE NULÄGE – Work 2026-11-02, 02:39 CET (ersätter äldre nästa-steg)
- Användaren godkände första staging-publiceringen och policyrevision 2 för engångspush. Efter upptäckt att dokumentationscommits fortfarande utlöste produktions-Workers Builds pausade användaren Disable builds och bekräftade sparat. Gör inga antaganden om tidigare utebliven produktionsdeploy: commit 3b8fb221 hade en lyckad produktions-build/version enligt GitHub-check.
- Första Gen17 staging-publiceringen LYCKADES. Kandidat exakt 3b8fb2215009592f3079af0b5806213588e3cecb, startcommit 6ece7cac0b69e42156724dd0f5b0d6804a079bdc; run https://github.com/container13/Container13-vintage/actions/runs/41373559974, job 125048912559, SUCCESS.
- 18/18 tester PASS, target guards PASS, dry-run PASS, credentials presence PASS. Logg: Uploaded och Deployed linas-opti-gen17-sse-staging; Cloudflare Version ID bf6cbfcc-8a41-41a7-b781-eb11c6520f0a. URL https://linas-opti-gen17-sse-staging.mangaj73.workers.dev.
- Dry-run använde Wrangler 4.156.1; wrangler-action installerade 3.90.0 för deploy. Båda lyckades; ingen byteidentitet mellan dessa bundles intygas.
- Push-start begränsades till exakt branch, before-SHA, unik commitmarkör och run_attempt 1; checkout låst till kandidat-SHA. Push-triggern togs bort i commit 9da63edcab17043e1637bca569b8243983ae4183 och exakt readback verifierades. Vanliga pushar kan inte starta nya staging-deployer.
- Live GET /corporate-actions-sse-diagnostic svarade HTTP 405 med METHOD_NOT_ALLOWED, vilket styrker att nya routen svarar. Inget autentiserat SSE-/Alpaca-anrop utfört. Separata staging-secrets och providerbehörighet är ännu inte verifierade.
- Nästa: verifiera staging-secrets säkert (aldrig hemliga värden i chat/logg), därefter bounded autentiserad diagnostik. Publiceringen ska INTE göras om. Gen17 DRAFT_ONLY/PIT_UNVERIFIED, Handel/Forward OFF, Gen8–16 frysta. main orörd.


## V0.4.47 – existing Lina TEST service SSE integration
User corrected environment classification and authorized integration/publication into linas-opti-api. Extra staging not required. Production platform label does not mean real production. Exact preflight run 41374374815 PASS, tests and Wrangler dry-run on V047 wrapper + unchanged V046 fallback and SSE module. Switch wrangler.jsonc to WORKER_V047_SSE.mjs, keep_vars true; preserve existing CORS by delegation, existing auth and all other routes. Hash-pin dependency closure in integrity gate. Initial prep integrity failed only state release/safe anchor; corrected in deployment commit. Await Cloudflare deployment/live route check. No authenticated provider request yet. Trade/Forward OFF, Gen8-16 frozen, Gen17 DRAFT_ONLY/PIT_UNVERIFIED; main untouched.


## Operativ checkpoint 2026-11-02 – V0.4.50 händelse-/tidsgranskning klar
- V050 live verifierad; 18 tester och dry-run PASS, GitHub integrity/Pages/Workers SUCCESS. Upp till tre allowlistade händelser sparas; tidigare rapporter oförändrade. SAMPLE har separat rapportnamn/sessionnyckel.
- Nytt stickprov 2026-09-16: HTTP200, 20 events, 10809 bytes, EVENT_LIMIT, complete=false, pitVerified=false. Rapport: linasopti/runtime-reports/GEN17_SSE_SAMPLE_20260916_2026-11-02T02-07-06-602Z_af7522b71714.json, blob 93cc3e030427f2758cddf4f107a0f7380bd9c246, återläst.
- Samtliga tre sparade JOF-exempel är update, at 2026-09-16T00:01:26Z med olika delsekunder och olika event_id/ca.id. Ex-/record-/payable-datum och rate matchar 3/3 mot fondens pressmeddelande 2026-09-10 16:30 ET: okt15/okt15/okt30, nov16/nov16/nov30, dec15/dec15/dec30, alla 0.0956 USD. process_date inte separat issuer-verifierat.
- Primärkälla: https://www.globenewswire.com/news-release/2026/09/10/3360001/0/en/japan-smaller-capitalization-fund-inc-announces-monthly-distributions-for-october-november-and-december-2026-under-its-level-distribution-plan.html
- Alpaca schema: https://docs.alpaca.markets/us/reference/subscribetocorporateactionseventssse : at = streaming service emission time. event_id unikt per emission, nytt vid update/delete; ca.id samma bolagshändelse. Detta är INTE bolagets publiceringstid eller bevis på första Alpaca-tillgänglighet. Tre update-emissioner efter tidigare issuer-release visar att en update-tid inte kan ersätta ursprunglig publiceringstid.
- Nästa: avgränsad revisionskedja insert/update/delete per ca.id, event_id-dedup, emission-time cutoff samt retention/täckning innan PIT-gate. Gör inte om avslutade prover. 2020–2024-täckning fortfarande obevisad. Gen17 DRAFT_ONLY/PIT_UNVERIFIED; Handel/Forward OFF; Gen8–16 frysta; main orörd.


## Operativ checkpoint 2026-11-02 – SSE retention och revisionskedja (dokumentationsgranskning)
- Officiell US SSE-reference https://docs.alpaca.markets/us/reference/subscribetocorporateactionseventssse anger historisk replay via since/since_id/Last-Event-Id, inklusiv återleverans för ID-cursor, och filtrering på type och region. Inget dokumenterat filter per ca.id. Ingen uttrycklig garanterad retention eller komplett 2020–2024-täckning verifierad.
- V050 SAMPLE-rapport återläst: 3 separata JOF ca.id, samtliga update, 20 events EVENT_LIMIT och complete=false. Inga ursprungliga inserts eller kompletta revisionskedjor observerade. 2020-08-31 nollhändelsesvar bevisar inte frånvaro av historik.
- Metod: för ett känt ca.id, replay inom snävt emissionsfönster, samla alla meddelanden och filtrera lokalt per ca.id; event_id dedupliceras; sortera deterministiskt efter emissionsordning; insert skapar, update ersätter, delete inaktiverar. Cutoff får endast använda observerade emissioner senast vid cutoff. Saknad insert, trunkering, tidslucka eller oklara retentiongränser => PIT_UNVERIFIED. Ingen REST-current snapshot får bakdateras.
- Nästa steg: inspektera befintlig SSE-diagnostikkod och begränsningar innan eventuellt nytt avgränsat providerprov. För att kunna intyga komplett kedja måste verktyget skilja EOF från EVENT_LIMIT/TIME_LIMIT och redovisa täckning och matchade ca.id. Nuvarande 20-event-cap kan inte i sig bevisa komplett kedja. Inget nytt provideranrop eller deploy genomfört i denna checkpoint.
- Miljö: linas-opti-api är användarens TESTMILJÖ. Ingen extra staging. Gen17 DRAFT_ONLY/PIT_UNVERIFIED, trade/forward OFF, Gen8–16 frysta; endast ccc-demo-public-test.


## Operativ checkpoint 2026-11-02 – offline SSE revisionskedja, CI verifierad

- Endast gren `ccc-demo-public-test`. Runtime-release V0.4.50; ingen ändring av handelsmotor eller Forward.
- Fristående offline-moduler `ci-corporate-actions/revision_lineage.mjs` och `ci-corporate-actions/lineage_sse_reader.mjs` med syntetiska testfiler. Ingen provideranslutning, inga hemligheter, ingen Worker-route.
- Nanosekundsprecision i emissionscutoff, deduplicering per `event_id`, fail-closed vid lika tidsstämplar/konflikter, saknad insert, trasig JSON, trunkerad eller obekräftad ström, max 20 events/65536 bytes.
- GitHub Actions `Lina Gen17 SSE Candidate Tests` run 41380123598 på commit `033f1c0db741e8911841f8b2d59181d8068061ea`: **29/29 PASS**, syntax PASS, befintliga SSE-tester PASS, Wrangler dry-run PASS. Release Integrity SUCCESS. Kontrollera alltid ny CI om senare ändringar görs.
- KVARVARANDE BLOCKERARE: de tre tidigare JOF-samplen är `update`-händelser från 2026-09-16. Ursprungs-`insert`, full mutationskedja för samma `ca.id`, historisk SSE-retention och fullständig tidsmässig täckning är inte bevisade. 2020-08-31 och 2026-09-15/16 redan provade: upprepa inte dessa provideranrop. `at` är emissionsögonblick, inte issuer-annonsering eller garanterad första tillgänglighet. Inga PIT- eller backtestanspråk.
- Gen17 fortsatt `DRAFT_ONLY / PIT_UNVERIFIED`, handel och Forward AV. Nästa steg är att utreda bevis för originalpost/revisionskedja utan att upprepa redan avslutade tester.
