# Linas Opti V0.58.7

> **Aktuell release: V0.58.7** · Dashboard-first kontrollcentral · responsiv mobil/desktop · tydlig status/nytt/klart · historik/utveckling · Forward + forskning · Handel AV · Robotmognad 48/100


## V0.45.12 – Signal Lab 3 UI/version hard-fix
- Korrigerar V0.45.11 där Signal Lab 3 fanns i HTML/JS men kunde döljas/överskridas av äldre Testlab-initiering i webbläsaren.
- Legacy-initieringen från Signal Lab 1 får inte längre skriva över aktuell Testlab-selection efter sidladdning.
- Signal Lab 3 · Close-testet finns kvar oförändrat som senaste labb; ingen strategi-, signal-, exit-, risk-, data- eller Worker-logik ändras.
- Versionsnumret visas nu både i huvudheadern och direkt på inloggningsrutan.
- Header, APP_VERSION och CSS/JS cache-busters är V0.45.12 / 0.45.12.
- `index.html` innehåller no-cache-meta för att minska risken att en gammal HTML-sida återanvänds.
- Signal Lab 3-rapporten använder V04512 i filnamnet.
- Simuleringsräknarens större logikfix är fortfarande planerad till nästa forskningsversion efter att Signal Lab 3-rapporten analyserats, enligt beslutet före denna hotfix.

# Linas Opti V0.45.11

## V0.45.11 – Signal Lab 3 · Close-testet

- Nytt **förregistrerat** Testlab efter Signal Lab 2: close-location testas som **77 / 80 / 83 / 86 %**, där **86 % är fryst kontroll**.
- Endast close-tröskeln ändras. Day Selection 16, PRO2-kvalitet, övriga Entry B-villkor, Strong-regim, forsknings-exit, risk, friktion, max 3 samtidiga positioner, 33,3 % max per position och max 4 nya entries/dag är frysta.
- Varje variant körs som sammanhängande portföljtest över 2023-01 → 2026-09 och rapporterar slutvärde, avkastning, affärer, PF, WR, max DD, kapitalutnyttjande och årsresultat.
- Checkpoint sparas efter varje helt färdig månad för alla fyra varianter. Avbruten körning kan återupptas. Simuleringsräknaren adderar **4 först när hela Signal Lab 3 är färdigt**.
- Signal Lab 3 ligger överst/förvalt i Testlab. Header och CSS/JS cache-busters är **0.45.11**. Rapportfilen heter `LINAS_OPTI_SIGNAL_LAB_3_CLOSE_TESTET_V04511_YYYY-MM-DD.txt`.

### Varför detta steg valdes
Signal Lab 1 visade att Entry B var den största signalflödesflaskhalsen: 41 420 PRO2-observationer blev 2 138 Entry B-observationer. Signal Lab 2 dissekerade Entry B. De hårda sekventiella filtren var m3-min, close ≥86 % och volym ≥1,15×. m3-min och volym-min hade bättre deskriptiv framåtrörelse för pass-gruppen, medan **close ≥86 % hade något bättre +15/+30/+60 min-rörelse i fail-gruppen**. Därför väljs close som första lilla förregistrerade parameterfamilj.

### Signal Lab 2 – resultat som nu är historik
- PRO2: 41 420 observationer.
- Efter m3 ≥0,40 %: 15 513.
- Efter m3 ≤1,20 %: 14 759.
- Efter close ≥86 %: 8 206.
- Efter volym ≥1,15×: 2 283.
- Efter volym ≤3,00×: 2 138.
- Separat close-test diagnostik: pass/fail framåtrörelse var +0,003/+0,007 % vid +15 min, +0,013/+0,017 % vid +30 min och +0,027/+0,037 % vid +60 min. Detta var endast diagnostik och används nu för att formulera Signal Lab 3, inte som bevis för en bättre tröskel.

### Forskningsdisciplin
2023–2026 är **inte nytt orört OOS**. Signal Lab 3 är ett förregistrerat utvecklingstest på historik som redan påverkat forskningen. Om 77/80/83 slår kontrollen 86 skall kandidaten frysas och därefter prövas på verkligt orörd data innan den får ersätta Entry B:s frysta 86 %. Robotmognad höjs inte av detta test ensamt.

### README- och chattöverlämningsregel
Varje kommande README ska fortsätta bära en kompakt löpande projekthistorik: viktiga versioner, forskningssteg, resultat, beslut, frysta delar, större buggar/fixar och varför nästa steg valts. När en Lina-chatt blir lång eller riskerar kontextförlust ska en proaktiv överlämningssammanfattning göras innan byte av chatt.

---

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


## V0.45.13 – Signal Lab 4 · Close 83 holdout + räknarfix

### Varför detta steg
Signal Lab 3 (V0.45.12) jämförde close 77/80/83/86% på 2023–2026. 83% gav högst slutvärde (+4,07%) med PF 1,08, 711 affärer och ett betydligt mindre tapp under 2026 än 86%-kontrollen. 83% utses därför endast till **fryst forskningskandidat**, inte ny produktionsregel.

### Förregistrerat test
Signal Lab 4 jämför endast:
- **83% – fryst kandidat**
- **86% – fryst kontroll**

Alla andra regler är frysta. Testperioden är 2021-01-01–2022-12-31. Den perioden användes inte för att formulera eller välja 83%-hypotesen i Signal Lab 2/3 och fungerar därför som **holdout för close-frågan**. Den ska inte beskrivas som globalt orörd OOS för hela Jägaren, eftersom äldre labb har använt delar av 2021–2022.

### Räknarfix
Den gamla räknaren ökade Signal Lab 3 med endast +4 trots att fyra varianter kördes över 45 månader. V0.45.13 migrerar därför räknaren en gång till verifierat minimum **19 922** (= 19 742 t.o.m. Signal Lab 2 + 180 variant×månad-enheter från Signal Lab 3). Därefter räknas Signal Lab 4 med **+2 per färdig månadscheckpoint**. Vid avbrott räknas inte ofärdiga månader om efter återupptagning.

### Projekthistorik / överlämning
README ska även fortsättningsvis bära den kompakta forskningshistoriken, frysta beslut, större buggar/fixar och varför nästa steg valts. När chatten blir lång ska en överlämningssammanfattning göras innan kontext riskerar att gå förlorad.


## V0.45.14 – Robustness Lab 1 · PBO / DSR

### Beslut efter Signal Lab 4
Close ≥83% slog 86%-kontrollen även i 2021–2022-holdouten men både 83% och 86% var negativa absolut. 83% förblir därför **fryst forskningskandidat**, inte bevisad slutregel. Ingen finoptimering runt 83% görs.

### Syfte
V0.45.14 ändrar inga Jägaren-regler. Den återkör den redan förregistrerade close-familjen 77/80/83/86% månadsvis över 2023–2026 och beräknar:
- CSCV/PBO för close-familjens urvalsstabilitet.
- Deflated Sharpe inom samma jämförbara fyrvariantsfamilj.
- Separat trial ledger som dokumenterar forskningsprogrammets minsta kända antal strategivariationer.

### Viktig metoddisciplin
PBO/DSR får **inte** låtsas omfatta alla gamla Lina-labb som om de vore en homogen kandidatmatris. Exit-, Entry-, Regim-, Kapital- och close-labb har olika sökutrymmen och datalayout. Därför används endast 77/80/83/86 i PBO/DSR. Hela historiken visas separat som trial pressure.

Dokumenterat minimum i V0.45.14:
- Exit Lab 1: 3
- Exit Lab 2: 625
- Entry Lab 1: 625
- Entry Lab 2: 4
- Regim Lab 1: 5
- Regim Lab 2: 2
- Kapital Lab 1: 4
- Kapital Lab 2: 4
- Signal Lab 3: 4
- Signal Lab 4: 2
= **1 278 dokumenterade strategivariationer minimum**.

Day Selection-symbolurval, diagnostik och rena omkörningar hålls utanför trial-siffran tills de klassificeras konsekvent.

### CSCV/PBO
2023–2026 månadsobservationer delas i 8 balanserade kronologiska block. Alla 70 val av 4 block som in-sample mot återstående 4 out-of-sample analyseras. För varje kombination väljs bästa close-variant in-sample och dess OOS-rank omvandlas till logit. PBO är andelen där den valda IS-vinnaren hamnar i den svagare OOS-halvan.

### DSR
Deflated Sharpe beräknas på 83%-kandidatens månadsavkastningar, med jämförelse mot förväntad maximum-Sharpe efter de fyra jämförbara close-trials. Resultatet gäller bara close-familjen och är inte ett bevis för hela strategins framtida edge.

### Simuleringsräknare
Verifierat golv höjs till **19 970** efter slutfört Signal Lab 4 (19 922 + 48 variant×månad). Robustness Lab 1 lägger därefter +4 först efter varje sparad månadscheckpoint. En full körning lägger alltså +180 och slutar på minst **20 150**.

### Nästa beslut
Nästa forskningssteg bestäms först efter Robustness Lab 1-rapporten. Vid svag PBO/DSR ska vi inte optimera vidare. Vid rimlig robusthet går vi vidare mot walk-forward/paper-design utan att använda samma historik för nya efterhandsregler.


## V0.46.0 – Validation Suite
Stor sammanhållen iPhone-anpassad valideringsetapp. Close ≥83% är fryst kandidat och ingen strategiparameter ändras automatiskt.

Sju förregistrerade steg: Integrity Audit, PBO/DSR, tidsstabilitet, friktionsstress, koncentration, Monte Carlo och slutrapport. Varje steg sparar status och forskningskvitto lokalt. Hela sviten kan köras i följd eller ett steg i taget. Slutrapport, rådata-JSON samt separat backup/restore finns.

Alla steg har tryckbara ?-förklaringar på vanlig svenska. Förklaringarna beskriver vad måttet betyder och, efter körning, det aktuella resultatet.

V0.46.0 använder regelhash och datafingerprint för spårbarhet. Ingen artificiell totalscore används: varje steg får PASS/VARNING/FAIL. Ingen automatisk räddningsoptimering görs. PBO/DSR gäller endast den jämförbara close-familjen. Test på andra marknader och fintrimning runt 83% ingår inte.

iPhone: färdiga steg lagras i Safari localStorage och kan fortsätta efter omladdning. Safari-lagring betraktas inte som permanent arkiv; backup bör sparas till Filer/iCloud.


### V0.46.0 slutinspektion
Efter extra release-audit rättades en kvarvarande äldre fallback i Testlab-väljaren från V0.45.14 till Validation Suite V0.46.0. Simuleringsräknaren fick även ett separat idempotent V0.46.0-ledger: fryst 83%-bas räknar månadsreplays en gång, PBO-familjen räknar variant×månad en gång och Monte Carlo räknar sina 2 000 permutationer en gång. Ledgern följer med backup/restore för att undvika dubbelräkning efter återställning.


### Release gate – godkänd för uppladdning
Slutinspektion genomförd efter V0.46.0-auditen. 47 kontroller granskades. Den enda automatiska flaggan var HTML-attributet `placeholder="Lösenkod"`, vilket är avsiktlig UI-text och inte en kvarlämnad utvecklings-placeholder. Därmed är samtliga releasekontroller godkända.


## V0.46.1 – Reliability / Live Progress

Ingen handelsregel ändrad. Close ≥83% förblir fryst kandidat.

Förbättringar för långa iPhone/webbläsarkörningar:
- basdata checkpointas efter varje färdig månad;
- en avbruten basdatakörning fortsätter från nästa ofärdiga månad i stället för 1/45;
- separat pågående checkpoint hålls isär från färdiga testresultat;
- live-status visar aktuell månad, delprogress, aktivitet, förfluten tid och senaste checkpoint;
- fem senaste logghändelserna visas;
- Pausa, Fortsätt och Avbryt;
- automatiskt upp till tre försök vid datafel samt 90 sekunders timeout per månadshämtning;
- skydd mot parallell dubbelkörning;
- Kör hela stoppar efter Integrity FAIL i stället för att fortsätta blint;
- säkerhetskopian inkluderar även pågående basdata-checkpoint;
- V0.46.1 har egna lagrings-/ledgernycklar så halvfärdig V0.46.0-state inte blandas in.

Safari/iOS kan fortfarande pausa JavaScript när sidan går i bakgrunden eller telefonen låses. V0.46.1 lovar därför inte bakgrundskörning, men färdiga månadscheckpoints ska finnas kvar.


## V0.46.2 – Validation Suite UX / Progress / Reproducibility

Ingen handelsregel ändrad. Close ≥83% är fortsatt fryst kandidat.

Ändringar:
- två separata progressnivåer: aktuellt test och hela 7-stegssviten;
- aktiv tabellrad visar ⏳ PÅGÅR med delprogress i stället för ”Ej körd”;
- färdiga rader visar ✅ PASS, ⚠️ VARNING eller ❌ FAIL;
- Fortsätt-knappen visas endast när körningen faktiskt är pausad;
- under aktiv körning visas endast Pausa och Avbryt; startknapparna döljs;
- loggen märker BASDATA respektive PBO och PBO skriver en ny klar-rad efter varje månad;
- PBO/DSR har egen månadscheckpoint och kan fortsätta efter ett avbrott utan att börja om från 1/45;
- testresultat kan öppnas direkt från tabellen, exporteras separat och kontrollköras;
- kontrollkörningar sparas under originalresultatet och skriver inte över första Validation Suite-resultatet;
- kontrollkörning jämför resultat/status mot originalet och varnar vid avvikelse;
- V0.46.1-resultat migreras till V0.46.2 när regelhashen är samma, så redan färdiga Validation Suite-resultat inte behöver kastas bort;
- backup inkluderar även eventuell pågående PBO-checkpoint.

V0.46.2 fortsätter forskningsprincipen att en omkörning är reproducerbarhetskontroll, inte ett sätt att jaga PASS.


## V0.46.3 – Loginfält tomt vid start

Ingen forsknings- eller handelslogik ändrad.

Ändring:
- lösenkodsfältet öppnar tomt vid sidladdning;
- fältet har `autocomplete="new-password"` och inget förifyllt value;
- Lina rensar fältet vid DOMContentLoaded, pageshow och några korta efterkontroller för att motverka sen autofyllning från webbläsaren;
- fältet rensas även första gången det får fokus medan inloggningsgrinden är låst.

Syftet är endast att inloggningsrutan ska börja visuellt tom. Användaren kan fortfarande själv välja ett sparat lösenord från webbläsarens lösenordshanterare.


## V0.47.0 – Validation Suite B · Edge & robusthet

Stor sammanhållen testetapp. Ingen handelsregel ändrad; Close ≥83% är fortsatt fryst kandidat.

Suite B är medvetet en **ny forskningsgeneration efter Suite A**. Det är viktigt eftersom Suite A-resultaten redan är kända. De 12 nya testerna ska därför beskrivas som robusthetsdiagnostik på återanvänd historik, inte som nytt orört OOS-bevis.

Förregistrerade Suite B-tester:
1. Edge per affär.
2. Kostnads-headroom / break-even.
3. Friktionsstege 1,0×–2,0×.
4. Leave-one-symbol-out.
5. Exit-orsaker.
6. Tid på dagen.
7. Veckodagar.
8. Rullande 6 månader.
9. Rullande 12 månader.
10. Bootstrap 95% konfidensintervall.
11. Svansrisk / längsta förlustsvit.
12. Vinstkoncentration topp 10%.

Varje test har ?-förklaring, sparat resultat, tekniska detaljer och separat export. Ingen parameter ändras automatiskt efter resultatet.

UI-fixar i V0.47.0:
- PASS/FAIL visas på svenska som GODKÄND / KRAV EJ UPPFYLLT, medan tekniska fel heter KÖRFEL.
- resultatrutor centreras i synlig viewport och scrollar internt;
- resultat visas i mänskligt läsbara nyckeltal med tekniska detaljer hopfällda;
- när Suite A redan är 7/7 klar döljs startknapparna och ersätts av tydligt genomfört-läge;
- lösenkodsfältet använder autocomplete=off och flera ignore-attribut för att minska automatiska lösenordsförslag;
- README-huvudet och aktuell release uppdateras till V0.47.0.

Releasekrav från och med denna version: README-huvudversion = APP_VERSION = loginversion = headerversion = CSS/JS-cacheversion innan ZIP får godkännas.


## V0.48.0 – Validation Suites C, D och E

Ny stor lokal diagnostiketapp. Ingen handelsregel ändrad. Close ≥83% är fortsatt fryst kandidat. Robotmognad kvar 48/100.

Alla tre nya sviter använder de redan sparade 711 Suite A-affärerna lokalt. Därför krävs ingen ny scanning/API-hämtning och körningen ska normalt gå mycket snabbt. De är diagnostik på återanvänd historik, inte nytt orört OOS-bevis.

### Suite C – Tidsstruktur · 10 tester
Positiva månader; kvartalsstabilitet; rullande 3 månader; rullande 9 månader; halvårsstabilitet; entry i 15-minutersfönster; veckodag × tid; affärslängd; exit-orsak × år; tidig vs sen historik.

### Suite D – Bredd & beroenden · 10 tester
Positiva symboler; PF-bredd per symbol; symbol × år; ta bort två bästa symbolerna; ta bort tre bästa symbolerna; affärskoncentration; P/L-HHI; topp 5% vinnare; sämsta 5% förluster; längsta symbolspecifika förlustsvit.

### Suite E – Statistik & Monte Carlo · 10 tester
Bootstrap affärer 5 000×; månadsblock-bootstrap 5 000×; slumpbortfall 10%; slumpbortfall 25%; slumpmässig kostnadschock; slumpad affärsordning/drawdown; sämsta 20-affärersfönster; sämsta 50-affärersfönster; förlustsvit Monte Carlo; Wilson 95% CI för vinstfrekvens.

Ny snabbknapp **Kör alla 30 tester** kör C → D → E i följd och sparar varje test lokalt direkt efter genomförande. Varje svit kan även köras separat och exporteras som TXT + RAW JSON. Varje enskilt test har hjälptext, detaljvy och separat export.

Totalt i A–E: 7 + 12 + 10 + 10 + 10 = 49 steg/tester.


V0.48.0 exporttillägg: snabbkörningen C+D+E har även en samlad TXT-rapport och en samlad JSON-backup med alla tre sviterna, regelhash och datafingerprint. Detta gör att hela 30-testpaketet kan lämnas till ChatGPT/analyseras senare utan tre separata råfiler.


## V0.49.0 – Validation Suites F, G och H

Ytterligare 30 lokala diagnostiska tester. Ingen handelsregel ändrad. Close ≥83% fortsatt fryst kandidat. Robotmognad kvar 48/100.

### Suite F – Sekvens & tidsberoende · 10 tester
P/L-autokorrelation lag 1; vinst/förlust-övergångar; efter förlust; efter tre raka förluster; månadsautokorrelation; kvartalsautokorrelation; första/andra halvan av månaden; månadens början/slut; dagsklustring; daglig expectancy.

### Suite G – Trade-geometri & exits · 10 tester
Realiserad R-multipel; riskbelopp; andel målträffar; andel stoppar; andel max-60-exits; hålltid × P/L; entrypris-kvartiler; positionsstorleks-kvartiler; equity-kvartiler; exitavstånd från entry.

### Suite H – Blockstress & borttagning · 10 tester
Leave-one-month-out; leave-one-quarter-out; leave-one-year-out; leave-one-weekday-out; leave-one-timebucket-out; ta bort bästa månaden; ta bort tre bästa månader; winsorize 1%; winsorize 2,5%; udda vs jämna handelsdagar.

Ny snabbknapp **Kör alla 30 tester** kör F → G → H lokalt. Varje test sparas direkt. Separata TXT/RAW JSON per svit plus samlad F+G+H TXT och JSON-backup.

Totalt A–H: 7 + 12 + 10 + 10 + 10 + 10 + 10 + 10 = 79 steg/tester.

Alla F–H-resultat är diagnostik på återanvänd historik, inte nytt orört OOS-bevis. Ingen parameteroptimering eller automatisk räddning.


## V0.50.0 – Validation Suites I, J och K

Ytterligare 30 lokala diagnostiska tester. Ingen handelsregel ändrad. Close ≥83% fortsatt fryst kandidat. Robotmognad kvar 48/100.

### Suite I – Fördelning & expectancy · 10 tester
Payoff ratio; trimmat snitt 5%; P/L-kvantiler; skevhet; excess kurtosis; PF utan bästa 1% vinnare; PF utan sämsta 1% förluster; median-expectancy; win/loss-asymmetri; expectancy-dekomposition.

### Suite J – Equity & drawdown · 10 tester
Max drawdown i kronor; max drawdown i procent; längsta underwater i affärer; längsta underwater i kalenderdagar; recovery factor; Ulcer index; sämsta aktiva dag; sämsta vecka; sämsta månad; drawdown-episoder.

### Suite K – Resiliens & kombostress · 10 tester
Slumpbortfall 5%; 15%; 30%; +10% kostnad +10% bortfall; +20% kostnad +10% bortfall; månadsbootstrap +10% kostnad; ta bort 2 slumpmånader; ta bort 4 slumpmånader; winsor 1% +10% kostnad; pessimistisk kombostress med bästa månaden borttagen +10% kostnad.

Ny snabbknapp **Kör alla 30 tester** kör I → J → K lokalt. Varje test sparas direkt. Separata TXT/RAW JSON per svit plus samlad I+J+K TXT och JSON-backup.

Totalt A–K: 109 steg/tester.

Alla I–K-resultat är diagnostik på återanvänd historik, inte nytt orört OOS-bevis. Ingen parameteroptimering eller automatisk räddning.


## V0.51.0 – Forward Validation Gate

Nu lämnar Lina den långa historiska diagnostikfasen och går över till ett äkta framåttest.

- Startankare: **2026-09-11**.
- Endast affärer med entrytid efter ankaret räknas.
- Samma frysta Jägare används: Day Selection 16, Strong regime, Entry B, Close ≥83%, research exit och samma kapitalregler.
- Regelhashen låses när forward-testet startas.
- Historiken 2023–2026 får ligga kvar för referens men används inte för att avgöra forward-resultatet.
- Handel är fortsatt AVSTÄNGD. Detta är paper/forward research.
- Ingen automatisk optimering, räddning eller parameterändring efter svaga resultat.

### Milstolpar
1. **60 nya affärer** – första lägesbild.
2. **120 nya affärer** – mellanbedömning.
3. **250 nya affärer** – starkare forward-bedömning.

V0.51.0 sparar varje ny forward-affär lokalt, deduplicerar affärer, sparar scan-historik, lastDataEnd och checkpoint i localStorage. Det finns separat forward-rapport och JSON-backup.

### Viktig princip
Om forward-resultaten är svaga ska samma generation fortsätta eller avslutas som svag. Vi ska inte ändra 83%, entrytid, exit eller andra regler och sedan kalla det samma forward-test. En framtida ändring måste bli en ny forskningsgeneration med nytt regelhash/nytt ankare.

Robotmognad ligger kvar på **48/100** tills verklig ny forward-data ger grund för höjning.


## V0.51.1 – iPhone PWA + auto-kontroll

Ingen forsknings- eller handelslogik ändrad. Samma frysta Jägare och samma forward-generation fortsätter.

Förbättringar:
- iPhone-PWA-stöd med `display: standalone`, Apple web-app-meta och appikon.
- Instruktion **Lägg till på hemskärmen** direkt i Lina.
- Vid öppning kontrollerar Lina automatiskt om avslutade USA-handelsdagar saknas sedan senaste forward-checkpointen.
- Om dagar saknas körs samma V0.51.0-forwardscan automatiskt. Om inget saknas görs ingen dataladdning.
- Auto-kontrollen kan stängas av/på lokalt.
- Senaste auto-kontroll visas i UI.
- Dator/iPhone behöver fortfarande inte vara på när marknaden stänger; nästa öppning hämtar ikapp saknade avslutade dagar.
- iOS får pausa webbappen i bakgrunden. V0.51.1 bygger därför inte på bakgrundskörning.

Forward-startankare, regelhash, 83%-kandidat och tidigare checkpoints bevaras. Robotmognad kvar **48/100**.


## V0.51.2 – Global uppdateringsknapp

Ingen forsknings- eller handelslogik ändrad.

- Ny fast, tumvänlig **↻ Uppdatera**-knapp nere till höger.
- Knappen finns lättillgänglig även när Lina körs som iPhone-PWA från hemskärmen.
- Ett tryck laddar om aktuell sida/app.
- Alla localStorage-checkpoints, forward-data och resultat bevaras vid omladdning.
- Om en datahämtning pågår frågar Lina först innan omladdning, så en aktiv scan inte avbryts av misstag.
- iPhone safe-area respekteras så knappen inte hamnar bakom hemindikatorn.

Forward-generation, startankare, regelhash och Close ≥83% är oförändrade. Robotmognad kvar 48/100.


## V0.51.3 – PWA UI-städning
- Stora permanenta iPhone-webbapp-kortet borttaget.
- Forward Validation Gate ligger åter direkt under Testlab-raden.
- ↻ Uppdatera behålls lättillgänglig.
- PWA/hemskärmsläge och automatisk forward-kontroll vid öppning behålls.
- Ingen ändring av Jägaren, forward-ankare, regelhash eller Close ≥83%.


## V0.51.4 – Tester + Uppdatera på samma rad

Ingen forsknings- eller handelslogik ändrad.

- Uppdatera-knappen är inte längre flytande ovanpå sidan.
- På mobil ligger **Tester** och **↻ Uppdatera** på samma rad.
- Uppdatera behåller samma storlek/utseende som tidigare.
- Tester tar resterande bredd på raden.
- Data / Test / Resultat ligger kvar under.
- Ingen ändring av Jägaren, forward-ankare, regelhash, Close ≥83% eller robotmognad.


## V0.51.5 – Responsiv Uppdatera-knapp

Ingen forsknings- eller handelslogik ändrad.

- Mobil behåller V0.51.4-upplägget: Tester + Uppdatera på samma rad, med tumvänlig Uppdatera-knapp.
- På 13" skärm och större blir Uppdatera kompakt i stället för att breda ut sig över raden.
- Testlab ligger kvar tydligt till vänster och labbvalet får resterande bredd.
- Ingen ändring av Jägaren, forward-ankare, regelhash eller Close ≥83%.


## V0.51.6 – LABB-raden full bredd på mobil

- Rättar bieffekten från V0.51.4 där LABB/Forward Validation-raden blev för smal på iPhone.
- **Tester + Uppdatera** ligger fortsatt på samma rad.
- Raden under, **LABB + Forward Validation**, använder åter hela tillgängliga bredden.
- Desktopfixen från V0.51.5 behålls.
- Ingen ändring av forskningslogik, Jägaren, forward-ankare, regelhash eller Close ≥83%.


## V0.52.0 – Historisk Tidsmaskin / pseudo-forward

Ny separat forskningsfunktion medan riktiga Jägaren samlar forward-data.

- Startår kan väljas 2024, 2025 eller 2026.
- Historiken släpps fram kronologiskt i 1, 5 eller 20 vardagar per steg, eller automatiskt till 2026-09-10.
- Samma frysta Jägaren och Close ≥83% används.
- Resultat och checkpoint sparas separat i `linasopti_historical_timemachine_v0520`.
- Riktig V0.51-forward och dess localStorage ändras inte.
- Rapporten märks uttryckligen **HISTORISK PSEUDO-FORWARD – INTE NY OOS**.
- Funktionen är diagnostisk eftersom dagens Jägare redan har påverkats av delar av 2024–2026-historiken.
- Ingen parameteroptimering eller automatisk regeländring sker från resultatet.
- Robotmognad kvar 48/100; Tidsmaskinen får inte ensam höja mognaden.


## V0.52.1 – Live-status för Tidsmaskinen

Ingen forskningslogik ändrad.

Tidsmaskinen visar nu tydligt under körning:
- aktuell historisk dag som bearbetas,
- dagnummer av totalt antal vardagar,
- procent färdigt,
- antal affärer hittills,
- senaste sparade checkpoint.

Statusen uppdateras före varje nytt datachunk och efter sparad checkpoint. Den riktiga V0.51-forwarden påverkas inte.


## V0.52.2 – Datablock, timeout och hämtstatus

Ren tillförlitlighets-/UI-patch. Ingen strategi eller forskningsregel ändrad.

- Automatisk Tidsmaskin kör nu i mindre block om 5 vardagar i stället för 20.
- UI visar exakt vilket datumintervall som hämtas.
- När ett block är klart visas hämtningstid och antal rader.
- 45 sekunders timeout skyddar mot att sidan ser frusen ut i flera minuter.
- Vid timeout/fel pausas körningen men checkpointen behålls; nästa tryck på `Kör till stopp` fortsätter från sparat läge.
- LABB-väljaren visar Tidsmaskinen som vald när den senaste Tidsmaskin-vyn öppnas.
- Riktig forward V0.51 och dess lagring lämnas orörda.


## V0.52.3 – Robust resume vid nätverksfel

Bakgrund: en verklig körning nådde 685/704 vardagar (2026-08-14) men fastnade sedan på återkommande `NetworkError` vid blocket som började 2026-08-17.

Ändringar:
- automatisk körning hämtar nu **en historisk vardag i taget**,
- varje dag får upp till **4 försök**,
- retry-backoff: 3 s, 6 s, 9 s,
- UI visar aktuellt försök,
- checkpoint sparas efter varje färdig dag,
- vid 4 misslyckade försök pausas körningen utan att cursor/affärer tappas,
- nästa `Kör till stopp` fortsätter exakt från samma dag,
- tidigare localStorage-nyckel behålls så pågående V0.52.2-körning kan återupptas utan reset.

Ingen strategi, Close ≥83 %, regelhash eller riktig Forward V0.51 har ändrats.


## V0.53.0 – Lina Swing Research Gate 1

Ny separat forskningsgeneration: **SWING-G1**. Jägaren fortsätter sin riktiga forward-validering orörd.

Förregistrerad uppdelning:
- utvecklingsdata: **2021-01-01 – 2023-12-31**,
- låst historisk pseudo-forward: **2024-01-01 – 2026-09-10**,
- första universum: samma 16 likvida USA-aktier som Jägaren,
- normal swinghorisont: 2–10 handelsdagar,
- separat signalfamilj: trend + rekyl + återhämtning,
- SPY-trend som gemensamt regimfilter,
- inga symbolspecifika räddningsregler,
- modellerad friktion och fast risk per affär,
- ingen tuning på den låsta pseudo-forward-perioden.

V0.53.0 kör ännu ingen Swing-optimering. Den låser forskningsplanen först. Nästa steg blir Swing Lab 1 som endast får använda 2021–2023. Robotmognad ligger kvar på 48/100.


## V0.54.0 – Lina Swing Alphabet A–O

Detta paket samlar så mycket som möjligt av första Swing-generationen i en enda reproducerbar körning.

**Dataregim**
- A–M får endast använda 2021-01-01 – 2023-12-31.
- Steg M fryser exakt kandidat och parameterhash mekaniskt.
- Först efter M får steg N hämta 2024-01-01 – 2026-09-10.
- Pseudo-forward-resultatet får inte användas för att rädda/ändra SWING-G1.
- Jägaren och riktig forward från 2026-09-11 påverkas inte.

**Alphabet A–O**
A Dataintegritet · B Baseline · C Trendfamilj · D Rekylfamilj · E Återhämtning · F SPY-regim · G Exitfamilj · H Friktion · I Kapital/risk · J Årsstabilitet · K Leave-one-symbol-out · L Bootstrap · M Frys kandidat · N Låst pseudo-forward · O Slutrapport.

**Förregistrerad grid**
- trend: 20/50/100 dagar
- rekyl: 2/4/6 %
- recovery: uppstängning / stängning över föregående high
- SPY-regim: av / över SMA50 / över SMA100
- stop: 5/7 %
- mål: 8/12 %
- max hålltid: 5/10 handelsdagar
- modellerad friktion: 0,10 % per sida
- risk: 0,5 % equity/affär
- max 5 samtidiga positioner
- max 20 % equity/position

Urvalet använder utvecklingsresultat, årsstabilitet och drawdown. Pseudo-forward klassas separat och är fortfarande historisk, inte ny framtida OOS.
Robotmognad ligger kvar på 48/100 tills ny evidens motiverar annat.


## V0.54.1
Fix: Swing A–O hämtar utvecklingsdata och låst pseudo-forward månad för månad med checkpoint efter varje färdig månad. Ingen strategiändring; Jägaren är orörd.

## V0.54.2 – Alpaca transportfix
V0.54.1 visade att även en månads direkt `1Day`-hämtning gav `Alpaca svarade med ett fel`.
Swing använder därför nu samma beprövade 5-minuters `/bars`-transport som Jägaren/Tidsmaskinen och aggregerar varje månad lokalt till dags-OHLCV innan Swing-motorn får datan.
Checkpoint sparar endast de kompakta dagsraderna. Forskningsregler, A–O-grid, datadelning och Jägaren är oförändrade.

## V0.54.3 – extra robust datahämtning: symbol × månad
V0.54.2 gav fortfarande Alpaca-fel. Nästa möjliga flaskhals är att ett månadspaket med alla 17 symboler fortfarande är för tungt eller att en enskild symbol orsakar felet.

V0.54.3 hämtar därför:
- **en symbol i taget**,
- **en månad i taget**,
- 5-minutersdata via samma `/bars`-väg,
- lokal aggregering till dags-OHLCV,
- checkpoint efter varje färdig symbol.

UI visar exakt `Månad X/Y · symbol N/17 · SYMBOL`. Om något fortfarande fallerar får vi därmed exakt symbol och månad istället för ett generiskt Alpaca-fel. Pågående misslyckad V0.54.2-fetch migreras automatiskt till nya symbol×månadsläget när `Fortsätt` trycks.

Ingen strategi-, grid-, datadelning- eller Jägarenändring.


## V0.55.0 – Lina Swing G1 · Riktig Forward

Swing-kandidaten från Alphabet A–O är fryst:
- hash `8f09f32a`
- trend 50 dagar
- rekyl 2 %
- recovery `prevhigh`
- SPY över SMA100
- stop 7 %
- mål 12 %
- max hålltid 5 handelsdagar
- kostnad 0,10 % per sida
- risk 0,5 % equity/affär, max 5 positioner, max 20 % equity/position

### Forwardankare
Swing-kandidaten frystes under USA-sessionen den 11 september 2026. Därför vore det metodologiskt fel att räkna en entry vid 11 september-open som riktig forward. **Första giltiga Swing-forwarddag är 2026-09-14.**

### Funktion
- separat localStorage: `linasopti_swing_forward_v0550`
- indikator-warmup börjar 2026-04-01 men får inte skapa entries före ankaret
- datan hämtas robust symbol × månad via 5-minutersbridge och aggregeras lokalt till dagsdata
- checkpoint efter varje färdig symbol
- öppna positioner tvångsstängs inte vid scan-slut
- motorn körs om deterministiskt från warmup med entries låsta till >= 2026-09-14
- milstolpar 60 / 120 / 250 stängda affärer
- auto catch-up vid öppning
- TXT, Raw JSON och separat backup
- jämförelsepanel mot Jägarens riktiga forward
- ingen automatisk rescue/optimering

Pseudo-forward 2024–2026-09-10 är endast referens: 323 affärer, +2 417 kr, PF 1,042, WR 50,46 %, DD −5,66 %.
Jägarens forward och regler är oförändrade. Robotmognad är fortsatt 48/100.


## V0.55.1 – Forward och forskning separeras i UI

Två robotar är nu särskilt markerade som strategier som arbetar framåt i riktig tid:
- **Jägaren · riktig forward**, ankare 2026-09-11.
- **Swing G1 · riktig forward**, ankare 2026-09-14.

De visas i en egen permanent `🚦 FORWARD`-rullgardin ovanför forskningsdelen. Status visas per lokal enhet:
- `🟢 AKTIV` = forwarden är startad i den aktuella webbläsarens localStorage.
- `🟡 REDO` = strategin är fryst men forwarden är ännu inte startad på just den enheten.

Den gamla Testlab-rullgardinen heter nu `HISTORIK/LABB` och innehåller endast forskning, pseudo-forward och historiska tester. Jägaren och Swing G1 har tagits bort ur den historiska listan för att undvika sammanblandning.

Ingen strategi-, data-, risk- eller forwardlogik ändras i V0.55.1. Jägaren och Swing G1 är exakt samma frysta robotar som i V0.55.0.
Nästa planerade forskningsspår är en separat **Swing G2** med en annan signalfamilj, inte finjustering av Swing G1.


## V0.56.0 – Lina Swing G2 · Breakout/Momentum Alphabet A–O

Ny oberoende strategigeneration. Den ersätter inte Swing G1 och ändrar inte Jägaren eller någon riktig forward.

### Förregistrering
- DEV: **2020-01-01 → 2022-12-31**
- låst historisk pseudo-forward: **2023-01-01 → 2026-09-10**
- signal: gårdagens stängning bryter över högsta tidigare stängningskurs i vald lookback
- entry: nästa handelsdags open
- breakout: 20 / 55 / 100 dagar
- trendfilter: off / SMA100 / SMA200
- volym: off / 1,2× / 1,5× 20-dagars snitt
- SPY-regim: off / SMA100 / SMA200
- stop: 5 / 7 %
- mål: 10 / 15 %
- max hålltid: 10 / 20 handelsdagar
- totalt **648 förregistrerade varianter**
- friktion: 0,10 % per sida
- risk: 0,5 % equity/affär
- max 5 samtidiga positioner
- max 20 % equity per position

A–M får endast se DEV. M fryser exakt kandidat och hash. Först därefter får N öppna pseudo-forward. Ingen rescue eller automatisk efteroptimering efter N.

### A–O
Dataintegritet, baseline, breakoutfamilj, trendfilter, volym, SPY-regim, exitfamilj, friktionsstress, kapital/risk, årsstabilitet, leave-one-symbol-out, bootstrap 2 000, kandidatfrysning, låst pseudo-forward och slutrapport.

2023–2026 benämns uttryckligen **historisk pseudo-forward**, inte färsk OOS.
Jägaren och Swing G1 forward är helt oförändrade. Robotmognad ligger kvar på 48/100 tills ny faktisk forwardevidens motiverar annat.


## V0.56.0 – UI patch: kompakt LABB → egen arbetsvy

Innan V0.56.0 publicerades ändrades LABB-navigationen för att lösa problemet där Forward + Forskning/Historik tog så stor höjd att bara en smal remsa av själva testpanelen syntes.

Ny princip:
- LABB-starten visar två kompakta menyområden: **Forward** och **Forskning & historik**.
- När en robot eller ett test väljs öppnas den som en **egen arbetsvy**.
- De stora navigeringsblocken döljs i arbetsvyn.
- En liten sticky `← LABB`-knapp tar användaren tillbaka till valvyn.
- Vid ny sidladdning visas den kompakta LABB-starten i stället för att ett gammalt test automatiskt ligger öppet under menyerna.

Detta är en ren UI/navigation-ändring. Jägaren, Swing G1 forward och Swing G2 A–O-motorerna är oförändrade.


### V0.56.0 – slutlig visuell städning före GitHub
- Forwardraden komprimerad till rubrik/status + en normalstor rullgardin.
- Forskning & historik komprimerad till en enda ren rad med normalstor testväljare.
- Den gamla stora generella Uppdatera-kontrollen döljs i navigeringen; relevant uppdatering finns i respektive arbetsvy.
- Data/Test/Resultat behandlas visuellt som separat fliknivå, inte som del av rullgardinsraden.
- Bakgrundsgrafiken tonas ned bakom arbetskontroller.
- Vald modul fortsätter öppnas som egen arbetsvy med `← LABB`.
- Ingen strategi-, data-, forward- eller G2-testlogik ändrad.


## V0.56.1 – Dashboard-first kontrollcentral

Lina öppnar nu på en responsiv dashboard i stället för den gamla staplade LABB-navigationen.

Dashboarden visar:
- Linas lägesbild
- nästa rekommenderade steg
- Forward: Jägaren och Swing G1 med verklig lokal status, affärer, P/L, PF och senaste behandlade dag
- Pågående forskning: Swing G2 med verklig A–O-progress
- Historik & utveckling
- metod/principer
- äldre LABB/testverktyg
- projektanteckningar
- backup av hela Lina
- senaste ändringar

Statusnivåer:
- `✅ KLART`
- `🟢 AKTIV`
- `🟡 REDO`
- `🆕 NYTT`
- `🧪 PÅGÅR`

Val av kort öppnar modulens egen arbetsvy. Där visas endast vald modul och `← Dashboard`.
Layouten anpassas automatiskt för mobil, tablet/laptop och större skärmar.

Ingen strategi-, signal-, forward-, data- eller G2-testlogik ändras i V0.56.1.


## Permanent release rule – two ZIP packages

From V0.56.1 onward, every Lina release delivered to the user MUST include two ZIP packages:

1. **COMPLETE** – the complete deployable Lina package containing all files required for the version.
2. **CHANGED_FILES_ONLY** – only files that were created or modified since the immediately preceding release.

Additional rules:
- Both ZIP packages must use the same Lina version number.
- The complete package is the authoritative deployable release.
- The changed-files package is a convenience package for reviewing/updating only changed files.
- Every delivery must state which files are included in CHANGED_FILES_ONLY.
- Release inspection and ZIP integrity checks must be performed before delivery.
- Historical `LINA_HANDOFF_Vxxxx.md` files are immutable snapshots and must not be rewritten retroactively.
- Each new version gets a new handoff file.
- `LINA_PROJECT_HISTORY.md` is the rolling project/build history and may be updated in new releases.
- This rule must be preserved in future README/handoff files so it survives chat handoffs.


## Permanent assistant/build rule – no generated images unless explicitly requested

For the Lina project, the assistant must **never generate, create, redesign or mock up an image merely because the user attaches a screenshot or says "kör"**.

- A screenshot is normally evidence to inspect/analyse the actual Lina UI or bug.
- `kör` means continue the requested Lina code/build work unless the user explicitly asks for an image.
- Image generation may only be used when the user explicitly asks to create/generate/design/render an image or visual.
- This rule must be preserved in future README and handoff files so it survives chat handoffs.


## V0.56.2 – Dashboard scroll fix

- Fixed the V0.56.1 dashboard being clipped and impossible to scroll fully on both desktop and mobile.
- Root cause: the dashboard had been placed inside the legacy `.sticky-top`, which is `position:fixed`.
- In dashboard mode only, `.sticky-top` now returns to normal document flow so the full dashboard contributes to page height.
- Workspace/module behavior remains unchanged.
- Added permanent project rule: do not generate images unless the user explicitly asks for an image.
- No strategy, signal, data, forward, G2 A–O, anchor, hash, risk or trading logic changed.

## V0.56.3 – Compact dashboard
- Permanent `↻ Uppdatera` in the header; compact icon on mobile.
- Home view prioritizes status, next step, and three compact tracks: Jägaren, Swing G1, Swing G2.
- History, methodology, project journey, notes, data and tools remain available behind one expandable entry.
- No strategy/data/forward/risk/trading logic changed.

## V0.56.4 – Focused section navigation
- The old giant expanded LABB page is no longer shown from the dashboard.
- `Historik, forskning & verktyg` now opens a compact menu of focused destinations.
- Historical labs open one module at a time with `← Dashboard`.
- Data opens in its own dedicated workspace with `← Dashboard`.
- Project journey, Jägaren history, methodology and notes open as focused overlays.
- `Alla historiska tester` provides a compact picker instead of rendering the full legacy page.
- No strategy/data/forward/risk/trading logic changed.


## Permanent UI architecture rule – dashboard is navigation, not content

From V0.57.0 onward Lina uses a strict three-level application hierarchy:

1. **Dashboard** – only status, next step and top-level categories.
2. **Category page** – only relevant subcategories/actions.
3. **Workspace/detail view** – the actual detailed test, data tool, history or report.

Permanent rules:
- New functionality must **not automatically add more detail to the dashboard**.
- Detailed legacy/test/data content must never expand underneath the dashboard.
- Each workspace must provide a clear back path to its parent category.
- The same information architecture must adapt automatically to mobile and larger screens.
- Existing research engines/history may remain under the hood; navigation controls what is visible.

## V0.57.0 – Application architecture

Major UI architecture change.

Lina is no longer treated as one growing Trading Lab page. It is now organized as:

`Dashboard → Category → Subcategory / Workspace`

Top-level dashboard categories:
- Forward
- Forskning
- Historik
- Data
- Verktyg
- Om Lina

The dashboard contains only project status, next step and category navigation. Detailed research/data/history tools are opened separately and never render underneath the dashboard.

Existing strategy engines, stored forward state and historical labs remain intact.

No strategy, signal, data, forward anchor, risk or trading rule was changed.


## V0.57.1 – Flow audit / actionable status

The complete package was inspected for user-facing states such as `redo`, `klar`, `väntar`, `nästa steg`, `starta` and `fortsätt`.

Findings and fixes:
- **Data ready card:** was a real dead end. It said `Redo att testa` without a route. It now says `Data klar för test` and contains a direct `Kör test med denna data →` action.
- **Data workspace:** V0.57.0 had disabled the transitional builder that used to create its back header. V0.57.1 creates its own permanent flow header with `← Data`.
- **Test workspace/result:** now stays inside the same guided flow. After a test is complete the result card explicitly says what happens next and offers `← Till Data`.
- **Header refresh:** V0.57.0 could lose the refresh button because the older dashboard builder was disabled. V0.57.1 restores `↻ Uppdatera` independently in the header.
- **Forward Jägaren/Swing G1:** no dead end found; `EJ STARTAD/REDO` states already have explicit Start/Scan actions.
- **Swing G2:** no dead end found; unlocked state has `Lås forskningsplan`, running state has its A–O controls, completed state shows final verdict.
- **Tidsmaskin / Swing G1 A–O / validation labs:** their waiting/running/completed states already have Start/Next/Resume/Run or visible results in the same workspace.
- **Completed generic test:** share buttons already existed; an explicit return-to-Data action was added to make continuation obvious.

Permanent UX rule: whenever Lina says that something is ready, complete, waiting for the user, or has a next step elsewhere, the same view must provide the concrete action or a clear route to it.

No strategy, signal, data engine, research rule, forward anchor, hash, risk or trading logic changed.

**FULL PACKAGE FLOW AUDIT: COMPLETED in V0.57.1.**


## V0.57.2 – workspace clarity audit

A second full UI inspection focused on two problems: unclear workspace identity and competing multi-column work areas.

Changes:
- Every detailed research/history/forward workspace now begins with a prominent parent/category + module header.
- Swing G2 explicitly identifies itself as `Swing G2 · Breakout/Momentum · A–O` before its controls.
- Detailed workspaces use one primary reading column. Dashboard/category cards may still use multiple columns because they are navigation, not work content.
- Data is now always a single vertical step flow on desktop and mobile. The previous desktop two-column market/data layout was removed.
- Swing G2 stages/actions are one column. The same rule is applied to the long Swing G1 / Research Gate work areas where competing columns reduced readability.
- Compact KPI groups may remain multi-column; they are short status values, not separate work streams.
- The data-ready action is now truly one click: `Kör test nu` starts Linas Opti immediately. It no longer jumps to a test view and asks for a second click.

Permanent interaction rule:
A button labelled `Kör`, `Starta`, `Fortsätt` or equivalent must perform that action. If a button only navigates, its label must say `Öppna`, `Visa` or otherwise make the navigation explicit.

## V0.57.3 – full responsive workspace/table audit

The complete V0.57.2 package was reviewed for fixed/minimum widths, horizontal overflow and desktop-only multi-column assumptions.

Responsive targets:
- mobile
- medium / 13-inch laptop
- large desktop

Changes:
- detailed workspaces use more of the available width on 13-inch screens (up to 1180 px)
- normal user-facing tables no longer keep the old global `min-width:760px`
- normal tables fit their workspace and allow meaningful cells such as `Orsak` to wrap
- the main trade log receives sensible proportional column widths
- on mobile, user-facing tables automatically become stacked labelled cards
- table labels are derived from each table's actual headers, including dynamically-generated result rows
- only explicitly technical/raw audit tables may retain horizontal scrolling
- dashboard/category navigation stays responsive 3/2/1 columns
- one-column detailed workspaces from V0.57.2 remain in force

Permanent responsive rule:
Normal user-facing information must fit without horizontal scrolling on a 13-inch screen. On mobile, wide tables must reflow into a readable stacked/card representation. Horizontal scrolling is reserved for genuine raw/technical data where preserving the raw table is more important than overview.

## V0.58.6 – navigation & orientation audit

The whole package was inspected for subviews that could visually replace the dashboard without clearly identifying the current location.

Permanent navigation hierarchy:
`Dashboard → Category → Module → Work step`

Every detailed workspace now gets one authoritative context bar containing:
- a visible Back button
- breadcrumb/location
- current module/work step
- a short description of what the user does there

Examples:
- `Dashboard › Forskning › Swing G2 · Breakout/Momentum · A–O`
- `Dashboard › Data › Marknadsdata`
- `Dashboard › Data › Test`
- `Dashboard › Data › Resultat`

The older competing workspace/flow headers are hidden while the new context bar is active, preventing two different navigation systems from appearing at once.

State audit:
The selected Market Group is now reconciled with the actual symbol list. If the symbol list exactly matches a known group, that group is highlighted. If it is custom, no preset remains falsely highlighted and the status says `Egen symbolista`.

Permanent rule:
A visible selected option must describe the state actually used by Lina. A stale highlight is treated as a UI correctness bug, not merely a cosmetic issue.

## V0.57.5 – context-preserving next-step flow

A completed step may never end with only `Klar`, `Redo` or `Väntar`.

The app now stores the workflow origin before entering Data. When Data completes, the next-action card uses that origin:
- Swing G2 origin → `Till Swing G2 →`
- general Data origin → `Kör test nu`

Important safety/UX distinction:
`Till Swing G2` returns to the canonical G2 A–O module and highlights the next enabled canonical control. It does not invent or auto-trigger a research stage whose exact state may require review/locking.
For the general test flow, `Kör test nu` executes the existing canonical test button in one user action.

Permanent flow rule:
Every completed user-facing step must expose a concrete next action in the same view. The action must preserve the workflow context that brought the user there. Navigation and execution must remain semantically distinct.

## V0.57.6 – view-driven layout/orientation

Previous fixes depended too much on how a pane was reached. In practice, the legacy code can show Data/Test/Result/Testlab through several paths, so a correct layout must be based on the **visible view itself**, not a body class set earlier in the route.

V0.57.6:
- Data is always one column whenever `#pane-data` is visible
- Test and Result always use the same clear work-column width when visible
- the authoritative context/orientation bar appears whenever Data, Test, Result or Testlab is visible
- old competing workspace headers are always suppressed
- the visible Testlab module determines the breadcrumb/module identity
- Market Group highlighting is recalculated from the actual symbol list every time the visible state changes
- a known exact symbol group is highlighted; custom symbols show `Egen symbolista`
- next-step rendering is refreshed from the actual visible Data-ready state

Permanent rule:
Visible state is authoritative. Layout, orientation and selected-state UI must not depend on which navigation path happened to open the view.

## V0.57.7 – unified application boot audit

A package-wide initialization audit found the deeper cause of the recent orientation failures.

### Root cause
Several V0.57.x features had exact-version initialization guards:
- V0.57.0 dashboard boot only ran when `APP_VERSION === V0.57.0`
- V0.57.1 flow init only ran in V0.57.1
- V0.57.2 workspace init only ran in V0.57.2
- V0.57.4/5/6 had the same pattern

After later version bumps, those initializers stopped running. Meanwhile the old legacy startup still executed `show('data', false)`. This could make Lina open directly in Data, making it look as if clicking G2 had led to a generic Data page.

### V0.57.7 fix
A single current-app boot now initializes the active V0.57 architecture and **always starts a fresh page load at Dashboard** after older legacy DOMContentLoaded handlers have finished.

It explicitly initializes:
- current header controls / Refresh
- context/orientation system
- responsive table labelling
- completion/next-step watcher
- visible-view normalization
- market selection truth
- Dashboard as authoritative startup

Permanent engineering rule:
Version-specific historical initializers must never be the only way a permanent current-app feature is started. Each current release must have one authoritative boot path that initializes the whole active architecture.

No strategy, research, forward, risk or data-engine logic changed.

## V0.57.8 – workflow-owner orientation

The work header now answers `Where am I?` using the workflow that owns the shared view, not only the generic pane name.

Examples:
- `Dashboard › Forskning › Swing G2 › Data`
- owner: `Swing G2`
- step: `Data · Marknadsdata`
- back: `← Swing G2`

The same pattern is applied to Jägaren and Swing G1 contexts where a shared Data/Test/Result view is used.

Permanent UX rule:
Shared tools such as Data, Test and Result must inherit the identity of the workflow/strategy that opened them. The owner, current step, breadcrumb and Back destination must all agree.

## V0.57.9 – G2 guided workflow

Swing G2 no longer dumps the user into the generic Data workbench as the primary experience.

G2 now owns a guided first step:
`Swing G2 → Steg 1: Hämta forskningsdata`.

The user is shown the frozen/pre-registered requirements:
- Lina Selection 16
- daily data
- DEV 2020–2022
- locked pseudo-forward 2023–2026

One primary action, `Hämta G2-data`, configures the known data choices and invokes the existing data fetch. Advanced Data settings remain available behind `Visa datainställningar`.

When data is ready, the same G2 context shows:
`✓ G2-data klar → Nästa: Steg A – Dataintegritet → Fortsätt till steg A`.

Permanent UX rule:
A research workflow with pre-registered inputs must present those inputs as fixed workflow requirements, not ask the user to reconstruct them in a generic tool.

## V0.58.0 – G2 returns to the proven research loop

The user-facing G2 workflow is deliberately simple again:

`Lås plan → Kör G2 A–O → Resultat klart → Exportera G2-rapport till ChatGPT`.

The existing G2 engine already knows its exact data periods and fetches the required data itself. Therefore the normal G2 path must NOT force the user through the generic Data workbench.

The generic Data tool remains available as an advanced/general tool, but it is not a required step in G2.

Permanent research UX rule:
When an experiment can determine its own frozen inputs, the primary action is `Kör`. After completion, Lina must provide an explicit export action and tell the user to send that report to ChatGPT for analysis.

## V0.58.1 – authoritative G2 route

V0.58.0 still allowed legacy pane logic to win and show generic Data after the user chose G2.

V0.58.1 makes the G2 route authoritative:
- clicking G2 can only activate the G2 workspace
- Data/Test/Result panes are forcibly hidden while G2 is active
- only `#v0560SwingG2Lab` is visible in Testlab
- legacy `show('data')` calls are ignored while G2 is active
- G2 always shows its own context header and V0.58 guided flow
- leaving G2 through category/home explicitly clears the G2 route
- fresh page load still starts at Dashboard

Permanent route rule:
A module route owns the visible workspace until the user explicitly leaves that module. Legacy pane switches may not hijack an active modern workflow.

## V0.58.2 – workspace isolation

A complete leak audit showed that the problem was not limited to Regim Lab 2.

The old testlab contains multiple generations of root nodes:
- modern `.v0413-lab-section.vlab-*`
- older `.card.vlab-*` / `.v0410-labhero`
- global legacy navigation blocks

V0.58.1 only hid one class family, so older labs and navigation could remain visible underneath a modern module.

V0.58.2 introduces one generic workspace-isolation layer:
- every root-level `vlab-*` block is hidden
- only nodes belonging to the active lab token are shown
- this also supports older labs that use companion cards with the same `vlab-*` class
- legacy Forward / Forskning & Historik / Tester navigation is hidden inside a module workspace
- a runtime MutationObserver re-hides anything old code tries to reveal later
- leaving to Dashboard/category releases the isolated workspace

Also fixed: the permanent V0.58 G2 flow no longer disables itself after a patch release. `v0580PaintG2Flow()` now remains active throughout V0.58.x, fixing the dead `Lås G2-planen` button seen in V0.58.1.

Permanent engineering rule:
Module visibility is controlled by one generic workspace host, not by assumptions about which historical CSS class a lab happens to use.

## V0.58.3 – G2 daily-data fetch fix

A real G2 run failed immediately at:
`AMD 2020-01-01–2020-01-31: 0 rows`.

Root cause: the G2 swing engine works entirely on daily bars, but its historical loader still requested **5-minute bars** month-by-month and then aggregated them into daily bars. That was unnecessary and made old history dependent on intraday availability.

V0.58.3 changes only the G2 data transport:
- G2 requests `timeframe=1Day` directly
- no 5-minute-to-daily aggregation in the G2 loader
- a new checkpoint mode `g2-symbol-month-daily-2` resets incompatible old 5-minute fetch checkpoints
- the DEV/OOS periods, symbol universe, strategy grid and all A–O research rules are unchanged
- retry/checkpoint/resume behavior remains

Permanent engineering rule:
A daily strategy should fetch daily bars directly unless intraday data is explicitly required by the research hypothesis.

## V0.58.4 – boot/guard cleanup

A package-wide guard audit found 17 exact-version checks. Several permanent UI/navigation features could silently stop after a patch release while legacy startup still called `show('data', false)`.

V0.58.4 introduces one authoritative current-app boot for the whole V0.58.x family.

It explicitly starts:
- header / refresh
- context/orientation
- responsive table support
- completion/next-step monitoring
- visible-view normalization
- market-state truth
- workspace-isolation runtime guard
- G2 permanent run/export panel

Then it renders Dashboard last, after older DOMContentLoaded handlers, so legacy Data startup cannot win the final first screen.

Permanent engineering rule:
No permanent current-app feature may depend solely on an exact historical version guard. Patch-version bumps inside the same active architecture family must not disable navigation, isolation, orientation, responsiveness or workflow logic.

## V0.58.5 – single boot / performance cleanup

V0.58.4 fixed exact-version guards but accidentally reactivated multiple historical startup generations at once. On login/page load this could start many delayed initializers and overlapping MutationObservers.

V0.58.5 changes the architecture:
- historical V0.57.x/V0.58.0–.4 init functions remain in source for compatibility/history
- their DOMContentLoaded autostarts are disabled
- exactly one current boot runs: `v0585CurrentBoot`
- exactly one observer of each permanent type is started
- dashboard is the final fresh-load state
- G2 panel, orientation, responsive tables, market-state truth and refresh are initialized once

Permanent performance rule:
One release = one authoritative app boot. Historical initializers may remain in code but must not autostart. Permanent observers/listeners must be idempotent and started once.

## V0.58.6 – navigation audit/fix

Navigation audit found several generations of wrappers around `v0570ShowCategory`, `v0570OpenLab` and `v0570RenderHome`, plus multiple back buttons that were rebound using `cloneNode()`. A visible button could therefore keep the right label while losing/replacing its click handler.

V0.58.6 introduces one authoritative delegated navigation router in capture phase. It owns the current back controls:
- G2 `← Forskning`
- category `← Dashboard`
- generic workspace back
- Data back
- flow back

Before leaving a module it releases workspace isolation and G2 state, then routes exactly one level out.

Single-boot rule is preserved: V0.58.6 is the only DOMContentLoaded boot; it calls the V0.58.5 base boot and then installs the navigation router once.

## V0.58.7 – G2 historical daily transport + durable back

Two live failures remained in V0.58.6:

1. G2 still returned `AMD 2020-01-01–2020-01-31: 0 dagsrader`.
   The G2 loader had moved to 1Day bars but still relied primarily on the Alpaca `/bars` route. V0.58.7 uses a historical-daily provider chain instead:
   `EODHD plain ticker → EODHD .US ticker → Alpaca 1Day`.
   Returned ticker names are normalized back to the frozen G2 universe.
   The checkpoint mode is bumped to `g2-symbol-month-daily-3`.

2. `← Forskning` could still fail because older context code replaces the button node with `cloneNode()`.
   V0.58.7 arms G2's back button with an inline `onclick` attribute. Attributes survive cloning, so the route remains attached even when historical wrappers replace the DOM node.

No G2 strategy/grid/risk logic changed.
