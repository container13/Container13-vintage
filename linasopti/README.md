# Linas Opti V0.23

Städad baslinje efter verifiering av V0.22.

## Ändrat
- 5-dagarskarantän och hela A/B-spåret är borttaget.
- Opti Swing är exakt den kronologiskt korrigerade A-baslinjen från V0.22.
- Huvudknappen heter **Kör Linas Opti**.
- Snabbvalet **2024–nu** heter nu **Hela perioden**.
- **Dela testdata** ligger fast i nederkant; tryck öppnar Snabbrapport / Full testdata.
- Lina-watermarken använder samma befintliga bild och har gjorts ett litet steg tydligare. Ingen ny/genererad bild används.
- Exporten innehåller inte längre karantän/A-B-resultat.

## Inte ändrat
- Swing-score/signallogik.
- Stop −7 %, mål +12 %, 20 handelsdagars exit.
- Max fem samtidiga Swing-positioner och vald maxposition.
- Signal på föregående stängning → köp nästa öppning.
- Dagens köp sker före dagens stop/target/time-exit; kapital från senare exit kan inte användas retroaktivt vid öppningen.
- SPY är endast benchmark och handlas inte.
- Opti Day finns kvar oförändrad.
- Handel är avstängd; detta är backtest/paper.

Föregående version: V0.22 chronology.
