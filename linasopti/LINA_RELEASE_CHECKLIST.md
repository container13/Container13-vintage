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
