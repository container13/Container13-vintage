# LINA G5 STRESS TEST – EVIDENCE FREEZE
Datum: 2026-09-15
Release: Clean Core V0.2.22

## Fryst identitet
- Plan: `6ec36eb2`
- Kandidat: `15efd75a`
- Period: 2020-01-01 → 2026-09-10
- Universum: AAPL, MSFT, AMZN, GOOGL, META, JPM, XOM, UNH, JNJ, PG, KO, CAT, HD, DIS, NKE, WMT
- Handel: AVSTÄNGD
- Ingen rescue, parameterändring eller symbolrensning efter resultat.

## Fryst utfall
- Gate: **FAIL · FROZEN**
- PASS-kvalificerade scenarier: **2/5**
- COMBINED-villkor: **NEJ**
- COST_10: 185 affärer · P/L +3 737,78 · PF 1,16 · WR 49,73 % · DD −4,62 %
- COST_25: 185 affärer · P/L −305,70 · PF 0,99 · WR 48,11 % · DD −6,10 %
- COST_50: 185 affärer · P/L −6 704,64 · PF 0,76 · WR 44,86 % · DD −8,75 %
- DELAY_1: 182 affärer · P/L +4 205,97 · PF 1,18 · WR 50,55 % · DD −4,26 %
- COMBINED: 182 affärer · P/L −2 367,93 · PF 0,91 · WR 47,25 % · DD −6,93 %

## Beslut
G5 accepteras som FAIL och fryses permanent. Ingen efterhands-rescue görs. Resultatet visar att kandidaten tålde +0,10 % extra kostnad per sida och 1 handelsdags entryfördröjning var för sig, men inte den förregistrerade kostnadsstressen 0,25/0,50 % eller COMBINED enligt gaten.

## Evidensbegränsning
G5 är stress-/robusthetstest, inte ny oberoende OOS. G2/G3 Real Forward har högre evidens.

## Bevisfiler
- `LINA_G5_STRESS_EVIDENCE_REPORT_V0217_2026-09-15.txt` – användarens exporterade rapport, oförändrad.
- `LINA_G5_STRESS_EVIDENCE_RAW_V0217_2026-09-15.json` – användarens exporterade RAW-resultat, oförändrat.
