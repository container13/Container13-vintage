# Linas Opti V0.45.10

## V0.45.10 – korrigerad Signal Lab 2-build
- Korrigerar V0.45.9 där index.html hade gamla versions-/cache-referenser och kunde ladda V0.45.8-JavaScript från webbläsarcache.
- Header, CSS cache-buster och JS cache-buster är nu 0.45.10.
- Signal Lab 2 · Entry B-dissektion är med i Testlab och är senaste/förvalda labb.
- APP_VERSION och Signal Lab 2-rapportnamn är V0.45.10/V04510.
- Ingen strategi-, signal-, exit-, data- eller Worker-logik ändras jämfört med avsedd V0.45.9.

# V0.45.9 – Signal Lab 2 · Entry B-dissektion

Byggd direkt från V0.45.8. Ingen strategi-, Entry B-, Strong-regim-, exit-, friktions-, Day Selection- eller Worker-logik ändrad.

## Nytt i V0.45.9
- Nytt diagnostiskt Testlab: **Signal Lab 2 · Entry B-dissektion**.
- Signal Lab 1 visade att Entry B är största relativa flaskhalsen: **41 420 PRO2-observationer → 2 138 Entry B (5,16%) → 840 Strong/godkända**.
- Endast observationer som redan klarat fryst PRO2-kvalitet analyseras.
- Entry B delas upp i exakt fem befintliga villkor: **m3 ≥0,40%**, **m3 ≤1,20%**, **close-location ≥86%**, **relativ volym ≥1,15×**, **relativ volym ≤3,00×**.
- Visar både sekventiellt bortfall och varje villkors pass/fail separat.
- Räknar vanligaste kombinationer av samtidigt missade villkor för att synliggöra överlapp.
- Mäter deskriptiv framåtrörelse **+15 / +30 / +60 min** från observationsbarens close för pass respektive fail. Detta är diagnostik, inte hypotetiska affärer och inte en ny strategi.
- Checkpoint sparas efter varje helt färdig månad och körningen kan återupptas efter avbrott/sidomladdning.
- Simuleringsräknarens dokumenterade golv är nu **≥19 741** efter färdig Kapital Lab 3 och Signal Lab 1; Signal Lab 2 adderar **1 först när hela körningen är färdig**.
- Rapport: `LINAS_OPTI_SIGNAL_LAB_2_ENTRY_B_DISSEKTION_V0459_YYYY-MM-DD.txt`.

## Varför detta steg valdes
Kapital Lab 3 visade att kapitalutnyttjandet är lågt främst därför att signalflödet är glest. Signal Lab 1 lokaliserade därefter största relativa bortfallet till Entry B: bara 5,16% av PRO2-observationerna passerade Entry B. V0.45.9 ändrar därför inte Entry B utan kartlägger vilket eller vilka delvillkor som står för bortfallet och om bortfiltrerade observationer deskriptivt har sämre eller bättre efterföljande prisrörelse. Först därefter får ett separat förregistrerat Signal Lab 3 testa en faktisk förändring.

## Forskningsdisciplin
- Entry B är fortsatt **fryst** i V0.45.9.
- Framåtrörelserna används endast för hypotesgenerering.
- Ingen tröskel får ändras utifrån denna rapport utan ett separat förregistrerat test.
- 2023–2026 är inte nytt orört OOS i sin helhet. Robotmognad ligger kvar på **48/100**.

## README- och chattöverlämningsregel
README ska fortsatt bära kompakt projekthistorik, centrala resultat/beslut, frysta delar, större buggar/fixar och varför nästa steg valdes. När arbetschatten börjar bli lång ska ChatGPT proaktivt skapa en överlämningssammanfattning innan kontext riskerar att gå förlorad.

---

# V0.45.8 – Signal Lab 1 · Filtertratten

Byggd direkt från V0.45.7. Ingen signal-, Entry B-, Strong-regim-, exit-, friktions-, Day Selection- eller Worker-logik ändrad.

## Nytt i V0.45.8
- Nytt diagnostiskt Testlab: **Signal Lab 1 · Filtertratten**.
- Mäter samma frysta Jägare stegvis: **rå teknisk observation → PRO2-kvalitet → Entry B → Strong-regim → slutligt godkänd kandidat**.
- Visar total tratt samt samma steg **per symbol** och **per år**.
- Ingen tröskel optimeras och inga alternativa strategier simuleras.
- Checkpoint sparas efter varje helt färdig månad och körningen kan återupptas efter avbrott/sidomladdning.
- Samma retry-funktion som tidigare långkörningar används vid datahämtning.
- Simuleringsräknaren ökar med **1 först när hela Signal Lab 1 är färdigkört**.
- Rapport: `LINAS_OPTI_SIGNAL_LAB_1_FILTERTRATTEN_V0458_YYYY-MM-DD.txt`.
- Signal Lab 1 ligger överst/förvalt i Testlabs rullgardinsmeny.

## Varför Signal Lab byggdes
Kapital Lab 3 gav ett tydligt diagnostiskt besked: 0 positioner vid **94,30%** av observerade 5-min-tidpunkter, någon position endast **5,70%**, 3 samtidiga positioner endast **0,69%**, och dagar med någon position **334/950 (35,2%)**. Samtidigt blockerades 70 kandidater av 3-positionersgränsen och 38 av max 4 entries/dag. Huvudflaskhalsen bedöms därför ligga i **signalflödet**, inte i tillåtet kapital eller antal positioner.

Signal Lab 1 ska därför inte försöka skapa fler affärer. Det ska först lokalisera **vilket fryst filter som står för det största bortfallet**, totalt och per symbol/år. Ett eventuellt nästa experiment ska förregistreras separat utifrån denna diagnostik.

## Forskningsstatus efter Kapital Lab 1–3
- Kapital Lab 1: **3 samtidiga positioner** är forskningskandidat.
- Kapital Lab 2: **33,3% max per position** gav högst slutvärde, men främst genom linjär skalning av befintlig edge.
- Kapital Lab 3: genomsnittligt kapital i arbete **2,81%**; flaskhalsen är främst signalflödet.
- Kapital Lab pausas tills vidare.
- Robotmognad ligger kvar på **48/100**; Signal Lab 1 är diagnostik och är inte ny OOS-validering.

## README- och chattöverlämningsregel
README ska fortsatt bära kompakt projekthistorik, viktiga versioner, forskningsresultat, beslut, frysta delar, större buggar/fixar och varför nästa steg valdes. När arbetschatten börjar bli lång ska ChatGPT proaktivt skapa en överlämningssammanfattning innan kontext riskerar att gå förlorad.

---

# V0.45.7 – Kapital Lab 3 · kapitalutnyttjande

Byggd direkt från V0.45.6. Ingen signal-, Entry B-, Strong-regim-, exit-, friktions-, Day Selection- eller Worker-logik ändrad.

## Nytt i V0.45.7
- Nytt Testlab: **Kapital Lab 3 · kapitalutnyttjande**.
- Fryst forskningskandidat: **max 3 samtidiga positioner + max 33,3% equity per position**.
- Labbet är diagnostiskt och ändrar inga signalparametrar.
- Mäter andel observerade 5-min-tidpunkter med 0 / 1 / 2 / 3 öppna positioner.
- Mäter snitt kapital i arbete, faktisk positionsstorlek, hålltid, dagar med position och dagar som når 4 entries.
- Räknar godkända signalkandidater samt kandidater blockerade av 3-positionersgränsen respektive max 4 nya entries/dag.
- Blockerade kandidater är diagnostik och räknas **inte** som hypotetiska affärer.
- Checkpoint sparas efter varje helt färdig månad och körningen kan återupptas efter avbrott/sidomladdning.
- Samma retry-funktion som V0.45.6 används vid datahämtning.
- Simuleringsräknaren ökar med **1 först när hela Kapital Lab 3 är färdigkört**.
- Rapport: `LINAS_OPTI_KAPITAL_LAB_3_KAPITALUTNYTTJANDE_V0457_YYYY-MM-DD.txt`.
- Kapital Lab 3 ligger överst/förvalt i Testlabs rullgardinsmeny.

## Varför detta labb byggdes
Kapital Lab 1 pekade ut 3 samtidiga positioner som forskningskandidat. Kapital Lab 2 visade sedan nästan linjär skalning när positionsstorleken ökades: 10% gav +1,18%, 20% +2,36%, 30% +3,53% och 33,3% +3,91%. PF och WR var i princip oförändrade och samtliga varianter hade 657 affärer. Vid 33,3% var max DD -3,03%, men genomsnittligt kapital i arbete fortfarande bara 2,8%.

Det centrala nästa forskningsproblemet är därför inte att optimera ytterligare en signalparameter, utan att mäta **varför kapitalet nästan alltid står oanvänt**. Kapital Lab 3 ska skilja mellan två hypoteser:
1. Bra kandidater finns men blockeras av positions-/dagsgränser.
2. Jägaren producerar helt enkelt få samtidiga godkända signaler och 0–1 position dominerar.

## Forskningsdisciplin
2023–2026 är inte ett nytt orört OOS-prov i sin helhet. Kapital Lab 3 är diagnostik på redan frysta signalregler och får inte behandlas som en prognos eller som ny oberoende validering. Robotmognad ligger därför kvar på **48/100** i denna version.

## README- och chattöverlämningsregel från V0.45.7
README ska framöver bära en kompakt löpande projekthistorik: viktiga versioner, forskningssteg, centrala resultat, beslut, frysta delar, större buggar/fixar och varför nästa steg valdes. När en arbetschatt börjar bli lång ska ChatGPT proaktivt skapa en överlämningssammanfattning **innan** kontext riskerar att gå förlorad. Sammanfattningen ska kunna klistras direkt i nästa chatt och ange senaste kodbas, forskningsstatus, frysta regler, resultat, öppna problem och nästa planerade steg.

---

# V0.45.6 – återuppta Kapital Lab 2 + flikfix

- Bygger vidare på V0.45.5 och behåller flikväxlingsfixen.
- Kapital Lab 2 sparar checkpoint efter varje helt färdig månad.
- Tillfälliga fetchfel försöks automatiskt upp till tre gånger via befintlig retry.
- Vid kvarstående avbrott behålls färdiga månader i localStorage och knappen blir **Fortsätt Kapital Lab 2 från sparad punkt**.
- Progressbaren återställs till sparad nivå även efter omladdning.
- Simuleringsräknaren ökar med 4 först när hela Kapital Lab 2 är färdigkört; delkörningar räknas inte som klara simuleringar.
- Kapital Lab 2-rapporten behåller den isolerade hårdfixen och får filnamn med `V0456`.
- Ingen strategi-, signal-, exit-, marknadsdata- eller Worker-logik ändrad. Robotmognad kvar 48/100.

# V0.45.5 – flikväxlingsfix

Byggd från V0.45.4. Ingen strategi-, data-, rapport- eller Worker-logik ändrad.

Ändringar:
- tar bort dyr `backdrop-filter`-komposition i desktop-headern som kan ge vit återritning när Chrome återgår till en bakgrundsflik,
- `pageshow` tvingar inte längre scroll till toppen när en befintlig sida återupptas,
- fokus skickas inte onödigt till kodfältet när fliken återaktiveras,
- sparar aktuell scrollposition passivt när fliken göms, utan att rendera om appen,
- cache-buster och versionsetikett V0.45.5.

Mål: Linas Opti ska ligga kvar visuellt där den lämnades när användaren växlar till en annan Chrome-flik och tillbaka.

# V0.45.4 – Kapital Lab 2 rapport hard-fix

- Kapital Lab 2 har en helt isolerad rapportknapp.
- Rapporten måste börja med `LINAS OPTI – KAPITAL LAB 2 · POSITIONSSTORLEK` och innehålla 10/20/30/33,3%-grid innan fil får skapas.
- Filnamn: `LINAS_OPTI_KAPITAL_LAB_2_POSITIONSSTORLEK_V0454_YYYY-MM-DD.txt`.
- Statusraden visar det exakta filnamnet efter nedladdning.
- Äldre event listeners på Lab 2-rapportknappen rensas genom att knappen ersätts med en ren klon vid sidstart.
- Strategi, Worker och Kapital Lab 2-resultatlogik är oförändrade. Robotmognad 48/100.

# V0.45.3 – rapportnamn + simuleringsräknare

- Kapital Lab 2 får unikt filnamn: `LINAS_OPTI_KAPITAL_LAB_2_POSITIONSSTORLEK_V0453_YYYY-MM-DD.txt`.
- Kapital Lab 1 får eget tydligt filnamn så rapporterna inte kan förväxlas.
- Simuleringsräknaren har dokumenterat gemensamt minimum ≥19 739 efter färdig Kapital Lab 2 och migrerar äldre lokala värden uppåt.
- Räknaren visar ≥ eftersom localStorage är enhets-/webbläsarlokal och därför inte kan ge ett falskt exakt globalt totalvärde.
- Endast färdigregistrerade simuleringar adderas.
- Robotmognadsinformationen är rättad till 48/100.
- Ingen strategi-, data-, Kapital Lab- eller Worker-logik ändrad.

# V0.45.2 – Kapital Lab 2

- Nytt Testlab: positionsstorlek 10 / 20 / 30 / 33,3% med exakt 3 samtidiga positioner.
- Tre positioner är frysta från Kapital Lab 1; signal-, regim-, exit- och friktionslogik är oförändrad.
- Robotmognad kvar 48/100.
- Rapportdelning följer V0.45.1: direkt .txt-nedladdning på desktop, native share på iPhone/iPad.

# V0.45.1 – plattformsanpassad rapportdelning + Robotmognad 48/100

- Windows/macOS/Linux: rapportknappar laddar direkt ner `.txt` via webbläsaren (normalt till Hämtade/Downloads enligt webbläsarens inställning).
- iPhone/iPad: rapportknappar använder native delningsark när det stöds.
- Samma princip används för Testlab-rapporterna och vanliga snabb/full-testexporter.
- Robotmognad rättad från 42/100 till 48/100 enligt senaste beslutade status.
- Ingen strategi-, test-, data- eller Worker-logik ändrad.

# V0.45.0 – Kapital Lab 1

- Nytt Testlab: jämför 1, 2, 3 och 5 samtidiga positioner med exakt samma frysta Jägare.
- Startkapital 100 000 kr, period 2023–2026-09.
- Max 20% equity per position, samma riskmodell, Entry B, Strong-regim, exit och friktion som V0.44.0.
- Hämtar varje månad en gång och kör fyra portföljvarianter på samma data.
- Visar slutvärde, avkastning, PF, WR, max DD, affärer och genomsnittligt kapital i arbete.
- Simuleringsräknaren ökar först när alla fyra kompletta tester är färdiga.
- Ingen Worker-ändring.
- Befintlig mobil/desktop-layout från V0.44.4 bevarad.

# V0.44.4 – Navigation proportion fix

- Desktop: FORSKNING has a dedicated wider label column so it can no longer sit behind the engine dropdown.
- Mobile: Forskningsmotor and Labb dropdowns are now full navigation-sized controls (68 px, larger type and touch target).
- Data/Test/Resultat remain intentionally calmer secondary navigation.
- No strategy, Day Selection, Jägaren, data, Worker or test logic changed.

# V0.44.3 – Layout/UX final pass

- Mobil: Data/Test/Resultat nedtonade till sekundär navigation.
- Mobil/Testlab: dynamisk mätning av fast header med ResizeObserver och säker scroll-offset; labbets överkant ska aldrig hamna bakom headern.
- Desktop: Data-vyn har explicit 50/50-grid: Marknadsgrupp vänster, Symboler + Datatyp/Period/Hämta höger.
- Ingen strategi-, test-, data- eller Worker-logik ändrad.

# V0.44.2 – Desktop alignment

- Desktop-only alignment pass; mobile rules unchanged.
- Header, dashboard, research navigation and work panes now share one centered desktop shell.
- Tester/Testlab use the same stable three-column navigation grid.
- Labb selector aligns with Data/Test/Resultat instead of drifting horizontally.
- Data workspace columns are balanced around the same centreline.
- No strategy, data, Worker, Jägaren or Testlab logic changed.

# Linas Opti V0.44.1 – Responsive Desktop

Desktop-only responsive polish for 13–24 inch screens. Mobile layout and all trading/research logic are unchanged. Adds constrained desktop work widths, a balanced research/navigation bar, two-column Data workspace and centered Testlab workspace.

# Linas Opti V0.44.0 – Jägaren 2023→nu

Nyhet: sammanhängande historiskt portföljtest med 100 000 kr startkapital från januari 2023 till september 2026. Motorn använder det frysta Day Selection 16, PRO2-kvalitetsregler, Entry B, Strong-regim och den frysta forsknings-exiten. En position åt gången, max fyra avslut per dag, återinvestering av aktuellt kapital och modellerad friktion 0,0425 % per sida. Position sizing behåller PRO2:s frysta riskreferens (0,5 % equity mot 0,6 % stop-referens, max 20 % equity).

Resultatet visar slutvärde, total avkastning, PF, win rate, max drawdown och årsvis kapitalutveckling. Detta är historiskt backtest – inte prognos – och perioden är inte ett helt nytt OOS-prov eftersom delar av historiken tidigare använts i forskning/validering.

# V0.43.4 – Stabilitet + UX

- Day Selection återupptas efter avbrott i stället för att börja om.
- Delresultat sparas lokalt efter varje färdig period.
- Datablock försöks automatiskt igen upp till 3 gånger vid Load failed/nätavbrott.
- Simuleringsräknaren ökar först för faktiskt registrerade färdiga resultat.
- Val av Day Selection scrollar till början av labbet.
- Körknapp före metodtext på Day Selection 1/2.
- Rullgardiner och knappar harmoniserade visuellt.
- Strategi/Entry B/Strong/exit/OOS-perioder oförändrade.

# V0.43.3 – Day Selection sharefix

- Dela Day Selection 1 är nu aktiv så fort det finns resultat, även om körningen avbryts före 10/10.
- iOS-delning försöker fil först, sedan text, urklipp och sist filnedladdning.
- Delningsstatus visas direkt i Day Selection-statusraden.
- Ingen strategi-, urvals- eller OOS-logik ändrad.

# V0.43.2 – mobilpolish Testlab

- Day Selection/Testlab-korten använder full tillgänglig mobilbredd.
- Tabellerna hålls inne i kortet och får horisontell scroll vid behov i stället för att pressa layouten.
- Körknappar, status och progresslinje fyller samma kortbredd.
- Forskningsmotor- och Labb-rullgardinerna behåller den stora, knapp-lika utformningen från V0.43.1.
- Ingen strategi-, data-, Worker- eller Day Selection-logik ändrad.
- ZIP är flat: endast de sju filer som ska läggas direkt i /linasopti/.

# V0.43.1 – navigation finalfix

- Regim/Entry/Exit/Day Selection-väljaren kan nu endast visas när Forskningsmotor = Testlab.
- Tester-läge visar endast Data, Test och Resultat.
- Navigationsläget styrs samtidigt via DOM-state, hidden, inline !important och CSS-state för att undvika iOS Safari/CSS-state-problem.
- Båda rullgardinsmenyerna är nu visuellt lika stora som Data/Test/Resultat-knapparna.
- Day Selection 1/2 och all strategi-/forskningslogik är oförändrad från V0.43.0.

# V0.43.0 – Day Selection 1 + Day Selection 2

- Robotmognad: 42/100 efter Regim Lab 2 OOS.
- Day Selection 1 kartlägger 80 förregistrerade likvida USA-aktier på 5-minutersdata.
- Entry B + Strong-regim + forsknings-exit är frysta och ändras inte.
- Selection 1 använder 10 redan förbrukade Entry Lab 2-perioder som utvecklingsdata.
- Kvalificering: minst 5 affärer, positiv P/L, PF >= 1 och minst 3 positiva utvecklingsperioder; max 16 symboler fryses.
- Det frysta urvalet sparas lokalt och låser upp Day Selection 2.
- Day Selection 2 jämför exakt det frysta urvalet mot Lina Selection 16 på 10 nya OOS-perioder.
- Ingen OOS-data används för omrankning eller parameterändring.
- Forskningsmotor-navigationen från V0.42.6 är kvar: labbväljaren visas endast i Testlab-läge.
- Worker och handelsläge är oförändrade; handel är avstängd.
# V0.43.0 – Day Selection 1 + 2

- Robotmognad 42/100 efter godkänt Regim Lab 2 OOS.
- Day Selection 1: fast brett USA-universum, 5-minutersdata, redan förbrukade utvecklingsperioder, fryst Entry B + Strong + forsknings-exit.
- Urval fryses automatiskt efter 10/10 med förregistrerade kvalificeringsregler; max 16 symboler.
- Day Selection 2 är låst tills urvalet är fryst och testar exakt urval på 10 nya OOS-perioder mot Lina Selection 16.
- Ingen livehandel. Worker oförändrad.

# V0.42.5 – Forskningsmotor nav-polish

- Fix: Testlab/labbväljaren är nu hårt dold när **Tester** är valt.
- Tester visar endast **Data · Test · Resultat**.
- Testlab döljer testerknapparna och visar endast labbväljaren.
- Ny tydligare mobil navigation: större träffytor, tydligare nivåer och mindre formulärfältskänsla.
- Ingen strategi-, test-, data- eller Worker-logik ändrad.
- Ingen bild genererad eller ändrad.

# V0.42.4 – Forskningsmotor navigation

- Forskningsmotor har nu två huvudval: **Tester** och **Testlab**.
- Tester visar tre separata knappar: **Data · Test · Resultat**.
- Testlab döljer dessa och visar i stället labbväljaren.
- Regim Lab 2 ligger kvar oförändrat som senaste labb.
- Körstatus/progress ligger direkt under körknappen.
- Menyerna är större och tydligare på mobil.
- Ingen strategi-, parameter-, data- eller Worker-logik ändrad.

# V0.42.3 – Regim Lab 2 + Forskningsmotor

- Ny fast toppnavigering: **Forskningsmotor** innehåller Data, Test, Resultat och Testlab.
- När Testlab är aktivt visas labbväljaren direkt bredvid och ligger kvar i toppytan. Senast valda labb sparas lokalt.
- Endast valt labb visas. Primär **Kör …**-knapp ligger överst i valt labb.
- Nytt **Regim Lab 2** ligger överst/förvalt: Entry B + exakt fryst Strong-regim testas på 10 nya, tidigare oanvända 20-handelsdagarsperioder.
- Förregistrerad jämförelse: Entry B utan regimfilter vs Entry B + Strong. 20 OOS-simuleringar totalt.
- Strong: SPY sedan öppning ≥ +0,10 % och SPY 15m momentum ≥ +0,05 %, mätt med information känd vid entry.
- Forsknings-exit oförändrad: stop −0,4 %, delay 20 min, mål +0,8 %, max 60 min.
- Robotmognad kvar 38/100 tills OOS-resultatet finns.
- Konservativ simuleringslägstanivå före denna körning: ≥18 890.
- Worker och handelsläge oförändrade. Ingen livehandel.

# Linas Opti V0.42.2 – Regim Lab 1

- Nytt Regim Lab 1 överst i Testlabs rullgardinsmeny.
- Endast valt labb visas.
- Entrykandidat B från Entry Lab 2 hålls fryst.
- 5 förregistrerade SPY-regimfilter × 10 tidigare Entry Lab 2-perioder = 50 utvecklingssimuleringar.
- Regimdata använder endast SPY-information känd vid entry: avkastning sedan dagsöppning och 15-minuters momentum.
- Samma exit: stop -0,4%, delay 20 min, mål +0,8%, max 60 min.
- Dessa perioder är utvecklingsdata; ett lovande filter måste senare valideras på nya orörda perioder.
- Robotmognad kvar 38/100.
- Simuleringsgolv minst 18 840 före nya V0.42.2-körningar.
- Worker oförändrad.

# Linas Opti V0.42.1 – Entry Lab 2

- Nytt **Entry Lab 2 · Orörda perioder** överst i Testlab-snabbvalet.
- Fryser fyra kandidater från den robusta zonen i Entry Lab 1 och kör dem på 10 nya 20-handelsdagarsperioder.
- 40 OOS-simuleringar; ingen ny parameteroptimering.
- Testlab visar nu **endast det labb som är valt i rullgardinsmenyn**.
- Simuleringsräknarens konservativa golv är uppdaterat till **≥18 800** efter genomförd Entry Lab 1; därefter fortsätter lokal automatisk räkning.
- Robotmognad kvar på 38/100 i väntan på OOS-resultatet.
- PRO2, Swing, Trend och Worker är oförändrade.

# Linas Opti V0.42.0 – Entry Lab 1

- Nytt Entry Lab 1 ligger överst i snabbvalet/rullgardinsmenyn i Testlab.
- 625 förregistrerade entryfilter × 10 perioder = 6 250 shadow-simuleringar.
- Testar m3-minimum, relativ volym-minimum, close-location-minimum och fem tidsfilter.
- Exakt samma frysta PRO2-entries används; bortfiltrerade entries ersätts inte med nya signaler.
- Exit hålls låst till Exit Lab 2:s bästa forskningsinställning (S−0,4 / D20-inställning / M+0,8 / H60).
- Inga symbol-specifika regler. Resultatet är utvecklingsforskning, inte oberoende validering.
- Simuleringsräknarens historiska golv höjt konservativt till minst 12 550; därefter räknas faktiska körningar lokalt.
- Robotmognad kvar på 38/100 tills positiv robust edge faktiskt visas.
- Worker/API och hemligheter är oförändrade.

# Linas Opti V0.41.3

- Synlig Robotmognad 38/100 i toppytan, klickbar med dynamisk förklaring.
- Kumulativ simuleringsräknare, seed 6 300 dokumenterade automatiska Testlab-simuleringar.
- Räknaren ökar automatiskt vid nya kontroll-, Exit Lab- och Exit Lab 2-simuleringar.
- Testlab har snabbval högst upp; senaste labbet är förvalt.
- Exit Lab 2 och PRO2-strategilogik är oförändrade från V0.41.2.
- Worker/API och hemligheter är oförändrade.

# Linas Opti V0.41.2 – Exit Lab 2

Byggd från verifierade V0.41.1.

## Nytt
- Exit Lab 2 / Parameterkarta.
- 625 förregistrerade exitkombinationer:
  - stop: 0,4 / 0,6 / 0,8 / 1,0 / 1,2 %
  - stop-delay: 0 / 5 / 10 / 15 / 20 min
  - mål: 0,6 / 0,8 / 1,0 / 1,2 / 1,5 %
  - max hålltid: 20 / 30 / 40 / 50 / 60 min
- 10 historiska 20-handelsdagarsfönster = 6 250 simuleringar.
- Samma frysta PRO2-entries återspelas; entry/signal/shares/friktion ändras inte.
- Topp 20 visas i appen; full rapport innehåller topp 50 + alla 625 kombinationer.
- Enkel robusthetsindikator räknar hur många närmaste parametergrannar som också har positiv P/L och PF >= 1.

## Forskningsdisciplin
De 10 perioderna är utvecklingsdata för Exit Lab 2 efter denna körning. En vald PRO3-kandidat måste frysas och testas på nya orörda perioder innan den kan kallas oberoende validerad.

Ingen livehandel.
