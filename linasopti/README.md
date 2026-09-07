# Linas Opti V0.24

V0.24 bygger vidare på den verifierade V0.23-baslinjen. Själva Opti Swing-baslinjen är inte ändrad.

## Ändrat i V0.24

- Delningslisten är nu **verkligt fast/flytande längst ned på skärmen** även när sidan scrollas. Tidigare vann en äldre CSS-regel över `position: fixed`.
- Samma befintliga Lina-bild används, men vattenmärket är ett litet steg tydligare. Ingen ny eller AI-genererad bild används.
- Första **omvärldstestet** är tillagt som ett separat experiment bredvid baslinjen.

## Omvärldstestets regel

Baslinjen körs exakt som tidigare. Experimentet använder SPY som en historiskt verifierbar marknadsstress-proxy och pausar **endast nya köp** när SPY:s föregående stängning ligger minst 5 % under högsta stängningen under de senaste 20 handelsdagarna.

- Ingen framtida information används.
- Befintliga positioner, stop -7 %, mål +12 %, 20 handelsdagars exit, max fem positioner och positionsstorlek är oförändrade.
- Experimentet visar slutkapital, avkastning, drawdown, affärer, profit factor, skillnad mot baslinjen, antal stressdagar och blockerade signaler.
- Exporten innehåller även omvärldstestets resultat och, i full export, dess affärer/händelselogg.

Detta är **inte ännu nyhets- eller AI-tolkning av omvärlden**. Det är första objektiva testet av om ett separat marknadsläge kan förbättra den frysta Swing-baslinjen utan parameteroptimering.

## Oförändrat

- Handel är avstängd; endast backtest/paper.
- Cloudflare Worker/API-upplägg och hemligheter är orörda.
- Snabbval: 2024, 2025, 2026, Hela perioden.
- SPY handlas inte i baslinjen.
- Delning via Snabbrapport / Full testdata finns kvar.
