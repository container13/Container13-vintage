# Linas Opti V0.15 — verifiering
- SPY är benchmark och exkluderas från robotens köp-kandidater.
- Uppvärmningsdata före vald teststart används bara till indikatorer.
- Signal beräknas på föregående dags stängning; köp sker nästa dags öppning för att undvika look-ahead.
- Stop/target testas mot dagens OHLC; vid samtidig träff antas stop först (konservativt).
- Profit factor, snittvinst/förlust, bästa/sämsta affär och full lista över avslutade Swing-affärer.
- Kärnresultatet kan därför skilja sig tydligt från V0.14; V0.15 är avsiktligt striktare.
