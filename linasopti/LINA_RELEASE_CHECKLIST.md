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
