# Linas Opti V0.41.1 – Exit Lab

Byggd från verifierade V0.41.0. PRO2 och baseline är orörda.

Nytt: Exit Lab återspelar exakt samma PRO2-entries över de 10 kontrollperioderna med tre förregistrerade exitregler: original, stop först efter 15 minuter, och ingen stop. Entrypris, shares och kostnadsmodell låses till PRO2. Detta är shadow-research och inte oberoende validering.

Linas Opti V0.41.0 – Lina Testlab

Byggd från verifierade V0.40.6.

NYTT
- Ny flik: 🧪 Testlab.
- Ett tryck kör de 10 historiska 20-handelsdagarsfönster som tidigare testades manuellt.
- Hämtar varje fönster automatiskt via befintlig Cloudflare/Alpaca-route.
- Kör fryst baseline och fryst PRO2 utan parameterändringar.
- Kör mekanikrevision på båda motorerna.
- Jämför mot manuellt facit med tolerans 0,02 procentenheter.
- Visar löpande tabell, kontroll, snitt och PRO2-vs-baseline.
- Labbrapport kan delas som TXT.
- Stoppa-knapp stoppar efter pågående fönster.

INTE ÄNDRAT
- daytrade() baseline.
- daytradePro() PRO2 V0.40.2.
- Risk, friktion, stop, mål, max hålltider eller signalregler.
- Worker/API.

NÄSTA STEG EFTER 10/10 REPRODUKTION
Exit Lab / massprovning med separata utvecklings- och valideringsperioder.
