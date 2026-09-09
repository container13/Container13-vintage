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
