# LINA HANDOFF – CLEAN CORE V0.2.7

Datum: 2026-09-14

## Fryst G2
Kandidat `15efd75a`.
Broker/Cost Gate: PASS.
Ingen parameterändring och ingen rescue.

## Nytt
G2 Real Forward / Paper är aktiv under Forward.
Anchor = 2026-09-11.
Warmup start = 2025-09-01, endast för indikatorhistorik.
Frysta parametrar: breakout 55, SMA200, volym 1.5x, SPY200, stop 7%, target 15%, hold 10.
Kostnad = 0.10% per sida, samma som fryst G2-referens.

## Forward-regler
- Endast entryDate >= 2026-09-11 räknas.
- Nya uppdateringar hämtar marknadsdata via Worker Yahoo → EODHD → Alpaca fallback.
- Öppna paper-positioner sparas som resultatstatus och får fortsätta över uppdateringar.
- Ingen period-end tvångsstängning i forward.
- Ingen historisk parameteroptimering.
- Milstolpar 60 / 120 / 250 stängda affärer.
- Handel AV.

## Lagring
Forward sparar inte hela warmup-datasetet i localStorage. Varje uppdatering bygger om från källdata och sparar kompakt state: stängda affärer, öppna positioner, stats, senaste marknadsdag och begränsad refreshhistorik. Detta följer permanent stora-körningar-regeln.

## Nästa
Låt forward samla verkligt nya marknadsdagar. Broker väljs inte slutligt förrän API/FX/konto/skatt och faktisk paper-orderintegration är verifierad.
