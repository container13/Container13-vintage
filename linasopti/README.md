# Linas Opti V0.9

## Fix
- Rättar statuskontrollen mot Cloudflare Workerns `/health`.
- Frontend läser nu Worker-svaret:
  - `ok`
  - `service`
  - `mode`
  - `tradingEnabled`
- Status visas som exempelvis:
  `🟢 Linas Opti API anslutet · Alpaca Paper · Handel avstängd`
- Ingen handelslogik har ändrats.
- Alpaca-nycklar ligger fortsatt endast som Cloudflare Secrets.

Lägg alla filer direkt i `/linasopti/` och ersätt V0.8.
