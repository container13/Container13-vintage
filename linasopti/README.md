# Lina Clean Core V0.2.9

## Status
Clean Core är en teknisk omstart av Lina, inte en kunskapsomstart. V0.58.8 COMPLETE är permanent legacy-checkpoint/facit före Clean Core och ska aldrig skrivas över.

V0.2.9 gör Uppdatera-flödet deterministiskt. V0.1.4 litade enbart på att sessionStorage-rensningen överlevde navigeringen. Nu skickas dessutom en explicit `force_login=1`-markör till nästa sidladdning. Login-koden ser markören innan någon auto-unlock kan ske, rensar upplåsningsflaggan igen och visar login. Därefter städas URL:en utan extra reload.

## V0.2.9 ändrat
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
Verifiera V0.2.9 live: login → Dashboard → Uppdatera → ren URL med `?update=...` → login ska visas igen → logga in → Dashboard → Forskning → Swing G2 → Tillbaka. När det är PASS portas auktoritativ G2-motor utan legacy-UI och jämförs mot gamla Lina innan acceptans.


## V0.2.9 – login/autofill + browser refresh
- Portar den bevisat fungerande legacy-lösningen från V0.46.3 som aktivt tömmer loginfältet vid DOM-start, fördröjt efter password-manager-autofill, vid pageshow och första fokus.
- Firefox/webbläsarens vanliga Reload räknas nu som en ren login-start och rensar endast `sessionStorage`-flaggan `linasopti_unlocked`; Lina-data i `localStorage` lämnas orörd.
- Linas egen Uppdatera behåller cache-bustad omladdning och tvingad login.
- Permanent regel: när ett beteende redan fungerat tidigare ska exakt fungerande implementation först lokaliseras, jämföras och portas/testas innan ny lösning uppfinns.

## V0.2.9 – Swing G2 första riktiga Clean Core-modulen
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


## V0.2.9 – G2 synligt körfel
- Korrigerar ett UI-fel i V0.2.0 där `Kör G2 A–O` fångade ett körfel och sedan direkt ritade om sidan, vilket gjorde att felet försvann och såg ut som att inget hände.
- Körstart och körfel sparas nu i G2-state (`runStatus`, `runStartedAt`, `lastError`) och `RUN_ERROR` skrivs i `trialLedger`.
- Strategiregler, grid, perioder, kandidatfrysning och datakällor är oförändrade.
- Vid nästa fel ska användaren få ett synligt `KÖRFEL` med exakt felorsak istället för tyst återgång till `Redo`.


## V0.2.9 – versionsynk är release-blocker
- Korrigerar V0.2.1 där synlig version var V0.2.1 men cache-busters och APP_VERSION fortfarande var 0.2.0.
- Permanent regel: en release får inte märkas PASS om synlig version, APP_VERSION, script/style `?v=`, rapportversion, README och handoff inte är synkroniserade.
- Releasekontrollen ska uttryckligen söka efter föregående patchversion i runtimefilerna innan ZIP byggs.

## Permanent startregel (V0.2.9)
Varje ny start eller ny inloggning ska alltid börja på `index.html` / Dashboard. En kvarvarande intern route-hash som `#g2` får aldrig återöppna en underliggande modul som första vy. Hash-routing får användas under en aktiv session, men den initiala vyn efter login är alltid Dashboard.


## V0.2.9 – G2 lagringsfix vid M/N
Efter verklig körning nådde G2 13/15 och avbröts under N med `The quota has been exceeded.`. Rotorsaken var att DEV-rådata + 648 gridresultat låg kvar samtidigt som pseudo-forward-rader växte i localStorage. V0.2.9 komprimerar state efter kandidatfrysning M och före fortsatt N. A–M, fryst kandidat och pågående OOS-checkpoint bevaras. Ingen strategiändring.


## V0.2.9 – G2 robusthetsanalys + Broker Gate förberedd
- G2-strategin är oförändrad och fryst med kandidat-hash `15efd75a`.
- Inbyggd robusthetsanalys för de 144 pseudo-forward-affärerna.
- Ny exportknapp `Robusthetsrapport`.
- Års-, symbol-, exit- och koncentrationsanalys finns i Lina.
- Ny dokumentation: `LINA_G2_ROBUSTHETSANALYS_V0209.md`.
- Ny dokumentation: `LINA_BROKER_GATE.md`.
- Permanent regel för stora körningar: checkpoint + automatisk lagringskompaktering planeras före körstart; rådata/mellanresultat som inte längre behövs får inte tillåtas fylla webbläsarens lagringskvot. Frysta resultat, historik och återstartspunkt ska alltid bevaras.
- Cloudflare-arbetsregel: när befintlig Lina Worker ska ändras ges hela färdiga Worker-koden direkt i chatten för copy/paste i Cloudflare-editorn → Deploy, om inget annat faktiskt krävs.
- Bildregel: skapa/generera aldrig bild om användaren inte uttryckligen ber om det.

## V0.2.9 – Broker/Cost Gate
- Ny separat Broker/Cost Gate för den frysta Swing G2-kandidaten `15efd75a`.
- Reprissätter samma 144 pseudo-forward-affärer; inga G2-parametrar ändras.
- Profiler: G2 referens, IBKR-proxy, Alpaca-proxy, Nordnet Mini auto-FX, Nordnet Mini valutakonto samt generiska stresstester.
- Visar P/L, PF, win rate, drawdown, skillnad mot G2 och break-even-kostnad.
- Officiella mäklaravgifter hålls åtskilda från Lina-antagandet om 0,05 % slippage/sida.
- Viktig modellbegränsning synlig i UI: G2:s 100 000 och USD-priser är ännu en modellvaluta, inte exakt SEK-bokföring.
- Nordnet API-status dokumenterad: tar för närvarande inte in nya API-kunder.
- Handel fortsatt AV.

## V0.2.9 – G2 Real Forward / Paper
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

## V0.2.9 – Lina Arkiv & Robotmognad
- Ny central arkivvy under Historik.
- Robotmognad visas permanent som 48/100 och ändras inte bara för att nya historiska tester läggs till.
- Arkivet skiljer på teststeg och simulerade affärer för att undvika dubbelräkning.
- G1 + G2 historiska Swing-affärer: 794 kända, icke blandade affärer i respektive rapportserie.
- Jägaren visas separat: 109 dokumenterade historiska teststeg och 442 affärer i Tidsmaskinen.
- G2 Real Forward räknas dynamiskt som helt nya affärer och visas separat.
- Arkivposter: Jägaren A–K, Jägaren Tidsmaskin, Swing G1, Swing G2, G2 Robusthet, Broker/Cost Gate samt dynamisk G2 Real Forward.
- Varje arkivpost kan exporteras som egen text-rapport.
- Gamla resultat är snapshots och skrivs inte över.

## V0.2.9 – Swing G3 Walk-Forward Learner
- G2 `15efd75a` lämnas helt orörd som fryst facit.
- G3 är en separat forskningsgeneration.
- Förregistrerad metod: 648 G2-gridvarianter testas endast på 2020–2022; topp 12 blir permanent kandidatpool.
- Från 2023 görs månadsvis omträning/rankning endast inom den låsta topp-12-poolen och endast med information t.o.m. föregående handelsdag.
- Affärsbeslut sker dagligen. En öppen position behåller stop/target/hold från modellen som gällde vid entry.
- Checkpoint efter initial pool och varje färdig månad. Rå prisdata sparas inte permanent.
- G3-simuleringar räknas separat.
- 2023–2026 är uttryckligen INTE ny orörd OOS; resultatet är metodtest och får inte användas för rescue/eftertrimning.
- Arkivet rättar simuleringshistoriken: historiskt observerat golv `≥ 21 400` före Clean Core visas separat från affärsräknare.
