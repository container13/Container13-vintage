# Gen9 – oberoende datalinje: källval och exekveringsgate

Datum: 2026-10-03. Status: SOURCE_QUALIFIED_EXECUTION_BLOCKED.
Ingen kandidatdata, kod, Worker eller verifieringsflagga ändrad.

## Beslut

Den oberoende jämförelselinjen ska byggas från Alpaca Historical Stock Bars med:
- feed: SIP
- timeframe: 1Day
- adjustment: all
- period: 2020-01-01 till 2024-12-31
- universum: AMD, SHOP, ADBE, MU, FDX, TSLA, LUV, NFLX, C, NOW, QCOM, BAC, GM, DDOG, PYPL, NVDA

Kandidatdata är Yahoo-baserad. Alpaca används endast som separat kontrollinje; inga Alpaca-fält får patchas in i kandidaten och leverantörsöverensstämmelse får inte ensam sätta någon verifieringsflagga.

## Varför SIP + adjustment=all

Alpacas aktuella dokumentation anger att historiska stock bars stöder feed=sip och att SIP omfattar alla amerikanska börser via de konsoliderade tapes. IEX är en enskild börs och är därför inte vald som fullmarknadsreferens.

Samma endpoint dokumenterar adjustment=all som kombinationen av split-, cash-dividend- och spin-off-justeringar. Detta gör linjen metodmässigt lämpad för jämförelse med den bakåtjusterade Gen9-kandidaten, men bevisar inte på förhand att leverantörernas exakta justeringsmetoder eller dagsbarsdefinitioner är identiska.

Primärkällor:
- https://docs.alpaca.markets/us/reference/stockbars
- https://docs.alpaca.markets/us/docs/market-data-faq
- https://docs.alpaca.markets/us/changelog/optionally-adjust-bars-after-spin-offs

## Repo/live-avvikelse

Den sparade repo-filen linasopti/worker.js använder feed=iex och adjustment=raw för /bars. Aktuell handoff dokumenterar däremot senare SIP-kontroller i den driftsatta Worker-miljön. Repo-kopian får därför inte antas representera den aktiva endpointens exakta beteende.

Ingen Worker ändras på gissning. Health och faktisk live-route måste verifieras innan full hämtning.

## Exekveringsblocker

Den nuvarande webbkörningsmiljön kunde inte öppna https://linas-opti-api.mangaj73.workers.dev/health eller /bars. Därför har ingen full 16-symbolers Alpaca-hämtning påståtts vara genomförd i detta steg.

Nästa säkra steg är att få verifierad åtkomst till den driftsatta Worker-routen och därefter hämta hela SIP/adjustment=all-linjen, hash:a rå/normaliserad data och jämföra datumvis OHLC mot kandidaten. Avvikelser ska rapporteras, inte patchas.

## Gates

- independentSourceQualified: true
- independentDatasetFetched: false
- independentDataLineVerified: false
- candidateDataChanged: false
- workerChanged: false
- gen9Approved: false
- researchStarted: false
- gen8Rerun: false
- trading: false
- forward: false
