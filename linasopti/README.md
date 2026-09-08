# Linas Opti V0.39.1 – Lina Day Jägaren

Datum: 2026-09-08
Bas: V0.38.7 (snabbval), som i sin tur bygger på verifierat fungerande V0.38.5/V0.38.6-spår.

## Syfte
Första frysta forskningsmotorn för nya Lina Day. Målet i denna version är INTE att optimera fram hög avkastning utan att testa om en kronologiskt ren intradagsmekanism har edge efter modellerad spread/slippage.

## Nytt
- Lina Day heter nu **Lina Day · Jägaren** i resultatet.
- 5-minutershämtning och snabbval 5/20/60 dagar är synliga igen för USA-marknader.
- Jägaren bevakar alla valda USA-symboler samtidigt och rankar kandidater på varje avslutad 5-minutersbar.
- Signal: kort momentum + positiv senaste bar + över kort SMA + stark stängning i baren + volym minst 1,15x nyligt snitt.
- Högst rankade kandidat får affären.
- Exekvering sker först på NÄSTA 5-minutersbars öppning.
- En position åt gången, max 6 avslutade affärer/dag, max 20% av kapitalet per position.
- Riskinställningen i appen används; default 0,5% risk/affär.
- Stop -0,6%, mål +1,0%, max innehav 40 minuter.
- Inga nya köp sent på dagen och säkerhetsstängning före/vid dagsslut; ingen övernattning.
- Modellerad spread/slippage är integrerad i Day-motorn (samma grundantagande som tidigare Day: spread 0,035% + slippage 0,025%).
- Gamla Day A/B-testet är fryst och körs inte i V0.39.1.

## Uttryckligen INTE ändrat
- Opti Swing-motorn.
- Swing-regler, Selection16, omvärldstest eller benchmarklogik.
- Dagsdatahämtningen/bridge()/getBars("1Day").
- Cloudflare Worker eller API-hemligheter.
- V0.38.7 period-/marknadsval.
- Rapport-/delningsflödet i övrigt.

## Forskningsregel
V0.39.1 Jägaren V1 ska betraktas som fryst första hypotes. Vi ska först läsa resultaten månad för månad innan signalgränser, stop, mål eller position sizing ändras. Ett snyggt backtest är inte bevis på framtida avkastning.

## Första test
1. Välj USA-marknad, gärna Lina Selection 16 eller USA 30.
2. Välj Lina Day testperiod 20 dagar.
3. Hämta 5-min-data för Jägaren.
4. Kör Linas Opti.
5. Dela Full testdata så att affärerna kan granskas exakt.


## V0.39.1 – 5-minutersdata återställd tydligt
- Återställer en tydlig Lina Day/Jägaren-yta i Data-fliken.
- Visar snabbval 5, 20 och 60 dagar.
- Visar knappen **Hämta 5-min-data för Jägaren** direkt i samma yta.
- Befintlig `getBars("5Min")` och Worker/API-väg återanvänds; ingen ändring av Swing-strategin eller dagsdatahämtningen.
- V0.38.5 är fortsatt golden master för datahämtningen.
