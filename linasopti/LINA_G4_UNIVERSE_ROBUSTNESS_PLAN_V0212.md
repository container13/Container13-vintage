# LINA G4 UNIVERSE ROBUSTNESS PLAN – V0.2.12
Datum: 2026-09-15
Status: FÖRREGISTRERAD PLAN · RESULTAT EJ ÖPPNAT
Plan-ID/hash: `95d2e735`
Handel: AV

## Fråga
Överlever den frysta Swing G2-kandidaten `15efd75a` när exakt samma strategi körs på ett annat aktieuniversum utan parameterändring?

G4 är ett portabilitets-/robusthetstest. Det är inte ny oberoende OOS, eftersom perioden 2020–2026 redan är historiskt observerbar och det alternativa universumet definieras 2026. Resultatet får därför stärka eller försvaga robusthetsbilden men får inte ersätta Real Forward.

## Fryst strategi
- Kandidat: `15efd75a`
- breakout 55
- trend SMA200
- volym 1,5× 20d
- SPY-regim SMA200
- stop 7 %
- target 15 %
- max hold 10 handelsdagar
- kostnad 0,10 % per sida
- risk 0,5 % per affär
- max 5 samtidiga positioner
- max 20 % av modell-equity per position
- startkapital 100 000 modellvaluta

Inga parametrar får ändras efter att G4-resultatet har öppnats.

## Ursprungligt G2-universum – FACIT, EJ G4
AMD, SHOP, ADBE, MU, FDX, TSLA, LUV, NFLX, C, NOW, QCOM, BAC, GM, DDOG, PYPL, NVDA.

## G4 testuniversum – FRYST
AAPL, MSFT, AMZN, GOOGL, META, JPM, XOM, UNH, JNJ, PG, KO, CAT, HD, DIS, NKE, WMT.

Urvalet är en i förväg deklarerad, diversifierad grupp likvida amerikanska large-cap-aktier med noll överlapp mot ursprungliga 16. Det är inte ett historiskt point-in-time-indexuniversum; survivorship/urvalsbias ska därför uttryckligen redovisas som begränsning.

SPY används endast för samma frysta regimfilter som i G2 och räknas inte som en handelssymbol.

## Period
2020-01-01 → 2026-09-10.

Hela perioden öppnas först efter planlås. Års-/kalendersegment används endast som stabilitetsdiagnostik. Ingen del används för att optimera G4.

## Förregistrerad Gate
### PASS
Alla måste vara uppfyllda:
- minst 100 stängda affärer;
- total P/L > 0;
- PF ≥ 1,15;
- max drawdown inte sämre än -8 %;
- minst 4 positiva kalendersegment (2020, 2021, 2022, 2023, 2024, 2025, 2026 t.o.m. 2026-09-10);
- inget enskilt bolag får stå för mer än 50 % av summerad positiv P/L.

### HOLD
Om PASS missas men samtliga följande uppfylls:
- minst 60 affärer;
- P/L > 0;
- PF ≥ 1,00;
- max drawdown inte sämre än -12 %.

### FAIL
Annars FAIL.

## Resultat som ska rapporteras
Affärer, P/L, PF, WR, DD, snitt/affär, årssegment, symbolfördelning, exitfördelning, vinstkoncentration och jämförelse mot fryst G2-facit. Negativt resultat bevaras.

## Förbud efter öppning
Ingen rescue. Inget byte av symboler. Ingen borttagning av dåliga aktier. Ingen parameterändring. Ingen ny gate. Om G4 blir HOLD/FAIL dokumenteras det och nästa experiment måste förregistreras separat.

## Evidensnivå
G4 kan svara på om G2-reglerna verkar portabla till ett annat fördefinierat universum. G2/G3 Real Forward från 2026-09-11 är fortsatt högre evidens eftersom den datan verkligen ligger efter frysningen.
