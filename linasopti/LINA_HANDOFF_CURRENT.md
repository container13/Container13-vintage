# Linas Opti — aktuell löpande överlämning

Uppdaterad: 2026-10-27. Runtime: **V0.4.45**. GitHub Integrity + Pages PASS för commit `33da9e506b5ca8126923d36a624b3e19a6653d4b`; iPhone-skärmbild visar V0.4.45 Dashboard. Full live-byteverifiering och Worker-receipts **UNVERIFIED**.

## Gen17 - viktig korrigering: breddfilter redan testat
Gen10 låst GRADED använder SMA180-bredd i 16 aktier (0-4/5-7/8-16) för exponering. Gen12 låst BREADTH_50_GATE stoppar alla nya inträden när färre än 8/16 ligger över SMA180. Föreslaget Gen17-breddfilter är alltså INTE en ny idé och får inte köras, tröskeljusteras eller räddas. Tidigare utkast nedan är historik och ersatta av denna STOPP-notering. Fryst Gen16 DATA-evidens är bara manifest, inte OHLC-rådata. Nästa: skrivskyddad inventering av genuint ny regimhypotes och oberoende data; stoppa om ingen försvarbar enskild ändring finns. Gen17 DRAFT_ONLY, Handel/Forward AV.

## Gen17 - inventering av marknadsregimdata
Gen16 motor använder redan individuell SMA180 och breakout på föregående 50 sessioners högsta high; next-open, 12-sessioners exit och 16 OHLC-symboler. Låst spec anger inget separat benchmark-index. Möjligt ENDA nytt inträdesfilter: marknadsbredd = andel av 16 aktier med stängning över SMA180 på föregående dag. Ingen tröskel beslutad, ingen grid eller research. Risker: urvalsbias i fast universum, färre affärer, koncentration kvar. Nästa: read-only kontroll av datakontrakt/tidigare regimmetoder, sedan exakt preregistrerad plan för mänskligt godkännande. Gen17 DRAFT_ONLY, Handel/Forward AV.

## Gen17 - 2022 trade-diagnos och vald inriktning
Användaren föredrar att Lina står utanför ogynnsamma marknadslägen. Gen16 2022 fold-filer lästa read-only: CONTROL 18 affärer (2 vinst, 16 förlust), P/L -5229.75; BREAKOUT 13 (1 vinst, 12 förlust), P/L -4133.07. Alla 31 affärer avslutades TIME_12, men det är inte bevisad förlustorsak. Gen17 nytt DRAFT-förslag: exakt en framåtblicksfri marknadsregimgrind för nya long-inträden; ingen samtidig ändring av exit/sizing. Exakt grind, datakälla, tröskel, kontroll, gates och oberoende validering återstår. Gen17 EJ LÅST/EJ STARTAD. Nästa: read-only inventering av befintliga regimdata och sedan exakt plan för uttryckligt godkännande. Handel/Forward AV.

## Gen17 - granskning 2026-10-27
Gen16 summary verifierad via GitHub. Kontroll PF 1.3318, koncentration 66.29 procent, sämsta fold PF 0.0419. Breakout PF 1.6313, koncentration 100 procent, sämsta fold PF 0.0142. Båda NO_CANDIDATE. Worker-kvitton ej verifierade. Riskfördelning ensam löser inte svaga 2022-resultat med 13 affärer. Gen17 är DRAFT_ONLY. Nästa steg: mänskligt beslut om en förregistrerad hypotes; ingen plan låst, ingen forskning startad.

## Nuläge, beslut och kvarstående uppgifter
- Gen8–16 frysta, Gen16 NO_CANDIDATE, Handel/Forward AV. Gen17 endast DRAFT_ONLY, ingen runnerspec eller forskningsstart.
- Gen16: tio GitHub-JSON-filer (summary, dataset, åtta folds) lästa från `linasopti/evidence/2026-10-06/`; schema/spec/år/variant matchar. Worker-receipt och content SHA-256 ej separat verifierade.
- Gen17: koncentrationsmedveten positionsrisk är en *hypotes*, inte beslutad plan. Kandidatens 2022-fold: 13 affärer, PF 0.014205, koncentration 100 %. Enbart riskfördelning löser inte affärsbrist eller dålig PF. Kräv en enda förregistrerad ändring, framtida oberoende verifiering och användarens uttryckliga godkännande före planlås/start.
- Worker: CURRENT/PENDING identisk GitHub-blob; PREVIOUS separat. Promotion-workflow read-only, ingen automatisk rotation.
- **Öppen dokumentstädning:** denna handoff har äldre kronologiska avsnitt efter aktuellt nuläge. Flytta vid separat kontrollerat steg till historikfil; behåll aktuell handoff kort och säkerställ ingen historik går förlorad.
- **Öppet löfte:** efter varje arbetssteg dokumentera även användarbeslut, föreslagna men ej beslutade förbättringar, assistentlöften, kvarstående småfixar, risker och exakt nästa åtgärd – inte bara tekniska ändringar. Synkronisera `LINA_HANDOFF_CURRENT.md` och `LINA_CURRENT_STATE.json` och läs tillbaka båda.
- **Nästa saksteg:** sök read-only verifierbara Worker-kvitton/hash; granska Gen17-hypotesens vetenskapliga giltighet. Ingen forskning eller handel.

## Start i ny chatt
Vid ”Läs Linas manual” eller ”Fortsätt Linas Opti”: läs `LINA_SYSTEM_MANUAL.md`, `LINA_MASTER_RULES.md`, denna handoff, `LINA_CURRENT_STATE.json`, `version.js` och releasechecklistan. Kontrollera branch/head, Actions och publicerad version. Fortsätt från checkpoint/`currentWork.next` utan att be användaren återberätta.

## Löpande regel
Spara nuläge **före** längre/riskfyllda steg och **efter varje** meningsfullt arbetssteg. Bevara alla ännu ej utförda löften och beslut i handoff/checkpoint. GitHub-write måste följas av readback. Ren operativ journalföring ändrar inte runtime-version. Historik finns i Git och `LINA_HANDOFF_HISTORY_THROUGH_2026-10-23.md`.

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

## 2026-10-27 – Gen16-evidens återfunnen, blockering löst
- Rotorsak: ChatGPT-container saknar DNS även till container13.se; GitHub-kodsökning missade icke-default-branch och vi gissade bort datumkatalogen. GitHub REST rekursivt filträd på `ccc-demo-public-test` visade verkliga filer i `linasopti/evidence/2026-10-06/`.
- Gen16 summary, datasetbevis och alla åtta fold-filer lästa från GitHub. Summary `NO_CANDIDATE`; båda varianter missar koncentration och minFoldPf. Full Worker-receipt/hashkontroll återstår. Se `LINA_RESEARCH_EVIDENCE_RECOVERY.md` för exakt metod och siffror.
- Nästa steg: komplettera evidensvalidering och precisera Gen17-förslaget för uttryckligt godkännande. Ingen rerun; Handel/Forward AV; V0.4.44 oförändrad.

## 2026-10-27 – säkerhetsrevision och V0.4.45 kandidat
- Upptäckt: `workCheckpoint` låg kvar UNVERIFIED för V0.4.43. Historisk enhetsverifiering har inte uppfunnits eller markerats PASS. Ny checkpoint skrevs före ändringarna.
- Worker-arkiv: `WORKER_CURRENT.js` och `WORKER_PENDING_RUNTIME_REPORT.js` hade identisk GitHub-blob SHA `c9e6f8fdd0d94089c79ae63f3d0aed4e55adb4f9`; PREVIOUS hade separat SHA `697733883aa9c5f7f43c904042ca1b63140e3ffd`. Inga Worker-arkiv eller forskningsresultat ändrades.
- Kritisk åtgärd: `.github/workflows/lina-worker-promote.yml` ändrad till read-only audit (contents:read), ingen `cp`, `git push` eller automatisk CURRENT/PREVIOUS-rotation. En framtida promotion kräver separat bevisad deploy/runtime/klientgrind och explicit godkännande; tills dess avsiktligt spärrad.
- Gemensam `project-template/CONTINUITY_PROTOCOL.md` uppdaterad med rotorsakskontroll, rekursiv GitHub-trädsökning, PENDING/CURRENT/PREVIOUS-gate, checkpoint och version/CI-grind.
- V0.4.45 i `version.js` och cachetokens i `index.html`. COMMITTED men CI/Pages/live bytes/iPhone fortfarande UNVERIFIED. Inte godkänd runtime-release. Gen17 DRAFT_ONLY, Gen8–16 frysta, Handel/Forward AV.
- Nästa: kontrollera Actions/Pages, därefter faktisk runtime och iPhone. Om ingen klientverifiering finns: behåll UNVERIFIED, promota inte Worker.

- CI-diagnos: första V0.4.45 Integrity-run FAIL eftersom `release-gate.js` hade `REQUIRED_RELEASE/REQUIRED_CACHE` kvar på V0.4.40. Rotorsak identifierad i Actions-loggen; korrigerad till V0.4.45 i commit `0f76edb124ffee2268667cff89ccd7f5d3d09dcc`. Ny Integrity/Pages efter denna commit måste kontrolleras; ingen PASS antagen.
