# LINA RELEASE CHECKLIST

Körs före varje Lina-ZIP.

- [ ] `LINA_MASTER_RULES.md` läst.
- [ ] Senaste handoff läst.
- [ ] Faktisk berörd baskod inspekterad; inga antaganden om filer/version.
- [ ] Ändringen automatiserar säkra delsteg fram till nästa verkliga mänskliga beslut.
- [ ] Varje avslutat forskningssteg sparas före continuation; återupptagning kör inte om sparade resultat.
- [ ] Handel AV och relevanta data-/Forward-spärrar kvar.
- [ ] Låsta plan/runnerspec/gates/hashar oförändrade om användaren inte uttryckligen beslutat annat.
- [ ] Inga observerade resultat används för efterhandsjustering/rerun/rescue.
- [ ] Negativa resultat och all variant-evidens bevaras.
- [ ] Global/modulspecifik export fungerar eller lämnas oförsämrad.
- [ ] GitHub/evidensflöde lämnas intakt eller verifieras efter ändring.
- [ ] Knappar efter en automatiserad kedja verifieras mot exakt det state som kedjan producerar; inga gamla completion-flaggor får blockera nästa steg.
- [ ] JavaScript syntaxkontrollerad.
- [ ] CHANGED FILES ONLY innehåller endast avsedda ändringar + regel/handoff-filer.
- [ ] FLAT COMPLETE skapad som säkerhetskopia.
- [ ] Ny handoff dokumenterar ändring, verifieringar och eventuella avvikelser från MASTER RULES.

- [ ] Irreversibelt research-state testat mot synkrace: sync får inte backa familyResults/frysning; merge ska vara monoton.
- [ ] Recovery testad utan marknadsdata-/researchanrop: endast exakt sparad/fryst evidens får återläsas.
- [ ] Bootstrap får aldrig applicera remote state före lyckad monoton merge+PUT när lokalt irreversibelt research-state finns.
- [ ] Vid synkfel ska diagnostik innehålla endpoint/metod, HTTP-status, relevant evidensnamn/payloadstorlek och sanerat API-svar; autentiseringskod får aldrig loggas/exporteras.

- [ ] Immutable evidence-idempotens: exakt serverbekräftad `409 Evidencefilen finns redan – original skrivs inte över` får avsluta pending sync utan overwrite; andra 409-fel får inte sväljas.

## V0.2.70 kandidatgrind
- Kandidatknapp får endast visas efter Gen4 summary FROZEN · GITHUB ✓.
- Urval måste vara deterministiskt från redan observerad/fryst evidens; ingen research/rerun.
- Kandidat fryses lokalt före async GitHub-synk; Forward och Handel förblir AV.

## Generation Engine gate
- [ ] Frysta generationer exponeras read-only och kan inte startas om från Generation Engine.
- [ ] Ny generation är `NOT_DEFINED` tills en ny plan uttryckligen definierats; ingen automatisk parameter-/resultatkopiering.
- [ ] Ingen Forward-anchor skapas före kandidatfrysning och ingen anchor backdateras.
- [ ] Automatisering stannar vid genuin mänsklig beslutspunkt.

## Nästa-generations-underlag
- [ ] Underlaget bygger endast på fryst observerad evidens och redan dokumenterade metodpunkter.
- [ ] Underlag/planförslag märks EJ LÅST och kan inte starta research.
- [ ] Fryst föregående generation muteras eller körs inte om.
- [ ] Behållna principer och metodkorrigeringar visas separat före planlås.

### Generation Engine / Gen5 från V0.2.73
- [ ] Gen5-planhash är `d501a5e1` före/efter planlås.
- [ ] Planlås kan inte starta research eller Forward.
- [ ] Handel AV och forskningsgräns 2024-12-31 bevaras.
- [ ] Nästa runnerspec måste verifiera train→OOS, gemensam portfölj, parameteranvändning och hashad rankingformel innan research öppnas.

### Gen5 autonom kedja från V0.2.74
- [ ] Runnerspechash `db1c4d7f` och planhash `d501a5e1` verifierade före research.
- [ ] TRAIN väljer parametrar före varje OOS-fold; OOS används inte för parameterurval.
- [ ] Kombinerad ensemble går genom en gemensam portföljsimulering/equity curve.
- [ ] Ingen deklarerad `riskSlots` eller annan oanvänd grid-parameter finns kvar.
- [ ] Varje familjs kompletta train/fold-evidens sparas före nästa familj.
- [ ] Kedjan skapar Gen6-underlag men startar inte Gen6 eller Forward.

- [ ] Data-preflight verifierar hela låsta universumet och alla forskningsperioder innan research-state öppnas.

### Gen5 data source probe från V0.2.76
- [ ] Probe startar ingen research och muterar inga familyResults/runs.
- [ ] Probe provar exakt Gen4-kompatibla Worker-endpoints och exporterar sanerad HTTP/formatdiagnostik.
- [ ] RUNNING används inte för ett stopp före research.
- [ ] Researchknappen är dold tills datakällediagnos har minst en normaliserbar fungerande endpoint; full data-preflight krävs fortfarande före research.

- [ ] For market-data response changes, verify metadata arrays cannot be selected instead of actual bar rows.


### V0.2.79
- [ ] Generation Engine ligger först under Forskning; äldre vyer finns kvar.
- [ ] Gen5-synk gör ingen research/rerun och reconcilear family/summary via exakt evidensnamn.
- [ ] Robotmognadsmodell `6e8908ca` summerar exakt 100 och poängen härleds endast från verifierbart state.
- [ ] Header, Generation Engine-export och Arkiv använder samma beräknade mognadspoäng.


### V0.2.80
- [x] Gen5 sync-knapp ger omedelbar progress och explicit KLART/STOPPAD.
- [x] Reconcile använder frysta evidensposter och ändrar inte researchresultat.
- [x] Gen5 rerun förbjuden; Gen6/Forward stängda; Handel AV.
- [x] JS syntaxkontrollerad och ZIP-integritet verifierad.

## Gen6 proposal barrier
- [ ] If Gen6 proposal is not explicitly locked, verify there is no Gen6 research runner/action.
- [ ] Verify Gen5 remains immutable and no Gen5 rerun path is introduced.
- [ ] Verify Handel AV and Forward closed.

- V0.2.82: verifiera att Gen6-planlås endast fryser planhash 206c11d7 + evidens och inte startar runnerspec/research/Forward.

### V0.2.83 – Single Version Source
- [x] Synlig aktuell release hämtas från `window.LinaVersion.release` i `version.js`; Generation Engine har ingen egen aktuell versionskonstant.
- [x] `app.js` hämtar appversion från samma källa.
- [x] `index.html` använder `data-lina-version` för synliga versionsetiketter.
- [x] Alla cache-busters i `index.html` matchar aktuell release före ZIP-bygge.
- [x] Releasekontroll stoppar bygg om aktuell UI-version, Generation Engine-version och cache-busters divergerar.
- [x] Gen6 planhash `206c11d7` och låsfunktion är oförändrade; ingen research/Forward startas.

## Version-source gate (V0.2.84+)
Before packaging, fail the release if:
1. `version.js` release/cache do not match the intended release.
2. any `[data-lina-version]` element contains a hardcoded current version instead of a neutral placeholder.
3. any active asset `?v=` token in `index.html` differs from `version.js` cache value.
4. `app.js` or `generation-engine.js` contains a numeric current-version fallback.
Historical/frozen research version strings are excluded from this current-release gate.

### V0.2.85 — Gen6 runnerspec/engine gate
- [x] Gen6 planhash `206c11d7` oförändrad.
- [x] Runnerspec canonical-hashad och exakt rankingformel inkluderad.
- [x] Riskregim/volatilitetsskalning definierad som pre-execution sizing/exposure.
- [x] Låsta gates och walk-forward 2020→2024 verifierade.
- [x] Ingen Gen6 research-runner exponeras; researchOpened=false och Forward=false.
- [x] Handel AV.


### V0.2.86 — Gen6 autonom research
- [x] Explicit start krävs; full 16×2020–2024 data-preflight före researchOpened.
- [x] Planhash `206c11d7` och runnerspechash `768e8d3e` verifieras före run.
- [x] Fyra familjer körs sekventiellt med TRAIN-val före OOS; komplett fold/variant-evidens sparas före continuation.
- [x] Riskregim/volatilitet påverkar sizing/exponering före exekvering; deklarerade grid-parametrar konsumeras.
- [x] Summary/kandidat/Gen7-underlag automatiseras efter 4/4; ingen Gen7-research eller Forward.
- [x] Handel AV och Robotmognadsmodell oförändrad.

### V0.2.87 — Gen6 evidence recovery/sync
- [x] Gen6 research/candidate state is read-only; no market-data or research call is introduced by recovery.
- [x] Pending Gen6 family/summary/candidate evidence is synced through the existing immutable evidence queue.
- [x] Gen6 evidence queue items reconcile monotonically back into exact family/summary/candidate state by immutable evidence filename.
- [x] Gen6 sync success requires all 4 family evidences + summary + candidate (when locked) to be `FROZEN · GITHUB ✓`.
- [x] Existing immutable 409 semantics remain unchanged; no overwrite.
- [x] Gen7 and Forward remain closed; Handel AV.
- [x] Completed Gen6 UI no longer says that research has not started.
- [x] Current runtime release comes from `version.js`; active cache tokens match `0.2.87`.

### V0.2.88 — Gen7 Plan Proposal
- [x] Gen6 är read-only; ingen Gen6 rerun/recovery ändrad.
- [x] Gen7-förslag bygger på fryst `gen7Basis`; ingen ny marknadsdata används.
- [x] Gen7-planhash `6876470e`; plan EJ LÅST.
- [x] Ingen Gen7 runnerspec/research/Forward exponeras.
- [x] Historisk research boundary 2024-12-31 och befintliga gates/folds bevaras.
- [x] Handel AV och Robotmognadsmodell oförändrad.


### V0.2.89 — aktuell generation överst
- [x] Generation Engine-generationer renderas i fallande generationsordning; aktuell högsta generation överst.
- [x] Regeln är generell via `data-generation`, inte hårdkodad som en engångsflytt för Gen7.
- [x] Gen7 planförslag är fortfarande EJ LÅST; ingen runnerspec/research/Forward har lagts till.
- [x] Gen6/Gen5 research-state och evidenslogik är oförändrade.
- [x] Handel AV och Robotmognadsmodell `6e8908ca` oförändrade.

## V0.2.90 Auto Pipeline checks
- [ ] Aktuell generation visas överst.
- [ ] Gen7 planhash är exakt 6876470e före planlås.
- [ ] Gen7 runnerspec + stabilitetsgates hash-låses före researchOpened.
- [ ] Data-preflight passerar före första observerade resultat.
- [ ] Evidens sparas före continuation och rerun av sparat/fryst resultat blockeras.
- [ ] Gen8/Forward/Handel öppnas inte av pipeline.
- [ ] Alla aktiva cache tokens matchar version.js.


### V0.2.91 — Integrity & Automation Cleanup
- [x] Global status-export använder `window.LinaVersion` och aktuell regelbaserad Robotmognad, inte V0.2.70/48 fallback.
- [x] Generation Engine full snapshot + integrity ingår i global status-export; full syncdiagnostik finns separat.
- [x] Evidence `syncApproved()` har single-flight-lås så parallella anrop delar samma sekventiella kö.
- [x] Gen7 reconcile stöds för familjer, summary och kandidat; syncStatus visar Gen7.
- [x] Endast exakt immutable-exists 409 accepteras; commit-race 409 förblir fel.
- [x] GitHub autosync pausas under Gen5/Gen6/Gen7 automation RUNNING.
- [x] Ingen Gen7 research/rerun eller Gen8/Forward/Handel öppnas av cleanup.
- [x] Aktiva cache tokens matchar version.js 0.2.91 och JS syntaxkontrolleras före ZIP.

### V0.2.92 — Gen7 Evidence Recovery + Integrity Finalize
- [x] Gen7 research körs aldrig om; recovery använder endast fryst familyResults + original run-timestamp.
- [x] Åter-materialiserad Dynamisk/Stabletsensemble verifieras mot förhandslåst SHA-256 före synk.
- [x] Gen7-integritet kräver exakt evidenspost per familj + summary, inte bara state-status/kötotal.
- [x] Evidence recovery är single-flight/pausar app-autosynk medan den kör.
- [x] Gen8-planförslag visas först efter grön Gen7-integritet; ingen Gen8 runnerspec/research/Forward startas.
- [x] Startup-progress visar inte samma statusrad dubbelt.
- [x] Kända Gen4/diagnostik-konflikter klassas som deterministiskt lösta i recoveryrapporten.
- [x] Handel AV, Robotmognadsmodell `6e8908ca` och Gen7 fryst state oförändrade.


### V0.2.93 — Gen8 komplett Auto Pipeline
- [x] Befintlig V0.2.92 FLAT COMPLETE använd som faktisk bas; MASTER RULES + V0.2.92 handoff lästa.
- [x] Gen8 planhash `be68328d` bevarad från godkänt planförslag.
- [x] Gen8 runnerspec definierar stabilitetsmedveten TRAIN-selektion och låsta OOS-stabilitetsgates före research.
- [x] Ett Auto Pipeline-initiativ kedjar planlås → runnerspec/hash → verify → preflight → fyra familjer → evidens → summary/kandidat → Gen9-underlag → GitHub-verifiering.
- [x] Gen7 förblir immutable; ingen Gen7 rerun.
- [x] Forward och Handel förblir AV.
- [x] JavaScript syntaxkontrollerad; aktiva cache tokens verifieras mot `version.js` före ZIP.

## Permanent incident-gate från V0.2.98
- [ ] Läs senaste incidentlärdom i `LINA_MASTER_RULES.md` före ändring av state/recovery/synk.
- [ ] Inventera alla obligatoriska localStorage/state-nycklar och verifiera att de faktiskt kommer med i `collect()`; inga tysta storleks-skippar.
- [ ] Verifiera faktisk payloadstorlek mot per-entry- och totalpaketgräns före ZIP.
- [ ] Testa Generation Engine recovery med: saknad state, trasig/gammal state, korrekt fryst state och nyare state.
- [ ] Verifiera monotonicitet: fryst generation kan inte återgå till PLAN_PROPOSAL eller bli körbar.
- [ ] Verifiera att aktuell generation, nästa beslut, statusrad och tillgängliga knappar beskriver samma state.
- [ ] Verifiera Robotmognad mot låst modellhash `6e8908ca` och bevarade verifierade kriterier; recovery får inte sänka redan intjänad processmognad.
- [ ] Kör end-to-end state-test utöver JS-syntax och ZIP-integritet.
- [ ] Vid andra blockerfixen i samma incident: STOPP tills rotorsak är dokumenterad och reproducerad.


## App-state kontrakt (obligatoriskt från V0.2.99)
- [ ] Lista alla nycklar som frontend `github-sync.js` kan samla in.
- [ ] Verifiera att samma nycklar accepteras av Worker `validateAppState()`; särskilt `lina_generation_engine_v0273`.
- [ ] Verifiera att Worker inte accepterar andra icke-`lina_clean_*`-nycklar än explicit allowlist.
- [ ] Kontrollera att frontend/Worker har kompatibla MAX_ENTRY/MAX_PACKAGE-gränser.
- [ ] Kör kontraktstest: Generation Engine-state accepteras; slumpmässig otillåten nyckel nekas.


## Gen8 state/Worker incident — obligatorisk release-gate efter V0.2.99
- [ ] Spåra varje ny permanent state-nyckel genom hela roundtrip-kontraktet: save → collect/sync → Worker POST-validering → GitHub → Worker GET/restore-validering → hydrate → localStorage → boot.
- [ ] Sök exakt feltext i faktisk frontend/Worker-källa innan blockerfix byggs.
- [ ] Verifiera `lina_generation_engine_v0273` i både frontendens sync-kontrakt och Worker `validateAppState()`; slumpmässig icke-allowlistad nyckel ska fortfarande nekas.
- [ ] Testa både POST/spara och GET/restore med samma state-paket.
- [ ] Efter restore: verifiera aktuell generation/status, planhash, runnerspec/Engine-status, GitHub/State/Evidence, Robotmognad, Forward och Handel tillsammans.
- [ ] Verifiera att Gen7 förblir immutable/icke-körbar och att äldre remote state inte kan backa nyare irreversibelt state.
- [ ] Kontrollera faktisk deployad Worker-kod; webbpaketets Worker-kopia är inte i sig bevis på vad Cloudflare kör.
- [ ] Inga påståenden om syntax/ZIP/deploy/integritet utan faktisk kontroll.
- [ ] Kod som användaren ska klistra in levereras som hel fil med ett-klick-kopiering, inte som manuell patch.

## V0.3.01 — global skärmbild / bekvämlighet
- [x] Skärmbild är separat UI-funktion och ändrar inte research/state/Forward/Handel.
- [x] Global 📸-knapp ligger i headern och exkluderas själv från den sparade bilden.
- [x] Hela aktuella Lina-vyn renderas till PNG; webbläsarens chrome/flikar/adressfält ingår inte.
- [x] Filnamn innehåller aktuell route, central release och tidsstämpel.
- [x] Lokala bilder bäddas in före rendering; extern resurs får inte tyst göra canvas ogiltig.
- [x] Renderings-/PNG-fel ger explicit Fel-status och inget falskt Sparad-läge.
- [x] Gen8-state, planhash, runnerspec, Engine-state, Gen7-evidens, Forward och Handel ändras inte av funktionen.


## V0.3.04 — Canonical Base / Resume Never Replay
- [x] Faktisk V0.3.01 FLAT COMPLETE återfunnen i Library och materialiserad som byggbas; användaren behövde inte ladda upp den igen.
- [x] `LINA_MASTER_RULES.md` är enda regelkälla; checklist/handoff har separata roller.
- [x] Gen8 continuation anropar inte `prepare()` igen när Engine redan är verifierad.
- [x] Befintligt Gen8-familjeresultat valideras strukturellt och hoppas över utan rerun.
- [x] Ofullständigt checkpointat familjeresultat blockerar continuation i stället för att köras om.
- [x] Global Generation Engine-status-export flyttad till Engine-toppen och gamla nederplaceringen borttagen.
- [x] Handel/Forward-logik ändras inte.
- [x] Cache tokens och central release uppdateras till V0.3.04.
- [ ] Browser end-to-end med användarens verkliga `RESEARCH_RUNNING` state verifieras efter deploy; detta kan inte bevisas enbart av statisk byggkontroll.


## Auto Pipeline runtime-gate från V0.3.04
- [ ] Klick på Auto Pipeline lämnar beständigt `UI_CLICK_RECEIVED`/attempt timestamp före async-arbete.
- [ ] STOPPED sparar exakt `lastError` + `lastUiStep` så fel överlever rerender/reload och finns i Engine-export.
- [ ] Incoming `RESEARCH_RUNNING` med befintlig komplett familj validerar/skips den; test får inte anropa research för den familjen igen.

- [ ] STATE-ROUNDTRIP-01: continuation with an already-observed family plus a newly observed family survives evidence/app-state sync without rerun or missing checkpoint.

## V0.3.05 — Chrome/Windows 📸
- [x] Urklippsbegäran startar under klickgesten; PNG-rendering levereras asynkront.
- [x] Kopiering ger ingen parallell nedladdning; nekad/otillgänglig kopiering ger en PNG-nedladdning.
- [x] Renderingsfel går till Fel och skapar inget falskt lyckat resultat.
- [x] Central release och alla HTML-cachetokens är V0.3.05.
- [ ] Faktiskt Chrome/Windows-klick med urklipp och nekad behörighet verifieras efter driftsättning.

## V0.3.06 — 📸 renderingskorrigering
- [x] Lokala CSS-bakgrundsbilder bäddas in och CSS XML-escapas före SVG-rendering.
- [x] Ett PNG-resultat: kopiera eller ladda ned; renderingsfel visas i klartext.
- [x] Ingen research-/Gen8-/Forward-/Handelslogik ändrad.
- [ ] Faktisk Chrome/Windows-bild och tidsmätning av inloggningsstegen återstår efter driftsättning.

## V0.3.07 — tainted canvas
- [x] SVG foreignObject laddas som data:-URL, inte blob:-URL.
- [x] CSS- och img-resurser är fortsatt inbäddade före rendering.
- [x] JavaScript-syntax och ZIP-struktur kontrollerade.
- [ ] Faktisk Chrome/Windows PNG-export verifieras efter driftsättning.

## V0.3.08 — starttider
- [x] Lösenkod, GET, PUT och evidens får separata tidsvärden i Dashboard.
- [x] Fast 220 ms väntan efter bootstrap borttagen.
- [x] Inget steg i state-återställning eller evidensverifiering hoppas över.
- [ ] Mät verklig Chrome/Windows-start och optimera den uppmätta flaskhalsen.

## V0.3.09 — uppmätt startoptimering
- [x] V0.3.08 faktisk Chrome-mätning: auth 0,1 s / GET 0,7 s / POST 3,4 s / evidence 0,1 s / bootstrap 4,2 s.
- [x] Nio lokala regressionfall: oförändrat app-state, enbart diagnostik, nytt Gen8-resultat, POST-fel, GET-fel, saknat remote-state, ny app-nyckel, identisk evidens och faktisk evidenskorrigering.
- [x] Nyare Gen8-resultat skrivs före apply och bevaras vid skrivfel. Ingen research körs i testen.
- [x] Evidensreconciliation skriver inte om oförändrat forskningsstate.
- [x] Faktisk Chrome-start efter uppgradering: spara state = ingen ändring, bootstrap 1,4 s i användarens bild 2026-09-29 21:23. GET varierade mellan 1,2 s och 6,8 s i två mätningar.

## V0.3.10 — samlade exporter
- [x] Exportpanelen placeras direkt efter Generation Engine-rubriken.
- [x] Engine-status och frysta Gen8-resultat får separata huvudknappar.
- [x] Befintliga exportknappar flyttas, behåller sina handler-ID och avdupliceras.
- [x] Övriga exporter samlas i Fler exporter (stängd från början).
- [x] Gen8-resultatexport spärras om sammanfattningen inte är fryst.
- [x] JavaScript-syntax, HTML-cachetokens, ZIP och manifest kontrollerade.
- [ ] Visuell kontroll av exportpanelen i användarens Chrome efter deploy.

## Dokumentationspaket 2026-09-30 — Gen9 olåst förslag
- [x] MASTER RULES, handoff, faktisk kod och inkommande exporter granskade.
- [x] Berörda filer matchade verifierad lokal V0.3.10 COMPLETE före ändring.
- [x] Forskningsstate, äldre evidens, JavaScript, Handel och Forward oförändrade.
- [x] CHANGED FILES ONLY innehåller fyra dokument; inga körbara ändringar.
- [x] ZIP CRC, exakta ändringar och lokal COMPLETE kontrollerade.
- [ ] Gen9-plan mänskligt godkänd och låst — inte gjort.
- [ ] Gen9-motor implementerad och syntetiska metodtester godkända — inte gjort.
- JavaScript-/browser-/state-tester är inte nya verifieringar i detta dokumentationspaket.

## V0.3.11 — Gen9 metodbygge
- [x] Faktisk V0.3.10-bas och uppdaterade styrdokument användes; äldre generationskod bevarad byte-identiskt.
- [x] Elva syntetiska metodfall; nio startup/evidence-regressionfall godkända.
- [x] Toppnivå-JS syntax, HTML-scriptfiler/cachetokens och ZIP/diff kontrollerade.
- [x] Gen9-förslag i Engine och Fler exporter; ingen kör-/låsknapp.
- [ ] Chrome-visuell kontroll återstår.
- [ ] Produktions-persist/resume/evidens, verifierad verklig data och plan/runnerspeclås återstår före forskning.

## V0.3.12 — Gen9-kedja
- [x] MASTER RULES, handoff och faktisk V0.3.11-bas lästa/använda.
- [x] Separata mänskliga plan/start/frysbeslut. Gen7/8 byte-identiska.
- [x] Syntetiskt syncfel följt av resume utan research-rerun.
- [x] Gen9-monoton merge: äldre remote, kompletterande checkpointrefs och konfliktblockering.
- [x] Saknad checkpoint stoppar; inga nya Worker-nycklar införda.
- [x] 11 metodfall + 9 tidigare regressionfall; JS/ZIP/manifest kontrollerade.
- [ ] Verklig datajustering och kalender verifierade — återstår, datagate blockerar.
- [ ] Verklig browser/Worker/evidence roundtrip — återstår.

## V0.3.13 — datakällediagnostik
- [x] MASTER RULES/handoff och faktisk bas används; inga Gen7/8-/Worker-ändringar.
- [x] Diagnostik fungerar före planlås; skriver endast sessionStorage.
- [x] Fyra schema-/diagnostikfall godkända. Ingen metadataflagga ger automatiskt datagodkännande.
- [x] JS-syntax, HTML-cachetokens, ZIP och manifest kontrollerade.
- [ ] Faktiska API-svar/browser verifieras med rapporten från användarens miljö.

## V0.3.14 — exporter
- [x] Gen9-exporter synliga; äldre Gen8-resultat under Fler exporter.
- [x] Exporthandlers bevarade; ingen forskning/state ändrad.
- [x] Syntax, exportcontainrar och ZIP/manifest kontrollerade.
- [ ] Visuell browserkontroll efter deploy återstår.

## V0.3.15 — texturklipp
- [x] Rapport exakt till både fil/text; fallback vid nekat/saknat urklipp.
- [x] Async urklippsbegäran initierad vid klick; rapportfel skapar inte fil.
- [x] Datumfel i EODHD-rapporten testat; Worker/forskning oförändrade.
- [x] Fem exportfall, fem diagnostikfall, JS-syntax, ZIP och manifest kontrollerade.
- [ ] Verklig browserkopiering och datakällfix återstår.


## V0.3.19 — Gen9 kandidatkopiering
- [x] MASTER RULES, aktuell handoff och berörd kod lästa före implementation.
- [x] Kandidatfil läses read-only och måste matcha låst SHA-256 före kopiering.
- [x] Ingen research, Gen8, Handel, Forward eller Worker ändrad.
- [x] Single Version Source/cachetokens uppdaterade till V0.3.19.
- [x] Ändrade filer publicerade till rätt branch och återläses efter publicering.
- [ ] Faktisk iPhone-kopiering av kandidatfil verifieras av användaren efter deploy.


## V0.3.20 — lokal kandidat ↔ Alpaca-jämförelse
- [x] Exakt numerisk OHLC-jämförelse utan toleransbaserat godkännande.
- [x] Låst kandidat-SHA kontrolleras före jämförelse.
- [x] Rapport begränsar exempel till 100 men behåller kompletta summeringar per symbol/fält.
- [x] Ingen kandidatpatchning, researchstart, Gen8-, Handel-, Forward- eller Worker-ändring.
- [x] Single Version Source/cachetokens V0.3.20.
- [ ] Faktiskt Safari/iPhone-resultat verifieras via kopierad jämförelserapport.


## V0.3.21 — kompakt ChatGPT-rapport
- [x] Full jämförelse bevaras lokalt.
- [x] Chattexport reducerad till hashar, totaler och 16 symbolsummeringar.
- [x] Detaljexempel/datumlistor exkluderas från chattexporten.
- [x] Ingen research-/verifieringsflagga, Gen8, Handel, Forward eller Worker ändrad.
- [ ] Verklig inklistring i ChatGPT på iPhone verifieras av användaren.


## V0.3.21 runtime-report kontroll
- [x] Runtime-report använder separat endpoint och separat GitHub-sökväg; evidence/app-state återanvänds inte som transport.
- [x] Handel/Forward förblir AV och Gen8/Gen9 research-state ändras inte.
- [x] Pending Worker hålls separat från CURRENT.
- [ ] Cloudflare pending Worker deployad.
- [ ] `/health` verifierad med `runtime-report-v0321`.
- [ ] Runtime-report POST verifierad från inloggad Lina.
- [ ] Efter verifiering: gamla CURRENT → PREVIOUS och deployad kod → CURRENT.


## V0.3.22 release check
- [x] Version bumped to V0.3.22.
- [x] index.html cache tokens bumped to 0.3.22.
- [x] Gen9 primary run action added high in Gen section.
- [x] Gen9 primary run chains diagnostic → Alpaca → comparison → GitHub report persistence.
- [x] Manual fallback controls retained.
- [x] MASTER RULE updated for primary Gen run placement.
- [x] Gen8 unchanged/frozen; no rerun.
- [x] Gen9 remains NOT APPROVED; research not started.
- [x] Handel/Forward remain OFF.
- [x] Cloudflare: INGEN ÄNDRING.


## V0.3.23 release check
- [x] Gen9 primary run placed directly after Gen9 heading.
- [x] Version bumped to V0.3.23.
- [x] index.html cache tokens bumped to 0.3.23.
- [x] Permanent every-change version rule added to MASTER RULES.
- [x] Gen8 frozen; Gen9 NOT APPROVED; research not started; Handel/Forward OFF.
- [x] Cloudflare: INGEN ÄNDRING.


## V0.3.24 release check
- [x] Gen9 primary run mount no longer depends on export-primary panel.
- [x] Version/cache bumped to V0.3.24.
- [x] Gen8 frozen; Gen9 NOT APPROVED; research not started; Handel/Forward OFF.
- [x] Cloudflare: INGEN ÄNDRING.


## V0.3.25 release check
- [x] Removed both invalid literal backslash-n sequences from gen9-data-check.js.
- [x] Verified no literal backslash-n remains in gen9-data-check.js.
- [x] Version/cache bumped to V0.3.25.
- [x] Gen9 primary-run placement and safe gates retained.
- [x] Gen8 frozen; Gen9 NOT APPROVED; research not started; Handel/Forward OFF.
- [x] Cloudflare: INGEN ÄNDRING.


## V0.3.26 release check
- [x] Candidate parser matches SOURCE_gen9-data.json object-by-symbol shape.
- [x] Hard 20,128 / 16×1,258 comparison preflight added.
- [x] Runtime-report upload blocked for incomplete comparison.
- [x] Version/cache V0.3.26.
- [x] Gen8 frozen; Gen9 NOT APPROVED; research not started; Handel/Forward OFF.
- [x] Cloudflare: INGEN ÄNDRING.


## V0.3.27 release check
- [x] Gen9 primär statusrad flyttad direkt under `▶ Kör Gen9-kontroll` för omedelbar synlig mobil återkoppling.
- [x] Statusrad använder `aria-live="assertive"`.
- [x] Gen9-körlogik och V0.3.26 data/preflight-gates oförändrade.
- [x] Version/cache V0.3.27; aktiva index-cachetokens har inga 0.3.26-rester.
- [x] `gen9-data-check.js` syntaxkontrollerad efter publicering.
- [x] Gen8 frozen; Gen9 NOT APPROVED; research not started; Handel/Forward OFF.
- [x] Cloudflare: INGEN ÄNDRING.


## V0.3.28 release check
- [x] Full fältnivådiagnostik byggd ovanpå kandidat↔Alpaca-jämförelsen.
- [x] Storleksband och 100 största avvikelser med datum/symbol/fält sparas i fullrapport.
- [x] Kompakt rapport inkluderar storleksband + 20 största avvikelser.
- [x] Ingen toleransbaserad verifiering, kandidatpatchning eller researchstart infördes.
- [x] JavaScript syntaxkontrollerad efter publicering.
- [x] Version/cache V0.3.28; inga aktiva 0.3.27-cachetokens kvar.
- [x] Gen8 frozen; Gen9 NOT APPROVED; Handel/Forward OFF; Cloudflare INGEN ÄNDRING.
\n\n## V0.3.29 release check\n- [x] Separat Alpaca SIP/raw-modul och exakt RAW-jämförelse tillagd.\n- [x] En knapp automatiserar RAW-hämtning → kandidat-SHA/radkontroll → jämförelse → runtime-report upload.\n- [x] Befintlig ALL-jämförelse återställs i sessionen efter RAW-upload.\n- [x] Permanent regel för maximal säker automatisering och status vid primärknapp tillagd.\n- [x] Version/cache V0.3.29.\n- [x] Gen8 fryst; Gen9 EJ GODKÄND; research ej startad; Handel/Forward AV; Worker INGEN ÄNDRING.\n

## V0.3.30 release check
- [x] RAW-upload frikopplad från ALL-upload.
- [x] Eget runtime-report-namn: GEN9_COMPARE_RAW.
- [x] Returvägen måste innehålla /GEN9_COMPARE_RAW_ innan UI visar klart.
- [x] Version/cache V0.3.30.
- [x] Worker INGEN ÄNDRING; Gen8 fryst; Gen9 EJ GODKÄND; research ej startad; Handel/Forward AV.


## V0.3.31 release check
- [x] Bokstavligt \\n i gen9-raw.js borttaget.
- [x] RAW mount använder document och befintlig [data-gen9-build]/[data-gen9-run-status].
- [x] Version/cache V0.3.31.
- [x] Worker INGEN ÄNDRING; Gen8 fryst; Gen9 EJ GODKÄND; research ej startad; Handel/Forward AV.


## V0.3.32 release check
- [x] index.html innehåller inga bokstavliga \\n-sekvenser.
- [x] Version/cache V0.3.32.
- [x] Ingen Gen9/Worker/forskningslogik ändrad.


## V0.3.33 release check
- [x] Alpaca SIP split/dividend/spin-off/all körs separat mot låst kandidat.
- [x] 20 128 rader krävs för kandidat och varje provider-variant.
- [x] Exakt OHLC, ingen tolerans/patchning.
- [x] Separat GitHub-rapport GEN9_ADJUSTMENT_DIAGNOSTIC och returväg verifieras.
- [x] Status visas vid Gen9 primärkontroller.
- [x] Version/cache V0.3.33; Worker INGEN ÄNDRING; Gen8 fryst; Gen9 EJ GODKÄND; research ej startad; Handel/Forward AV.


## Gen9 four-anomaly evidence check — 2026-10-05
- [x] Four >=10 Alpaca/all anomalies checked independently.
- [x] All four support candidate values at displayed historical precision.
- [x] Corporate-action timing checked for NVDA 10:1 and TSLA 5:1 split context.
- [x] Separate immutable evidence file saved; candidate untouched.
- [x] Gen9 still NOT APPROVED; research not started; Handel/Forward OFF.


## V0.3.34 dataset gate check
- [x] Explicit user dataset gate recorded separately.
- [x] Gate bound to locked candidate SHA and 20 128 rows.
- [x] Candidate unchanged; existing evidence preserved.
- [x] Gen9 research not started; plan not locked.
- [x] Gen8 frozen; Handel/Forward OFF; Worker unchanged.
- [x] Version/cache V0.3.34.


## V0.3.35 approved-dataset gate check
- [x] Exact SOURCE file SHA verified before parsing.
- [x] Dataset gate must be PASSED and match locked SHA + 20,128 rows.
- [x] 16 symbols × 1,258 aligned valid OHLC rows required.
- [x] Approved dataset is fetched automatically; no normal manual file import.
- [x] Gen9 spec/method unchanged; plan not locked; research not started.
- [x] Gen8 frozen; Handel/Forward OFF; Worker unchanged.
- [x] Version/cache V0.3.35.


## V0.3.36 Gen9 plan-lock check
- [x] Explicit human plan-lock decision received after contract review.
- [x] Exact SPEC locked: hash 083bcb30; canonical SHA-256 a1362ccffcf76b4d4fb548c1db115d5def35cc3f0a41252f1e43465ef56b135f.
- [x] Immutable plan-lock evidence written to GitHub.
- [x] Approved dataset SHA unchanged.
- [x] Research not started; Gen8 frozen; Handel/Forward OFF; Worker unchanged.
- [x] Version/cache V0.3.36.
