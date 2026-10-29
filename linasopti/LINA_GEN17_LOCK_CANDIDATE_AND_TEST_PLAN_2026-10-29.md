# Gen17 – låsbar kandidatspecifikation och testplan
Datum 2026-10-29. Status: PROPOSED / NOT_LOCKED / NO_BACKTEST.

## Hypotes och enda ändring
Gen16 PRICE_CHANNEL_BREAKOUT behålls exakt som baslinje. Gen17 filtrerar varje annars godkänd aktiesignal före rangordning och positionskapacitet: för signalindex s beräknas R[k]=(high[k]-low[k])/close[k] på färdigställda OHLC-barer; recent=mean(R[s-20..s-1]); previous=mean(R[s-40..s-21]); tillåt bara recent<previous. Likhet, otillräcklig historik eller ogiltig bar: avstå inträde. Utbrottsdagen s ingår inte. Exekvering fortsatt öppning s+1. Ingen parameteroptimering.

## Bevarad Gen16-baslinje
Låst Gen16 runnerspec SHA256 a065ce8ad2285010493f8491c86116f01025ed3554be18744471de394dbdeafa. 16 symboler; 50-dagars tidigare high, SMA180, 20-dagars volatilitet för storlek, 12-sessioners exit, kostnad 0,1 procent per sida, kapital 100000, max 8 positioner, max 12,5 procent per position, risk 0,5 procent, sizing distance 5 procent; årsfolds 2021,2022,2023,2024. Gen16 original och dess frysta resultat får inte ändras.

## Data och tolkningsgrind
Tidigare SHA256- och kalenderbevis återanvänds; råfilens SHA256 cb84e436a0527b44262949994306dcb85eaf5f10ad88fc7906d443833cc6589c. Gen17 range-kvot är invariant mot gemensam positiv OHLC-faktor per bar, men baslinjens breakout och P/L är inte nödvändigtvis det. Tidskorrekt corporate-action-proveniens för hela jämförelsen kvarstår BLOCKED_DATA. Tidigare Gen7/8-overlap är PRIOR_ART_UNVERIFIED men användaren har accepterat att fortsätta.

## Automatiska tester FÖRE planlås
1. Syntetiska 40+ barer: minskande range ger allow; ökande eller lika ger deny; kontrollera exakt 20+20 index och utesluten signalbar.
2. NaN, noll, negativ, inkonsistent H/L/C och för få historiska barer ger deny; inga undantag.
3. Multiplicera H/L/C med samma positiva faktor per bar och kontrollera identiskt gate-resultat.
4. Testa att Gen16-kandidater filtreras före ranking, och att next-open, exits, storlek och kostnader är identiska vid identiska signaler.
5. Källkodsdiff mot Gen16: endast gate och separata identifierare/spec tillåtna. Hasha kod, data och spec. Ingen simulering av verkliga affärer i detta steg.

## Förregistrerad forskningsplan EFTER datagrind och explicit godkännande
Fryst baseline parity och separata kandidatfolds 2021–24. Samma mått som Gen16: minst 100 OOS-affärer, PF>=1,2, positiv aggregerad P/L, max drawdown <=12 procent, max symbolkoncentration <=40 procent, minst 3 positiva folds, lägsta fold-PF >=0,8, högsta folds andel av gross profit <=55 procent. Inga parametergrid, omtag eller räddningsoptimeringar. Åren 2021–24 är redan observerade, alltså inte osedd holdout; dokumentera multipla tester och kräv separat framtida validering.

## Kontrollpunkt
Nuvarande gen17-generation-engine.DRAFT.js är en kopia med Gen16-SPEC och avsiktligt ogiltig draft-hash; den är INTE en låst eller godkänd forskningsmotor. Skapa egen Gen17 SPEC och giltig SHA256 och kontrollera att referens till gate-modul inte divergerar från integrerad logik. Separat användargodkännande krävs innan PLAN_LOCKED och backtest. Trade OFF, Forward OFF, ingen deploy.
