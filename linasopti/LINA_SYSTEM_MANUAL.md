# LINA — SYSTEMMANUAL

Dokumentstatus: auktoritativ operativ manual  
Projekt: LinaSopti / Lina Clean Core  
Repo: `container13/Container13-vintage`  
Branch: `ccc-demo-public-test`  
Projektrot: `linasopti/`

> Den här manualen beskriver **hur Lina ska förstås och arbetas med**. Aktuell release ska alltid läsas från `version.js`; historiska versionsnummer i dokumentation är inte runtime-sanning.

## 1. Sanningsordning

Vid konflikt gäller följande ordning:

1. Faktisk live-runtime + verifierad release/evidence.
2. `version.js` för aktuell release.
3. `LINA_MASTER_RULES.md` för permanenta regler.
4. `LINA_RELEASE_CHECKLIST.md` och exekverbara release-gates.
5. Låst runnerspec/evidence för respektive generation.
6. `LINA_HANDOFF_CURRENT.md` som arbetslogg/handoff.
7. README/arkitektur/migrationsdokument som bakgrund.
8. `history/legacy/` är historik och får aldrig användas som aktuell instruktion utan verifierad jämförelse.

Filnamn som CURRENT, PREVIOUS, PENDING, LIVE eller PRODUCTION är inte bevis på faktisk drift.

## 2. Startprocedur före varje ändring

Läs MASTER RULES och relevant del av RELEASE CHECKLIST. Läs därefter faktisk berörd kod. Kontrollera repo, branch, sökväg och aktuell `version.js`. Spåra runtime → source → build/config → deploy automation → live target innan första skrivning.

Om något fungerade tidigare: jämför Git-historik före ny plattformsspecialkod. Om något tidigare var automatiserat men nu verkar manuellt: spåra befintlig automation innan en ny väg byggs.

Permanent arbetsprincip: **FIX → ROOT CAUSE → GENERAL LESSON → PERMANENT RULE/CHECK → VERIFY**.

## 3. Versionsdisciplin

Varje ändring i Lina kräver nytt versionsnummer: kod, CSS/HTML, config, dokumentation, diagnostik, cache/asset-revision eller deploy-touch. Ingen hotfix under redan använd version.

`version.js` är Single Version Source. Aktiva cachetokens och release-gate måste matcha. Historiska forskningsversioner får inte globalersättas. Gen16:s historiska research-start är exempelvis bunden till V0.3.95 och ska förbli så.

Gör aldrig blind global replacement av versionssträngar i storage/evidence/schema-identiteter. Persistenta identiteter ändras bara genom avsiktlig migrering.

## 4. Releasekedjan

En GitHub-write är inte en verifierad release. Minimikrav:

GitHub write → repo readback → exakt slutcommit → build/deploy → faktisk laddad release → bootstrap/auktoritativ state → UI → avsedd effekt → permanent state/evidence.

Grön GitHub Pages-run bevisar Pages-deploy, men inte att en viss iPhone laddat rätt release eller att en efterföljande Worker/GitHub-operation lyckats.

Vid fastnad Pages-deploy kan en minimal deploy-touch användas om det behövs, men även den måste få nytt versionsnummer.

## 5. GitHub och filarbete

Färdiga ändrade projektfiler får överföras automatiskt till rätt repo/branch. Endast ändrade filer vid koduppdateringar. Ingen force-push. Läs tillbaka efter skrivning och verifiera innehållet innan det kallas klart.

Fryst immutable evidence får aldrig skrivas över. Hemligheter/inloggningsuppgifter får aldrig läggas i repo.

## 6. Frontend / Clean Core

Grundprincip: en boot, en router, central state och deterministisk scriptladdning. Ny login öppnar Dashboard; gammal route/hash ska inte styra första vyn.

Aktuell mänsklig åtgärd ska ligga högst. Varje state-ändrande klick ska ge omedelbar synlig feedback. Fel får inte vara tysta. En knapp ska göra exakt vad texten lovar. Ett klick = ett resultat.

Aktuell/högsta generation visas först. UI-ordning får aldrig mutera forskningsstate.

## 7. iPhone/login — verifierad lösning

Login ska vara stabil från första paint. Mobil login är toppförankrad. V0.4.13 verifierades på riktig iPhone: Safari hade tidigare flyttat dokumentet till `scrollY 92`, `cardTop -72` redan före första input-eventet. Fixen neutraliserar dokumentets fokus-scroll och behåller login vid `scrollY 0`, `cardTop 20`.

Använd inte `visualViewport.height` som styrsignal på denna klient; den har gett ogiltigt sentinelvärde. Återinför inte focus-time `position:fixed`; det verifierades misslyckat. Gissa inte ny viewportfix om beteendet återkommer — mät verklig klientgeometri först.

Login får visa deploystatus. Recovery/debug/intern teknisk status ska inte ligga där permanent.

## 8. Worker — verklig källkedja

Anta aldrig Worker-källa från filnamn. Verifiera `worker/wrangler.jsonc`. Den verifierade deploykällan har varit `worker/WORKER_PENDING_RUNTIME_REPORT.js`; kontrollera alltid config före ny Workerändring.

`WORKER_CURRENT.js` / `PREVIOUS` är arkiv/rollback-begrepp och är inte automatiskt deploykälla. Workflow `.github/workflows/lina-worker-promote.yml` roterar PENDING/CURRENT/PREVIOUS men ska inte förväxlas med själva Cloudflare-deployen.

Återanvänd befintlig Worker-funktion före ny endpoint. Permanent diagnostik använder i första hand befintlig `/runtime-report` när kontraktet passar.

## 9. State, sync och recovery

GitHub är permanent källa för kritiska beslut/lås/frysningar. localStorage/sessionStorage är runtime/checkpoint-lager, inte ensam permanent sanning.

Recovery får endast återläsa exakt sparad/fryst evidence. Ingen research får rekonstrueras eller köras om. Immutable recovery får inte gissa datum/path/commit; använd stabil identitet och auktoritativ discovery/receipt. Noll eller flera matchningar ska stoppa.

Bootstrap/sync får aldrig backa irreversibelt research-state. Konflikter ska följa dokumenterad monoton merge.

## 10. Evidence och receipts

Kritisk skrivning är inte klar vid HTTP 200 eller commit-id. Auktoritativ write receipt ska verifieras av samma serverkomponent mot backend och innehålla exakt path/blob/content SHA-256 enligt kontrakt.

Befintlig evidence-kedja: stage → approve/freeze → Worker write → GitHub readback → `LINA-GITHUB-COMMIT-RECEIPT-1`.

Runtime-/diagnostikrapport: använd `/runtime-report` när det passar. Den skriver till `linasopti/runtime-reports/` och verifierar GitHub blob + SHA-256 receipt.

Bygg inte parallell synk/evidence-kedja innan befintliga endpoints/moduler inventerats.

## 11. Forskning — absoluta gränser

Observerat/sparat resultat får aldrig köras om för att förbättra utfallet. Spara varje avslutat steg före nästa. Resume ska fortsätta från nästa osparade steg.

Plan/runnerspec/gates låses före resultat. Ingen efterhandsjustering eller rescue. Negativa resultat bevaras. Ny generation är nytt preregistrerat experiment.

Handel och Forward är separata mänskliga gates och ska förbli AV om de inte uttryckligen godkänts.

## 12. Frysta generationer

Gen8 är permanent färdig/fryst och får aldrig köras om. Gen9–Gen16 är avslutade/frysta enligt respektive evidence/state. Gen12 är permanent closed/no-rerun. Gen13–Gen16 slutade NO_CANDIDATE. Gen16 är permanent NO_CANDIDATE; dess förbättrade PF/P&L/DD ändrar inte att koncentrations- och fold-PF-gates föll.

För exakta generationstal, SHA, folds och gates: använd respektive `LINA_GEN*_RUNNERSPEC.json` + immutable evidence. Kopiera aldrig historiska resultat in i en ny generation som om de vore nya.

## 13. Research-start / executable release gate

Dokument/checklistor ensamma får inte öppna forskning. Research-start kräver aktuell executable Release Gate PASS receipt. State/schema/bootstrap/merge/resume-ändringar kräver state compatibility gate.

Syntetiska fixtures får inte vara release-gate förrän deras premisser verifierats numeriskt/semantiskt. Browser/produktion ska inte vara första plats som avslöjar deterministiska fixturefel.

## 14. Diagnostik och felsökning

När en fix inte ändrar beteendet: stoppa gissningar och instrumentera variabler som skiljer hypoteserna. Tillfällig diagnostik ska vara read-only där möjligt och tas bort efter verifierad fix.

När användaren säger att något fungerade tidigare samma arbetsperiod: Git-history diff först. Vid rollback jämför hela komponentytan — HTML, CSS, JS och relevanta assets/config.

Spara diagnostik automatiskt via verifierad befintlig permanent kedja när det är rimligt, så användaren inte behöver kopiera tekniska mätningar manuellt.

## 15. Deploystatus på login

Loginens deploystatus och Pages-deploy är olika bevisnivåer. Direkt GitHub API-anrop från Safari kan fallera trots lyckad Pages-deploy. Ett sådant klientfel får inte beskrivas som misslyckad deploy utan server-/Actions-verifiering.

På sikt bör status hämtas via en verifierad server/Worker-väg om direkt klient-GitHub visar sig opålitlig.

## 16. Dokumentkarta

- `LINA_SYSTEM_MANUAL.md`: denna operativa manual.
- `LINA_MASTER_RULES.md`: permanenta normativa regler och incidentlärdomar.
- `LINA_RELEASE_CHECKLIST.md`: releasekontroller; flytta maskintestbara regler till executable gate.
- `version.js`: aktuell runtimeversion.
- `LINA_HANDOFF_CURRENT.md`: arbetslogg/överlämning; äldre sektioner är historik även om de en gång hette aktuell.
- `LINA_CLEAN_CORE_ARCHITECTURE.md`: arkitekturbakgrund; versionsrubrik är historisk.
- `README.md`: projektöversikt och filöverföringsbeslut.
- `README_WORKER_DEPLOY.md`: Worker-historik/deploybakgrund; verifiera alltid faktisk wrangler/config före användning.
- `LINA_MIGRATION_CHECKLIST.md`: historisk Clean Core-migration; inte aktuell runtime-status.
- `LINA_GEN*_RUNNERSPEC.json`: preregistrerade/låsta generationskontrakt.
- `evidence/`: immutable forskningsbevis.
- `runtime-reports/`: verifierade runtime-/diagnostikrapporter.
- `history/legacy/`: arkiv, aldrig aktuell sanning utan explicit verifiering.

## 17. Standardarbetsgång för nästa ChatGPT-session

1. Läs denna manual.
2. Läs MASTER RULES.
3. Läs aktuell relevant handoff-del och RELEASE CHECKLIST.
4. Läs `version.js`.
5. Inspektera faktisk berörd kod/config.
6. Inventera befintlig automation/endpoint innan ny mekanism byggs.
7. Gör minsta ändring som löser verifierad rotorsak.
8. Ny version för varje ändring.
9. GitHub-write och exakt readback.
10. Verifiera slutcommit/deploy/live runtime.
11. Verifiera avsedd effekt på verklig klient när det krävs.
12. Verifiera permanent state/evidence/receipt.
13. Spara generell lärdom som regel och maskintest när möjligt.
14. Först därefter nästa beroende steg.

## 18. Det som inte får antas

- Att grön deploy betyder fungerande klient.
- Att GitHub-write betyder live.
- Att filnamnet CURRENT betyder deploykälla.
- Att 409 betyder success utan exakt immutable-match.
- Att localStorage är permanent bevis.
- Att en README:s gamla versionsrubrik är aktuell.
- Att tidigare automatisering är borta bara för att den inte syns.
- Att en browserfix är korrekt utan verklig mätning.
- Att en ny endpoint behövs innan befintliga vägar inventerats.
- Att negativ forskning får räddas med ny parameter efter observation.

---

**Underhållsregel:** Manualen ska uppdateras när systemarkitektur eller permanent arbetsprocess ändras. Detaljerad incidenthistorik hör i MASTER RULES/handoff; manualen ska hållas sammanhängande och användbar från noll.
