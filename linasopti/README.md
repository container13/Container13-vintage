# Linas Opti V0.22
## Viktig verifieringsfix: korrekt handelsordning
Tidigare kunde dagens intraday-exit behandlas före ett köp på samma dags öppning. Det kunde skapa tidsmässigt omöjliga affärer och låta kapital från en senare försäljning finansiera ett tidigare öppningsköp.

V0.22 kör varje dags Swing-händelser i kronologisk ordning:
1. Signal från föregående stängning.
2. Köp på dagens öppning med kapital och positionsplatser som faktiskt finns vid öppningen.
3. Därefter dagens stop/target.
4. Tidsutgång vid dagens stängning.

A/B-testet finns kvar: A utan karantän, B med 5 handelsdagars karantän efter stop-loss.
Snabbvalen 2024, 2025, 2026 och 2024–nu finns kvar.

## Lina
Samma befintliga originalbild används. Ingen genererad bild används.
Watermarken ligger nu som en mycket svag overlay ovanpå kortytorna, så Lina ska synas genom hela gränssnittet och inte bara i gliporna.
