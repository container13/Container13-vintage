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
