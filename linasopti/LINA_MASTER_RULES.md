# LINA MASTER RULES — auktoritativ projektregelbok

Status: AKTIV från Clean Core V0.2.64. Denna fil är överordnad äldre handoffs när arbetsmetod eller permanenta regler skiljer sig. Historiska evidensfiler får aldrig skrivas om av denna fil.

## 1. Arbetsprincip
- Automatisera allt fram till ett verkligt mänskligt beslut. Användaren ska inte behöva klicka igenom säkra, deterministiska delsteg ett och ett.
- Standard för flerstegskedjor: EN startknapp, synlig progress, spara varje avslutat delsteg innan nästa, återuppta från nästa osparade steg efter avbrott, aldrig köra om ett redan observerat/sparat resultat.
- "Spara allt först, fortsätt sedan."
- Färre men större säkra releaser föredras framför många små releaser och repetitiva skärmbildskontroller.
- Stoppa endast vid genuina beslut, irreversibla lås/frysningar eller fel som kräver mänsklig bedömning.

## 2. Start av varje ny Lina-sittning/release
Innan kod ändras ska ChatGPT läsa:
1. `LINA_MASTER_RULES.md`.
2. `LINA_HANDOFF_CURRENT.md` (versionsspecifika äldre handoffs är endast historik).
3. Den faktiska kod som berörs i basversionen.
Det krävs inte att hela historiska Linasopti läses om. Äldre material används när den aktuella ändringen kräver det.

## 3. Release-gate
Före ZIP ska `LINA_RELEASE_CHECKLIST.md` gås igenom. Ny handoff ska ange att MASTER RULES och checklistan kontrollerats. En MASTER RULE får inte medvetet ändras utan uttryckligt beslut från användaren.

## 4. Clean Core
- En boot, en router, central state/localStorage och separat API-lager.
- Ingen cloneNode-navigation/rebind, inga konkurrerande DOMContentLoaded/boot-kedjor och inga exakta patchversionsguards för init.
- Strategilogik ska inte bäddas in i UI.
- Migrerad modul jämförs/godkänns innan gammal auktoritativ funktion ersätts.

## 5. Forskningsdisciplin
- Handel AV under forskning. Robotmognad ändras endast genom formellt beslut.
- Plan/runnerspec/gates låses före observerade resultat som de ska bedöma.
- Ingen efterhandsändring av regler, gates eller ranking för att rädda ett resultat.
- Alla varianter och negativa resultat bevaras. Ingen rerun/rescue efter observerat/sparat resultat.
- Observerad historik får inte presenteras som ny unseen holdout. Forward får endast använda data som verkligen blev framtida efter relevant kandidatfrysning; aldrig retroaktiv start.
- Kandidatval ska vara deterministiskt enligt regler låsta före resultat. Assistenten ska inte manuellt välja "bäst" efter facit.
- Gen4 rankingimplementation före första Gen4-run: score = PF*100 + positiveFolds*20 - abs(DD)*150 - concentration*25 + min(trades,250)/25. Endast varianter som klarar samtliga gates kan kvalificera sig; P/L är inte primärt. Formel/tie-break får inte ändras efter första observerade Gen4-resultat.

## 6. Evidens, GitHub och state
- GitHub-first för permanent forskningsstate/evidens. Lokal rå marknadsdata/cache får stanna lokal.
- Evidens fryses och synkas; befintlig evidens skrivs aldrig över.
- Unika lokala fynd får markeras men får inte retroaktivt ändra fryst forskning.
- Vid konflikt vinner verifierad kanonisk GitHub-state för forskningsprogression.

## 7. Export och diagnostik
- `📥 Exportera Lina-status` ska alltid vara lätt åtkomlig globalt.
- Moduler ska kunna exportera exakt diagnostik/resultat när det behövs.
- När ChatGPT behöver exakt Lina-state ska exportfil begäras före många skärmbilder, konsolkopior eller manuell avskrift.

## 8. Generationer
- Ny generation är ett nytt preregistrerat experiment, aldrig en rescue av föregående generation.
- Kopiera maskinen, inte experimentet: återanvänd säker infrastruktur/UI men aldrig tidigare generations resultat/state som nya resultat.
- Varje generation har egen identitet/state/evidens och lämnar tidigare frysta generationer orörda.

## 9. Gen4 fasta ankare
- Planhash `8d51311d`.
- Runnerspechash `d1daab90`.
- Research hard-stop `2024-12-31`.
- 2025-01-01–2026-09-10 är observerad och får inte användas som ny holdout.
- Gates: OOS trades >=100, PF >=1.20, DD <=12%, positiv OOS, max 40% single-symbol gross-profit share, minst 3/4 positiva folds.
- Fyra familjer: Breddbalanserad trend; Relativ styrka med symboltak; Equal-risk pullback; Koncentrationsmedveten ensemble.
- Gen4 ska köras som en säker automatkedja med `▶ Kör hela Gen4`; varje familj sparas före nästa och redan sparad familj hoppas över vid återupptagning.
- Efter 4/4 stoppas kedjan för granskning/frysning. Ingen kandidat eller Forward öppnas automatiskt.

## 10. Cloudflare Worker
- Worker ändras inte om en release inte faktiskt kräver det och behovet har verifierats.

## Irreversibelt state och synk
- Irreversibelt research-state får aldrig backas av GitHub/app-state-synk. FamilyResults, fryst evidens och frysbeslut mergeas monotont: redan observerade/sparade resultat bevaras.
- Under pågående automatiserad researchkedja pausas app-state-autosynk. Evidens får frysas/synkas separat.
- Recovery får endast återläsa exakt redan sparad/fryst evidens; den får aldrig köra om research eller rekonstruera saknade resultat.

## Lärdom Gen4 recovery/synk (permanent)
- Irreversibelt research-state ska mergeas monotont; äldre remote state får aldrig backa senare observerad evidens.
- Immutable evidence 409 får endast räknas som redan säkrad när svaret explicit bekräftar att originalet redan finns; aldrig overwrite.
- Tekniska state/synkfel repareras genom exakt evidens-recovery, aldrig genom research-rerun eller rekonstruktion.
- Diagnostik ska bära request/fil, HTTP-status och API-svar utan hemligheter.
- Automatiska kedjor testas mot exakt slutstate de själva producerar.
- Automatisera säkra steg mellan verkliga mänskliga beslutspunkter; recovery är en förstaklassfunktion.
- Generation Engine ska återanvända infrastrukturen, medan nästa generations experiment definieras först från lärdomar i föregående frysta generation.

## Generation Engine — permanent kontrakt från V0.2.71
- Generation Engine är gemensam processmotor, inte ett sätt att återanvända gamla forskningsresultat.
- En ny generation börjar `NOT_DEFINED` och får inte automatiskt ärva plan, parametrar, resultat eller kandidat från föregående generation.
- Fryst generation är immutable referens. Motorn får läsa dess status/lärdomsunderlag men aldrig mutera eller köra om den.
- Standardlivscykel: PLAN → PLAN_LOCKED → RUNNERSPEC_LOCKED → ENGINE_VERIFIED → RESEARCH_RUNNING → RESEARCH_COMPLETE → SUMMARY_FROZEN → CANDIDATE_FROZEN → FORWARD.
- Säkra deterministiska steg automatiseras till nästa genuina mänskliga beslut. Frysning av nytt experiment/avgörande beslut kräver uttrycklig mänsklig handling.
- Forward-anchor skapas först vid relevant kandidatfrysning och får aldrig backdateras.

## Lärdomsunderlag före ny generation — från V0.2.72
- Efter kandidatfrysning ska Generation Engine skapa ett läsbart/exportbart underlag från den frysta generationens observerade resultat och dokumenterade metodbrister.
- Underlaget är inte en plan och får aldrig i sig öppna research, skapa runnerspec eller starta Forward.
- Metodbrister i en fryst generation rättas endast i en ny generation; den frysta generationens evidens/semantik ändras aldrig.
- Nästa generations plan ska uttryckligen skilja mellan vad som bevaras och vad som korrigeras innan planlås.

## Gen5 planlås — från V0.2.73
- Gen5-planen måste vara komplett och hashad före research. Planhash V0.2.73: `d501a5e1`.
- Mänskligt godkännande låser planen men startar inte research i samma steg.
- Full train→OOS, verklig kombinerad portfölj, använda parametrar och hashad exakt rankingformel är obligatoriska Gen5-metodkrav.
- Efter planlås ska runnerspec + engine verifieras mot planen innan någon observerbar Gen5-körning tillåts.

## Gen5 självkörande kedja — från V0.2.74
- Gen5 runnerspec hash är `db1c4d7f`; exakt rankingformel ingår i den hashade runnerspecen.
- Efter låst plan får runnerspec-lås + engine-verifiering automatiseras eftersom de är deterministiska och inte observerar forskningsresultat.
- Gen5 research startas med en uttrycklig mänsklig start. Därefter får kedjan automatiskt köra alla fyra familjer, spara full train/fold-evidens före continuation, frysa sammanställning, göra låst deterministiskt kandidatval och skapa Gen6-underlag.
- Gen5 använder faktisk TRAIN-selektion före respektive OOS-fold. Kombinerad ensemble ska exekveras som en gemensam portfölj/equity curve.
- Gen6 får inte startas av Gen5-kedjan. Forward förblir stängd.

- Ny generation får inte gå in i RESEARCH_RUNNING förrän full data-preflight för låst universum och samtliga forskningsperioder är godkänd.

## Gen5 datakällediagnos — från V0.2.76
- Datakällproblem före första observerade Gen5-resultat felsöks med read-only probe, aldrig genom research-rerun.
- Probe ska logga endpoint/request, HTTP-status, content-type, sanerat svarsexempel, JSON-struktur, radantal och första/sista datum utan hemligheter.
- Research-startknapp ska inte exponeras efter blockerad dataproblematik förrän probe visar en fungerande dataväg och full preflight därefter passerar.
- Tekniskt preflight/probe-stopp före observerade resultat ska visas som STOPPED_BEFORE_RESEARCH, inte RESEARCH_RUNNING.

- Data loaders must prefer explicit market-row fields (`rows`, `bars`, `data`) over generic arrays; metadata arrays such as `symbols` must never be normalized as bars.


## Robotmognad 2.0 — från V0.2.79
- Robotmognad får aldrig ändras manuellt per release; den beräknas från en låst 100-poängsmodell.
- Modellhash: `6e8908ca`. Kriterierna summerar exakt 100 poäng och bygger på verifierbara state/evidens-milstolpar.
- Forsknings-FAIL får inte i sig sänka redan intjänad processmognad. Framtida Forward, broker, paper och live-gate har egna ej förtjänade poängblock.
- Modellens kriterier/poäng får inte ändras efter att framtida resultat observerats utan ett uttryckligt nytt modellbeslut/version.

## Gen5 slutlig evidenssynk — från V0.2.79
- Gen5-resultat får aldrig köras om för att reparera synk. Pending familj/summary ska matchas mot exakt evidensnamn i evidence-kön och reconcileas till `FROZEN · GITHUB ✓` först efter lyckad synk eller explicit immutable-409.
- Generation Engine är primär ingång under Forskning; äldre forskningsvyer bevaras som historik/evidens.


## Gen5 sync UX — från V0.2.80
- Evidenssynk måste alltid ge synlig status. Ingen knapp får tyst lyckas eller tyst göra noll arbete.
- Reconcile av redan GitHub-fryst Gen5-evidens får endast uppdatera status/referenser; forskningsresultat får aldrig räknas om.

## Gen6 decision barrier (V0.2.81)
- Gen6 plan proposal `206c11d7` is review-only until explicitly approved/locked by the user.
- No Gen6 runnerspec, research, candidate or Forward may be created before that lock.
- Gen5 is immutable source evidence; Gen6 must never modify or rerun Gen5.


## Gen6 planlås — från V0.2.82
- Gen6-planhash `206c11d7` är mänskligt godkänd och får låsas immutable med GitHub-evidens.
- Planlås får inte starta Gen6-research, skapa kandidat eller öppna Forward.
- Efter planlås är nästa säkra automatiska steg runnerspec + engine-verifiering; research kräver därefter uttrycklig start enligt Generation Engine-kontraktet.

## Single Version Source (från V0.2.83)
- Aktuell Lina-release definieras en gång i `version.js` (`window.LinaVersion`).
- Synliga aktuella versionsetiketter och modulernas aktuella releaseidentitet ska läsa denna källa; ingen modul får ha en egen aktuell hårdkodad release som kan driva isär.
- Cache-busters är distributionsmetadata och måste verifieras automatiskt mot `version.js` före ZIP-bygge.
- Versionsnummer får aldrig användas som forsknings-/initieringsgrind.

## Single Version Source — permanent rule (V0.2.84)
- Current UI release identity has exactly one runtime source: `version.js` / `window.LinaVersion`.
- Login/header/module views must not hardcode the current release as fallback text.
- `index.html` may contain cache-busting query tokens generated for the release, but the release audit must verify every active asset token equals `version.js` cache value before packaging.
- Historical version numbers inside archived evidence, reports, migrations and frozen research metadata are historical facts and must not be rewritten.

## Gen6 runnerspec + engine verification — från V0.2.85
- Gen6 planhash `206c11d7` är låst och får inte ändras av runnerspec-steget.
- Gen6 runnerspec ska hashberäknas deterministiskt från hela canonical SPEC; exakt rankingformel ingår i hashen.
- Risk-/regimstyrning och volatilitetsskalning måste påverka positionsrisk/exponering före exekvering, aldrig efterhandsfiltrera resultat.
- Gates förblir ≥100 OOS-affärer, PF ≥1.20, DD ≤12 %, positiv OOS, koncentration ≤40 %, positiva folds ≥3/4.
- Runnerspec + engine-verifiering är ett säkert automatiskt steg efter planlås. V0.2.85 får inte starta Gen6-research, skapa kandidat eller öppna Forward.


## Gen6 självkörande research — från V0.2.86
- Gen6 research kräver explicit mänsklig start efter plan `206c11d7`, runnerspec `768e8d3e` och Engine VERIFIED.
- Starten gör full data-preflight innan `researchOpened=true`.
- Därefter körs fyra Gen6-familjer automatiskt; varje familjs kompletta TRAIN→OOS-evidens sparas före nästa och redan sparade resultat hoppas över vid återupptagning.
- Summary fryses, kandidat väljs endast deterministiskt bland PASS-familjer och Gen7-underlag skapas även om ingen kandidat finns.
- Gen7 och Forward startas aldrig av Gen6-kedjan; Handel AV.


## Generation Engine arbetsordning — permanent regel från V0.2.89
- Aktuell/senaste generation och dess aktiva arbetssteg ska alltid visas överst i Generation Engine.
- Tidigare generationer visas därefter i fallande generationsordning; äldre fryst historik/audit ligger längre ned.
- När en ny generation blir aktuell ska ordningen följa state/generationsnummer automatiskt, inte kräva manuell flytt av HTML-sektioner.
- UI-ordningen får aldrig ändra forskningsstate, evidens, planhashar, runnerspecar eller Forward/Handel-status.

## Automatisera säkra kedjor — permanent regel från V0.2.90
- Om flera efterföljande steg kan genomföras deterministiskt utan en ny verklig mänsklig beslutspunkt ska Lina göra hela kedjan med ett enda användarinitiativ.
- Tekniska mellanlägen som planlås efter redan genomförd mänsklig granskning, runnerspec-hashning, engine-verifiering, datapreflight, evidenssparning, summary, deterministiskt kandidatval och GitHub-verifiering ska inte kräva egna releaser/klick när de säkert kan kedjas.
- Varje intern säkerhetsbarriär finns kvar och måste passera i rätt ordning. Auto Pipeline ska stoppa vid första fel och får aldrig kringgå planhash, runnerspechash, preflight, evidens-före-continuation eller immutable-regler.
- Observerad/fryst forskning får aldrig köras om för att reparera ett senare tekniskt/synkfel. Recovery fortsätter från exakt sparad state/evidens.
- Forward, broker/paper/live och Handel är separata verkliga beslutsgates och får inte öppnas automatiskt av generationskedjan.
- UI ska visa aktuell generation överst och i första hand erbjuda ett begripligt Auto Pipeline-flöde i stället för många små tekniska knappar.

## Gen7 Auto Pipeline — V0.2.90
- Mänsklig granskning av Gen7-planförslag `6876470e` är genomförd före Auto Pipeline.
- Auto Pipeline får därefter låsa exakt plan, skapa/hash-låsa runnerspec, verifiera Engine, göra data-preflight och köra hela Gen7 utan fler manuella mellanbeslut.
- Gen7 stabilitetskontroll definieras och hash-låses före första researchresultat: max 55 % av positiv fold-bruttovinst från en positiv OOS-fold, varje OOS-fold PF minst 0,80 och vald weak-regime-exponering högst 0,65.
- Ordinarie gates kvarstår: ≥100 OOS-affärer, PF ≥1,20, DD ≤12 %, positiv OOS, koncentration ≤40 %, positiva folds ≥3/4.
- Komplett fold/variant-evidens sparas före continuation. Summary och kandidat fryses deterministiskt. Gen8-underlag skapas men Gen8 och Forward startas inte.


## Auto Pipeline slutintegritet — permanent regel från V0.2.91
- Auto Pipeline får lämna över till användaren först när en slutlig integritetskontroll har verifierat aktuell release/state, evidenskompletthet och att Handel/Forward-spärrarna är intakta, eller när ett konkret blockerande fel visas.
- GitHub/evidensskrivningar ska serialiseras. Parallella sync-anrop får inte skapa commit-race eller falskt gröna slutstatusar.
- HTTP 409 är endast godkänd immutable-idempotens när API-svaret exakt bekräftar `Evidencefilen finns redan – original skrivs inte över`; övriga 409 är konflikt och ska förbli blockerande tills recovery verifierat exakt fryst evidens.
- En avslutad generations tekniska recovery får aldrig köra om forskning. Den får endast synka/reconcilea redan fryst state/evidens.
- Global Lina-status ska använda aktuell runtime-release, aktuell låst Robotmognadsmodell och inkludera aktuell Generation Engine-state/integritetsstatus. Full rå diagnostik ska kunna exporteras separat så standardexporten förblir begriplig.

## Evidence completeness och recovery — från V0.2.92
- En generations integritet får inte avgöras enbart av statusfält i Generation Engine eller totalt antal poster i evidenskön. Varje obligatorisk evidensfil ska finnas som egen `FROZEN · GITHUB ✓`-post och matchas mot generationens exakta evidensnamn.
- Om en fryst evidensfil behöver åter-materialiseras från redan sparat fryst research-state får det endast ske deterministiskt från exakt sparade resultat + original run-timestamp och med en förhandskänd SHA-256-kontroll. SHA-avvikelse stoppar recovery före nätverkssynk.
- Recovery får aldrig anropa marknadsdata eller research-runner och får aldrig ändra observerade resultat, gates, ranking eller kandidatbeslut.
- Nästa generations plan får visas först när föregående generations obligatoriska evidens är komplett och integritetsgrön.


## Kompletta paket + Generation Engine — permanent regel från V0.2.93
- Efter ett uttryckligt mänskligt godkännande ska Lina inte dela upp säkra efterföljande steg i små releaser. En release ska om möjligt bära hela den meningsfulla etappen fram till nästa genuina beslut.
- Innan en Lina-fil/paket efterfrågas från användaren ska tidigare samtalsfiler, Library och tillgänglig arbetsyta kontrolleras. Användaren ska endast behöva ladda upp igen om filen faktiskt inte går att återfinna.
- Generation Engine ska generaliseras: nya generationer uttrycks primärt som låst plan/runnerspec/data till motorn. Generationsspecifika specialfall ska undvikas när samma kontrakt kan uttryckas generellt.
- Efter mänskligt godkänd generationsplan får Auto Pipeline utföra planlås → immutable evidens → runnerspec/hash → Engine verify → preflight → research → evidens före continuation → summary/frysning → deterministiskt kandidatbeslut → nästa generations underlag → GitHub-verifiering → slutintegritet, med stopp endast vid konkret fel eller nästa verkliga beslut.
- Forward, broker/paper/live och Handel förblir separata mänskliga gates.

## Gen8 preregistrering — V0.2.93
- Gen8-planhash `be68328d` är mänskligt godkänd före första Gen8-resultat.
- Gen8 använder stabilitetsmedveten TRAIN-selektion över fördefinierade kalenderårsdelregimer före varje OOS-fold; OOS får aldrig påverka TRAIN-valet.
- Ordinarie gates kvarstår: ≥100 OOS-affärer, PF ≥1,20, DD ≤12 %, positiv OOS, koncentration ≤40 %, positiva folds ≥3/4.
- Stabilitetsgate är låst före research: varje OOS-fold PF ≥0,80; max 55 % av positiv fold-bruttovinst från en fold; vald weak-regime-exponering ≤0,65. TRAIN-selektion föredrar min subregim-PF ≥0,70 och straffar PF-spread över 2,50; exakt formel ingår i runnerspec-hashen.
- Gen8 Auto Pipeline får skapa Gen9-underlag men får inte starta Gen9, Forward eller Handel.

## Incidentlärdom V0.2.93–V0.2.97 — permanent, NON-NEGOTIABLE
- Ingen recovery får byggas på antaganden om state. Före kodändring ska exakt producerande state-nyckel, alla läsare, alla skrivare, synkfilter och bootordning spåras.
- En ny permanent state-nyckel räknas inte som GitHub-synkad bara för att `eligible()` accepterar namnet. Release-gaten ska verifiera att nyckelns verkliga payload ryms genom collect → merge → PUT → apply och inte filtreras bort av storleksgränser.
- Synk får aldrig tyst hoppa över en obligatorisk state-post. Om en obligatorisk post är för stor ska synken stoppa med explicit fel och diagnostik.
- Recovery ska testas mot minst fyra scenarier: helt saknad state, gammal/trasig state, korrekt fryst state och nyare state. Nyare irreversibelt state får aldrig backas.
- En fryst generation får aldrig åter bli körbar. Både motor och UI ska blockera rerun av fryst generation.
- UI får inte visa motsägande state (t.ex. GODKÄND samtidigt som "granska planen"). Aktuell generation, nästa beslut, knappar och statusrad ska härledas från samma state.
- Robotmognad är monotont intjänad enligt låst modell. Recovery/synk får inte tappa tidigare verifierade kriterier. Verifierade mognadsbevis ska bevaras separat från flyktiga UI/state-källor.
- Syntaxkontroll + ZIP-integritet räcker inte som releasebevis. Generation Engine kräver end-to-end state-test av det faktiska startläget och det förväntade slutläget.
- En blockerfix får göras separat, men efter första misslyckade blockerfixen ska rotorsaksanalys genomföras innan ytterligare release. Ingen serie gissnings-hotfixar.
- Efter en incident ska orsak → misslyckade försök → verifierad rotorsak → permanent skydd dokumenteras i handoff och relevanta checklistor innan normal utveckling fortsätter.


## Worker/API allowlist — permanent lärdom från V0.2.99
- När en ny permanent app-state-nyckel läggs till i frontend-synken måste Worker/API:s exakta allowlist verifieras i samma release innan leverans.
- Frontend `eligible()` och Worker `validateAppState()` är ett kontrakt och ska testas tillsammans; en nyckel får aldrig vara tillåten på bara ena sidan.
- Undantag utanför `lina_clean_*` ska vara explicit namngivna, aldrig godkännas med bredare prefix. Generation Engine-nyckeln är `lina_generation_engine_v0273`.
- Frontend- och Worker-gränser för post/paket ska vara kompatibla och releasekontrollen ska stoppa vid mismatch.
- Exakt API-fel ska spåras till den kodrad som producerar felet innan fix byggs.


## Gen8 state/Worker-incident — verifierad efter faktisk deploy V0.2.99
- Permanent state måste verifieras som ett helt kontrakt: frontend save/write → sync/collect → Worker/API-validering → GitHub canonical storage → GET/restore → restore-validering → frontend hydrate → localStorage → boot → monotont slutstate. En fix i endast en riktning räcker inte.
- Exakta feltexter ska spåras till producerande kod före ny release. Incidentens faktiska blockerare var `validateAppState()` som endast accepterade `lina_clean_*` och därför nekade `lina_generation_engine_v0273` med `Otillåten App-state nyckel`.
- Worker-kod som användaren faktiskt kör är auktoritativ vid Worker-felsökning. Antaganden om en Worker-kopia i ett webbpaket får aldrig beskrivas som verifierad deploy.
- Efter Worker/API-ändring ska både skrivväg och läs/restore-väg provas. Godkänt slutläge kräver att GitHub/State/Evidence är gröna, aktuell generation återställs korrekt, Robotmognad återges från låst modell och Handel/Forward-spärrar är intakta.
- Gen8-incidenten visade att dashboard kan visa ofullständigt mognadsvärde innan Generation Engine-state hydreras. Releasekontroll ska därför verifiera mognad efter full state-hydrering, inte bara första dashboard-renderingen.
- Dokumentation/handoff får inte påstå att en kodändring, syntaxkontroll, ZIP-kontroll eller deploy är verifierad utan faktisk verktygs-/källkontroll.
- Leveransregel till användaren: när en hel kodfil ska klistras in ska hela färdiga filen levereras för ett-klick-kopiering; användaren ska inte behöva pussla in funktionspatchar manuellt.
- Gen7 är immutable och får aldrig rerunnas. Gen8 får inte startas förrän dess state är återställt till godkänt beslutsläge och sync/integritet är grön.

## Gemensamma styrdokument — permanent regel
- Versionsspecifika handoff-/regel-/checklistfiler ska inte skapas för varje release (t.ex. `LINA_HANDOFF_CLEAN_CORE_V0299.md`, `V0300.md`, `V0301.md`).
- `LINA_MASTER_RULES.md` är den permanenta, gemensamma källan för regler och lärdomar som ska följa projektet mellan alla framtida releaser.
- `LINA_RELEASE_CHECKLIST.md` är den permanenta, gemensamma releasekontrollen och ska uppdateras i stället för att versionskopieras.
- Projektet ska ha en gemensam aktuell handoff/statusfil som uppdateras över tid. Aktuell release/version skrivs inne i filen och ska normalt inte vara en del av filnamnet.
- Historiska incidenter och lärdomar som fortfarande påverkar framtida arbete sammanfattas i de gemensamma styrdokumenten; nya versionsfiler skapas endast om ett uttryckligt revisions-/arkivbehov beslutas av användaren.
- Vid framtida dokumentationsändringar ska befintliga gemensamma styrdokument uppdateras i första hand. Ingen ny versionsfil får skapas slentrianmässigt.


## Bekvämlighetsautomation — permanent UI-princip från V0.3.01
- Återkommande administration ska göras med ett tryck när det kan ske säkert och deterministiskt; användaren ska inte behöva göra manuella skärmbilder, filnamn eller repetitiva exportsteg i onödan.
- Global skärmbild får endast läsa/rendera aktuell UI-vy lokalt. Den får aldrig ändra research-state, evidens, Forward, kandidatbeslut eller Handel.
- Skärmbild ska ge explicit fel vid misslyckad rendering och får aldrig visa falskt lyckad status.


## Canonical Source Base + Resume Never Replay — permanent regel från V0.3.04
- `LINA_MASTER_RULES.md` är enda auktoritativa regelkällan. Checklist och handoff får kontrollera/beskriva regler men aldrig definiera konkurrerande regler.
- Exakt en komplett bas ska identifieras som kanonisk utvecklingsbas (`LINA_CURRENT_BASE.zip`). Före varje bygge ska aktuell konversation, Library och tidigare genererade artefakter sökas innan användaren ombeds ladda upp något igen.
- Ingen release får byggas från minne, rekonstruerad kod eller antagen äldre version. Faktisk bas ska materialiseras och verifieras före ändring.
- **Resume Never Replay:** stoppad Auto Pipeline fortsätter från första säkert ofärdiga steg. Ett observerat/checkpointat forskningsresultat får aldrig exekveras igen för att reparera sync, UI, evidence eller continuation.
- Ett befintligt familjeresultat får endast hoppas över efter strukturell validering av obligatoriska folds, TRAIN-varianter, selectedParams och OOS-mått. Ofullständigt checkpointat resultat ska stoppa och kräva recovery — aldrig rerun.
- Persist-before-next-step är tvingande: observerat resultat → lokal checkpoint → evidence-state → sync/verifiering enligt kontrakt → först därefter fortsatt kedja.
- Releasekontroll ska köras mot det verkliga inkommande state som uppgraderingen ska möta, inklusive `RESEARCH_RUNNING`, delvis synkad evidens och frysta generationer. Tom installation ensam räcker inte.
- Globala Generation Engine-kontroller ska ligga i Engine-toppen; generationsspecifika kontroller ska ligga i respektive generation.
- Vid varje blockerande incident ska exakt felproducerande kod sökas i den faktiska basen. Om feltexten inte finns där ska detta dokumenteras som versions/cache/runtime-avvikelse och inte ersättas med en gissad rotorsak.


## Auto Pipeline click-receipt och stoppdiagnostik — permanent regel från V0.3.04
- Varje Auto Pipeline-start ska checkpointa ett beständigt `UI_CLICK_RECEIVED` innan första async-steg. Därmed kan ett faktiskt klick skiljas från UI-/eventproblem efter reload/render.
- Pipeline ska beständigt spara senaste försökstid, senaste steg och exakt stoppfel i Generation Engine-state. Ett UI-rerender får aldrig radera stopporsaken.
- Vid `RESEARCH_RUNNING` får diagnostik/releasefix inte rerunna redan observerade familjer; endast statevalidering, continuation från första ofärdiga steg och evidens/synk får ske.


### STATE-ROUNDTRIP-01 — Checkpoint survives sync
A persisted research checkpoint must survive asynchronous evidence/GitHub sync. If sync replaces local Engine state with a snapshot that lacks the just-observed family, restore the exact in-memory checkpoint and attach evidence; never recompute the observation.

## Skärmbild i Chrome/Windows — permanent regel från V0.3.05
- Ett klick på 📸 ska ge exakt ett resultat: kopierad PNG i bildurklipp, eller en nedladdad PNG om urklippet nekas eller saknas. Ingen dubbel leverans.
- Begäran till urklippet måste initieras under klickets användaraktivering; asynkron rendering levererar sedan PNG via ClipboardItem-promise.
- Renderingsfel ska ge Fel-status och får inte döljas som urklippsfel eller följas av en tom fil. Ingen research-, evidence-, Forward- eller Handelsstate ändras.

## Chrome-bildrendering — kontroll från V0.3.06
- CSS-bilder med relativa adresser ska bäddas in som data före SVG/canvas-rendering. CSS-text måste XML-escapas i SVG.
- Om PNG-renderingen ändå misslyckas ska exakt fel visas direkt för användaren, inte enbart i knappens title.

## Canvas origin-clean — permanent regel från V0.3.07
- SVG med foreignObject får inte laddas som blob:-URL före Canvas/PNG-export i Chrome. Använd en självständig data:-URL med inbäddade resurser.
- `toBlob`-felet om tainted canvas ska spåras till SVG-bildens ursprung innan annan skärmbildslogik ändras.

## Starttidsdiagnostik — från V0.3.08
- Optimera inte bort app-state PUT eller evidensverifiering på antagande om latens. Mät auth, GET, PUT och evidence separat i användarens faktiska miljö.
- Tidsmätning sparas endast i sessionStorage och ändrar inte Generation Engine, evidens, Forward eller Handel.

## Oförändrat app-state vid uppstart — V0.3.09
- Efter godkänd GET och befintlig säker merge får bootstrap avstå POST endast när samtliga app-posters värdesträngar och nyckelmängd är identiska med serverns godkända LINA-APP-SYNC-1-paket (Handel false). Alla förändrade eller nya app-poster kräver fortsatt godkänd POST före apply.
- Enda uttryckliga undantaget vid denna jämförelse är `lina_clean_sync_diagnostics_v0270`: begäransloggar bevaras lokalt tills nästa full/manuell synk. De får inte ensamma kräva en GitHub-skrivning vid varje login och får inte rapporteras som räddade/synkade poster på snabbvägen.
- Evidensverifiering körs även på snabbvägen. Reconciliation får bara uppdatera updatedAt när evidensmetadata verkligen ändras; oförändrade frysta resultat förblir byte-identiska.

## Användarpreferens — exporter längst upp (2026-09-29)
- Exporter ska vara enkla att hitta och samlade längst upp i den relevanta huvudvyn, direkt under rubriken. Huvudexporten ska vara tydlig; övriga exporter samlas under en utfällbar Fler exporter.
- Samma exportåtgärd ska inte dupliceras längre ned. Befintliga exportfunktioner och forskningsspärrar bevaras när knappar flyttas.
- I Generation Engine: aktuell forskningsstatus och exporter för senaste aktiva generationen ligger synliga. Äldre generationers planer, runnerspec och resultat samlas under Fler exporter. När Gen9 är aktuell ska dess plan, state/resultat och datakällkontroll vara synliga; Gen8-resultat flyttas till Fler exporter.


## Forskningsgranskning inför Gen9 — 2026-09-30
- TRAIN får endast använda information till och med träningsperiodens slut. Signal-, entry- och exitgränser måste definieras separat; framtida avslut får aldrig påverka TRAIN-urval.
- En ny urvalsregel verifieras mot faktisk ranking och valda parametrar. Likadan bonus till alla alternativ ändrar inte rangordningen.
- Familjenamn bevisar inte metod: kontrollera faktisk signalvariation, köpstopp, riskexponering och komponenternas gemensamma beroenden.
- Frysta exporter används för analys före nya experiment. Observerad historik är utvecklingsdata, aldrig ny unseen holdout.
- Drawdown måste ange om den bygger på avslutade affärer eller löpande mark-to-market. Dessa mått får inte presenteras som likvärdiga.
- Granskning av metodbrister ändrar aldrig tidigare fryst evidens, gates eller resultat. Rättningar görs i en ny, förhandslåst generation.
- Gen9-parametrar nedan är endast förslag tills uttryckligt planbeslut; inget planlås eller researchstart följer av dokumentationen.

## Rapportexport till fil och texturklipp — 2026-09-30
- Rapportexporter ska både spara fil och försöka kopiera exakt rapporttext för Ctrl+V/⌘V i chatten. Kopiering gäller text, inte en filbilaga.
- Urklippsbegäran initieras vid klick även när rapporten hämtas asynkront. Nekat/saknat urklipp ger synlig kopieringsknapp och manuell textmarkering, aldrig falskt Kopierad.
- Export får inte ändra forskning eller lås. Skärmbildens separata ett-resultat-regel ändras inte.
- Datakällans HTTP 200 eller radantal räcker inte: kontrollera att varje datum ligger inom begärd period. Datakällrapporten 2026-09-30 visade EODHD 2025-09-30 vid begäran om 2020. Ingen sådan data får användas för begärd historik.


**Cloudflare-kod – obligatorisk leveransregel:** När användaren behöver klistra in komplett Worker-kod ska koden INTE skrivas ut i chatten. Leverera i stället en kompakt ett-klick-kopieringslösning/HTML-hjälpare som kopierar hela den kompletta Worker-filen till urklipp. Användaren ska bara behöva trycka på kopieringsknappen och sedan klistra in i Cloudflare. Visa full kod endast om användaren uttryckligen ber att få se den.


## Worker CURRENT/PREVIOUS — permanent regel från V0.3.21
- Exakt komplett senast verifierad och deployad Cloudflare Worker sparas som `linasopti/worker/WORKER_CURRENT.js`.
- Exakt föregående verifierad/deployad Worker sparas som `linasopti/worker/WORKER_PREVIOUS.js` för snabb rollback.
- Före en ny verifierad Worker görs CURRENT till PREVIOUS; först efter lyckad deploy + verifiering får den nya koden bli CURRENT.
- Prepared/pending Worker får aldrig skriva över CURRENT eller PREVIOUS. Pending kod lagras separat.
- Vid misslyckad deploy ändras varken CURRENT eller PREVIOUS.
- Om historisk PREVIOUS saknas när regeln införs får den inte fabriceras från en äldre repo-kopia; PREVIOUS etableras vid nästa verifierade Worker-byte.


## Primary run placement for every Gen
- Every Gen view MUST place its primary run action high in the Gen section, directly after the Gen heading/status and before long descriptions, exports, diagnostics, or fallback controls.
- The primary run action SHOULD orchestrate the safe mechanical steps for that Gen when those steps can be automated.
- Detailed/manual controls remain available as fallback and diagnostics.
- Automation of the run MUST NOT bypass approval gates, start research, enable Handel/Forward, or convert diagnostics/comparisons into verification unless the applicable gate is explicitly satisfied.


## Mandatory version increment
- Every Lina change MUST increment the visible release/version number, including the smallest UI, text, cache, documentation, bug-fix, or placement change that is shipped as part of Lina.
- The version bump and cache-token bump are part of the same change and must not be deferred.
- After writing, read back `version.js` and `index.html` and verify the new version/cache before calling the change complete.
\n\n## Maximal säker automatisering — permanent regel från V0.3.29\n- När flera mekaniska steg kan genomföras säkert utan ett nytt mänskligt beslut ska Linas primära knapp automatisera hela kedjan: hämtning, validering, jämförelse, rapportskapande och beständig rapportsparning.\n- Manuella detaljknappar är reserv/felsökning, inte normalflöde.\n- Automatisering får aldrig kringgå beslutsgates, godkänna en generation, starta forskning, öppna Forward/Handel, skriva över fryst evidens eller patcha kandidatdata.\n- Status, fel, klart-resultat och nästa steg ska visas direkt vid den aktiva primära knappen högt i aktuell viewport.\n

## 11. UI-prioritet och synlig återkoppling
- **PRIORITY UI RULE:** Det som kräver användarens uppmärksamhet, beslut eller åtgärd ska alltid visas allra högst upp i den aktuella vyn, före export, historik, tidigare generationer och sekundär statusinformation.
- **UI ACTION FEEDBACK RULE:** Varje användaråtgärd som ändrar state måste omedelbart ge en tydlig synlig förändring i samma vy. Ett lyckat klick får aldrig vara tyst eller se ut som om inget hände.
- Efter state-ändrande klick ska UI återrenderas från det faktiskt sparade state-värdet och visa ny status/knapptext eller tydligt KLART/STOPPAD-resultat.
- Vid releaseverifiering ska faktisk DOM-placering kontrolleras; det räcker inte att anta att en prioriterad komponent ligger högst på grund av sin generationsordning eller CSS-klass.

## 12. Workflow-kontrakt: fel, state och knappar
- **NO SILENT FAILURE:** Fel eller blockerade steg måste omedelbart visas högt i aktuell vy som STOPPAD/BLOCKERAD med begriplig orsak och nästa möjliga steg. Lina får aldrig lämna användaren med en oförändrad vy som kan tolkas som att klicket inte registrerades.
- **SAVED ≠ VISIBLE ≠ VERIFIED:** Sparat state, synlig UI-status och verifierad funktion är tre separata nivåer. En ändring får inte rapporteras som fungerande enbart för att kod/state sparats. Relevant nivå ska verifieras före KLART.
- **ONE CLICK = ONE RESULT:** Ett användarklick ska utlösa exakt en avsedd åtgärd. Primärknappen ska skyddas mot dubbelstart medan åtgärden pågår och därefter visa ett entydigt resultat.
- **RESUME, NEVER REPEAT:** Efter reload, avbrott, enhets- eller chatbyte ska workflow återuppta från senaste säkert beständiga steg. Redan observerat/sparat forskningsresultat får aldrig köras om; samma princip gäller mekaniska delsteg när säkert completion-state finns.
- **GITHUB = PERMANENT STATE:** Beslut, godkännanden, lås, frysningar och annat state som måste överleva webbläsar-/enhetsbyte ska göras beständigt via kanonisk GitHub/app-state-synk. localStorage får vara cache/arbetsstate men får inte vara enda permanenta källa för kritiskt state.
- **NO FALSE BUTTON PROMISES:** Knapptext ska beskriva exakt den åtgärd som den aktuella releasen faktiskt utför. En knapp får inte lova nästa pipeline-/research-/synksteg om den endast registrerar ett godkännande eller utför ett delsteg.
- **CURRENT ACTION CONTRACT:** Högst upp i varje huvudvy ska användaren kunna se aktuell status, vad Lina väntar på och exakt nästa åtgärd. Om ingen mänsklig åtgärd behövs ska det uttryckligen framgå.

## 13. SIZE-AWARE EXECUTION
- **SIZE-AWARE EXECUTION:** Planera stora filer, kodändringar, GitHub-skrivningar, Worker-kod, state/evidence, exporter och artefakter i logiska verifierbara delsteg redan innan första skrivningen. Försök inte först med ett onödigt stort verktygsanrop och dela upp först efter fel.
- Uppdelningen får aldrig ändra det avsedda slutresultatet eller skapa en halv release som betraktas som klar.
- Varje del ska vara deterministisk, återupptagningsbar och verifierbar. Beroenden och laddningsordning ska bestämmas före skrivning.
- Irreversibla/observerade steg får starta först när samtliga nödvändiga delar är skrivna, återlästa och verifierade som en komplett release.


## 14. END-TO-END RELEASE VERIFICATION
- **END-TO-END RELEASE VERIFICATION:** Ingen release får kallas COMPLETE enbart för att kod är skriven, syntaxkontrollerad, committad eller deployad. Den verkliga kedjan GitHub → deploy → webbläsare → bootstrap/auktoritativt state → synlig UI → avsedd åtgärd → nytt permanent state/evidens ska verifieras för de delar releasen påverkar.
- UI är aldrig sanningskälla för kritiskt workflow-state. Permanent GitHub/app-state/evidens är auktoritativt och UI ska rekonstrueras från detta efter bootstrap.
- Resume/idempotens är ett obligatoriskt release-scenario för återupptagningsbara flöden: start → säkert checkpoint → avbrott/reload → återuppta exakt checkpoint → ingen rerun → fortsätt.
- Versionsbyte ska verifieras från föregående verkliga release med befintlig cache/localStorage, inte endast i en ren session.
- Efter en state-ändrande release ska permanent state/evidens återläsas och jämföras med synlig UI innan releasen rapporteras som fungerande.
- Regeln är generell och ska återanvändas i andra projekt där samma bygg-/releaseprincip är relevant.

## 15. STATE COMPATIBILITY GATE
- **STATE COMPATIBILITY GATE:** Varje release som ändrar state-schema, bootstrap, merge, migrering, cache eller resume måste före versionssättning testas mot både aktuellt och verkligt legacy-state. Produktionsstart får aldrig vara första testet av state-migrering.
- Permanent state ska ha explicit schemaVersion när strukturen kan utvecklas. Schemaändringar ska hanteras med deterministiska, versionsbundna migreringar; övrig kod får inte förutsätta att nya fält redan finns.
- Saknat fält (undefined), false och true är tre skilda tillstånd. För varje säkerhetskritiskt fält ska legacy-default och hårdstopp vara explicit definierade. Faktiskt true för Handel/Forward får aldrig normaliseras bort.
- Merge för oberoende generationer/domäner ska vara separerad. GenN får inte kunna raderas, nedgraderas eller påverkas av att GenN-1 saknas eller har annan struktur.
- Obligatoriska merge-scenarier: gammalt lokalt + nytt remote; nytt lokalt + gammalt remote; remote GenN + saknat lokalt GenN; lokalt GenN + saknat remote GenN; båda med olika antal checkpoints; saknade nya fält; verklig konflikt i samma observerade checkpoint.
- För observerade checkpoints gäller monoton merge: union får bevara identiska observationer/evidens, men olika result-SHA för samma checkpoint är alltid hårdstopp.
- Cross-device resume ska verifieras från tom lokal cache/IndexedDB: bootstrap från permanent state → verifierad rekonstruktion av lokalt arbetsstate → exakt befintlig checkpoint → ingen rerun → nästa steg.
- State Compatibility Suite ska kontrollera semantiskt slutresultat, inte bara syntax eller att funktionen inte kastar fel. Förväntat state ska jämföras fält för fält för kritiska workflowfält.
- Flight recorder/diagnostik för bootstrap → state → eligibility → run → data/checkpoint restore ska finnas återanvändbar och kunna visas högt i UI vid stopp utan att ändra forskningslogik.
- En release som berör state/synk/resume får inte markeras COMPLETE förrän State Compatibility Gate och END-TO-END RELEASE VERIFICATION båda är godkända.



## 16. AUTHORITATIVE WRITE RECEIPT
- Den komponent som utför en permanent write ansvarar också för auktoritativ read-back-verifiering innan den får rapportera success.
- GitHub-write via Worker får inte räknas som VERIFIED enbart för att Contents API PUT lyckades eller för att en statisk/deployad fil-URL går att läsa.
- Worker ska efter write läsa exakt GitHub-blob via blob-SHA, beräkna innehållets SHA-256 och jämföra mot det avsedda innehållet.
- Ett permanent write-kvitto ska minst innehålla path, gitBlobSha, contentSha256 och verifiedAt; commitSha ska sparas när GitHub returnerar den.
- En redan existerande immutable fil får endast adopteras om dess GitHub-blob read-back matchar exakt förväntad SHA-256. Existens eller HTTP 409 ensam är aldrig verifiering.
- Klient/state får låsa upp nästa irreversibla eller observerade steg först efter verifierat auktoritativt kvitto.
- Retry/polling får inte användas för att kompensera för verifiering mot fel källa. Eventual consistency hanteras endast efter att rätt auktoritativ källa valts.
- Om samma felklass återkommer två gånger ska lokal patchning stoppas och write/read/verify-arkitekturen granskas end-to-end före nästa fix.


## Deploykedja före ändring — UNIVERSAL REGEL FÖR ALLA PROJEKT
- Ändra aldrig en antagen produktionsfil. Bevisa först vilken fil och vilken kedja som faktiskt leder till den körande versionen.
- Före första write ska hela leveranskedjan spåras och verifieras: faktisk runtime → källfil → build/config → deployautomation → live-mål.
- Filnamn som CURRENT, PRODUCTION, LIVE, PENDING eller liknande är aldrig bevis för vad som körs eller deployas.
- Befintlig automation och projektkonfiguration ska alltid kontrolleras före manuella lösningar, inklusive relevanta buildfiler, deploykonfiguration och CI/CD-workflows.
- E2E-verifiering börjar före ändringen: dependency- och deployspårning är en release-gate, inte bara efterkontroll.
- Om något tidigare fungerat automatiskt ska orsaken till att automatiken verkar ha slutat fungera utredas innan ett manuellt arbetsflöde införs.
- Om samma felklass återkommer ska arbetet stoppas på punktfixnivå och den gemensamma systemorsaken spåras.
- Regeln gäller Lina och alla nuvarande och framtida projekt där ChatGPT gör kod-, build-, deploy- eller produktionsändringar.


## Lina Worker deploykedja — verifierad 2026-10-05
- Cloudflares deploykälla styrs av `linasopti/worker/wrangler.jsonc` och är `linasopti/worker/WORKER_PENDING_RUNTIME_REPORT.js`.
- `WORKER_CURRENT.js` får inte antas vara deploykälla enbart på grund av namnet.
- GitHub-workflow `.github/workflows/lina-worker-promote.yml` är den befintliga promotionskedjan för PENDING → CURRENT → PREVIOUS och ska kontrolleras/användas före manuellt Cloudflare-flöde.
- Före varje Worker-ändring ska `wrangler.jsonc` och promotionsworkflowen verifieras på aktuell branch så att kedjan inte antas från historik.
- Gen10 är fryst och får inte köras om eller ändras av Worker-/deployarbete.

## 17. FINAL RENDER GATE
- Prioriterad status ska monteras efter sista bootstrap och route-render som kan ersätta aktuell vy.
- Ett tidigt start-event bevisar inte synlig funktion om appen renderar om senare.
- Releasekontroll ska verifiera att statusen fortfarande syns efter bootstrap och slutlig render.
- Försvunnen status betyder att UI-verifieringen har misslyckats och blockerar nästa observerade eller irreversibla steg.
- Frysta gamla diagnostikrader får inte dominera över aktuell generations status och nästa beslut.
- Regeln gäller alla våra nuvarande och framtida projekt med bootstrap, routing eller asynkron state-recovery.


## 18. EXPLICIT ASYNC DEPENDENCY CHAIN — UNIVERSAL REGEL
- Två asynkrona steg där B kräver resultat/kvitto från A får aldrig startas som oberoende timers, events eller fire-and-forget-anrop.
- B ska `await` A:s auktoritativa resultat i samma explicit kedja, eller triggas av ett unikt verifierat completion-kvitto från A.
- Timing, timeoutordning, nätverkshastighet eller renderhastighet får aldrig användas som implicit synkronisering.
- Ett dependency-steg som ännu inte är klart ska ge synlig WAIT/STOP-status; det får inte tyst `return` och sedan lämna workflowet utan continuation.
- Release Gate → startkvitto → observerad research är en strikt sekvens och ska implementeras som en enda await-kedja.
- Regeln gäller alla våra projekt.


## Gen13 research-start — V0.3.80
- Gen13 research-start är uttryckligen mänskligt godkänd efter synlig V0.3.79 Engine Verification + Release Gate PASS.
- Låst runnerspec SHA-256 `e8cd7a717f3240f3650c326e610457d122a3b144a2c5494036f0618db4afbb42` och RANK_TO_CAPACITY får inte ändras under körningen.
- Researchkedjan ska vara resumable utan rerun: varje observerad fold checkpointas före immutable evidence och nästa fold får inte börja innan auktoritativt GitHub-kvitto verifierats.
- Gen10–Gen12 är frysta och får aldrig köras om. Handel/Forward förblir AV efter Gen13 closeout tills separat mänskligt beslut.


## V0.3.81 — Gen13 GitHub write-race fix
- V0.3.80 nådde Release Gate PASS men stoppades säkert under Gen13 innan någon immutable fold-evidence skapades.
- Rotorsak: Gen13 immutable evidence och ordinarie app-state autosync kunde skriva samtidigt till samma GitHub-branch. GitHub avvisade stale branch-head med `is at … but expected …`.
- Gen13 tar nu research/write-ownership redan före dataset-evidence. Ordinarie app-state autosync är blockerad från godkänt Gen13 startReceipt tills summaryFreeze är klar.
- Befintlig immutable Gen13 DATA-evidence återanvänds via exakt SHA/read-back. Eventuellt lokalt fold-checkpoint får endast återupptas; aldrig simuleras om.
- Ingen Worker-ändring krävdes. Runnerspec/hash och Gen13-metod är oförändrade. Handel/Forward AV.

## Versionsdisciplin — permanent regel från V0.3.87
- Minsta ändring i Lina-projektet kräver ett nytt versionsnummer. Detta gäller kod, HTML/CSS, konfiguration, dokumentation, diagnostik, cache-/asset-revisioner och deploy-only/deploy-touch-ändringar.
- Ingen `r2`, `hotfix`, query-token eller annan ändring får publiceras under ett redan använt versionsnummer.
- Ny ändring => höj `version.js` och alla aktiva cachetokens konsekvent före deploy.
- Releasekontrollen ska stoppa publicering om ändrade Lina-filer förekommer utan nytt versionsnummer.

## 19. SYNTHETIC FIXTURE VALIDITY GATE — permanent från V0.3.94
- Ett syntetiskt test får inte användas som release-/research-gate förrän testfixturens egna premisser har verifierats oberoende av den produktionsfunktion som testas.
- För varje boundary-test ska fixture-generatorn eller en separat oracle explicit verifiera relationerna som testnamnet påstår, t.ex. `priorMaxClose < testClose <= priorMaxHigh`, innan signalens förväntade utfall kontrolleras.
- Testet ska skilja på **fixture validity** och **system under test**. En ogiltig fixture ska rapporteras som `FIXTURE_INVALID`, inte som produktionslogikens FAIL.
- Positivt fall, negativt fall och relevanta gränsfall ska konstrueras från beräknade referensnivåer när det är möjligt, inte från handvalda tal som råkar antas ligga på rätt sida om gränsen.
- Syntetiska tester och syntax/semantikkontroller ska köras mot exakt den fil som ska publiceras före browser/live-verifiering. Browsern får inte vara första testmiljö för deterministiskt testbar logik.
- Om en syntetisk gate stoppar release ska först avgöras om felet ligger i fixture/oracle eller i system under test. Produktionslogik/runnerspec får inte ändras för att få ett felkonstruerat test att passera.
- En fixture-fix efter preregistrering får endast ändra testdata/oracle när den låsta produktionssemantiken är bevisat oförändrad; annars krävs ny metodprövning/runnerspec.
- Regeln gäller alla framtida generationer och återanvändbara release-gates.



## 19. FIX → LEARN → PERMANENT RULE — UNIVERSAL REGEL
- Varje gång ett fel, en felaktig implementation, ett felaktigt testantagande eller en brist i arbetsflödet upptäcks och rättas ska arbetet, innan nästa beroende steg, också göra en kort rotorsaksanalys.
- Frågan är inte bara "vad rättades?" utan "vilken generell felklass gjorde att detta kunde hända?".
- Den återanvändbara lärdomen ska permanent sparas i MASTER RULES, RELEASE CHECKLIST eller annan auktoritativ projektdokumentation där den faktiskt kan förebygga samma felklass.
- Spara generell orsak/princip, inte en smal regel för exakt den enskilda buggen. Om en befintlig regel redan täcker felklassen ska den förstärkas i stället för att skapa duplicerade specialregler.
- En fix är därför inte metodiskt COMPLETE förrän kedjan **FIX → ROOT CAUSE → GENERAL LESSON → PERMANENT RULE/CHECK → VERIFY** är genomförd.
- Om lärdomen kan maskintestas ska den så långt möjligt flyttas från enbart dokumentation till executable preflight/release-gate/test.
- Denna metaregel gäller Lina och alla nuvarande och framtida projekt där ChatGPT gör ändringar.

## 20. SYNTHETIC TEST FIXTURE VALIDITY GATE — lärdom V0.3.92 → V0.3.94
- Ett syntetiskt säkerhets-/kontraktstest får inte användas som release-gate innan själva test-fixturens premisser har verifierats numeriskt/semantiskt.
- Varje testfall ska bevisa både sin avsedda positiva/negativa gräns och varför inputen faktiskt ligger på rätt sida om de trösklar testnamnet påstår.
- För jämförelsetester ska relevanta referensvärden kunna härledas före assertionen; ett test får inte bara anta att en konstruerad siffra ligger mellan två nivåer.
- Browser/produktion får inte vara första miljön som avslöjar ett deterministiskt fixture-fel när samma test kan verifieras före deploy.
- Vid fixture-fel ska produktions-/forskningslogiken och låst spec lämnas orörda om rotorsaken endast är testdatan. Rättelsen får inte användas för att ändra hypotesen efter observation.

## Fix → Learn: recovery-identitet får inte gissas (V0.3.96)
- När en teknisk korrigering avslöjar en återanvändbar felklass ska lärdomen sparas som permanent regel samtidigt som fixen görs; framtida implementationer ska kontrolleras mot regeln.
- Immutable evidence-recovery får aldrig gissa servervald sökmetadata såsom kalenderdatum, katalog eller commit. Recovery ska utgå från den frysta evidensens stabila identitet/filnamn och låta den auktoritativa GitHub-vägen upptäckas och verifieras.
- Om write-sidan väljer lagringsmetadata måste read-sidan antingen få tillbaka den exakta metadata som del av ett verifierat kvitto eller kunna slå upp objektet auktoritativt utan gissning.
- Namnbaserad recovery ska stoppa vid noll träffar eller tvetydiga flera träffar; den får aldrig välja "senaste" eller första matchningen.
- Recovery är read-only beträffande observerade forskningsresultat: tekniska lookup-/path-fixar får aldrig utlösa research-rerun, ändra fryst evidence eller rekonstruera saknade resultat.
