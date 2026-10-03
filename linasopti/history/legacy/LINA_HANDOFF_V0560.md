# LINA HANDOFF – V0.56.0

## Forward – lämnas orört
- Jägaren: riktig forward från 2026-09-11, fryst 83%-kandidat.
- Swing G1: riktig forward från 2026-09-14, hash 8f09f32a.
- V0.56.0 ändrar ingen forwardlogik.

## Ny forskning: Swing G2
Strategifamilj: breakout/momentum, separat från G1 trend–rekyl–återhämtning.

Förregistrering:
- DEV 2020-01-01 → 2022-12-31
- låst historisk pseudo-forward 2023-01-01 → 2026-09-10
- breakout 20/55/100
- trend off/SMA100/SMA200
- volym off/1.2x/1.5x 20d
- SPY off/SMA100/SMA200
- stop 5/7%
- target 10/15%
- hold 10/20d
- 648 varianter
- 0.10% kostnad/sida
- 0.5% equity-risk, max 5 positioner, max 20%/position

A–M får endast se DEV. M fryser kandidat + hash. N öppnar historisk pseudo-forward en gång. Ingen rescue efter N.
Paketet har robust symbol×månad-hämtning med resume/checkpoint, TXT, RAW JSON och backup.

## Nästa beslut
Efter A–O-resultatet:
- överlever G2 tydligt → frys och förbered riktig G2-forward som robot nr 3;
- tunn/negativ → behåll resultatet, ingen räddningsoptimering inom SWING-G2.

Handel AV. Robotmognad fortsatt 48/100.


## UI patch före publicering
- LABB-starten är nu kompakt.
- Forward och forskning ligger som två små valområden.
- Val av modul öppnar separat arbetsvy och döljer menyerna.
- `← LABB` återgår till valvyn.
- Ingen motor-/regeländring.
