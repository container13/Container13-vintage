# Linas Opti V0.28

V0.28 bygger vidare på V0.27 utan att ändra den verifierade Opti Swing-baslinjen.

## Nytt
- Renare sticky topp: titel + underrubrik, därefter en kompakt rad med datastatus och version, sedan flikarna.
- Opti Day A/B-test.
  - A = exakt V0.27-signalen.
  - B = experimentell bekräftad momentum-signal. Samma risk, stop, mål, kostnader, max hålltid och exekveringsordning som A.
  - B kräver 15-min momentum > 0,6 %, pris över SMA12, positiv senaste bar, stängning i övre 35 % av signalbaren och volym minst 12-bars-snitt.
- Resultatpanelen visar A och B sida vid sida.
- Full testdata exporterar båda Opti Day-varianternas affärer och händelseloggar.

## Oförändrat
- Paper/backtest only; inga liveordrar.
- Swing-logik och kronologi.
- SPY benchmark/omvärldsexperiment.
- Opti Day A:s V0.27-regler och kostnadsmodell.


## V0.29 – marknadsgrupper
- Opti Day/Swing-logiken är oförändrad från V0.28.
- Nya symbolpreset: USA Core (10), USA 20 och USA 30. SPY följer med som benchmark men handlas inte.
- Byte av grupp tömmer tidigare inläst data så grupper inte blandas av misstag.
- Europa och Asien visas som kommande grupper men är inte aktiverade i denna version.
- Full testdata exporterar vald marknadsgrupp.
- Syftet är att testa om samma strategi beter sig annorlunda i ett bredare aktieuniversum innan signalparametrar ändras.

V0.29.1: Fixad cache-busting för JavaScript/CSS. V0.29 HTML hade script-taggen kvar på ?v=0.28, vilket kunde ladda cachad V0.28-JS och göra USA 20/30 oklickbara. Ingen strategilogik ändrad.
