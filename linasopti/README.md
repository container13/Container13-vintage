# Linas Opti V0.31 – Nordic-ready

V0.31 behåller den verifierade USA30 Swing-motorn oförändrad för USA och lägger till en separat dataväg för första nordiska testet.

## Nytt
- **Sverige 20** som första EODHD-grupp. Benchmark: `XACT-OMXS30.ST` (handlas aldrig).
- Datakällan väljs per marknadsgrupp: Alpaca för USA, EODHD för Sverige.
- Opti Day och V0.26-omvärldstest körs fortfarande bara för USA; Sverige testar i första hand Swing/Trend på dagsdata.
- Frontend skickar EODHD-grupper till Worker-endpointen `/eod-bars`. Ingen EODHD-token finns i frontend.
- Danmark (`CO`), Finland (`HE`) och Norge (`OL`) visas som nästa nordiska steg.
- Full export anger datakälla och benchmark.

## Viktigt innan svenska resultat tolkas
Detta är ett **datatest**, inte en ny verifierad strategi. EODHD:s vanliga EOD-OHLC är råa priser. V0.31 har ännu inte slutlig splitjustering, utdelningar eller valutahantering. Sverige 20 är dessutom en statisk lista och kan innehålla urvals-/survivorship bias.

## Worker
Se `worker_eodhd_patch_v031.js`. Lägg EODHD-token som Cloudflare Worker-secret med namnet `EODHD_API_TOKEN`; lägg aldrig token i GitHub eller webbsidan.

# Linas Opti V0.30.1 – Swing revision

V0.30.1 ändrar **inte Swing-strategin**. Den lägger till en revisionspanel som kontrollerar signalchronologi, nästa dags öppning, kontantnivå, max 5 samtidiga positioner, exitregler, samma-dag-affärer, OHLC-kvalitet och att SPY aldrig handlas. Full export innehåller revisionsresultatet.

Varningar som revisionen avsiktligt inte kan trolla bort: statisk USA30-lista kan ge survivorship/urvalsbias, och Swing saknar fortfarande courtage/spread/slippage.

# Linas Opti V0.30 – Opti Trend

Ny tredje strategi: Opti Trend. Swing och Day är oförändrade. Trend rankar aktier veckovis på 3/6/12 månaders momentum, kräver pris över SMA200 och håller Top 5. Signal använder föregående stängning och handel sker vid nästa öppning. SPY är benchmark och handlas inte. För Trend krävs cirka 252 handelsdagars dagsdata före teststart.

# Linas Opti V0.28

V0.28 bygger vidare på V0.27 utan att ändra den verifierade Opti Swing-baslinjen.

## Nytt
- Renare sticky topp: titel + underrubrik, därefter en kompakt rad med datastatus och version, sedan flikarna.
- Opti Day A/B-test.
  - A = exakt V0.27-signalen.
  - B = experimentell bekräftad momentum-signal. Samma risk, stop, mål, kostnader, max hålltid och exekveringsordning som A.
  - B kräver 15-min momentum > 0,6 %, pris över SMA12, positiv senaste bar, stängning i övre 35 % av signalbaren och volym minst 12-bars-snitt.
- Resultatpanelen visar A och B sida vid sida.
- Full testdata exporterar båda Opti Day-varianternas affärer och händelseloggar.

## Oförändrat
- Paper/backtest only; inga liveordrar.
- Swing-logik och kronologi.
- SPY benchmark/omvärldsexperiment.
- Opti Day A:s V0.27-regler och kostnadsmodell.


## V0.29 – marknadsgrupper
- Opti Day/Swing-logiken är oförändrad från V0.28.
- Nya symbolpreset: USA Core (10), USA 20 och USA 30. SPY följer med som benchmark men handlas inte.
- Byte av grupp tömmer tidigare inläst data så grupper inte blandas av misstag.
- Europa och Asien visas som kommande grupper men är inte aktiverade i denna version.
- Full testdata exporterar vald marknadsgrupp.
- Syftet är att testa om samma strategi beter sig annorlunda i ett bredare aktieuniversum innan signalparametrar ändras.

V0.29.1: Fixad cache-busting för JavaScript/CSS. V0.29 HTML hade script-taggen kvar på ?v=0.28, vilket kunde ladda cachad V0.28-JS och göra USA 20/30 oklickbara. Ingen strategilogik ändrad.


## V0.29.2
- Fix: när användaren trycker på **2. Test** scrollas vyn automatiskt så **Kör Linas Opti** blir direkt synlig.
- **1. Data** och **3. Resultat** återgår till början av respektive arbetsyta vid flikbyte.
- Ingen ändring i Opti Swing, Opti Day A/B, risk, kostnader eller marknadsgrupper.
- Cache-busting uppdaterad till 0.29.2.


## V0.31.1 – Danmark 20
- Aktiverar Danmark 20 via EODHD Copenhagen (`.CO`).
- Benchmark: `SPIC25KL.CO` (Sparindex INDEX OMX C25 KL).
- Opti Swing-reglerna är oförändrade från V0.31.
- Sverige 20 och USA-grupperna är oförändrade.
- Danmark-listan är statisk och kan därför ha urvals-/survivorship bias.
- EODHD raw EOD OHLC, split/dividend/cost caveats från V0.31 gäller fortsatt.


## V0.32 – Finland 20 + Norge 20
- Aktiverar Finland 20 via EODHD Helsinki (`.HE`), benchmark `SLGOMXH25.HE`.
- Aktiverar Norge 20 via EODHD Oslo (`.OL`), benchmark `OBX.OL` (OBX Total Return Index).
- Samma frysta Opti Swing och revisionskontroller som tidigare; inga strategiparametrar ändrade.
- USA, Sverige och Danmark är oförändrade.
- Norden är fortfarande datatest: statiska universum, rå EODHD-OHLC och inga courtage/spread/slippage i Swing.


## V0.32 Opti Global
- Ny grupp: Opti Global · Norden 80.
- Exakt samma frysta Swing-regler; inga signalparametrar ändrade.
- 80 aktier rankas gemensamt, max fem samtidiga positioner.
- EODHD-hämtning delas automatiskt i batcher om max 25 symboler för att passa Worker-gränsen.
- NORDIC-4 benchmark = aritmetiskt medel av Sverige/Danmark/Finland/Norge-benchmark under testperioden.
- Valutaeffekter mellan SEK/DKK/EUR/NOK är INTE modellerade; Global är därför fortfarande ett experimentellt, currency-neutral datatest.


## V0.33 – Global Test Pack
Ingen ändring av Opti Swing-parametrarna. Tre nya Alpaca-baserade testuniversum har lagts till:
- Världsregioner 20: 20 USA-noterade region-/internationella ETF:er, benchmark VT.
- Global ex-USA 20: 20 internationella ETF:er, benchmark VEU.
- USA + Värld 50: USA30-aktier + 20 region-ETF:er i samma ranking, benchmark VT.

Syftet är robusthetstest, inte parameteroptimering. ETF-universumen är statiska och utdelningar/kostnader är inte fullständigt modellerade. Norden 80 från V0.32 finns kvar oförändrad.


## V0.34 – Global Lab
- Global Stocks 100: 99 USA-noterade aktier/ADR:er från flera regioner + VT benchmark.
- Global Momentum: fryst Swing-signal men endast topp 20% av dagens positiva kandidater får nya positioner.
- Global Defensive: enkel månadsvis 6m momentum top-5, men står i cash när färre än 35% av universum har positivt 6m-momentum.
- Lina vs enkel momentum: kontrollstrategi, månadsvis top-5 på 6m momentum.
- Baseline Opti Swing är oförändrad. Experimenten exporteras separat.
- Alpaca Basic/IEX är fortfarande en testdatakälla; USA-noterade ADR:er ger gemensam USD-prissättning men är inte samma sak som lokal primärnotering.


## V0.34.1 – snabbval 1 år
- Ny knapp **1 år** under Snabbval.
- Ett tryck sätter Till = dagens datum, Från = exakt ett år tidigare och Testperiod börjar = fem månader efter Från för samma enkla warmup-upplägg som de senaste jämförelsetesterna.
- Ingen strategi, signal, benchmark eller marknadsgrupp har ändrats.


## V0.34.2 – Analys
- Ny automatisk symbolanalys efter varje Opti Swing-test.
- Visar största bidrag, största förluster, antal vinst/förlustsymboler och topp-3-koncentration.
- Alla handlade symboler kan fällas ut med affärer, vinstfrekvens, total P/L, +12%-mål och stoppar.
- Symbolanalysen följer med i Snabbrapport och Full testdata.
- Swing-strategins signal-, köp-, exit- och sizingregler är oförändrade från V0.34.1.


## V0.34.3 – Lina Selection 16

Ny marknadsgrupp: `⭐ Lina Selection 16`.

Aktier:
`HD, BAC, AMD, INTC, GOOGL, NVDA, CRM, UBER, ADBE, MU, PYPL, AMZN, WMT, CSCO, KO, QCOM`

Benchmark: `SPY`. Datakälla: Alpaca.

Urvalsmetod:
- Alla inskickade Linas Opti-rapporter användes som underlag och dubbletter identifierades.
- Kända pre-V0.22-körningar med den äldre kronologin används inte för själva rankingen.
- För det gemensamma Alpaca-urvalet används fem separata testmiljöer: USA30 2024, USA30 2025, USA30 2026, Global Stocks 100 (2026-fönstret) och USA + Värld 50 (2026-fönstret).
- Minimikrav: minst 5 avslutade affärer, minst 2 testmiljöer, positiv genomsnittlig affär, profit factor > 1 och positivt bidrag i minst hälften av testmiljöerna.
- Rankingpoängen väger genomsnittlig affär, konsekvens mellan miljöer, profit factor, antal affärer och vinstfrekvens.

Viktigt: detta är selection bias med flit – listan har valts från tidigare testresultat. Resultat på samma eller överlappande historik får därför **inte** användas som oberoende bevis. Den frysta Opti Swing-motorn är inte ändrad. Nästa meningsfulla test är ett held-out/intervall som inte användes för urvalet.

Ingen Worker-ändring krävs.


## V0.34.4 – Eldprov + kostnader + aktier
- Delningsmenyn stängs direkt när Snabbrapport eller Full testdata väljs.
- Ny snabbknapp `🔥 Eldprov 2023`: data 2022-12-01–2023-12-29, teststart 2023-01-03. 2023 användes inte när Lina Selection 16 skapades.
- Ny `Aktier · snabbvy` i resultatet.
- Ny skuggberäkning av handelsfriktion: 0,10% på köp och 0,10% på sälj. Visar brutto, netto, kostnad och netto mot benchmark.
- Kostnadstestet påverkar inte köp/sälj-signaler, positionsstorlek eller den frysta Swing-motorn; det är en separat efterberäkning.
- Kostnadsresultatet följer med i exporterad rapport.
- Ingen Worker-ändring krävs.


## V0.34.5 – tydlig Eldprov-knapp
- Korrigerar V0.34.4 där Eldprov-knappen inte hamnade i den faktiska snabbvalssektionen.
- `🔥 Eldprov 2023` ligger nu direkt efter `Hela perioden` under Data → Snabbval.
- Testlogik och Swing-strategi är oförändrade.
- Arbetsgång: 1. Data = välj grupp/period och hämta data; 2. Test = välj/kör test; 3. Resultat = granska analys och dela rapport.


## V0.35 – Guided Flow
Ren UX-/flödesversion. Swing, Lina Selection 16 och handelsregler är oförändrade.

- Data får en tydlig stegpanel och `Fortsätt till test →` när dagsdata finns.
- Ny `🔥 Eldprov 2022` bredvid Eldprov 2023.
- Test-fliken sammanfattar vald grupp, period och inläst data.
- Efter `Kör Linas Opti` går appen automatiskt till Resultat.
- Resultat får en kompakt topp med Lina, benchmark, skillnad och efter kostnader.
- `Nästa test → 🔥 Eldprov 2022` tar användaren tillbaka till Data och väljer nästa eldprov.
- Befintliga avancerade funktioner finns kvar; V0.35 fokuserar på att huvudkedjan ska kännas sammanhängande.
- Worker oförändrad.


## V0.35.1 – periodval fix
- Eldprov 2022 och Eldprov 2023 har nu exklusiv markering: bara ett periodval kan se aktivt ut åt gången.
- Vald period får prefixet `✓`.
- Om ett vanligt snabbval (1 år, 2024, 2025, 2026, Hela perioden) väljs tas eldprovsmarkeringen bort.
- Ingen ändring i Swing, Lina Selection, datahämtning eller backtestlogik.


## V0.36 – Flow Cleanup
Ren UX-version. Swing, Lina Selection 16 och handelsreglerna är oförändrade.

- Test-fliken är kraftigt förenklad: sammanfattning + `Kör Linas Opti`.
- Startkapital, maxposition, Day-risk och teststart ligger under `Avancerat & testinställningar`.
- Trend/omvärldsförklaringar ligger under `Experiment & utvecklarinformation`.
- Nytt kugghjul i toppen med inställningen `Efter avslutat test`.
- Förvalt beteende: gå till Resultat och öppna delning av **Full testdata** automatiskt.
- Alternativ: Snabbrapport eller bara Resultat.
- Permanent `Dela testdata`-knapp längst ned är avstängd som standard, men kan slås på igen i Inställningar.
- Resultat har en kompakt `Dela rapport`-väg även när den permanenta nederknappen är dold.
- Inställningarna sparas lokalt på enheten.
- Worker oförändrad.


## V0.36.1 – Robust Flow
- Fix: Test-sammanfattningen använder nu faktiskt hämtade `DAILY`-rader och uppdateras direkt efter hämtning/import.
- Fix: 5-min-status visas inte i Swing-fokuserad Test-vy.
- Fix: Backtestkontroll/revision ligger nu hopfälld under Resultat, inte löst under sidfoten.
- Fix: Inställningsknappen använder en robust direktkoppling till inställningspanelen.
- Ändring: automatisk **native** AirDrop/delningsruta efter ett långt test används inte längre. iPhone/Safari kräver ett aktivt användartryck för Web Share.
- Nytt: efter avslutat test kan appen i stället automatiskt visa ett eget delningsval. Ett tryck på `Full testdata` eller `Snabbrapport` öppnar därefter iPhones vanliga delningsruta/AirDrop.
- Permanent nederknapp för delning är fortfarande av som standard och kan slås på i Inställningar.
- Swing-motor och handelsregler är oförändrade.


## V0.36.2 – Click Fix
- Inställningskugghjulet och delningsprompten binds om efter att hela JavaScript-filen laddats.
- Inga inline-onclick-anrop behövs.
- Modalvisning säkras med både `hidden` och `.v036-open`.
- Gamla V0.36/V0.36.1 sparade delningsvärden migreras automatiskt till `prompt`.
- Efter test visas delningsvalet som standard; endast explicit `Gå bara till Resultat` stänger av det.
- Ingen strategi- eller backtestlogik ändrad.


## V0.36.3 – Native Settings
- Kugghjulet är nu byggt med webbläsarens egna HTML `details/summary` och kräver inget JavaScript för att öppnas.
- Den tidigare JavaScript-modalen för Inställningar är borttagen.
- Efter ett avslutat test visas delningsvalet ovillkorligen; användaren väljer därefter Full testdata eller Snabbrapport med ett aktivt tryck för iOS Share/AirDrop.
- Permanent Dela-knapp kan fortfarande slås på/av i kugghjulet.
- Ingen strategi- eller backtestlogik ändrad.


## V0.36.4 – Share Fix
- Orsak hittad: V0.36.3 hade kvar trasig HTML från den borttagna gamla inställningsmodalen efter delningsrutan.
- Sidans nederdel är nu ombyggd rent från grunden.
- `Testet är klart ✓` använder nu en egen enkel bottom-sheet med direkt `display:flex/none`, inte kombinationen hidden + modal-klasser.
- Efter test går appen till Resultat och öppnar delningsvalet efter 400 ms.
- Full testdata / Snabbrapport kräver därefter ett aktivt tryck för iOS Share/AirDrop.
- Kugghjulet fortsätter använda ren HTML details/summary.
- Ingen strategi- eller backtestlogik ändrad.


## V0.36.5 – Inline Share
- Popuprutan efter test är borttagen.
- Efter test går appen till Resultat och visar en vanlig synlig kortsektion högst upp: `Testet är klart ✓`.
- Full testdata och Snabbrapport ligger direkt i Resultat och kräver ett aktivt tryck, vilket passar iOS Web Share/AirDrop bättre.
- `Dela rapport` visar samma kort om det skulle vara dolt.
- Permanent Dela-knapp via kugghjulet finns kvar som reserv.
- Ingen strategi- eller backtestlogik ändrad.


## V0.36.6 – Finish Point
- `Testet är klart ✓` kopplas nu direkt i den verkliga `runBtn`-slutpunkten.
- Resultatfliken och färdigkortet visas innan övriga sekundära resultatpaneler renderas.
- Kortet säkras en andra gång efter renderingen.
- 5-minbarer döljs i det Swing-fokuserade resultatet.
- Ingen beräkning, signalregel, position sizing, exitregel eller benchmarklogik ändrad.


## V0.36.7 – Cleanup
- Kugghjulet/Inställningar borttaget.
- Gamla `Dela rapport` borttaget.
- Permanent nedersta Dela-rad borttagen.
- Dubbla `Dagsdata: N rader` under `Kör Linas Opti` döljs.
- `Testet är klart ✓` med Full testdata / Snabbrapport behålls.
- Ingen strategi- eller backtestlogik ändrad.


## V0.36.8 – Context Cleanup

**Bas:** byggd direkt från V0.36.7 Cleanup. Detta är UI/presentationsstädning.

**Data:** `Testa anslutning` döljs från normalvyn men `#healthBtn` och funktionen finns kvar för felsökning. Opti Day-snabbval och `Hämta 5-min-data` döljs i den Swing-fokuserade normalvyn men finns kvar i DOM/kod. Efter lyckad dagsdatahämtning visas en tydlig grön bekräftelse med vald marknad, antal rader, dataperiod och `Redo att testa`. Befintlig `#bridgeStatus` behålls för intern status/felsökning.

**Resultat:** Opti Day och Day A/B döljs när ingen 5-min-data finns. Opti Trend döljs när den bara visar ej-kört/tomt 100 000 kr och 0,00 %. Swing och verkliga Swing-analyser lämnas kvar. `Testet är klart ✓` och Full testdata/Snabbrapport lämnas oförändrade.

**Inte ändrat:** Swing-score/signaler, kronologi, entry/exit, stop/target/time exit, position sizing, maxpositioner, benchmark, Omvärld-regler, Day-/Trend-motorernas beräkningskod, Worker/API/secrets eller exportinnehåll.

**Felsökning senare:** Day/Trend och anslutningstest är dolda presentationsmässigt – inte raderade. Börja vid `.v0368-day-control`, `.v0368-day-result`, `.v0368-trend-result`, `#healthBtn` och `v0368UpdateContextUI()` om de återaktiveras. Behåll V0.36.1–V0.36.6 i historiken för felsökning av modal/Web Share/finish-point.
