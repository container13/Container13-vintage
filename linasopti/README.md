# Lina Clean Core V0.2.33

## V0.2.32 – GitHub Shared Forward State
- G2/G3 Real Forward har nu gemensam kompakt master i GitHub via Cloudflare Worker.
- Forward Evidence Center läser GitHub-master vid öppning och sparar automatiskt efter `Uppdatera G2 + G3`.
- `Synka GitHub` initialiserar/kontrollerar master manuellt. Lokal backup/import finns kvar som recovery.
- GitHub-token ligger endast som Worker secret. Skrivning kräver separat `LINA_SYNC_KEY`, som endast hålls i browserns sessionStorage.
- Worker validerar anchor 2026-09-11, G2 `15efd75a`, G3 plan `75838ed5` och Handel AV. Konflikt stoppar skrivning.
- GitHub-state är gemensam Real Forward-master; permanent forskningshistorik/evidence förblir separat och fryst.
- Robotmognad 48/100. Handel AV. Ingen strategi-/parameter-/gateändring.
- Cloudflare Worker: ÄNDRING KRÄVS. Full kod: `cloudflare-worker-v0232.js`.

# Lina Clean Core V0.2.30

## V0.2.30 – Forward Integrity & Sync
- Forward Evidence Center kan nu exportera en kompakt **Backup Forward-state** och importera/synka den på en annan dator.
- Varje G2/G3 forward-affär får ett deterministiskt permanent trade-ID. Import merge:ar på ID och dubbelräknar inte samma affär.
- Kandidat, planhash och anchor valideras före import. Vid konflikt stoppas synken i stället för att skriva över data.
- G3 månadsmodeller valideras per månad; olika modell för samma månad är en blockerande konflikt.
- Senaste marknadsdag/refresh och refreshhistorik merge:as. Permanent README/handoff/evidence-historik skrivs aldrig över av browser-state.
- localStorage fortsätter endast bära kompakt runtime/resultat; ingen rå marknadsdata läggs där.
- Robotmognad 48/100. Handel AV. Ingen strategi-, parameter-, gate- eller forwardregel ändrad.
- Cloudflare Worker: INGEN ÄNDRING.

# Lina Clean Core V0.2.29

## V0.2.29 – History-aware Forward State
- Forward Evidence Center skiljer nu permanent dokumenterad projekthistorik från lokal browser-runtime.
- Tom localStorage/IndexedDB på en ny dator får inte längre beskrivas som att G2/G3 aldrig har körts.
- G2/G3 visas som dokumenterat aktiva från anchor 2026-09-11 även när lokal runtime-data saknas.
- Lokala mätvärden visas endast när de faktiskt finns på den aktuella enheten; inga saknade siffror uppfinns från historiken.
- Permanent evidens/history är facit; localStorage/IndexedDB är runtime/cache/checkpoint.
- Ingen forskningslogik, kandidat, plan, anchor, robotmognad eller handel ändrad.
- Cloudflare Worker: INGEN ÄNDRING.


## V0.2.28 – Forward Evidence Phase
- Efter G2–G12 Research Review flyttas huvudfokus till riktig Real Forward.
- Ny **Forward Evidence Center** uppdaterar G2 + G3 sekventiellt med en knapp och visar deras evidensstatus tillsammans.
- Gemensam forward-rapport + Raw JSON kan exporteras.
- Formella forward-milstolpar: 60 / 120 / 250 nya stängda affärer per modell.
- Robotmognad kvar 48/100; historiska tester eller tid höjer den inte automatiskt. Handel AV.
- G2/G3 forward-rapporternas releaseversion/exportfilnamn synkade till V0.2.28; forskningsregler/state-nycklar är oförändrade.
- Rå warmup/marknadsdata sparas inte i localStorage; endast kompakt forward-state/resultat.
- Cloudflare Worker: INGEN ÄNDRING.

## Historik från tidigare releaser

## V0.2.27 – G7–G12 Evidence Freeze + Research Review
- G7–G12 är avslutade som **6/6 PASS · FRYST**. Kandidat `15efd75a` ändras inte.
- Planhashar: G7 `247c474a`, G8 `46c80eee`, G9 `c82b5c2a`, G10 `80385a7e`, G11 `0cc6ede6`, G12 `403fef49`.
- De två exporterade V0.2.26-bevisfilerna ligger byte-identiskt i COMPLETE.
- G7: 6 positiva år; 2023 negativt bevaras. G8: största positiva symbolandel 23,03 %, 11/16 icke-negativa.
- G9: 10 000 Monte Carlo; p95 max-DD 4,69 %. G10: 86,67 % positiva proxy-grannar.
- G11: även BOTH_20 positiv (+1 133,08; PF 1,045). G12: 1,5× DD ca −5,50 %.
- Historisk diagnostik; inte ny oberoende OOS. G2/G3 Real Forward har högre evidens. Robotmognad kvar 48/100. Handel AV.
- Permanent workflow: paketera oberoende förregistrerade tester i batterier och använd IndexedDB/checkpoint för stora data; localStorage ska bara bära kompakt state/resultat.
- Cloudflare Worker: INGEN ÄNDRING.

## V0.2.15 – G4 Evidence Freeze
- G4 plan `95d2e735` är avslutad som **PASS · FROZEN**. Kandidat `15efd75a` ändras inte.
- Fryst resultat: 185 affärer, P/L +6 522,15, PF 1,29, WR 51,35 %, DD −3,70 %, slut 106 522,15.
- 6 positiva kalendersegment; största positiva symbolandel 23,03 % (CAT).
- De två exporterade V0.2.14-bevisfilerna är inlagda oförändrade i COMPLETE tillsammans med `LINA_G4_RESEARCH_GATE_RESULT_V0215.md`.
- Arkivet har permanent G4-post `PASS · FROZEN`. G4-vyn visar fryst status.
- G4 är portabilitets-/robusthetsevidens, inte ny oberoende OOS. G2/G3 Real Forward har fortsatt högre evidens.
- Ingen strategi-, parameter-, gate- eller forwardlogik ändrad. Robotmognad 48/100. Handel AV.

## V0.2.14 – G4 Universe Robustness Runner
- G4-plan `95d2e735` var låst i V0.2.12 innan resultatmotorn byggdes.
- Ny `g4-engine.js` hämtar 2020-01-01–2026-09-10 för det frysta 16-aktieuniversumet + SPY och kör exakt fryst G2-kandidat `15efd75a`.
- Ingen parameterändring, rescue eller symbolselektion efter resultat.
- Förregistrerad PASS/HOLD/FAIL-gate bedöms automatiskt och rapport/Raw JSON kan exporteras.
- Hämtningen checkpointas årsvis/symbolvis så en avbruten körning kan återupptas.
- G2/G3 Real Forward lämnas orörda. Robotmognad 48/100. Handel AV.

## V0.2.14 – G4 Universe Robustness Plan
- Ny separat forskningsgeneration: **G4 Universe Robustness**.
- G2 `15efd75a` och G3 lämnas helt orörda; G2/G3 Real Forward fortsätter parallellt från anchor 2026-09-11.
- G4 testar exakt fryst G2-strategi på ett annat, förregistrerat 16-aktieuniversum utan parameterändring.
- G4 testuniversum: AAPL, MSFT, AMZN, GOOGL, META, JPM, XOM, UNH, JNJ, PG, KO, CAT, HD, DIS, NKE, WMT. Noll överlapp med ursprungliga G2-universumet.
- Period: 2020-01-01 → 2026-09-10. Planhash `95d2e735`.
- Förregistrerad PASS/HOLD/FAIL-gate finns i `LINA_G4_UNIVERSE_ROBUSTNESS_PLAN_V0214.md`.
- V0.2.14 öppnar **inte** G4-resultatet. Först låses planen i UI; körmotorn byggs i nästa steg.
- G4 är robusthets-/portabilitetstest, inte ny oberoende OOS. Real Forward har fortsatt högre evidens.
- Robotmognad kvar 48/100. Handel AV.


## V0.2.11 – G3 Research Gate PASS + Real Forward
- G3 plan `75838ed5` är avslutad som metodtest: 181 affärer, +18 446,11, PF 1,4851, WR 51,38 %, DD -3,38 %.
- G3 Research Gate: **PASS**, därefter metodfrysning. Ingen rescue/efteroptimering på 2023–2026.
- Ny `g3-forward-engine.js` + `g3-forward.js`.
- G2 och G3 Real Forward går parallellt från anchor 2026-09-11, Handel AV.
- G3 septembermodell är fryst `69147890` tränad t.o.m. 2026-08-31; framtida månadsval använder endast då känd data och den frysta topp-12-poolen.
- Milstolpar 60 / 120 / 250 stängda affärer. Robotmognad kvar 48/100.
- Ny dokumentation: `LINA_G3_RESEARCH_GATE_RESULT_V0211.md` och `LINA_HANDOFF_CLEAN_CORE_V0211.md`.


## Status
Clean Core är en teknisk omstart av Lina, inte en kunskapsomstart. V0.58.8 COMPLETE är permanent legacy-checkpoint/facit före Clean Core och ska aldrig skrivas över.

V0.2.10 gör Uppdatera-flödet deterministiskt. V0.1.4 litade enbart på att sessionStorage-rensningen överlevde navigeringen. Nu skickas dessutom en explicit `force_login=1`-markör till nästa sidladdning. Login-koden ser markören innan någon auto-unlock kan ske, rensar upplåsningsflaggan igen och visar login. Därefter städas URL:en utan extra reload.

## V0.2.10 ändrat
- Uppdatera rensar `sessionStorage["linasopti_unlocked"]`;
- navigerar till `index.html?force_login=1&update=<timestamp>`;
- login-koden kontrollerar `force_login=1` före all auto-unlock;
- upplåsningsflaggan rensas en andra gång på den nya sidladdningen;
- URL:en städas tillbaka till ren `/linasopti/` eller `/linasopti/index.html` innan login;
- persistent Lina-data/checkpoints i `localStorage` lämnas orörda;
- login med knapp och Enter lämnas i samma fungerande flöde;
- flat filstruktur kvarstår.

## PERMANENTA REGLER FÖR CHATGPT / UTVECKLING
1. `kör` betyder bygg/ändra de riktiga filerna omedelbart enligt senast överenskommen riktning.
2. ALDRIG skapa/generera/mocka en bild om användaren inte uttryckligen ber om en bild.
3. Bygg från senaste godkända COMPLETE-release, aldrig från CHANGED-paketet.
4. Varje release levereras som två ZIP: COMPLETE och CHANGED FILES ONLY.
5. Lina använder flat filstruktur: alla projektfiler direkt i samma mapp och direkt i ZIP-roten. Inga undermappar om vi inte uttryckligen beslutat annat.
6. Versionsnummer, cache-buster, UI, README, handoff och filnamn ska synkas.
7. Gamla releaser/handoffs är orörbara snapshots. Skapa ny handoff per release.
8. Testa syntax, navigation, berörda flöden, filstruktur, ZIP och version före leverans. Rapportera PASS/FAIL och SHA256.
9. Ändra bara det som behövs. Fungerande delar lämnas orörda om ändringen inte kräver annat.
10. Ingen regression accepteras som bieffekt.
11. Mobil-first och responsivt även för 13 tum och större skärmar.
12. Varje vy ska tydligt svara på: var är jag, varför är jag här, vad gör jag nu, vart går Tillbaka.
13. En knapp = en tydlig handling.
14. Forskningsregler och UI/infrastruktur ändras inte samtidigt.
15. Frysta forskningsregler ändras bara som uttryckligt nytt experiment/version.
16. Misslyckade tester och negativa resultat bevaras i historiken.
17. Tre misslyckade fixar på samma grundproblem => stoppa patchandet och ompröva arkitekturen.
18. Ingen legacy-kod följer med "för säkerhets skull".
19. Fungerande login/session-beteende ska bevaras och regressionstestas.
20. README + senaste handoff ska räcka för att starta nästa ChatGPT-chatt.
21. Ta checkpoint vid tydligt verifierat fungerande läge.
22. Handel är AV. Ingen livehandel aktiveras.
23. Robotmognad är 48/100 tills ny evidens motiverar annat.
24. 2023–2026 får inte beskrivas som färsk orörd OOS i sin helhet.
25. V0.58.8 COMPLETE är permanent legacy-checkpoint före Clean Core.
26. ÅTERANVÄND BEVISAT FUNGERANDE FUNKTION FÖRST: om en funktion redan har fungerat korrekt i en tidigare Lina-version ska den implementationen alltid undersökas och testas som förstahandsval innan funktionen skrivs om eller byggs på nytt. Men tidigare kod får inte kopieras blint: först ska det tidigare beteendet jämföras mot det aktuella kravet. Om kravet skiljer sig ska den fungerande implementationen användas som facit/referens och bara den nödvändiga beteendeskillnaden göras. Ny implementation görs endast om den gamla inte passar Clean Core-arkitekturen eller om det finns ett dokumenterat skäl. Vid omskrivning ska beteendet jämföras mot den tidigare fungerande versionen. Detta gäller bland annat login, Enter-inloggning, Uppdatera, navigation, API-anrop, datainsamling, beräkningar och export.

## Clean Core arkitektur
- en boot;
- en router;
- ett centralt state/localStorage-lager;
- separat API-lager;
- ingen cloneNode-navigation/rebind;
- inga exakta patchversionsguards för initiering;
- inga konkurrerande DOMContentLoaded/bootkedjor;
- ingen strategilogik inbakad i UI-koden;
- gamla Lina används som facit tills migrerad modul har jämförts och godkänts.

## Forskningsstatus att bevara
### Jägaren
Fryst kärna och historiska valideringar ska portas senare utan ändring. Mognad 48/100. Real forward har separat anchor 2026-09-11.

### Swing G1
Fryst hash `8f09f32a`. DEV-resultat och pseudo-forward ska bevaras. Real forward anchor 2026-09-14.

### Swing G2
Första modul att migrera. DEV 2020-01-01–2022-12-31. Låst historisk pseudo-forward 2023-01-01–2026-09-10. Breakout/momentum-grid 648 varianter. A–M DEV, M fryser kandidat/hash, N öppnar pseudo-forward, O slutbedömning. Ingen rescue efter N.

## Nästa steg
Verifiera V0.2.10 live: login → Dashboard → Uppdatera → ren URL med `?update=...` → login ska visas igen → logga in → Dashboard → Forskning → Swing G2 → Tillbaka. När det är PASS portas auktoritativ G2-motor utan legacy-UI och jämförs mot gamla Lina innan acceptans.


## V0.2.10 – login/autofill + browser refresh
- Portar den bevisat fungerande legacy-lösningen från V0.46.3 som aktivt tömmer loginfältet vid DOM-start, fördröjt efter password-manager-autofill, vid pageshow och första fokus.
- Firefox/webbläsarens vanliga Reload räknas nu som en ren login-start och rensar endast `sessionStorage`-flaggan `linasopti_unlocked`; Lina-data i `localStorage` lämnas orörd.
- Linas egen Uppdatera behåller cache-bustad omladdning och tvingad login.
- Permanent regel: när ett beteende redan fungerat tidigare ska exakt fungerande implementation först lokaliseras, jämföras och portas/testas innan ny lösning uppfinns.

## V0.2.10 – Swing G2 första riktiga Clean Core-modulen
- V0.1.6 är fryst som första fungerande Clean Core-checkpoint för login, Enter, Uppdatera och browser reload.
- Auktoritativ Swing G2-motor från legacy V0.56.0/V0.58.8 har portats till separat `g2-engine.js` utan legacy-navigation eller gamla bootkedjor.
- Forskningsreglerna är oförändrade: DEV 2020–2022, pseudo-forward 2023–2026-09-10, 648 varianter, 0,10 % kostnad/sida, 0,5 % risk, max 5 positioner, max 20 %/position.
- Guidat flöde: **Lås plan → Kör/Fortsätt G2 A–O → Resultat → Exportera rapport till ChatGPT**.
- G2 hämtar sin egen exakta data; generella Data-vyn används inte som mellanlandning.
- Datatransporten behåller legacy V0.58.8-ordningen: Worker Yahoo daily → EODHD .US → Alpaca daily, två cykler, 60 s timeout.
- Datakällans namn sparas på hämtade rader och Stage A visar vilka providers som faktiskt användes. Blandad provider är därför synlig och kan granskas; ingen data blandas tyst utan spårbarhet.
- M fryser kandidat/hash innan N får öppna historisk pseudo-forward. Ingen rescue efter N.
- Strategilogik ligger i `g2-engine.js`; UI ligger i `g2.js`.
- Clean Core använder egen G2-nyckel `lina_clean_swing_g2_v0201`, så gamla checkpoints/felstatus inte smyger in i en ny körning. Legacy-nyckeln `linasopti_swing_g2_v0560` lämnas orörd som facit.


## V0.2.10 – G2 synligt körfel
- Korrigerar ett UI-fel i V0.2.0 där `Kör G2 A–O` fångade ett körfel och sedan direkt ritade om sidan, vilket gjorde att felet försvann och såg ut som att inget hände.
- Körstart och körfel sparas nu i G2-state (`runStatus`, `runStartedAt`, `lastError`) och `RUN_ERROR` skrivs i `trialLedger`.
- Strategiregler, grid, perioder, kandidatfrysning och datakällor är oförändrade.
- Vid nästa fel ska användaren få ett synligt `KÖRFEL` med exakt felorsak istället för tyst återgång till `Redo`.


## V0.2.10 – versionsynk är release-blocker
- Korrigerar V0.2.1 där synlig version var V0.2.1 men cache-busters och APP_VERSION fortfarande var 0.2.0.
- Permanent regel: en release får inte märkas PASS om synlig version, APP_VERSION, script/style `?v=`, rapportversion, README och handoff inte är synkroniserade.
- Releasekontrollen ska uttryckligen söka efter föregående patchversion i runtimefilerna innan ZIP byggs.

## Permanent startregel (V0.2.10)
Varje ny start eller ny inloggning ska alltid börja på `index.html` / Dashboard. En kvarvarande intern route-hash som `#g2` får aldrig återöppna en underliggande modul som första vy. Hash-routing får användas under en aktiv session, men den initiala vyn efter login är alltid Dashboard.


## V0.2.10 – G2 lagringsfix vid M/N
Efter verklig körning nådde G2 13/15 och avbröts under N med `The quota has been exceeded.`. Rotorsaken var att DEV-rådata + 648 gridresultat låg kvar samtidigt som pseudo-forward-rader växte i localStorage. V0.2.10 komprimerar state efter kandidatfrysning M och före fortsatt N. A–M, fryst kandidat och pågående OOS-checkpoint bevaras. Ingen strategiändring.


## V0.2.10 – G2 robusthetsanalys + Broker Gate förberedd
- G2-strategin är oförändrad och fryst med kandidat-hash `15efd75a`.
- Inbyggd robusthetsanalys för de 144 pseudo-forward-affärerna.
- Ny exportknapp `Robusthetsrapport`.
- Års-, symbol-, exit- och koncentrationsanalys finns i Lina.
- Ny dokumentation: `LINA_G2_ROBUSTHETSANALYS_V0209.md`.
- Ny dokumentation: `LINA_BROKER_GATE.md`.
- Permanent regel för stora körningar: checkpoint + automatisk lagringskompaktering planeras före körstart; rådata/mellanresultat som inte längre behövs får inte tillåtas fylla webbläsarens lagringskvot. Frysta resultat, historik och återstartspunkt ska alltid bevaras.
- Cloudflare-arbetsregel: när befintlig Lina Worker ska ändras ges hela färdiga Worker-koden direkt i chatten för copy/paste i Cloudflare-editorn → Deploy, om inget annat faktiskt krävs.
- Bildregel: skapa/generera aldrig bild om användaren inte uttryckligen ber om det.

## V0.2.10 – Broker/Cost Gate
- Ny separat Broker/Cost Gate för den frysta Swing G2-kandidaten `15efd75a`.
- Reprissätter samma 144 pseudo-forward-affärer; inga G2-parametrar ändras.
- Profiler: G2 referens, IBKR-proxy, Alpaca-proxy, Nordnet Mini auto-FX, Nordnet Mini valutakonto samt generiska stresstester.
- Visar P/L, PF, win rate, drawdown, skillnad mot G2 och break-even-kostnad.
- Officiella mäklaravgifter hålls åtskilda från Lina-antagandet om 0,05 % slippage/sida.
- Viktig modellbegränsning synlig i UI: G2:s 100 000 och USD-priser är ännu en modellvaluta, inte exakt SEK-bokföring.
- Nordnet API-status dokumenterad: tar för närvarande inte in nya API-kunder.
- Handel fortsatt AV.

## V0.2.10 – G2 Real Forward / Paper
- Broker/Cost Gate är nu permanent registrerad som PASS för kandidat `15efd75a`.
- Ny modul under Forward: `Swing G2 Real Forward`.
- Anchor: 2026-09-11. Affärer före anchor räknas aldrig.
- Warmup hämtas från 2025-09-01 enbart för SMA200, breakout och volymhistorik.
- Exakt frysta G2-parametrar används; ingen rescue eller optimering.
- Knappen `Hämta nya marknadsdagar` hämtar dagsdata från Worker med samma provider-fallback som G2.
- Forward-state sparar endast resultat, öppna paper-positioner, senaste marknadsdag och kort refreshhistorik; rå warmup-data lagras inte i localStorage.
- Milstolpar: 60 / 120 / 250 helt nya stängda affärer.
- Export av forward-rapport och Raw JSON.
- Handel AV.

## V0.2.10 – Lina Arkiv & Robotmognad
- Ny central arkivvy under Historik.
- Robotmognad visas permanent som 48/100 och ändras inte bara för att nya historiska tester läggs till.
- Arkivet skiljer på teststeg och simulerade affärer för att undvika dubbelräkning.
- G1 + G2 historiska Swing-affärer: 794 kända, icke blandade affärer i respektive rapportserie.
- Jägaren visas separat: 109 dokumenterade historiska teststeg och 442 affärer i Tidsmaskinen.
- G2 Real Forward räknas dynamiskt som helt nya affärer och visas separat.
- Arkivposter: Jägaren A–K, Jägaren Tidsmaskin, Swing G1, Swing G2, G2 Robusthet, Broker/Cost Gate samt dynamisk G2 Real Forward.
- Varje arkivpost kan exporteras som egen text-rapport.
- Gamla resultat är snapshots och skrivs inte över.

## V0.2.10 – Swing G3 Walk-Forward Learner
- G2 `15efd75a` lämnas helt orörd som fryst facit.
- G3 är en separat forskningsgeneration.
- Förregistrerad metod: 648 G2-gridvarianter testas endast på 2020–2022; topp 12 blir permanent kandidatpool.
- Från 2023 görs månadsvis omträning/rankning endast inom den låsta topp-12-poolen och endast med information t.o.m. föregående handelsdag.
- Affärsbeslut sker dagligen. En öppen position behåller stop/target/hold från modellen som gällde vid entry.
- Checkpoint efter initial pool och varje färdig månad. Rå prisdata sparas inte permanent.
- G3-simuleringar räknas separat.
- 2023–2026 är uttryckligen INTE ny orörd OOS; resultatet är metodtest och får inte användas för rescue/eftertrimning.
- Arkivet rättar simuleringshistoriken: historiskt observerat golv `≥ 21 400` före Clean Core visas separat från affärsräknare.

## V0.2.10 – Lina-bakgrund
Återställer den bevisade `.lina-watermark`-implementationen från legacy V0.58.8 med samma placering, storlek, transparens och mobilvärden. Befintlig `lina-circle.png` används. Vattenmärket döljs på login. Ingen strategi/data/forward-logik ändrad.

## V0.2.14 – G4 Storage Hotfix + större Lina-bakgrund
- Ren teknisk robusthetsfix efter att V0.2.13 stoppades av webbläsarens localStorage-kvot under G4-körningen.
- G4-plan `95d2e735`, kandidat `15efd75a`, universum, period och gate är helt oförändrade.
- Rå marknadsdata/checkpoint-rader lagras nu i IndexedDB, aldrig i localStorage.
- localStorage innehåller endast kompakt körstatus, resultat, affärslogg och revisionsmetadata; säkerhetsgräns kontrolleras före skrivning.
- Om en V0.2.13-checkpoint finns migreras dess redan hämtade rådata till IndexedDB och körningen kan fortsätta från sparad year/symbol-position. Den gamla tunga V0.2.13-posten tas därefter bort.
- Efter färdig G4-beräkning rensas rå marknadsdata ur IndexedDB; det frysta resultatet bevaras kompakt.
- Lina-vattenmärket är förstorat globalt för att visuellt motsvara den större Lina-bakgrunden: desktop max 620 px, mobil 96vw.
- Ingen strategi-, parameter-, gate-, G2-, G3- eller forward-logik ändrad. Handel AV. Robotmognad 48/100.


## V0.2.18 – G5 Stress Test Plan
- G4 är PASS/FROZEN; inga G4-resultat ändras.
- Ny förregistrerad G5-plan `6ec36eb2` för frysta `15efd75a`.
- Fem låsta stresscenarier: extra exekveringskostnad 0,10/0,25/0,50 % per sida, 1 handelsdags entryfördröjning samt kombinerat 0,25 % + 1 dag.
- PASS/HOLD/FAIL-gate visas och låses innan någon G5-runner finns.
- Ingen strategi-, G2/G3/G4- eller forwardlogik ändrad. Handel AV. Robotmognad 48/100.

## V0.2.18 – G5 Stress Test Runner
- Förregistrerad/låst G5-plan `6ec36eb2` är oförändrad; kandidat `15efd75a`, universum, period, fem scenarier och gate ändras inte.
- Ny G5-runner kör de fem låsta stresscenarierna. Resultat öppnas först när användaren trycker Kör G5.
- Marknadsrådata/checkpoint lagras i IndexedDB; localStorage innehåller endast kompakt status/resultat med storleksvakt.
- 1 handelsdags entryfördröjning simuleras som verklig senare entry på nästa handelsdags open; stop/target/hold börjar från faktisk entrydag.
- Ingen rescue, parameterändring eller symbolrensning. G2/G3 Real Forward orörda. Handel AV. Robotmognad 48/100.


## V0.2.18 – Lina background visual restoration
UI-only. Restores the much larger visual scale of the Lina watermark using the older Linas Opti dashboard as the visual reference. Desktop watermark container max 1100px / 94vw, top 10vh. Mobile 150vw (max 760px), top 12vh. Opacity/filter and lina-circle.png unchanged. G5 plan/runner and all research logic unchanged.


## V0.2.21 – exact legacy Lina watermark restore
- UI-only. The effective V0.20 + V0.21 Lina watermark CSS from supplied legacy Linas Opti V0.58.8 is copied verbatim into Clean Core.
- Restores the exact radial mask, effective 620px desktop / 112vw mobile sizing, top position, opacity, filters and legacy translucent-card behavior.
- `lina-circle.png` verified byte-identical to legacy.
- No G2/G3/G4/G5/forward/research/storage logic changed. G5 plan `6ec36eb2` and existing result remain untouched. Handel AV. Robotmognad 48/100.

## V0.2.21 – Lina watermark overlay restore
Återför den effektiva legacy-overlay-stacken från Linas Opti V0.58.8 (V0.22–V0.25) ovanpå V0.2.19:s mask/transparens. Lina ligger nu som watermark-overlay med multiply och slutlig opacity .112 desktop/.12 mobil. Ingen forskningslogik ändrad.


## V0.2.21
Structural Lina watermark fix: watermark moved inside #app as final child so it paints above Clean Core cards; legacy V0.58.8 mask/blend/opacity retained. No research/trading logic changed.

## V0.2.22 – G5 Evidence Freeze
- G5 plan `6ec36eb2`, kandidat `15efd75a`, period och universum är oförändrade.
- Användarens exporterade G5-rapport och RAW JSON är inlagda oförändrade som permanent evidens.
- G5 registreras i arkivet som **FAIL · FROZEN**: 2/5 PASS-kvalificerade scenarier; COMBINED = NEJ.
- G5-vyn visar nu `FAIL · FRYST` för redan lagrat komplett resultat. Ingen omkörning krävs.
- Ingen rescue, parameterändring eller symbolrensning. Ingen G2/G3/G4/forward-/tradinglogik ändrad.
- Lina-watermarken från V0.2.21 lämnas orörd. Handel AV. Robotmognad 48/100.


## V0.2.25 – G6 Execution Cost Boundary Plan
- Ny förregistrerad och låst G6-plan `1567bbbe`.
- G6 mäter kostnadsgränsen för oförändrade `15efd75a`; ingen rescue/optimering.
- Extra kostnadsgrid per sida: 0,00–0,50 % i nio låsta punkter.
- PASS/HOLD/FAIL och boundary-definition låses innan runner byggs.
- G5 förblir FAIL/FROZEN. Handel AV. Robotmognad 48/100.
- Cloudflare Worker: **INGEN ÄNDRING**.

## V0.2.25 – G6 Execution Cost Boundary Runner
- Förregistrerad/låst G6-plan `1567bbbe` är oförändrad; kandidat `15efd75a`, universum, period, nio kostnadspunkter och gate ändras inte.
- Ny G6-runner kör exakt de nio låsta kostnadspunkterna och beräknar P/L, PF, WR, DD och slutkapital.
- Boundary = högsta testade extra kostnad/sida med P/L > 0 och PF >= 1,00; ingen interpolation.
- PASS/HOLD/FAIL räknas exakt enligt V0.2.23-planen.
- Marknadsrådata/checkpoint lagras i IndexedDB; localStorage innehåller endast kompakt status/resultat med storleksvakt.
- Ingen rescue, parameterändring eller symbolrensning. G5 förblir FAIL/FROZEN. Handel AV. Robotmognad 48/100.
- Cloudflare Worker: **INGEN ÄNDRING**.

## V0.2.25 – G6 Evidence Freeze
- G6 plan `1567bbbe` och kandidat `15efd75a` är oförändrade.
- Användarens exporterade G6-rapport och RAW JSON från V0.2.24 ingår byte-för-byte som permanent evidens.
- G6 registreras **PASS · FROZEN**. Boundary = +0,20 % extra kostnad per sida, motsvarande 0,30 % total modellerad kostnad per sida.
- Vid boundary: P/L +1 024,68, PF 1,04, WR 48,65 %, DD -5,58 %. Nästa testpunkt (+0,25 % extra) är negativ med PF < 1.
- Ingen rescue, parameterändring eller symbolrensning. G6 är inte ny oberoende OOS-evidens. G2/G3 Real Forward har högre evidens.
- Lina-watermarken lämnas orörd. Handel AV. Robotmognad 48/100.
- Cloudflare Worker: **INGEN ÄNDRING**.


## V0.2.26 – G7–G12 Research Battery
Sex planer och runners levereras tillsammans för att minska separata uppladdningar. Alla planer låses före resultat och får inte ändras utifrån andra resultat i samma batteri. Planhashar: G7 247c474a, G8 46c80eee, G9 c82b5c2a, G10 80385a7e, G11 0cc6ede6, G12 403fef49. Cloudflare Worker: INGEN ÄNDRING.

### Clean Core V0.2.32
Cross-device Forward-sync använder nu den vanliga Lina-inloggningen. Den separata prompten för synknyckel är borttagen. Worker verifierar login mot Secret `LINA_LOGIN_CODE`; GitHub-token stannar server-side. Ingen forskningslogik ändrad. Robotmognad 48/100. Handel AV.

## V0.2.33 – GitHub Full Sync
Headern har `☁ Synka` för gemensam synk mellan datorer. Forward-state plus kompakt beständig Lina-state synkas via Worker/GitHub. IndexedDB/rådata stannar lokalt. Konflikt = stopp, inte tyst överskrivning. Handel AV; robotmognad 48/100.


## V0.2.34 – Lina Arkiv utvecklingslogg (2026-09-15)
Lina Arkiv visar nu större utvecklingssteg. V0.2.32–V0.2.34 är dokumenterade, inklusive V0.2.33 första synk-FAIL och efterföljande PASS. Frysta forskningsresultat är orörda. Cloudflare Worker: ingen ändring. Handel AV. Robotmognad 48/100.

### V0.2.34 – Evidence-komplettering
COMPLETE innehåller nu tillgängliga originalexporter i TXT/JSON för G3, G4, G5, G6, G7–G12 och Forward-state/evidence från 2026-09-15. `LINA_EVIDENCE_INVENTORY_V0234.md` är kontrollregister med SHA256. Resultatfiler är permanent evidence/facit; stora råa marknadsdataset och IndexedDB-cache ingår inte. Cloudflare Worker: INGEN ÄNDRING.

## V0.2.35 – Evidence Freeze & GitHub Sync (2026-09-15)
Framtida TXT-rapporter och RAW/resultat-JSON blir PRELIMINÄRA vid export. De måste uttryckligen Godkännas & frysas i Lina Arkiv. Först därefter laddar headerns ☁ Synka upp dem som permanent, SHA256-verifierad evidence till GitHub. Befintlig evidence skrivs aldrig över. Stora marknadsrådata/IndexedDB-cache synkas inte. Handel AV; robotmognad 48/100.

## V0.2.36 – Archive navigation hotfix (2026-09-15)
- Fixar ett konkret fel i `archive-data.js`: en extra separator skapade en tom post (`undefined`) i arkivets RECORDS-array.
- När Lina Arkiv renderade försökte UI läsa `r.family` från den tomma posten och navigationen såg därför ut att inte göra något.
- Sparse-array-posten är borttagen och arkivets samtliga poster valideras nu i release-test.
- `app.js` versionsmetadata korrigerad till 0.2.36.
- Ingen strategi, forskningsregel, evidence, Worker-endpoint eller robotmognad ändrad.
- Cloudflare Worker: INGEN ÄNDRING. Fortsätt använda redan deployad V0.2.35 Worker.


## V0.2.37
`Linas Opti` i headern fungerar alltid som Hem och går till Dashboard. Worker oförändrad.


## V0.2.39 – Evidence E2E test-ready + App-state newline hotfix (2026-09-15)
- Byggd från godkänd V0.2.37 COMPLETE.
- Arkivets befintliga rapportexporter stageas nu samtidigt som PRELIMINÄR evidence. Detta gör att en redan fryst/verifierad arkivrapport kan användas för första riktiga end-to-end-testet utan att köra om forskning.
- Flöde: Exportera rapport → PRELIMINÄR → Godkänn & frys → FROZEN → ☁ Synka → FROZEN · GITHUB ✓.
- App-state-felet från Worker V0.2.35 var en bokstavlig `\n` efter JSON. Worker-källan i denna COMPLETE innehåller den redan deployade korrigeringen till riktig newline. Befintlig GitHub-fil reparerades och Mac cross-device ☁ Synka verifierades PASS 2026-09-15.
- Inga forskningsregler/resultat ändrade. Ingen omkörning. Robotmognad 48/100. Handel AV.
- Cloudflare Worker: INGEN YTTERLIGARE ÄNDRING. Den korrigerade Workern är redan deployad.


## V0.2.39 – Ett tryck: Godkänn & frys (2026-09-16)
- Normalt evidence-flöde förenklat till: färdigt resultat → `✓ Godkänn & frys` → SHA256 → FROZEN → automatisk GitHub-synk.
- Om GitHub inte går att nå behålls resultatet som `FROZEN · VÄNTAR PÅ SYNK`; nästa vanliga ☁ Synka kan slutföra uppladdningen.
- Lina Arkivs Evidence-kö är kontroll/återställning, inte normal arbetsgång.
- TXT-rapport + resultat-RAW JSON fryses tillsammans. Ingen ny forskning, ingen ändring av frysta resultat. Robotmognad 48/100. Handel AV.
- Cloudflare Worker: INGEN ÄNDRING.


## V0.2.40 – Direkt evidenssäkring från Arkiv (2026-09-16)
- Redan frysta G2/G4/G5/G6/G7–G12 kan säkras direkt från Lina Arkiv med `✓ Säkra evidens`.
- Ett tryck skapar TXT + RAW JSON, SHA256-fryser och försöker GitHub-synk automatiskt.
- Idempotens: redan `FROZEN · GITHUB ✓` skapas inte om eller skrivs över.
- Vid tillfälligt synkfel visas `FROZEN · VÄNTAR PÅ SYNK`.
- Evidence-kön är fortsatt endast kontroll/recovery.
- Inga forskningsresultat eller regler ändrade. Robotmognad 48/100. Handel AV.
- Cloudflare Worker: INGEN ÄNDRING.


## V0.2.41 – Datoroberoende historisk evidens (2026-09-16)
- Live-test V0.2.40 på ny dator: FAIL. `Säkra evidens` försökte läsa lokalt engine-resultat och gav `Inget färdigt resultat finns att frysa`.
- V0.2.41 använder permanent TXT + RAW från releasepaketet för historisk backfill av G4/G5/G6/G7–G12. G6 kräver därmed inte gammal localStorage/IndexedDB.
- RAW måste vara giltig JSON före frysning. Klienten SHA256-fryser och skickar via befintlig `/evidence`-endpoint; Worker verifierar hash och nekar overwrite som tidigare.
- G2 lämnas på befintlig engine-väg eftersom komplett permanent TXT+RAW-par inte finns i releasepaketet; ingen evidens fabriceras.
- Handel AV. Robotmognad 48/100. Inga frysta forskningsresultat ändrade.
- Cloudflare Worker: INGEN ÄNDRING.


## V0.2.42 – Evidence E2E checkpoint (2026-09-16)
- Byggd från V0.2.41 COMPLETE.
- V0.2.41 live-verifierades på en ny dator: G6 `✓ Säkra evidens` gick i ett tryck till `FROZEN · GITHUB ✓`.
- GitHub verifierades manuellt efteråt. Under `linasopti/evidence/2026-09-16/` finns både TXT och RAW JSON för G6 samt G7–G12.
- Evidence-kedjan för detta historiska cross-device-flöde markeras **END-TO-END PASS**.
- V0.2.40-livefelet förblir dokumenterat som FAIL; historiken skrivs inte om.
- Inga forskningsresultat, parametrar eller regler ändrade. Robotmognad 48/100. Handel AV.
- Nästa fokus: kontroll av Real Forward-status och fortsatt ny, tidsmässigt framåtriktad evidens; inga G13+-historiska tester startas här.
- Cloudflare Worker: **INGEN ÄNDRING**.


## V0.2.43 – Automatisk Forward med stängd-marknadsdagsspärr (2026-09-16)
Lina gör Forward catch-up automatiskt vid start. G2/G3 får endast behandla säkert avslutade USA-marknadsdagar. Liveprovet i V0.2.42 visade att 2026-09-16 kunde synas medan USA-sessionen fortfarande pågick; V0.2.43 korrigerar detta och innehåller en snäv, autentiserad Worker-repair för master som ligger framför säker cutoff. Handel AV, robotmognad 48/100.


## V0.2.44 – Lina Generation 2 Research Plan (2026-09-16)
- Nytt separat forskningsspår. Original G2/G3 och Real Forward lämnas helt orörda som kontrollspår.
- Förregistrerad datadelning: DEV 2020–2022, validation 2023–2024, förseglad holdout 2025-01-01–2026-09-10. Holdout får inte användas för tuning/ranking och öppnas först efter kandidatfrysning.
- Fyra strategifamiljer låses före resultat: trend/momentum, mean reversion, volatility breakout och regime ensemble.
- Urval prioriterar robust riskjusterad prestation framför högsta historiska P/L. Minimikrav före holdout: >=80 affärer, PF >=1.20, DD <=12 %, positiv validation och koncentrationsskydd.
- V0.2.44 producerar inga nya forskningsresultat; nästa steg är runners. Handel AV. Robotmognad 48/100.
- V0.2.43 live-verifierad: completedThrough och G2/G3 lastMarketDate 2026-09-15 i permanent GitHub-master efter safe-close rollback.
- Cloudflare Worker: INGEN ÄNDRING. Fortsätt använda verifierad V0.2.43 Worker.


## V0.2.48 – Gen2 Plan Lock + Research Engine (2026-09-17)
- Byggd från V0.2.44 FLAT COMPLETE.
- Förregistrerad Gen2-plan ändras inte: kanonisk planhash är fortfarande `1d5f8bc1`. Planobjektets forskningsversion lämnas V0.2.44 för att hashens innehåll ska vara byte-/fältmässigt oförändrat; releasekoden är V0.2.48.
- `Lås Generation 2-plan` skapar nu ett verifierbart lås och vägrar fortsätta om beräknad hash avviker från `1d5f8bc1`. Ett eventuellt V0.2.44-lås migreras endast om dess hash redan är korrekt.
- Ny `gen2-engine.js` inför hård dataguard: endast DEV 2020-01-01–2022-12-31 och Validation 2023-01-01–2024-12-31 accepteras.
- Holdout 2025-01-01–2026-09-10 är fortsatt SEALED. V0.2.48 har ingen holdout-runner och ingen holdout-resultatyta; fel intervall blockeras.
- Fyra förregistrerade familjer är registrerade i motorn, men inga resultat eller vinnare skapas av själva planlåset/preflight. Negativa framtida runnerresultat ska bevaras.
- Original G2/G3 + Real Forward lämnas oförändrade som kontrollspår. Handel AV. Robotmognad 48/100.
- Cloudflare Worker: INGEN ÄNDRING. Fortsätt använda live-verifierad V0.2.43 Worker.


## V0.2.48 – Gen2 DEV/Validation Research Runners (2026-09-17)
- Byggd från V0.2.45 COMPLETE efter live PASS. Planhash `1d5f8bc1` är oförändrad.
- Ny separat runnerspec låses före första resultat. Fyra familjer får små, fasta parametergridar och fast 16-symbolers universum.
- Endast DEV 2020–2022 och Validation 2023–2024 kan hämtas/köras. Holdout 2025-01-01–2026-09-10 är fortsatt SEALED utan runner/resultatyta.
- Rå dagsdata cachas i IndexedDB; kompakt körstate/resultat i localStorage. Negativa familjer bevaras.
- Minimikrav kvar: minst 80 affärer, PF >=1.20, DD <=12 %, positiv Validation och koncentrationsskydd. Högsta P/L är inte primär ranking.
- Original G2/G3/Real Forward orörda. Handel AV. Robotmognad 48/100.
- Cloudflare Worker: INGEN ÄNDRING. Verifierad V0.2.43 Worker används oförändrad.


## V0.2.48 – Navigation race fix
- Byggd från V0.2.46 FLAT COMPLETE.
- Fixar en verifierad race: Forward Evidence Center kunde efter asynkron auto-catch-up rendera om den gemensamma #view efter att användaren redan lämnat Forward. Det gjorde att Dashboard/Gen2 såg ut att "hoppa tillbaka".
- Forward får nu endast rendera om sig om dess route + navigationssekvens fortfarande är aktiv.
- Routern använder pushState för användarnavigation och popstate för riktig browser-back; start använder replaceState.
- Gen2 forskningsregler, planhash 1d5f8bc1, runnerspec, holdout och original G2/G3 är oförändrade. Handel AV. Robotmognad 48/100.
- Cloudflare Worker: INGEN ÄNDRING.


## V0.2.48 – Gen2 navigation load-order fix
Gen2-moduler laddas nu före app-start. Router visar explicit renderfel i stället för tyst återhopp. Forskningsregler, planhash 1d5f8bc1, holdout och Forward är oförändrade. Cloudflare Worker: INGEN ÄNDRING.


## V0.2.49 – Gen2 plan-hash recovery
- Fixar den verifierade orsaken till att Gen2-modulen inte laddades i V0.2.48.
- Den förregistrerade PLAN-payloaden hade oavsiktligt ändrats i fältet `next`, vilket ändrade beräknad hash från låsta `1d5f8bc1` till `1b97692d` och fick `gen2-lab.js` att avbryta innan `window.LinaGen2Lab` registrerades.
- Återställer exakt V0.2.45/V0.2.44 PLAN-payload och därmed hash `1d5f8bc1`. Runnerlogik ligger separat och ändrar inte den frysta planen.
- Holdout fortsatt SEALED, Handel AV, robotmognad 48/100. Original G2/G3 och Real Forward orörda. Worker: ingen ändring.


## V0.2.50 – Gen2 DEV/Validation audit före kandidatfrysning (2026-09-17)
- Byggd från V0.2.49 FLAT COMPLETE efter att alla fyra förregistrerade Gen2-familjer körts live.
- Ingen forskningsregel, parametergrid, ranking, datadelning eller tidigare resultat ändras. Planhash `1d5f8bc1` och runnerspec `c7f6a2d9` är oförändrade.
- Ny auditvy härleder de låsta PASS/FAIL-kriterierna från den redan sparade topprankade varianten per familj: totalt affärsantal (DEV + Validation), Validation PF, Validation DD, positiv Validation P/L och koncentrationsskydd.
- Körjournalen visar totalt 15 registrerade parameterförsök: 4 Trend/momentum, 4 Mean reversion, 4 Volatility breakout och 3 Regime ensemble.
- Evidensbegränsning upptäckt och bevarad: V0.2.49 sparade försöksantal + endast topprankad variant per familj; de övriga 11 variant-raderna sparades inte permanent. V0.2.50 fabricerar eller kör inte om dem.
- Kandidatfrysning markeras därför BLOCKERAD tills variantnivå-evidensen hanteras genom ett uttryckligt senare beslut. Holdout förblir SEALED och har ingen runner/resultatyta.
- Original G2/G3/Real Forward orörda. Handel AV. Robotmognad 48/100.
- Cloudflare Worker: INGEN ÄNDRING. Verifierad V0.2.43 Worker används oförändrad.


## V0.2.51 – Gen2 permanent all-variant evidence (2026-09-17)
- Byggd från V0.2.50 COMPLETE. Forskningsregler, planhash `1d5f8bc1` och runnerspec `c7f6a2d9` är oförändrade.
- Från och med V0.2.51 sparar varje ny Gen2-familjekörning samtliga variant-rader (DEV + Validation + eligibility + score) i engine-state innan evidenssynk försöks.
- Varje ny familjekörning skapar därefter ett separat JSON-evidensartefakt, fryser det och försöker synka det via befintlig `/evidence`-väg till GitHub. Vid synkfel behålls artefakten lokalt som `FROZEN · VÄNTAR PÅ SYNK`; nästa vanliga GitHub-synk kan skicka den.
- Omtag av redan körd familj blockeras i engine-lagret så positiv eller negativ evidens inte kan skrivas över.
- Historisk lucka kvarstår: de 11 icke-topprankade variantdetaljerna från V0.2.49 kan inte återskapas utan omkörning och fabriceras inte. Kandidatfrysning förblir blockerad tills luckan hanteras genom uttryckligt beslut.
- Holdout 2025-01-01–2026-09-10 är fortsatt SEALED. Handel AV. Robotmognad 48/100.
- Cloudflare Worker: INGEN ÄNDRING. Befintlig verifierad `/evidence`-endpoint används.

## V0.2.52 – Gen2 pre-holdout evidence decision (2026-09-17)
- Byggd från V0.2.51 COMPLETE efter livekontroll av 15 registrerade Gen2-försök.
- Forskningsregler, planhash `1d5f8bc1`, runnerspec `c7f6a2d9`, parametergridar och observerade resultat ändras inte.
- Den historiska V0.2.49-luckan med 11 icke-topprankade variantdetaljer bevaras uttryckligen som datalucka. Ingen omkörning, rekonstruktion eller fabricering tillåts.
- Ny beslutspunkt i Gen2 låser policyn `ACCEPT_DOCUMENTED_HISTORICAL_GAP / NO_RERUN_NO_RECONSTRUCTION`.
- När beslutet låses skapas ett separat pre-holdout JSON-evidenspaket med plan/runnerspec, dataintervall, alla fyra sparade topprankade resultaten, 15 registrerade försök och den dokumenterade luckan. Paketet fryses och försöker synkas via befintlig GitHub-evidensväg; synkfel lämnar artefakten FROZEN/VÄNTAR PÅ SYNK.
- V0.2.52 fryser ingen kandidat och öppnar inte Holdout. Efter låst beslut markeras endast att systemet är redo för ett separat kandidatfrysningssteg.
- Holdout 2025-01-01–2026-09-10 är fortsatt SEALED. Handel AV. Robotmognad 48/100. Original G2/G3/Real Forward orörda.
- Cloudflare Worker: INGEN ÄNDRING. Befintlig verifierad `/evidence`-endpoint används.


## V0.2.53 — Evidence sync recovery
- Fixar integrationen där `LinaEvidence.stage()` skapade evidensposten men inte returnerade posten till Gen2.
- Ett redan låst V0.2.52 pre-holdout-beslut ändras inte och körs inte om.
- Ny återställningsknapp synkar den redan frysta/stagade Gen2-evidensen till GitHub.
- Kandidatfrysning förblir blockerad tills status är `FROZEN · GITHUB ✓`.
- Holdout 2025-01-01–2026-09-10 förblir SEALED. Handel AV. Robotmognad 48/100.
- Planhash `1d5f8bc1` och runnerspec `c7f6a2d9` är oförändrade.
- Cloudflare Worker: ingen ändring.
