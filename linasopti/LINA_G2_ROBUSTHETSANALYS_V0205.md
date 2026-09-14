# Lina Swing G2 – robusthetsanalys pseudo-forward

Version: Clean Core V0.2.5  
Kandidat: `15efd75a`  
Status: FRYST – inga parameterändringar eller rescue tillåts.

## Sammanfattning

Pseudo-forward 2023-01-01 → 2026-09-10 gav 144 affärer, +13 708,85 kr, PF 1,4673, win rate 50,0 % och max drawdown -2,34 %.

DEV 2020–2022 gav 78 affärer, +13 165,73 kr, PF 2,0123, win rate 60,26 % och max drawdown -2,03 %.

PF sjönk alltså från 2,01 till 1,47 när kandidaten gick från DEV till den låsta historiska pseudo-forward-perioden. Kandidaten är fortsatt positiv och klassas som POSITIV KANDIDAT.

## År för år – pseudo-forward

| År | Affärer | P/L kr | PF | Win rate |
|---|---:|---:|---:|---:|
| 2023 | 8 | +1 459,76 | 3,48 | 62,5 % |
| 2024 | 65 | +1 840,46 | 1,14 | 44,6 % |
| 2025 | 39 | +4 349,10 | 1,52 | 53,8 % |
| 2026 t.o.m. 10 sep | 32 | +6 059,53 | 1,79 | 53,1 % |

Alla kalenderår i pseudo-forward är positiva. 2024 är klart svagast men fortfarande positivt.

## Symboler – pseudo-forward

| Symbol | Affärer | P/L kr | PF | Win rate |
|---|---:|---:|---:|---:|
| MU | 19 | +7 632,16 | 3,38 | 63,2 % |
| AMD | 13 | +3 185,04 | 1,98 | 53,8 % |
| NVDA | 6 | +2 465,90 | 3,77 | 66,7 % |
| C | 8 | +1 645,49 | 2,42 | 62,5 % |
| LUV | 8 | +1 644,36 | 3,41 | 62,5 % |
| DDOG | 11 | +997,65 | 1,38 | 36,4 % |
| TSLA | 7 | +580,00 | 1,30 | 42,9 % |
| FDX | 9 | +552,82 | 1,36 | 55,6 % |
| NFLX | 6 | +251,00 | 1,51 | 66,7 % |
| SHOP | 10 | -129,99 | 0,94 | 50,0 % |
| ADBE | 1 | -246,88 | 0,00 | 0,0 % |
| BAC | 7 | -270,44 | 0,68 | 57,1 % |
| NOW | 9 | -819,96 | 0,55 | 44,4 % |
| QCOM | 11 | -870,03 | 0,76 | 27,3 % |
| PYPL | 9 | -963,35 | 0,57 | 33,3 % |
| GM | 10 | -1 944,91 | 0,24 | 40,0 % |

Viktig observation: MU står för cirka 55,7 % av nettovinsten. AMD och NVDA bidrar också mycket. Det är därför G2 ska betraktas som en lovande men fortfarande ofärdig kandidat tills riktig forward/paper trading har samlat ny data.

## Exittyp

| Exit | Affärer | P/L kr | PF |
|---|---:|---:|---:|
| Target | 24 | +26 817,81 | ∞ |
| Max hold | 76 | +10 665,77 | 2,92 |
| Stop | 42 | -22 987,32 | 0 |
| Periodslut | 2 | -787,41 | 0 |

Det är normalt att rena target- och stop-grupper får extrem PF eftersom targetaffärer bara är vinnare och stopaffärer bara förlorare. Det viktiga är totalsystemets PF 1,47.

## Koncentration och affärsfördelning

- Gross profit: +43 046,51 kr
- Gross loss: -29 337,66 kr
- Största enskilda vinst: +1 198,40 kr
- Största enskilda förlust: -595,28 kr
- Längsta vinstsvit: 10 affärer
- Längsta förlustsvit: 5 affärer
- De 10 största vinnarna står för cirka 27,1 % av gross profit, inte hela resultatet.

## Beslut

G2 förblir FRYST med kandidat-hash `15efd75a`.

Parametrar:
- breakout 55
- trend SMA200
- volym 1,5×
- SPY-regim SMA200
- stop 7 %
- target 15 %
- max hold 10 handelsdagar

Ingen parameter ändras efter pseudo-forward.

Nästa Gate:
1. Broker/Cost Gate – verkliga courtage-, spread-, slippage- och valutaväxlingskostnader.
2. Om kandidaten fortfarande håller: riktig forward/paper trading med samma hash.
3. Milstolpar för ny data: 60 / 120 / 250 affärer.
