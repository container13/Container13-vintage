# LINA HANDOFF – CLEAN CORE V0.2.6

Datum: 2026-09-14

## Fryst forskningsresultat
Swing G2 kandidat `15efd75a` är oförändrad och fryst.
Pseudo-forward: 144 affärer, +13 708,85 i G2-modellvaluta, PF 1,4673, WR 50,0 %, DD -2,34 %.
Ingen rescue eller efteroptimering.

## Nytt i V0.2.6
Broker/Cost Gate är en egen route och nås från Forskning samt från färdig G2.
Den reprissätter exakt samma 144 affärer.

Profiler:
- G2 referens: 0,10 %/sida.
- IBKR Pro Tiered proxy: publicerad USD 0,0035/aktie, min USD 0,35/order + regulatoriska säljavgifter + Lina slippage 0,05 %/sida.
- Alpaca proxy: 0 aktiekommission för kvalificerad self-directed API-handel + regulatoriska säljavgifter + Lina slippage 0,05 %/sida.
- Nordnet Mini auto-FX proxy: 0,25 % courtage + 0,25 % auto-FX + 0,05 % slippage/sida.
- Nordnet Mini valutakonto proxy: 0,25 % courtage + 0,05 % slippage/sida; 0,075 % manuell FX hålls separat.
- Stress 0,15 / 0,30 / 0,50 % per sida.

## Modellbegränsning
G2:s kapital 100 000 och amerikanska USD-priser har hittills behandlats i samma modellvaluta. Broker Gate är därför en relativ robusthets-/kostnadsjämförelse. Exakt SEK-, FX-, ISK- och skattebokföring ska lösas innan livehandel.

## Mäklare – aktuellt
IBKR är huvudkandidat tekniskt.
Alpaca är stark API-kandidat.
Nordnet är relevant svensk referens men deras External API tar för närvarande inte in nya kunder.
Ingen mäklare är slutligt vald.

## Nästa steg efter Broker Gate
Om kostnadsmarginalen håller: bygg G2 Real Forward / Paper Trading med exakt kandidat-hash `15efd75a`.
Milstolpar: 60 / 120 / 250 helt nya affärer.
Handel AV tills separat beslut.

## Permanenta regler
- Bygg från senaste COMPLETE.
- Flat ZIP.
- Versionssynk är release blocker.
- G2 får inte efteroptimeras.
- Stora körningar ska ha checkpoint + lagringskompaktering från start.
- Cloudflare Worker: komplett kod direkt i chatten för copy/paste → Deploy när Worker ska ändras.
- Skapa aldrig bild om användaren inte uttryckligen ber om det.
