# Linas Opti V0.8

Publik frontend för:
`https://container13.se/linasopti/`

## Nytt i V0.8
- Frontend är nu kopplad till den fungerande Cloudflare Workern:
  `https://linas-opti-api.mangaj73.workers.dev`
- Alpaca API Key ID och Secret Key ligger fortsatt endast som Cloudflare Secrets.
- Inga hemligheter finns i GitHub-filerna.
- Knappen för anslutningskontroll använder nu den riktiga Workern.
- Hämtning av `1Day` och `5Min` går via Workerns `/bars`-endpoint.
- Ingen orderläggning är aktiverad. Workerns health-svar rapporterar `tradingEnabled: false`.

## Filer
Alla filer ligger i samma `/linasopti/`-mapp:
- `index.html`
- `linasopti.css`
- `linasopti.js`
- `manifest.webmanifest`
- `README.md`

## Säkerhetsmodell
iPhone / webbläsare → container13.se/linasopti/ → Cloudflare Worker → Alpaca

Alpaca-hemligheterna får aldrig läggas i GitHub, HTML eller JavaScript.
