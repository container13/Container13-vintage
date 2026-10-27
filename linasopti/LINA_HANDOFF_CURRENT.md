# Linas Opti — aktuell löpande överlämning

Uppdaterad: 2026-10-23. Senaste kodkandidat: **V0.4.40** (PENDING; ingen device-PASS). Föregående dokumentationsrelease: **V0.4.39**. GitHub Integrity och Pages: **SUCCESS** för commit `4b5a547c8a37f66d278b4e87a5b87cff7a457839`. Live-byteverifiering och iPhone-test: **UNVERIFIED**.

## Start här
Vid ”Fortsätt Linas Opti” eller ”Läs Linas manual”: läs denna fil, `LINA_CURRENT_STATE.json`, `version.js`, `LINA_SYSTEM_MANUAL.md`, `LINA_MASTER_RULES.md` och relevant releasechecklista. Kontrollera verklig branch/head, Actions, publicerad release och Worker innan nästa ingrepp. Begär inte manuell överlämning om repo innehåller den.

## Projekt och absoluta skydd
- Repo: `container13/Container13-vintage`; branch `ccc-demo-public-test`; mapp `linasopti/`; webb https://container13.se/linasopti/.
- Gen8–Gen16 är frysta, Gen16 NO_CANDIDATE. **Ingen research-rerun. Handel och Forward AV.** Worker/evidence ändras inte för denna dokumentationsrelease.
- V0.4.37 var tidigare verifierad säker bas (commit `4ecd25580beeef8bba4a88c1d0f11e0d50a78c6a`). V0.4.38 integritetsreparation fick Actions SUCCESS och Pages SUCCESS på commit `fad61639815ac3cf9835f2c6fa48b5b28ab0f000`; det är inte bevis på separat iPhone-test av .38.

## Pågående arbete
- **V0.4.39:** inför Remembers korta löpande överlämning och gemensamma projektmallskrav. Den tidigare stora handoffen är bevarad i `LINA_HANDOFF_HISTORY_THROUGH_2026-10-23.md`.
- Löpande handoff efter varje meningsfullt steg/test/deploy och före längre/riskfyllda steg; alltid GitHub-skrivning + exakt readback, parallellt med strukturerat state. Inga falska PASS eller onödiga versioner för ren journalföring.
- Mallnyheter att tillämpa: sök `solutions/` och systembibliotek före nyutveckling; en ägare per beteende; stopp efter två misslyckade fixar; tydliga COMMITTED/DEPLOYED/RUNTIME/DEVICE-statusar.
- **Inte genomfört:** separat teknisk inventering av central PWA-updater, versionsfot på alla vyer, mobil zoompolicy och faktisk iPhone-beteende. Inga sådana kodändringar görs i V0.4.39.

## Nästa konkreta steg
1. Kontrollera faktiska live-bytes för `version.js` och `index.html` när nätåtkomst till webbplatsen fungerar; Pages SUCCESS är redan verifierat, men extern livehämtning misslyckades.
2. Riktad teknisk inventering 2026-10-23 (read-only): `index.html` har nätbaserad releasekontroll vid första sidladdning och manuell Uppdatera-knapp; `pageshow` används för deploystatus, inte för en ny releasekontroll. Ingen `visibilitychange`-releasekontroll identifierad. Den befintliga reloaden kontrollerar inte pågående formulär/arbete. `data-lina-version` finns på login och i header, men ingen central sidfot hittades. Viewport anger `initial-scale=1,viewport-fit=cover` utan mallens `maximum-scale=1,user-scalable=no` eller gemensam touchpolicy. Dessa är kodobservationer, inte enhetstest.
3. Nästa kodrelease först efter separat inventering av befintliga uppdaterings-/touchägare och avstämning av skydd för osparat arbete. Gen8–Gen16, Worker, Handel och Forward förblir orörda.

## Löpande rutin
Håll denna fil kort och ersätt nuläget, inte bygg på med arbetslogg. Efter varje meningsfullt steg och före längre steg: spara version/commit, vad som är klart och verifierat, hinder och ett nästa steg. Vid avbrott: IN_PROGRESS/UNVERIFIED. Läs tillbaka exakt GitHub-innehåll före påståendet SPARAD. Historik finns i Git, äldre handoffs i historikfilen. Följ `../project-template/CONTINUITY_PROTOCOL.md`; projektets egna hårdare regler gäller.

## V0.4.40 – pågående kontroll (2026-10-23)
- En enda releasekontroll i index.html på start, pageshow, foreground och återanslutning; tidigare dubblerad tidig kontroll borttagen. Uppskjutning vid fokuserade formulärfält och markerade pågående arbeten. Ingen automatisk omstart om samma release redan provats i sessionen.
- Central körande versionsetikett i sidfot. `version.js`, index cachetokens och release-gate uppdaterade till V0.4.40.
- **Ännu ej verifierat:** slutcommitens Integrity/Pages, faktiska live-bytes, iPhone installerad PWA och formulär-/arbetsflödesregression. Mobilzoomskydd lämnas orört tills separat inventering och device-test; det får inte slentrianmässigt införas.
- **Nästa steg:** kontrollera sista Integrity och Pages; verifiera live och be användaren testa installerad iPhone. Handel/Forward OFF; frysta Gen8–Gen16 orörda.

## V0.4.41 – popupfix (2026-10-27)
- Rotorsak: app.js startar LINA_AUTO_SUPPORT automatiskt; export-status.js visade alltid kvittopopup, med vit bakgrund och otillräcklig textkontrast.
- Ändring: automatiskt stödrapportflöde kör fortsatt men tyst; manuell export behåller kvitto. Popup får mörk bakgrund, tydlig text och radbrytning av långa sökvägar.
- Status: kodskrivning utförd; Integrity/Pages/live/iPhone UNVERIFIED tills separat kontroll. Handel/Forward OFF; fryst forskning orörd.

## V0.4.42 – dashboardordning (2026-10-27)
- Central status-order.js sorterar dashboard: stopp/blockering överst, sedan lägesbild och systemstatus, därefter generationskort i fallande nummerordning.
- Dynamiska kort sorteras via MutationObserver. Handel/Forward och fryst forskning orörda.
- GitHub-kod sparad; Actions/Pages och iPhone för V0.4.42 ännu ej verifierade.

## V0.4.43 – kompakt dashboard (2026-10-27)
- Visar senaste generationen Gen16 direkt; Gen15–Gen11 i expanderbar historik i fallande ordning. Fel/blockeringar och systemstatus förblir överst. Forskning/evidens och Handel/Forward oförändrade.
- V0.4.42 visuell iPhone-PASS för ordning. V0.4.43 GitHub-sparad; Actions/Pages/iPhone ännu ej verifierade.

## V0.4.44 – Gen17 planförslag, ingen research-start (2026-10-27)
- Ny fil `LINA_GEN17_PLAN_PROPOSAL.md` är DRAFT_ONLY. Gen13–Gen16 runnerspecar inventerade; Gen16 immutable summary/receipts kunde inte verifieras via tillgänglig anslutning.
- Gen17 ännu EJ GODKÄND, EJ LÅST, EJ STARTAD. Handel/Forward AV. Nästa steg: auktoritativ summary/fold-evidens och exakt envariabelplan för mänskligt godkännande.
- Version 0.4.44 är dokumentationsrelease; CI/Pages/live ej verifierade.

## 2026-10-27 – evidensåterställning dokumenterad (ingen runtime-ändring)
- Ny operativ runbook: `LINA_RESEARCH_EVIDENCE_RECOVERY.md`. **Läs den före nästa generationsplan**. Dokumenterar read-only `GET /app-state` → `state.entries['lina_generation_engine_v0273'].value` → `.gen16`, samt `GET /evidence-read?name=…`, receipt/SHA-kontroll och faktiskt GitHub-path. Anropa inte `bootstrap/syncAll/put/recoverFinalStateFromImmutableEvidence` för enbart inspektion.
- Dashboard är korrekt plats för Gen16. Tidigare hänvisningar till Forskning/Generation Engine var fel. Föreslå inte ny exportfunktion innan befintliga synk-/evidensvägar prövats.
- Källkod verifierad; Worker-svar, faktisk evidence-path och exakta Gen16-mått fortsatt UNVERIFIED. Gen17 DRAFT_ONLY, Handel/Forward AV, ingen rerun. Nästa steg: read-only Worker GET eller faktiskt GitHub-path och verifiera summary + åtta folds.
