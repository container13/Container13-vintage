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
