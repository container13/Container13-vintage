# LINA — AKTUELL HANDOFF / STATUS

Aktuell release: V0.3.15
Uppdaterad: 2026-10-03
Dokumentrevision: överlämning 2026-10-03

## Läs först – aktuell överlämning

### Projekt och arbetsplats
- Projekt: Linas Opti / Lina Clean Core. Detta arbete gäller linasopti/, inte CCC.
- Repository: container13/Container13-vintage.
- Branch: ccc-demo-public-test. Lina finns inte på main.
- Webb: https://container13.se/linasopti/
- GitHub Pages publicerar automatiskt denna branch. V0.3.15-publiceringen verifierades med lyckad Pages-körning och serverad version.js.
- Cloudflare Worker: https://linas-opti-api.mangaj73.workers.dev
- Senast kända driftsatta Worker: V5, 0.58.8 + evidence-sync-v0235 + alpaca-history-v02 + twelve-history-v02. Återkontrollera health före ny ändring. GitHub-uppladdning av Worker-kod innebär inte Worker-deploy.

### Absoluta regler
- Läs LINA_MASTER_RULES.md och LINA_RELEASE_CHECKLIST.md före implementation.
- Gen7 och Gen8 är frysta. Gen8 är färdig och får ALDRIG köras om.
- Gen9 är NOT APPROVED, plan inte låst och forskning inte startad. Handel och Forward AV.
- Inga verifieringsflaggor får sättas på grund av leverantörsöverensstämmelse eller diagnostiska toleranser.
- Inga prisfält får patchas genom att blanda leverantörer.
- Fryst evidence får inte skrivas över. Nya analyser sparas separat.
- Historiska avsnitt längre ned är bakgrund; denna toppsektion är aktuell status.

### Användarens arbetsflöde och tillstånd
- Användaren har godkänt automatisk överföring av färdiga projektfiler till rätt GitHub-repo/branch. Beslutet finns i root README, linasopti/README.md och README_WORKER_DEPLOY.md, dokumentrevision 1.1.
- Överför endast ändrade filer för kodändringar och verifiera exakt innehåll efteråt.
- Aldrig force-push. Annat CCC-arbete kan samtidigt ändra samma branch: hämta senaste head och bevara det.
- Leverera frontend som CHANGED FILES ONLY till användaren. Bygg och verifiera COMPLETE som bas när en kodrelease görs.
- Worker-kod ska gå att kopiera i ett knapptryck via HTML-hjälpare utan att tusentals rader visas i chatten.
- **Cloudflare-kod – obligatorisk leveransregel:** När användaren behöver klistra in komplett Worker-kod ska koden INTE skrivas ut i chatten. Leverera i stället en kompakt ett-klick-kopieringslösning/HTML-hjälpare som kopierar hela den kompletta Worker-filen till urklipp. Användaren ska bara behöva trycka på kopieringsknappen och sedan klistra in i Cloudflare. Visa full kod endast om användaren uttryckligen ber att få se den.
- Rapporter ska gå att kopiera/klistra in; aktuell generations exporter synliga överst, äldre under Fler exporter.
- Inget påstående om globalt minne: dessa regler är beständigt dokumenterade i repo.
- Supportfrågor är förberedda men INTE skickade. Automatisk filöverföring är inte tillstånd att kontakta leverantörer.

### Bas och senaste kod
- Frontend V0.3.15. Screenshot-fixen är verifierad av användaren i Chrome; exportfunktionen sparar fil och kopierar text.
- Tidigare arbetsmiljö hade release/LINA_CURRENT_BASE.zip och LINA_CLEAN_CORE_V0315_FLAT_COMPLETE.zip. Lokala filer är inte garanterat tillgängliga i nästa chatt.
- Dessa ZIP:ar föregår senare GitHub-dokument/evidence och arkivflytten. Använd dem inte som komplett aktuell repo-snapshot utan avstämning mot GitHub.
- GitHub på rätt branch är källan för nuvarande mappstruktur och senaste handoff/evidence. Bevara nya rapporter och arkiv när nästa COMPLETE byggs.

### Gen9 kandidatdata
- Original: SOURCE_gen9-data.json. SHA-256 cb84e436a0527b44262949994306dcb85eaf5f10ad88fc7906d443833cc6589c.
- 16 symboler: AMD SHOP ADBE MU FDX TSLA LUV NFLX C NOW QCOM BAC GM DDOG PYPL NVDA.
- 20128 rader, 1258 datum, 2020–2024. Strukturell kontroll godkänd, datamanifest fortsatt inte godkänt.
- Normaliserat femfältsschema d/o/h/l/c hade SHA-256 ae6e8ac4a54fe485ccdc207b5bdfbf63c495d08113d41c30ee7eba071f5adb12.
- 2020 warmup; 2021–2024 är redan observerad utvecklingsperiod, inte ett nytt osett holdout.
- Full OHLC-bas, corporate-action-kompletthet, oberoende datalinje och kalenderunderlag återstår. Diagnostisk 0,5%-gräns är inte ett godkännandekrav.

### Senaste färdiga arbete
1. Publicering av saknade V0.3.15-filer till GitHub och verifiering av Pages.
2. Gen9-granskningar sparade som nya evidence-filer och exakt återlästa.
3. Godkänd rensning: 129 äldre handoffs och sju äldre Worker-filer flyttade utan innehållsändring till history/legacy/. Ett gammalt COMPLETE-ZIP och .gitkeep borttagna. 835 övriga blobbar bevarades. README länkar arkivet. Rensningscommit c732ba0b59557939d3492fedbe217dc5c9cec913. Inga GitHub Release-poster fanns.
4. GM 2023-06-05: Twelve none open 34.45000076 / high 34.375 underkänns av Linas OHLC-kontrakt. Yahoo raw high 34.45000076293945, Alpaca SIP daily high 34.49. Nytt SIP-femminutersprov har 78 ordinarie intervall och high 34.49 vid 09:30 ET. Samma leverantör, ingen oberoende bekräftelse. Daily open 34.45 skiljer från första femminuters-open 34.49.
5. Alpacas primärdokumentation styrker olika villkorsregler för minut- och dagsbarer. Orsaken för just GM är inte styrkt. Benämningen ”Twelve-felet” betyder att Linas kontrakt inte uppfylls; leverantörens rotorsak är obekräftad. GM pausas i väntan på rad-specifikt besked/affärer med villkorskoder. Supportutkast finns; inte skickat.
6. FDX: FedEx Freight-separationen är styrkt. Yahoo anger att adjusted close följer CRSP-standard och CRSP:s 2024-metodik dokumenterar explicit spin-off med when-issued-handel som parent close minus WI close × distributionskvot. Metodluckan är därmed stängd på standardnivå. Marknadsrekonstruktionen 411,75 - 0,5×160,37 ger faktor 0.805258044930176 mot kandidatmedian 0.8058017740753254. Exakt Yahoo vendor-input/precision för den enskilda justeringen är fortfarande inte direkt observerad, så ingen toleransbaserad verifieringsflagga sätts. Form 8937:s cirka 81,55% skattebas används inte som prisfaktor.
7. PYPL:s AdjClose/quoteClose-faktor är nu numeriskt rekonstruerad med Yahoos dokumenterade utdelningsformel och fyra senare utdelningar om 0,14 USD: 2025-11-19, 2026-03-04, 2026-06-04 och 2026-09-04. Med publikt visade föregående stängningar 60,70 / 46,38 / 42,61 / 56,82 blir produkten 0.9889710881644362 mot kandidatmedian 0.9889711061369744; absolut rest cirka 1,80e-8. Ny separat evidence finns i LINA_GEN9_PYPL_ADJUSTMENT_RECONSTRUCTION.md/.json. Ingen verifieringsflagga sattes från toleransen.
8. Kontantutdelningsfrånvaro 2020–2024: ADBE, AMD och NOW är nu stängda på cash-dividend-nivå. AMD sluts via historisk issuer/SEC-deklaration plus reviderade 2022/2024 10-K som tillsammans täcker målperiodens finansierings-/equityflöden. NOW sluts via 2021 års explicita 'never declared or paid' och 2024 års retrospektiva 'have not declared'. NOW:s 5:1-split i december 2025 ligger utanför målperioden. Detta är inte ett godkännande av alla corporate actions.

### Nästa konkreta steg – börja här
Handelskalendern är nu verifierad som separat evidence: kandidatens 16 symboler har vardera exakt 1 258 unika datum 2020–2024 och datumaxeln matchar NYSE-kalendern utan saknade/extra/dubbla datum. Evidence: `LINA_GEN9_TRADING_CALENDAR_VERIFICATION.md/.json`. Detta stänger endast kalenderblocket; datamanifestet är fortsatt inte godkänt.

Oberoende datalinje är nu källkvalificerad: Alpaca Historical Stock Bars med SIP, 1Day och adjustment=all för hela 16-symbolsuniversumet 2020–2024. Evidence: `LINA_GEN9_INDEPENDENT_DATA_LINE_SOURCE.md/.json`. Kandidaten är Yahoo-baserad; Alpaca ska endast vara separat kontrollinje och får inte patchas in i kandidaten. Repo-`worker.js` visar äldre /bars med IEX/raw medan handoffen dokumenterar senare SIP-kontroller live; repo-kopian får därför inte antas motsvara aktiv Worker.

Worker-källan i GitHub är nu V0.58.9. /bars behåller IEX/raw som bakåtkompatibla standardvärden men accepterar explicit feed=sip och adjustment=all (samt dokumenterade enskilda adjustment-värden). GitHub-koden är återläst och verifierad; tradingEnabled är fortsatt false. Detta är endast källkod i GitHub och innebär INTE Cloudflare-deploy.

Nästa konkreta steg: deploya Worker V0.58.9 till Cloudflare, verifiera /health och därefter hämta hela Alpaca SIP/adjustment=all-datasetet 2020–2024, hash:a rå/normaliserad data och jämför datumvis OHLC mot kandidaten. Den aktuella webbkörningsmiljön kan inte öppna Worker-domänen, så live-deploy eller fullhämtning påstås inte vara genomförd. GM 2023-06-05 förblir pausad tills radspecifikt underlag finns. FDX:s exakta Yahoo-input/precision lämnas öppen. All-corporate-action-kompletthet är separat. Gen9 är NOT APPROVED; Gen8 får inte köras om; Handel/Forward AV. Planlås/research först när samtliga datakrav är styrkta.

### Läs dessa senaste filer (alla sökvägar relativt linasopti/)
- LINA_MASTER_RULES.md
- LINA_RELEASE_CHECKLIST.md
- LINA_GEN9_PLAN_PROPOSAL.md
- LINA_CLEANUP_PROPOSAL.md
- evidence/2026-10-03/LINA_GEN9_GM_REVIEW_ae9bb251464b7fe5.md och .json
- evidence/2026-10-03/LINA_GEN9_GM_METHODOLOGY_REVIEW.md
- evidence/2026-10-03/LINA_GEN9_FDX_PYPL_FACTOR_REVIEW_11033f0c98e1a604.md och .json
- evidence/2026-10-03/LINA_GEN9_PYPL_ADJUSTMENT_RECONSTRUCTION.md och .json
- evidence/2026-10-03/LINA_GEN9_FDX_SPINOFF_FACTOR_RECONSTRUCTION.md och .json
- evidence/2026-10-03/LINA_GEN9_DIVIDEND_ABSENCE_REVIEW_6b10570365629eec.md
- evidence/2026-10-03/LINA_GEN9_DIVIDEND_ABSENCE_REVIEW_14c1a484f62a5630.json
- evidence/2026-10-03/LINA_GEN9_AMD_NOW_DIVIDEND_CLOSURE.md och .json
- evidence/2026-10-03/LINA_GEN9_TRADING_CALENDAR_VERIFICATION.md och .json
- evidence/2026-10-03/LINA_GEN9_INDEPENDENT_DATA_LINE_SOURCE.md och .json

Senaste faktorrapportens commit före denna handoff: ca87060af5e1aeed4376d51ee0bbd2d4f786ea72. Hämta alltid senaste branch-head; andra ändringar kan ha tillkommit.

---

## Historiska releaseanteckningar

## Historiskt säkert läge vid tidigare handoff
- Webbversion V0.3.13; Gen9 beräkningsmodul och olåst förslagsvy tillagda.
- Handel AV, Gen8 Forward inte öppnad. Gen7 och Gen8 är frysta och får aldrig köras om.
- Auktoritativa exporter: LINA_GENERATION_ENGINE_2026-09-29_214132.json och LINA_GEN8_FROZEN_RESEARCH_2026-09-29_214134.json.
- Gen8: GEN8_COMPLETE_NO_CANDIDATE_GEN9_BASIS_READY. Plan be68328d, runnerspec d26e5499; fyra FAIL, ingen kandidat, summary fryst.
- Gen9: BASIS_READY_PLAN_NOT_DEFINED. LINA_GEN9_PLAN_PROPOSAL.md är olåst och ändrar inget app-state.
- Robotmognad 70/100 enligt export. Äldre RESEARCH_RUNNING-noteringar nedan är historiska.

## V0.3.01 — bekvämlighet utan forskningsändring
- Global 📸 Bild-knapp i headern.
- Ett tryck sparar hela den aktuella Lina-vyn som PNG, inte webbläsarens flikar/adressfält.
- Filnamn innehåller vy, Lina-release och tidsstämpel.
- Skärmbild skapas lokalt i webbläsaren; funktionen ändrar inget forskningsstate och startar inte Gen8/Forward/Handel.
- Vid renderingsfel visas explicit felstatus på knappen; inget falskt lyckat läge.

## Permanent incidentlärdom
- App-state ska verifieras end-to-end: frontend write → sync → Worker/API validate → GitHub → GET/restore → hydrate → localStorage → boot → monotont slutstate.
- `lina_generation_engine_v0273` kräver explicit Worker-allowlist utöver `lina_clean_*`.
- Feltext ska spåras till producerande kod före fix. Inga gissnings-hotfixar.
- Releasepåståenden om kod, syntax, ZIP eller deploy måste vara faktiskt verifierade.

## Styrdokument
- `LINA_MASTER_RULES.md` är permanent regelbok.
- `LINA_RELEASE_CHECKLIST.md` är gemensam releasekontroll.
- Denna fil, `LINA_HANDOFF_CURRENT.md`, uppdateras i stället för nya versionsspecifika handoff-filer.


## V0.3.01 – komplett Lina-skärmdump
- 📸 är fortfarande en enda knapp utan meny.
- Ett tryck renderar hela aktuella Lina-vyn från topp till botten, oberoende av scrollposition.
- Samma PNG sparas lokalt och kopieras till bildurklipp när webbläsaren tillåter det, för direkt ⌘V/Ctrl+V i aktuell ChatGPT-chatt.
- Dashboardens Robotmognad hämtas från samma auktoritativa modell som Generation Engine.


## V0.3.04 — Gen8 säker continuation + canonical base
- Byggbas: återfunnen `LINA_CLEAN_CORE_V0301_FLAT_COMPLETE.zip`; ingen gissad/rekonstruerad bas.
- Gen8 Auto Pipeline är state-aware: låst/verifierad runnerspec prepareras inte om.
- Redan observerade familjer valideras och hoppas över; ofullständiga checkpoints stoppar recovery i stället för rerun.
- Den tidigare observerade feltexten `specTrainingResults[0].evidence` finns inte i den återfunna V0.3.01-källbasen. Den behandlas därför som runtime/cache/versionsavvikelse tills den producerande koden kan visas; ingen gissad rotorsak påstås.
- Global `Exportera Generation Engine-status` ligger nu i Engine-toppen.
- Handel AV och Forward AV.


## V0.3.04 — beständig Auto Pipeline-diagnostik
- V0.3.02 inkommande state var intakt men ett faktiskt klick på Gen8 Auto Pipeline gav ingen beständig synlig förändring efteråt.
- Rotorsaken är ännu inte verifierad; V0.3.04 gissar därför inte. I stället checkpointas klickmottagning, pipeline-steg och exakt stoppfel i Engine-state innan/under async-kedjan.
- UI visar senaste pipeline-klick/steg efter rerender/reload. STOPPED-fel bevaras i state/export.
- Resume Never Replay kvarstår: observerad första Gen8-familj får inte rerunnas. Handel/Forward AV.


## V0.3.04 Gen8 continuation repair
Root cause: after a new Gen8 family was checkpointed, asynchronous evidence/GitHub sync could replace Engine state with a snapshot lacking that family. After await, code dereferenced the now-missing family `.evidence`. Repair preserves the exact computed result, restores that checkpoint without recomputation, then attaches evidence; Gen8 evidence reconciliation is included.

## V0.3.05 — 📸 ett klick, ett resultat
Chrome/Windows: urklippsskrivning initieras direkt i klickgesten med asynkron PNG-rendering. Lyckad kopiering visar Kopierad utan filnedladdning. Om urklipp saknas/nekas sparas i stället en PNG och knappen visar Sparad. Renderingsfel ger Fel. Ingen Gen8-körning eller forskningsstate ändras. Faktisk Windows-browserverifiering återstår.

## V0.3.06 — Chrome/Windows uppföljning
V0.3.05 visade Fel vid 📸 på användarens Chrome/Windows. CSS-bakgrundsbilden inbäddas nu och CSS XML-escapas i SVG. Exakt återstående fel visas direkt om renderingen fortfarande misslyckas. Rotorsaken är ännu inte verifierad i faktiskt Chrome. Långsam inloggning observerades efter lösenkod: auth-kontroll och därefter seriell GET/POST/evidensverifiering blockerar Dashboard av integritetsskäl. Ingen osäker genväg förbi state-återställningen infördes.

## V0.3.07 — verifierad feltext, riktad korrigering
Användaren rapporterade exakt `Failed to execute 'toBlob' on 'HTMLCanvasElement': Tainted canvases may not be exported.` i Chrome/Windows på V0.3.06. Källan använder SVG foreignObject som bild via blob:-URL. Chromium behandlar denna kombination som icke origin-clean. SVG laddas nu via självständig data:-URL, med fortsatt inbäddade resurser. Browser-utfallet är ännu inte verifierat. Gen8 och state/synk ändras inte.

## V0.3.08 — långsam inloggning, mätning
Efter lösenkod blockeras Dashboard av app-state GET, säker merge/PUT och evidensverifiering. V0.3.08 visar tider per steg på Dashboard och tar bort en fast 220 ms fördröjning. Ingen nätverks-/state-gate hoppas över. Screenshot-fixen från V0.3.07 är verifierad i användarens Chrome genom en inklistrad helvys-PNG.

## V0.3.09 — snabbare start när app-state är oförändrat
Användarens V0.3.08-bild visar auth 0,1 s, GET 0,7 s, POST 3,4 s, evidence 0,1 s och bootstrap 4,2 s. Den inkommande V0.3.04-basen hade redan samma seriella GET/POST/evidence-kedja; screenshot-ändringar introducerade inte den. Tidigare svarstider är inte uppmätta.
Bootstrap hoppar nu över POST när exakt samma app-innehåll redan finns i verifierad GET. Endast den namngivna diagnostikposten undantas och stannar lokalt till full synk. Förändrat Gen8-/evidence-/övrigt app-state kräver fortfarande POST. Evidensreconciliation görs idempotent så identisk metadata inte skapar nya updatedAt-värden vid varje login. Första starten kan behöva normal synk av tidigare ändringar; därefter visar Dashboard `spara state ingen ändring` när snabbvägen används. Nio regressionfall godkända lokalt; faktisk Chrome-latens återstår.

## V0.3.10 — forskningsexport längst upp
Exporter ligger i egen panel direkt efter Engine-rubriken: Exportera aktuell forskningsstatus + Exportera Gen8-resultat. Övriga exportknappar (planer, runnerspec, äldre frysta resultat) finns under stängd Fler exporter. Befintliga knappar flyttas före eventbindning och dubbla export-ID tas bort. Gen8-resultatknappen använder befintlig frozenResearchExport utan researchstart.
V0.3.09 startoptimering verifierades i användarens Chrome: oförändrat state sparas inte, bootstrap 1,4 s. Gen8 är enligt användaren avslutad och får aldrig köras om. Nästa forskningsarbete kräver aktuell full Engine-export för analys; äldre RESEARCH_RUNNING-beskrivningar ovan är historiska.

## Granskning 2026-09-30
MASTER RULES, handoff, checklist och berörd Gen8-kod lästa. Faktisk lokal V0.3.10 COMPLETE ZIP kontrollerad mot berörda filer före ändring.
Inför 2022 får samtliga Gen8-alternativ +20 stabilitetsbonus utan avdrag; samma parametrar som Gen7 väljs. TRAIN-simulering har tillgång till testårets priser och begränsar endast signaldatum, vilket kan låta senare avslut påverka TRAIN. Faktisk omfattning kan inte fastställas från exporter utan affärslogg.
Endast regler, handoff, checklist och nytt olåst Gen9-planförslag ändrade. Ingen JavaScript-ändring, forskning, låsning eller deploy. Dokumentationspaket jämfört mot V0.3.10-basen och ZIP-innehåll verifierat.
Lokal nästa bas inkluderar dokumentationen; tidigare V0.3.10-lagring blev blockerad, därför görs inget påstående om uppdaterad fjärrbas.

## V0.3.11 — Gen9 metodbygge före lås
Användaren godkände implementation/test, inte planlås eller forskningsstart. gen9-generation-engine.js är isolerad och skriver inte state, hämtar inte priser och anropar inte äldre generationer. Ren simulator jämför A/B, loggar affärer/skippade signaler/equity, håller periodgränser, kostnader, positionstak och mark-to-market-DD. Endast B kandidatberättigad. SPEC status NOT_LOCKED; FNV för förslagets identitet är inte lås eller kryptografiskt evidensbevis.
Elva syntetiska metodtester och nio befintliga startup/evidence-regressionfall godkända. Syntax för alla toppnivå-JS och ZIP kontrollerade. Ingen verklig forskning eller Chrome-verifiering utförd. Produktionskedja för planlås, evidens och resume återstår före research; UI visar bara förslag och export.

## V0.3.12 — Gen9 arbetskedja
Separata UI-handlingar: planlås med evidens; datamanifest/import och evidens; forskningsstart/återupptagning; resultatexport; sammanfattningsfrysning. Inget av detta har utförts på användarens forskningsstate.
Checkpointlagring i egen IndexedDB begränsar app-state-storlek. Checkpoints och påbörjade observationer kan inte tappas genom Gen9-monoton merge. Saknat/korrupt checkpoint eller 409 utan innehållslikhet stoppar; ingen research-rekonstruktion/rerun.
Workflow- och synkmergetester godkända med fake IndexedDB/evidens och syntetiska beräkningsresultat. Verklig data, Worker/evidence roundtrip och Chrome har inte verifierats. Eleven simulator cases + nine prior regression cases passed. Datakvalitet är faktisk blocker före live research; ingen automatisk import av gammal overifierad cache.
Äldre V0.3.11-status om avsaknad av orkestrering är historisk; kandidatfrysning och GitHub-recovery för borttappade lokala råcheckpoints återstår.

## V0.3.13 — läsande Gen9-datakällkontroll
Worker-kopian läser Yahoo quote OHLC men vidarebefordrar inte adjclose/split/utdelningsunderlag; kopian bevisar inte driftsatt Worker-kod. API-probe här blockerades av nätverk. Ingen Worker ändrad.
Ny knapp före planlås läser AMD 2020 från två befintliga Worker-endpoints (Yahoo/EODHD), timeout 20 s per källa. Rapport med HTTP-status, schema, tre exempelrader och verifieringsluckor sparas endast i sessionStorage och exporteras under Fler exporter. Ingen research, localStorage-state, lås eller evidens ändras.
Rapporten är diagnostik, aldrig datagodkännande. Full prisjusterings-/kalenderverifiering och datapaket återstår. Fyra diagnostikfall och JS/ZIP/manifest kontrollerade. Browserutfall återstår; användaren kör Kontrollera Gen9-datakälla och exporterar JSON för nästa verifiering.

## V0.3.14 — aktuell generations exporter synliga
Gen9-plan, Gen9-state/resultat och Gen9-datakällkontroll placeras i synlig primärpanel. Gen8-resultat flyttas till Fler exporter. Ingen handler eller forskningslogik ändrad; enbart målcontainer för exportknappar. Användarens bild bekräftade felplaceringen i V0.3.13. JS-syntax, målcontainer, ZIP och manifest kontrollerade; browserutseende efter uppgradering återstår.

## V0.3.15 — rapporter till fil + texturklipp
Aktuell datakällrapport läst lokalt: Yahoo AMD 2020 gav 253 rader 2020-01-02–2020-12-31, EODHD AMD.US gav en rad 2025-09-30 trots begäran om 2020. Båda HTTP 200. Yahoo justeringsstatus är fortfarande obevisad; EODHD har konkret periodfel. Ingen Worker ändrad; aktuell driftsatt Worker-källa behöver säkras innan datakällfix.
Central downloadText/downloadObject sparar fil och kopierar exakt text med synlig status/fallback. downloadObjectAsync begär ClipboardItem text/plain under användaraktivering före await, används av Gen9-resultat. Äldre aktiva text-exporthjälpare/arkiv/broker använder central export. Gen7/8-generationernas forskningskod oförändrad; ändringar i andra äldre moduler gäller enbart exporthjälpare. Ingen simuleringsfunktion ändrad.
Fem urklipps/exportfall och fem diagnostikfall godkända; syntax, ZIP och manifest kontrollerade. Faktisk Chrome/Safari-kopiering återstår efter deploy. Browserklistring blir text, inte automatisk bilaga. Beständig fjärrlagring har tidigare blockerats av nätverk.

## GitHub-publicering 2026-10-03 — V0.3.15
Verifierad lokal V0.3.15 COMPLETE jämförd med publiceringsgrenen ccc-demo-public-test. GitHub Pages kör automatiskt från denna gren; före överföring serverade container13.se/linasopti/version.js V0.3.14. Endast saknade V0.3.15-kodändringar och aktuella styrdokument överförs; nya README-rutiner och separat Gen9-evidence bevaras. Export- och diagnostiktester godkända. Gen7/8-kod bevaras; ingen forskning, planlås, datagodkännande eller Worker-deploy utförs.


## V0.3.16 — independent Alpaca execution path
- Gen9 Data Check has a browser-side full fetch for all 16 locked symbols, 2020–2024, via Worker `/bars` with `feed=sip&adjustment=all`.
- Expected shape is locked to 20,128 rows = 16 × 1,258 dates; raw and normalized SHA-256 are calculated before export.
- This is an independent comparison line only: no candidate patching, no research start, no Gen8 rerun, Handel/Forward remain OFF.
- `independentDataLineVerified` remains false until exported data has been compared against the candidate and evidence reviewed.
- Cloudflare: INGEN ÄNDRING. Existing complete live Worker already supports SIP/all.


## V0.3.17 — iPhone-vänlig kopiering av exporter
- Central export visar nu **📋 Kopiera** som primärt val för JSON/text och **⬇ Hämta fil** separat.
- Ett tryck på Kopiera lägger hela filinnehållet i urklipp för direkt inklistring i ChatGPT på iPhone.
- iPhone-instruktion: öppna chatten, håll i skrivfältet och välj **Klistra in**; Ctrl/⌘V-instruktioner används inte.
- Fallback vid nekat Clipboard API markerar hela texten i en textarea för manuell Kopiera.
- Gäller alla exporter som använder LinaStatusExport; forskningslogik, Gen8, Handel, Forward och Worker är oförändrade.
- Cloudflare: INGEN ÄNDRING.


## V0.3.18 — viewport-lås + synlig ett-klick-kopiering
- iPhone/mobile: hela appen är globalt låst till viewportens bredd; horisontell sidpanorering är blockerad.
- Alla centrala exportknappar som tidigare hette Exportera märks nu **📋 Kopiera** direkt i vyn.
- Ett tryck på en vanlig JSON/text-export försöker omedelbart kopiera hela filinnehållet till urklipp; popupen bekräftar och erbjuder separat **⬇ Hämta fil**.
- Asynkrona exporter behåller ClipboardItem-flödet under användargesten.
- Gäller LinaStatusExport-baserade exporter centralt. Ingen forskningslogik ändrad.
- Cloudflare: INGEN ÄNDRING. Gen8 orörd. Handel/Forward AV.


## V0.3.19 — ett-klick-kopiering av låst Gen9-kandidatdata
- Generation Engine visar **📋 Kopiera Gen9-kandidatdata** bredvid aktuell Gen9-datakontroll.
- Knappen läser `SOURCE_gen9-data.json` read-only och verifierar SHA-256 `cb84e436a0527b44262949994306dcb85eaf5f10ad88fc7906d443833cc6589c` före kopiering.
- SHA-avvikelse eller ogiltig JSON stoppar exporten; ingen kandidatdata patchas eller normaliseras.
- Syftet är att kunna klistra exakt kandidatfil i ChatGPT på iPhone för full datumvis OHLC-jämförelse mot den redan exporterade Alpaca SIP/all-linjen.
- Ingen forskningsstate ändras. Gen8 orörd. Gen9 EJ GODKÄND. Handel/Forward AV. Cloudflare: INGEN ÄNDRING.


## V0.3.20 — lokal kandidat ↔ Alpaca-jämförelse
- Ny **🔎 Jämför kandidat ↔ Alpaca** kör exakt numerisk OHLC-jämförelse lokalt i browsern mellan låst `SOURCE_gen9-data.json` och redan hämtad Alpaca SIP/all.
- Kandidatens SHA-256 måste vara `cb84e436a0527b44262949994306dcb85eaf5f10ad88fc7906d443833cc6589c`; annars stopp.
- Rapporten redovisar saknade nycklar, exakta rader, avvikande rader/fält, per-symbol summering, max absolut avvikelse och högst 100 exempel. Ingen tolerans används för godkännande.
- Rapporten sätter inte verifieringsflagga automatiskt och patchar aldrig kandidaten. Gen8 orörd; Gen9 EJ GODKÄND; forskning ej startad; Handel/Forward AV. Cloudflare: INGEN ÄNDRING.


## V0.3.21 — kompakt ChatGPT-jämförelserapport
- Full V0.3.20-jämförelse behålls lokalt oförändrad.
- **📋 Kopiera jämförelserapport** exporterar nu en separat kompakt ChatGPT-rapport: hashar, totaler och 16 per-symbol-summeringar; inga 100 exempelrader eller datumlistor.
- Ingen verifieringsflagga ändras automatiskt. Gen8 orörd; Gen9 EJ GODKÄND; Handel/Forward AV. Cloudflare: INGEN ÄNDRING.


## V0.3.21 — runtime-report transport (2026-10-04)
- Full Gen9 kandidat↔Alpaca-jämförelse kan skickas från Lina till separat Worker-endpoint `POST /runtime-report` och sparas under `linasopti/runtime-reports/`.
- Runtime-report är transport/scratch, inte frozen evidence och ändrar inga forsknings-/verifieringsflaggor.
- Browserklienten har knapp `☁️ Spara full rapport till GitHub`.
- Worker-kandidat: `worker/WORKER_PENDING_RUNTIME_REPORT.js`. En-klickskopia: `worker/COPY_WORKER_RUNTIME_REPORT.html`.
- Cloudflare: ÄNDRING KRÄVS. Pending Worker är inte CURRENT förrän deploy och /health verifierats.
- Gen8 får aldrig köras om. Gen9 är fortsatt NOT APPROVED. Handel/Forward AV.


## V0.3.22 — Gen primary run + automatic report persistence
- Gen9 has a primary action high in the Gen section: `▶ Kör Gen9-kontroll`.
- One run orchestrates data-source check → independent Alpaca SIP/all fetch → candidate/Alpaca comparison → automatic full-report persistence to GitHub.
- Manual detailed controls remain as fallback/diagnostics.
- Full comparison report auto-save uses the already deployed `/runtime-report` endpoint; Cloudflare Worker unchanged in this release.
- Permanent MASTER RULE: every Gen places its primary run action high in the Gen section.
- No automatic Gen9 approval. Research remains not started. Handel/Forward remain OFF. Gen8 remains frozen and must never be rerun.


## V0.3.23 — Gen9 primary-button placement + mandatory versioning
- Corrected the Gen9 primary-run placement so `▶ Kör Gen9-kontroll` is inserted directly after the Gen9 heading.
- Permanent rule added: every Lina change increments the release/version and cache token, even the smallest change.
- Gen8 unchanged/frozen. Gen9 remains NOT APPROVED. Research not started. Handel/Forward OFF.
- Cloudflare Worker unchanged.


## V0.3.24 — Gen9 primary-run mount fix
- Fixed Gen9 Data Check mount so the primary `▶ Kör Gen9-kontroll` action does not disappear when the export-primary panel is unavailable at mount time.
- Export/diagnostic controls attach when their panel exists; the Gen9 primary run depends only on the Gen9 section itself.
- No Gen9 approval/research gate changed. Gen8 remains frozen. Handel/Forward OFF.
- Cloudflare Worker unchanged.


## V0.3.25 — Gen9 Data Check syntax repair
- Root cause of the missing Gen9 controls identified: two literal backslash-n sequences existed between JavaScript statements in `gen9-data-check.js`, causing the entire file to fail parsing in the browser.
- Replaced those invalid literal sequences with real line breaks.
- Primary Gen9 run remains directly after the Gen9 heading and retains the automated diagnostic → Alpaca → comparison → GitHub report flow.
- Gen8 frozen; Gen9 NOT APPROVED; research not started; Handel/Forward OFF. Cloudflare Worker unchanged.


## V0.3.26 — Gen9 candidate parser + hard comparison preflight
- Candidate parsing now supports the locked source shape where data is keyed by the 16 symbols; the symbol key is attached before canonical normalization.
- Comparison is blocked unless candidate and Alpaca each contain exactly 20,128 rows and 1,258 rows per expected symbol.
- Runtime-report upload is blocked unless candidateRows, alpacaRows and matchedKeys are all 20,128.
- The V0.3.25 report with candidateRows=0 is invalid as a Gen9 comparison and approves nothing.
- Gen8 frozen; Gen9 NOT APPROVED; research not started; Handel/Forward OFF. Cloudflare Worker unchanged.


## V0.3.27 — Gen9 synlig körstatus på mobil
- Rotorsak i UI: primärknappen låg direkt under Gen9-rubriken men statusfältet som uppdaterades låg längre ned i sektionen; på iPhone gav klick därför ingen synlig återkoppling i aktuell viewport.
- Statusfältet ligger nu direkt under `▶ Kör Gen9-kontroll` och använder `aria-live="assertive"`.
- Körlogik, kandidatparser och hård 20 128 / 16×1 258-preflight är oförändrade från V0.3.26.
- Gen8 är fryst och orörd. Gen9 är fortsatt NOT APPROVED; research ej startad. Handel/Forward AV. Cloudflare: INGEN ÄNDRING.


## V0.3.28 — Gen9 full avvikelsediagnostik
- Kandidat↔Alpaca-jämförelsen samlar nu alla OHLC-fältskillnader diagnostiskt och redovisar kumulativa storleksband från <0.00001 till <10 samt >=10.
- De 100 största absoluta avvikelserna sparas med exakt datum, symbol, OHLC-fält, kandidatvärde, Alpaca-värde och absolut skillnad; kompakt ChatGPT-rapport tar med de 20 största.
- Ingen tolerans används för godkännande och ingen kandidatdata patchas. Gen9 förblir NOT APPROVED och research ej startad.
- Gen8 fryst/orörd; Handel/Forward AV; Cloudflare INGEN ÄNDRING. Version/cache V0.3.28.
\n\n## V0.3.29 — automatiserad Gen9 RAW-diagnostik\n- Ny primär RAW-kontroll hämtar Alpaca SIP/raw för samma 16 symboler 2020–2024, kräver 20 128 rader, verifierar låst kandidat-SHA, gör exakt OHLC-diagnostik och sparar rapport automatiskt via befintlig runtime-report-transport.\n- ALL-resultatet bevaras i sessionen efter RAW-upload; RAW är separat diagnostik och ger inget automatiskt godkännande.\n- Permanent regel om maximal säker automatisering och synlig status vid primärknappen tillagd.\n- Gen8 fryst/orörd; Gen9 EJ GODKÄND; research ej startad; Handel/Forward AV; Worker INGEN ÄNDRING.\n

## V0.3.30 — RAW-rapport får egen sparväg
- RAW-diagnostiken använder nu runtime-report direkt med namnet GEN9_COMPARE_RAW och verifierar att returvägen faktiskt är en GEN9_COMPARE_RAW-fil.
- Ingen sessionStorage-växling via ALL-uploadfunktionen används längre; ALL-rapporten kan därför inte maskera RAW-resultatet.
- Ingen Worker-ändring krävs: runtime-report accepterar säkra separata rapportnamn.
- Gen8 fryst/orörd; Gen9 EJ GODKÄND; research ej startad; Handel/Forward AV.


## V0.3.31 — RAW-knappens montering reparerad
- Rotorsak: gen9-raw.js innehöll ett bokstavligt \\n i JavaScript-källan och boot sökte dessutom en specifik #view-root som inte är Gen9-mountens kontrakt.
- RAW-modulen är syntaktiskt reparerad och mount söker nu Gen9-sektionen från document, samma faktiska DOM som Gen9 byggs i.
- RAW-knappen monteras direkt efter Gen9-statusen och statusen används för all feedback.
- Gen8 fryst/orörd; Gen9 EJ GODKÄND; research ej startad; Handel/Forward AV; Worker INGEN ÄNDRING.


## V0.3.32 — synlig \\n\\n-text borttagen
- Två bokstavliga backslash-n mellan Gen9-script-taggarna i index.html togs bort; Safari renderade dem som synlig text under login-kortet.
- Version/cache V0.3.32. Ingen logik ändrad.


## V0.3.33 — automatiserad Gen9-justeringsdiagnos
- Ny kontroll kör Alpaca SIP med adjustment split, dividend, spin-off och all mot samma låsta kandidat (SHA cb84e436a0527b44262949994306dcb85eaf5f10ad88fc7906d443833cc6589c), 20 128 rader per variant.
- Exakt OHLC utan tolerans; fulla diagnostiska summeringar och största avvikelser sparas separat som GEN9_ADJUSTMENT_DIAGNOSTIC.
- Resultaten rankas diagnostiskt efter >=10-avvikelser och därefter totalt antal fältavvikelser. Ingen kandidat patchas och diagnosen kan inte godkänna Gen9 eller starta research.
- Gen8 fryst/orörd; Gen9 EJ GODKÄND; research ej startad; Handel/Forward AV; Worker INGEN ÄNDRING.


## Gen9 four-anomaly independent evidence — 2026-10-05
- Saved: evidence/GEN9_FOUR_ANOMALIES_INDEPENDENT_2026-10-05.json.
- All four Alpaca SIP/all differences >=10 are independently supported on the candidate side: NVDA 2024-06-10 high ~122.75; TSLA 2021-03-04 high ~222.82; TSLA 2021-03-01 high ~239.67; TSLA 2020-12-18 close ~231.67.
- Conclusion: these four are Alpaca comparison anomalies, not grounds to patch the locked candidate.
- Evidence complete for this diagnostic stage, but Gen9 remains NOT APPROVED pending explicit gate decision; research not started; Handel/Forward OFF.


## V0.3.34 — Gen9 dataset gate passed
- Explicit user gate recorded in evidence/GEN9_DATASET_GATE_2026-10-05.json.
- Locked candidate SHA cb84e436a0527b44262949994306dcb85eaf5f10ad88fc7906d443833cc6589c, 20 128 rows, is accepted as Gen9 research data input.
- Candidate remains unchanged. This gate does not start Gen9 research and does not lock a Gen9 research plan.
- Gen8 remains frozen. Handel/Forward remain OFF. Worker unchanged.


## V0.3.35 — approved Gen9 dataset wired into research gate
- Gen9 engine now accepts only the approved SOURCE_gen9-data.json bound to SHA-256 cb84e436a0527b44262949994306dcb85eaf5f10ad88fc7906d443833cc6589c and evidence/GEN9_DATASET_GATE_2026-10-05.json.
- Browser verifies exact file bytes SHA before JSON parsing, then requires 20,128 rows / 1,258 per each of 16 symbols and aligned valid OHLC dates.
- Workflow fetches the approved candidate + gate automatically after plan evidence; manual iPhone JSON import is no longer the normal path.
- Research method/spec unchanged. Plan remains NOT LOCKED and research NOT STARTED. Gen8 frozen; Handel/Forward OFF; Worker unchanged.


## V0.3.36 — Gen9 plan locked
- Explicit user decision locked the reviewed Gen9 plan before research.
- Locked SPEC hash: 083bcb30; canonical SPEC SHA-256: a1362ccffcf76b4d4fb548c1db115d5def35cc3f0a41252f1e43465ef56b135f.
- Immutable gate evidence: evidence/GEN9_PLAN_LOCK_2026-10-05.json.
- Dataset remains locked to SHA-256 cb84e436a0527b44262949994306dcb85eaf5f10ad88fc7906d443833cc6589c.
- Research NOT started. Gen8 frozen. Handel/Forward OFF. Worker unchanged.


## V0.3.37 — immutable Gen9 plan-lock adoption
- Browser workflow can now adopt the already-approved immutable GitHub plan lock after exact SPEC hash/SHA and dataset SHA verification.
- Adoption writes only the matching local plan checkpoint/state; it does not create a new plan decision or change SPEC.
- This closes the GitHub-lock/localStorage gap before Gen9 research start. Research remains unobserved until the runner is actually invoked. Handel/Forward OFF; Gen8 frozen; Worker unchanged.


## V0.3.38 — Gen9 research start authorized
- Explicit user research-start gate saved as evidence/GEN9_RESEARCH_START_2026-10-05.json, bound to locked SPEC hash/SHA and approved dataset SHA.
- On Lina mount, the gate can mechanically adopt the immutable plan, verify/freeze approved data evidence and invoke the locked runner without another iPhone confirmation.
- Auto-start is blocked if researchOpened, any checkpoint, summary or summaryFreeze already exists; no rerun/rescue path added.
- Fold evidence/checkpoint discipline remains unchanged. Handel/Forward OFF; Gen8 frozen; Worker unchanged.


## V0.3.39 — Gen9 global post-login start fix
- Root cause of V0.3.38 no-op confirmed: authorizedAutoStart was invoked only from Gen9 mount, while clean login always opens Dashboard.
- Explicit Gen9 start gate is now checked globally in startApp after GitHub bootstrap/recovery and normal route start.
- Dashboard gets a visible high status line for Gen9 progress/completion/error.
- Existing single-use/no-rerun guards remain unchanged. Handel/Forward OFF; Gen8 frozen; Worker unchanged.


## V0.3.40 — Gen9 locked dataset wrapper parser fix
- V0.3.39 global start correctly stopped before any fold with DATA: symbol saknas AMD.
- Root cause verified from exact Git blob: SOURCE_gen9-data.json is wrapper schema LINA-GEN9-RAW-DATA-1 with symbol arrays under data.AMD etc.
- validateApprovedDataset now requires ok=true + exact wrapper schema + object data, then normalizes input.data.
- Locked source file, source SHA, row requirements, SPEC and research method unchanged. This is parser/transport only.
- No Gen9 fold had been observed before this fix. Handel/Forward OFF; Gen8 frozen; Worker unchanged.
