# Linas Opti — aktuell löpande överlämning

## 2026-10-27 – Gen16 prisjusteringar, återfunnen tidigare evidens
- Read-only kodkontroll: gen16-generation-engine.js normalize/signalAt/simulate använder r.o/r.h/r.l/r.c från SOURCE_gen9-data.json direkt för SMA180, breakout, next-open, P/L och equity; separata raw-fält används inte. Motorn utför ingen egen korrigering för split/utdelning.
- Tidigare Gen9-revisioner återfunna: NYSE-kalender 2020–2024 verifierad för alla 16 symboler (1258 datum), men källa har fortfarande calendarVerified=false; skilj bevis från flaggstatus. FDX spin-off CRSP-metod styrkt på standardnivå men exakt Yahoo-factor ännu olöst; PYPL faktor ~0.9889711 rekonstruerad med fyra utdelningar efter 2024; AMD/NOW inga kontantutdelningar under målperioden verifierade, inte samtliga corporate actions; GM OHLC-leverantörsavvikelse öppen. Gen9 corporate-action evidence PARTIAL_EXTERNAL_VERIFICATION och tidigare oberoende Alpaca-linje kvalificerad men full jämförelse ej styrkt.
- VIKTIGT: bakåtjustering för bolagshändelser 2025–2026 innebär möjlig point-in-time/look-ahead-metodrisk för simulering 2020–2024. En *konstant* faktor per symbol över hela folden kan lämna relativa signaler invarianta men ändra kontantberäknade notional/qty och utfallsvalidering; varierande faktorer kring händelser är större risk. Kräver eventnivå-granskning, ej automatisk slutsats om fel.
- Bevarad SHA256 PASS gäller byteidentitet, INTE pris-/corporate-action-riktighet, OHLC punkt-i-tid-giltighet eller oberoende leverantörsvalidering. Gen16 förblir NO_CANDIDATE; Gen8–16 immutable, Gen17 DRAFT_ONLY, Handel/Forward OFF, inga simuleringar körda.
- Nästa: skrivskyddad eventnivå jämförelse av bevarad raw/adjusted OHLC kring SHOP/NVDA/TSLA splitar och utdelningsdatum, särskilt rader som ändrar signalkriterier, samt Worker-receipts; dokumentera metodrisk innan eventuell ny forskningsplan.


## Gen16 RAW SHA256 PASS – nytt
Originalfilen SOURCE_gen9-data.json läst via Git blob; 8 446 807 bytes, SHA256 cb84e436a0527b44262949994306dcb85eaf5f10ad88fc7906d443833cc6589c matchar låst Gen16-manifest exakt. Bevis: `LINA_GEN16_SHA256_VERIFICATION_2026-10-27.md`. Datakvalitet/justeringar/bolagshändelser fortsatt UNVERIFIED. Nästa: read-only kontroll av råa/justerade OHLC och Gen16-kod; ingen rerun, Handel/Forward AV.


## Återfunnen chatt och Gen16-dataintegritet – 2026-10-27 (NYTT)
- Originaltext från användaruppladdade `chatt28okt.txt` arkiverad med återläst innehåll: `linasopti/history/LINA_CHAT_28OKT_RECOVERED_VERBATIM.txt`. Denna fil är historiskt källmaterial, inte nytt forskningsbevis.
- Kondenserad historik: `linasopti/LINA_RECOVERED_CHAT_2026-10-28.md`; detaljer om Gen14–16:s 2022-affärer, tidskoncentration, Gen16-portföljbokföring, exekveringsregler och tekniska begränsningar. Originalet har företräde vid oenighet om ordalydelsen.
- Gen16 dataintegritet granskad read-only: `linasopti/LINA_GEN16_DATA_INTEGRITY_AUDIT_2026-10-27.md`. Fryst DATA-evidens är ett manifest med SHA256-referens, inte OHLC-rådata. `SOURCE_gen9-data.json` hittades men GitHub-connectorn gav tomt textinnehåll; oberoende bytebaserad SHA256 **UNVERIFIED**. Detta bevisar inte att rådatafilen är tom.
- **Exakt nästa uppgift:** verifiera råfilens exakta bytes/SHA256 read-only, därefter dataproveniens och Worker-receipts; kontrollera sedan historisk G2/G3 Forward-evidens. Inga reruns, inga förändringar av fryst evidens, Handel/Forward AV, Gen17 DRAFT_ONLY.
- **Öppet:** synkronisera `LINA_CURRENT_STATE.json`, läs tillbaka båda filerna. Allt innehåll från uppladdad chatt är nu arkiverat; påståenden är inte självständigt verifierade förrän jämförda med evidens.


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

## 2026-10-27 – komplettering från avbruten chatt (ännu ej oberoende omräknad)
- Tidigare chatt rapporterade riktad kontroll av sex aktiers justeringsfaktorer i bevarad Gen9-fil: SHOP och TSLA faktor 1, NVDA ungefär 0,3–0,7 % avvikelse, PYPL cirka 0,98897, FDX cirka 0,885–0,966 och QCOM cirka 0,862–0,963. Inga faktorhopp över 2 % mellan intilliggande handelsdagar rapporterades för dessa sex.
- Exempel rapporterat för 2024-06-10 (rå close → justerad close): NVDA 121,79→121,44; PYPL 67,09→66,35; FDX 204,45→194,41; SHOP 63,01→63,01.
- Dessa siffror är återförda från användarens chattutdrag, INTE självständigt återverifierade i detta steg. Faktor 1 för SHOP/TSLA bevisar inte frånvaro av splitjustering i leverantörens OHLC.
- Öppen forskningsfråga: tidskausalitet och eventuell look-ahead från efterhandsjusterade priser; konstant multiplikator kan lämna relativa signaler invarianta men påverkan på bokföring/exekvering måste kontrolleras.
- Nästa: verifiera med riktade, begränsade läsningar och befintlig kod/evidens; ingen stor råfil i chatt utan förvarning. Informera användaren före stora inläsningar och föreslå ny chatt i tid. Ingen rerun, Handel/Forward AV.

## 2026-10-27 – Gen16 engine read-only audit (verified source)
- Actual engine `gen16-generation-engine.js` found through complete recursive branch tree (`truncated=false`), not default-branch search. `normalize()` validates adjusted o/h/l/c consistency and aligned dates but does NOT validate corporate-action provenance or point-in-time adjustment factors.
- `signalAt()` uses adjusted close for SMA180, prior close/high for 50-session breakout, 20-day log-return volatility, and 50-day relative strength; signal at day i-1, next-day adjusted open entry.
- `simulate()` uses adjusted open to size fractional qty, deducts qty*adjusted entry including 0.1% side cost; exits at adjusted close with side cost, computes P/L = qty*(exit-entry), and daily equity = cash + qty*adjusted close. No explicit dividend cash credit or split share adjustment in this engine.
- Deduction (mathematical, not dataset-tested): a constant positive scaling of all OHLC for one symbol leaves its own SMA/breakout/volatility/strength and cash P/L invariant under fractional share sizing; a time-varying factor can change signals and returns. The engine does not verify that adjustment factors were knowable at each historical date. Adjusted OHLC are total-return-like synthetic prices, NOT directly executable historic quotes; dividend accounting is implicit in adjusted-price returns, not cash ledger.
- Additional code-review concern: daily entries are processed before same-day scheduled exits, potentially affecting cash availability/number of entries; requires bounded review against frozen event evidence, not a rerun. No evidence of an actual incorrect trade established yet.
- Next: inspect saved fold events for entry skips and same-day exits; review corporate-action point-in-time risk with small targeted evidence. Gen8-16 frozen; Gen17 draft; trade/forward OFF. Warn before large reads.

## 2026-10-27 – frozen eight-fold event audit (read-only)
- Read all 8 Gen16 frozen fold JSON files (CONTROL and PRICE_CHANNEL_BREAKOUT × 2021–2024); no simulation rerun. Totals: 1500 SKIP SYMBOL_OPEN, 133 SKIP POSITION_CAP, 0 SKIP NO_CASH. Of POSITION_CAP, 60 occur on a day when at least one position exits at CLOSE; of SYMBOL_OPEN, 92 occur on the same day that same symbol exits at CLOSE. These are event counts, not independent trading opportunities.
- Crucial correction to earlier concern: entries execute at day OPEN, scheduled exits at day CLOSE. Therefore processing entries before exits is chronologically appropriate and avoids funding morning purchases with afternoon proceeds. The 60/92 coincidences are not evidence of a bug; changing order would introduce look-ahead unless execution timing also changed under a separately authorized future design.
- Data quality and historical point-in-time corporate actions remain UNVERIFIED. Do not change frozen engine or rerun. Next: targeted review of historical factor provenance and split/dividend economic interpretation; Worker receipts pending. Warn before large loads.

## 2026-10-27 – Gen9 historical corporate-action evidence reused (read-only)
- Found existing Gen9 source evidence, avoiding re-fetch of 8.4 MB dataset. `LINA_GEN9_PYPL_ADJUSTMENT_RECONSTRUCTION.md` reproduces historical PYPL factor ~0.988971 from four 2025-26 $0.14 dividends; median 0.9889711061 vs reconstructed 0.9889710882. Constant post-2024 scaling alone does not alter Gen16 relative signals or fractional-share P/L.
- `LINA_GEN9_FDX_SPINOFF_FACTOR_RECONSTRUCTION.md` documents June 2026 FedEx Freight spin-off, CRSP method and approximate factor ~0.805258 vs candidate ~0.805802, with exact Yahoo vendor input unresolved. It does not prove all FDX OHLC rows.
- `LINA_GEN9_TRADING_CALENDAR_VERIFICATION.md` records 1258 NYSE trading dates for each of 16 symbols with zero missing/extra/duplicate dates; the frozen dataset metadata may still say calendarVerified=false, so distinguish later independent evidence from embedded flag.
- `GEN9_FOUR_ANOMALIES_INDEPENDENT_2026-10-05.json` reports four large Alpaca comparison outliers (NVDA/TSLA) independently supporting Yahoo candidate rather than Alpaca. Not blanket vendor validation.
- `GEN9_DATASET_GATE_2026-10-05.json` says PASSED with scope RESEARCH_DATA_INPUT, not proof of complete corporate-action/point-in-time correctness. Do not conflate.
- Main remaining question: variable adjustment factors within 2020–2024 and correctness of total-return interpretation, plus independent source and Worker receipts. No dataset rewrite, rerun or trading.

## 2026-10-27 – in-period dividends and legacy blocker recovered (read-only)
- `evidence/LINA_GEN9_DATA_AUDIT_V2.json` (same source SHA) lists in-period dividends: MU14, FDX20, LUV10, C20, QCOM20, BAC20, GM11, NVDA20; SHOP1 split, TSLA2 splits, NVDA2 splits. Internal dividend-factor errors <=4.22e-7 in that audit. These verify internal arithmetic, NOT completeness or point-in-time economic correctness.
- Critically its status `BLOCKED_ADJUSTMENT_BASIS_MISMATCH`: Yahoo quote OHLC are not necessarily unadjusted exchange prices; FDX issuer nominal dividend $1.38 versus provider $1.112006 on 2024-12-09, ratio ~0.8058 consistent with later 2026 spinoff retro-adjustment. Historical vendor corporate-action chain must be distinguished from real ex-date cash dividend.
- Later Gen9 research separately closed AMD and NOW cash-dividend absence for 2020-24 (not all corporate actions). Earlier audit text that PYPL future dividend chain unverified is superseded by later targeted reconstruction; retain chronological provenance.
- Do not call the entire Gen16 historical point-in-time validity VERIFIED. No source data or frozen results changed. Next examine source fields and synthetic total-return accounting around in-period ex-dividend days without rerunning.

## 2026-10-27 – frozen Gen16 trades crossing verified GM ex-dividend dates
- Read-only joined 2024 frozen CONTROL and PRICE_CHANNEL_BREAKOUT trades with GM issuer-verified ex-dividend dates 2024-02-29, 06-07, 09-06, 12-06. Three GM trades straddle ex-date (entry < ex-date <= exit): CONTROL 2024-02-22→03-08 (02-29), CONTROL 2024-11-25→12-11 (12-06), PRICE_CHANNEL_BREAKOUT 2024-11-26→12-12 (12-06). This is a targeted example, NOT exhaustive 16-symbol dividend/trade reconciliation.
- Gen16 engine credits no separate dividend cash; adjusted OHLC valuation gives total-return-like synthetic accounting. Must distinguish from executable raw open/close plus cash dividend; ex-date crossing makes this an actual methodological question, not merely theoretical. Cannot quantify P/L discrepancy without event-date adjusted/raw basis and dividend treatment; no rerun authorized.
- SPEC: 12-session hold, entry next-day OPEN, exit at 12th session CLOSE, 0.1% each side, fractional shares. Frozen trades untouched.

## 2026-10-27 – all eight frozen folds joined with 115 issuer-reconciled ex-dividend events
- Read-only join of 115 events in `evidence/LINA_GEN9_CORPORATE_ACTION_EVIDENCE.json`: GM11 and C20 direct issuer ex-dates; MU14, LUV10, BAC20, QCOM20, NVDA20 derived ex-dates from issuer record dates plus applicable settlement rules. FDX20 not included in this 115-event ledger; no claim of all-symbol coverage.
- For each frozen trade, overlap condition entry < exDate <= exit (entry OPEN on ex-date does not earn dividend, exit CLOSE on ex-date does). CONTROL 2021=7, 2022=0, 2023=3, 2024=10 => 20; PRICE_CHANNEL_BREAKOUT 2021=5, 2022=0, 2023=5, 2024=8 => 18. Total 38 distinct trade/event overlaps in the checked ledger. Counts are per strategy, not 38 unique independent market positions. No rerun, no change to evidence.
- This establishes concrete exposure to dividend-related adjusted-price accounting but does NOT demonstrate 38 erroneous trades or quantify a discrepancy. Missing issuer event coverage and FDX require separate treatment; point-in-time adjustment and cash-dividend economic reconciliation still unresolved.

## 2026-10-27 – frozen trade P/L attribution for 115-event ex-date subset
- Reused same 115-event issuer-reconciled ledger and 8 frozen Gen16 folds. CONTROL 320 trades, 20 overlap, their synthetic adjusted-price P/L sum +$1396.88675857; PRICE_CHANNEL_BREAKOUT 258 trades, 18 overlap, synthetic P/L +$1611.52918404. 4 CONTROL + 3 BREAKOUT overlap trades have |synthetic P/L| < $50. This is descriptive, not evidence of dividend-driven gains or trade error.
- CRITICAL accounting caveat: Gen16 qty is fractional synthetic shares calculated from adjusted open; multiplying that qty by issuer nominal dividends and adding to frozen P/L is INVALID (different share basis, double-counting potential). Proper alternative economic comparison requires raw executable OHLC, split-aware actual shares, ex-date entitlement and dividend payment timing, consistent costs and initial notional. No such economic P/L reconciliation performed or claimed. No rerun, dataset change, trading or Forward.

## 2026-10-27 – Yahoo adjusted return vs cash-dividend total return (method-level finding)
- Inspected frozen `gen16-generation-engine.js`: entries/exits use fully adjusted o/c with 0.001 side cost, fractional synthetic qty, no dividend ledger. `gen9-raw.js` independently documents Alpaca SIP/raw fetch route but no raw dataset was fetched in this step.
- Yahoo Help https://in.help.yahoo.com/kb/adjusted-close-sln28256.html documents back-adjustment on prior days by factor 1-D/P_prev. Therefore across an ex-dividend boundary adjusted one-day return is P_new/(P_prev-D)-1, whereas actual one-share cash-dividend total return is (P_new+D)/P_prev-1 (assuming comparable split-normalized raw closes, no tax/cost). They are not algebraically identical; difference equals D*(P_new-P_prev+D)/(P_prev*(P_prev-D)), usually small but sign depends on ex-date total move.
- Independent Ian Gow 2025 analysis https://iangow.github.io/notes/published/yahoo-returns.html reproduces the difference and compares standard formula against CRSP returns. This is an external methodological cross-check, NOT verification of any Lina per-trade discrepancy.
- 38 previously identified trade/ex-date overlaps establish relevance; do not infer that 38 trades are erroneous, nor add cash dividends to synthetic qty. Exact Gen16 P/L discrepancy needs matched executable raw bars and corporate action/payment accounting, no rerun of frozen Gen16.

## 2026-10-27 – archived Alpaca SIP raw / adjustment diagnostic located
- Located archived immutable-style diagnostic snapshots in `runtime-reports/GEN9_COMPARE_RAW_2026-10-04T22-53-07-983Z_77c12bee8110.json` and `runtime-reports/GEN9_ADJUSTMENT_DIAGNOSTIC_2026-10-04T22-56-37-422Z_ba19d8cba8dd.json`. Candidate SHA matches locked source, both cover 20,128 matched daily keys and compare 4 OHLC fields. Reports contain aggregate difference bands and top 20 outliers, NOT full raw matched bar history; therefore insufficient to reconstruct individual dividend-straddling trade cash P/L.
- All-adjustment Alpaca SIP comparison: 78,306 numerically different OHLC fields, 4 differences >= $10; split-only 9,214 >=$10; dividend-only 24,737; spin-off-only 28,261. Raw comparison 78,968 differing fields, 28,915 >=$10. These are absolute field differences across different price bases, not evidence that 78,306 records are economically wrong. `all` closest by large outliers. Earlier four large outliers independently corroborated Yahoo, not Alpaca; still not universal validation.
- Public Yahoo Help documents cumulative prior-bar adjustments for splits/dividends; adjusted historical series can be revised by future actions. Diagnostic snapshots do not store as-of-2024-12-31 raw+adjusted daily OHLC with factor vintage. Thus no defensible per-trade real-depot return difference quantified. No frozen research rerun, no dataset/runtime change.

## 2026-10-27 – targeted archived raw OHLC provenance and GM 2023-06-05
- Read-only repository tree search found no full archived `release/LINA_ALPACA_SIP_2020_2024_RAW.json` on current branch, though archived `evidence/2026-10-03/LINA_GEN9_GM_REVIEW_ae9bb251464b7fe5.json` records SHA256 `7fccc87b8d889578683aeb79735ab9513b383da1344ee96cb232ba8189e4c566` for that raw dataset. A hash reference does not establish retrievable file bytes.
- Same GM review saves date 2023-06-05: Yahoo candidate adjusted OHLC o=33.33878779764356, h=33.33878779764356, l=32.57426900811007, c=33.029109954833984, factor 0.967744181692695; embedded Yahoo raw o=34.45000076293945, h=34.45000076293945, l=33.65999984741211, c=34.130001068115234. Saved Alpaca SIP raw daily o=34.45,h=34.49,l=33.66,c=34.13. 78 Alpaca regular-session 5-minute bars corroborate high=34.49, BUT same provider and different trade/aggregation rules remain unresolved; Alpaca 09:30 5m open=34.49 versus daily open=34.45. Twelve high 34.375 below open 34.45000076 violated OHLC invariant and was rejected. No field patched.
- These are a single date's raw/adjusted bars, not the entry+exit dates of one of the 38 dividend-overlap trades. They demonstrate price-basis differences and unresolved cross-provider intraday bar conventions, NOT a valid trade-level dividend cash P/L reconciliation. Continue searching archived targeted dates or existing raw file through read-only means; no rerun.

## 2026-10-27 – historic raw archive path and GM daily bar methodology rechecked
- Current branch recursive tree has no `linasopti/release/LINA_ALPACA_SIP_2020_2024_RAW.json`. GitHub commit-history query for that exact path returned zero entries, and commit search for ALPACA returned no matches. This does NOT prove the blob is unavailable in other branches/history or local archives. Recorded SHA256 of raw archive is a content hash, not necessarily Git blob SHA; do not pass it to fetch_blob as if a Git SHA.
- Read `evidence/2026-10-03/LINA_GEN9_GM_METHODOLOGY_REVIEW.md`: Alpaca daily OHLC bars can follow trade-condition and session rules different from aggregated minute/5min bars. GM daily open 34.45 vs first regular 5min open 34.49 is not itself proof of an error. Twelve Data GM 2023-06-05 high 34.375 below open 34.45000076 violates Lina's OHLC invariant; source root cause is unresolved. Prewritten Twelve Data support question exists in this file but was NOT sent. No silent source patch or validation weakening.
- Next evidence path: investigate whether a known historic commit/tree SHA actually contains archived raw dataset before claiming restoration; otherwise label raw archive absent from examined branch/path and per-trade raw reconciliation blocked. No research rerun, no live API request, no trading.

## 2026-10-27 – cross-branch archive search and source backup
- GitHub branches API returned 100 branch entries (first page only); checked recursive trees of `main`, `ccc-development`, `backup-vinted-before-unified-engine-20261008`, `ccc-backup-20260814`, plus active `ccc-demo-public-test`. Main/development/August backup lack `SOURCE_gen9-data.json`; Oct 8 backup contains exact source Git blob `5ac082c346db53fabccb9ab5009bb99527f764e1` (8,446,807 bytes) and archived raw comparison report. Active branch contains same source Git blob. This is a second branch reference to original Gen9 candidate, NOT independent source validation.
- No examined branch tree contains `LINA_ALPACA_SIP_2020_2024_RAW.json` at any path; path-specific GitHub commit-history checks for `linasopti/release/LINA_ALPACA_SIP_2020_2024_RAW.json` and `release/LINA_ALPACA_SIP_2020_2024_RAW.json` returned []. Archived GM evidence records SHA256 `7fccc87b8d889578683aeb79735ab9513b383da1344ee96cb232ba8189e4c566`, which is not a Git blob ID. Search incomplete across 100+ branches and all Git object history; no claim that archive never existed or cannot be recovered.
- Keep Gen16 frozen and no new simulation. Next: targeted GitHub Actions artifact inventory or historic release assets for raw file, if retained; avoid assuming archive accessible.

## 2026-10-27 – archived GitHub Actions artifact availability sampled
- GitHub connector disallowed direct repository-wide `/actions/artifacts` inventory endpoint (HTTP 400 unsupported fetch URL), so no exhaustive artifact search is claimed.
- Queried workflow runs on 2026-10-04: 156 runs; first page 100 showed only `pages build and deployment`; second page 56 also included `Promote verified Lina Worker`. Two successful Oct 7 Pages runs and three sampled successful Oct 4 runs (IDs 37239996810, 37239888985, 37239753987) returned zero run artifacts from `fetch_workflow_run_artifacts`. This establishes only those sampled runs lacked available artifacts; not that none of 156 or other dates had one.
- GitHub Docs default Actions artifact retention 90 days, configurable, so Oct 2026 artifacts may still exist if uploaded. No raw archive retrieved. Next consider targeted workflows with upload-artifact or releases; do not overstate search coverage. No frozen data/research changed.
