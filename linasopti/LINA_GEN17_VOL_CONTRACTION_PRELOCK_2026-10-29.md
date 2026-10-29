# Gen17 – volatilitetssammandragning, förregistreringsutkast
Datum: 2026-10-29. Status DRAFT_ONLY / NOT_LOCKED. Inga körningar, inga ändringar i fryst Gen16, ingen deploy, handel eller Forward.

## Exakt föreslagen ENDA nya regel (ej godkänd)
För varje aktie och signal vid stängning t: beräkna daglig range R_i=(high_i-low_i)/close_i från justerade och tidskorrekta OHLC, för enbart redan avslutade sessioner. M_recent = aritmetiskt medel av R över t-20 ... t-1. M_previous = aritmetiskt medel av R över t-40 ... t-21. Tillåt befintligt Gen16-köp endast om M_recent < M_previous. Likhet eller saknad/ogiltig OHLC => inget nytt inträde. Denna lag om en fullständig session förhindrar att dagens breakout-bar används för att kvalificera sig. Valet 20+20 sessioner är ett förhandsförslag med enkel tolkningsbarhet, inte kalibrerat mot Gen17-resultat; inget parametergrid.

## Oförändrat
Gen16:s 16 symboler, signal och nästa dags öppning, positionsstorlek (inklusive dess befintliga volatilitetsfunktion), 12-sessioners exit, transaktionskostnader, kapacitet, foldgränser, exekveringsordning och jämförelsegrindar. Varken handelsvolym, SPY, VIX eller extern earnings-data ingår i nya villkoret. Jämförelse måste göras mot exakt fryst Gen16-kontroll, utan att skriva över tidigare experiment.

## Granskning och blockerare
Gen9–16 specifikationer och G2/G3/G4/G5/G6-kod granskade utan att samma inträdesvillkor identifierats. Gen7–8-källkod har ännu inte verifierats på rätt filväg; nyhet är därför UNVERIFIED. Gen1 ej fullständigt kontrollerad. OHLC tillgänglighet och point-in-time corporate-actions-behandling måste verifieras innan godkännande. Data 2021–24 är observerad utvecklingshistorik och får inte marknadsföras som osedd holdout. Minst 40 kompletta historiska sessioner krävs före varje signal, med saknade datum/ickepositiva priser => avstå.

## Nästa steg / STOP
1. Spåra faktiska Gen7/8-implementationer och verifiera tidigare ATR/range/kontraktionsfilter; dokumentera kvarvarande osäkerhet om kod ej finns.
2. Verifiera rå-OHLC, justeringarnas tidskorrekthet, kalendermatchning och att både kontroll och kandidat kan reproduceras utan lookahead.
3. Skriv deterministisk RUNNERSPEC med hash, frysta indata, testprotokoll, risk- och koncentrationsgrindar, flera-test-korrigering och framtida validering.
4. Begär explicit mänskligt godkännande av exakt plan innan PLAN_LOCKED och någon Gen17-backtest. STOP vid saknad proveniens eller historisk nyhetskonflikt.
