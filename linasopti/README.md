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
