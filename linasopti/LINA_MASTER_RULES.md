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
2. Senaste `LINA_HANDOFF_CLEAN_CORE_*.md`.
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

## Gemensamma styrdokument — permanent regel
- Versionsspecifika handoff-/regel-/checklistfiler ska inte skapas för varje release (t.ex. `LINA_HANDOFF_CLEAN_CORE_V0299.md`, `V0300.md`, `V0301.md`).
- `LINA_MASTER_RULES.md` är den permanenta, gemensamma källan för regler och lärdomar som ska följa projektet mellan alla framtida releaser.
- `LINA_RELEASE_CHECKLIST.md` är den permanenta, gemensamma releasekontrollen och ska uppdateras i stället för att versionskopieras.
- Projektet ska ha en gemensam aktuell handoff/statusfil som uppdateras över tid. Aktuell release/version skrivs inne i filen och ska normalt inte vara en del av filnamnet.
- Historiska incidenter och lärdomar som fortfarande påverkar framtida arbete sammanfattas i de gemensamma styrdokumenten; nya versionsfiler skapas endast om ett uttryckligt revisions-/arkivbehov beslutas av användaren.
- Vid framtida dokumentationsändringar ska befintliga gemensamma styrdokument uppdateras i första hand. Ingen ny versionsfil får skapas slentrianmässigt.
