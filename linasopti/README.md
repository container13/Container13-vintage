# Linas Opti V0.38.7 – Snabbare val

Byggd direkt ovanpå fungerande V0.38.6.

## Ändrat i V0.38.7
- Periodvalet markerar vald knapp omedelbart och gör datum-/statusuppdateringen i nästa renderingsvarv.
- Marknadsval (bl.a. USA Core, USA 20 och USA 30) markerar vald knapp omedelbart och gör övrig UI-städning i nästa renderingsvarv.
- Målet är att valen ska kännas rappare på iPhone utan att ändra vad valet faktiskt gör.

## Uttryckligen inte ändrat
- `bridge()` och `getBars()` / datahämtningen.
- Cloudflare Worker eller API-adress.
- Alpaca/EODHD-logik.
- Swing-strategi, signaler, exits, position sizing eller benchmarklogik.
- Rapport-/delningsflödet.

## Stabil bas
V0.38.5 är golden master för fungerande datahämtning. V0.38.6 är verifierad fungerande med återställda perioder. V0.38.7 ändrar endast responsordningen i period- och marknadsvalens UI.

## Test
1. Prova snabbt mellan USA Core / USA 20 / USA 30 och kontrollera att markeringen flyttar direkt.
2. Prova flera perioder/år och kontrollera att markeringen flyttar direkt och datumen uppdateras.
3. Välj önskad grupp + period och hämta dagsdata.
4. Kör test och kontrollera resultat/export som vanligt.
