# Lina Clean Core V0.2.24 – Handoff

## Ändring
G6 Execution Cost Boundary runner byggd mot exakt fryst plan `1567bbbe` från V0.2.23.

## G6
- Kandidat: `15efd75a` (oförändrad)
- Period: 2020-01-01 → 2026-09-10
- Universum: samma 16 symboler som G4/G5
- Bas: 0,10 % kostnad per sida
- Extra grid: 0,00 / 0,05 / 0,10 / 0,15 / 0,20 / 0,25 / 0,30 / 0,40 / 0,50 % per sida
- Boundary: högsta testade extra kostnad med P/L > 0 och PF >= 1,00; ingen interpolation
- Gate: exakt enligt V0.2.23
- Storage: rå/checkpoint i IndexedDB; kompakt state/resultat i localStorage
- Resultat öppnas först när användaren trycker Kör G6.

## Forskningsdisciplin
G5 är fortsatt FAIL/FROZEN. Ingen rescue, parameterändring eller symbolrensning. G6 är diagnostisk robusthetsforskning, inte oberoende OOS. G2/G3 Real Forward har högre evidens.

## Drift
Handel AV. Robotmognad 48/100. Lina-watermark V0.2.21 lämnas orörd.
Cloudflare Worker: INGEN ÄNDRING.
