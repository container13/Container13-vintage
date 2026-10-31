# Gen17 – Cloudflare test access decision (2026-10-31)

Status: PREPARED / ACCESS BLOCKED. No deployment or provider request performed.

## Verified
- Production Worker `linas-opti-api` already reads `APCA_API_KEY_ID` and `APCA_API_SECRET_KEY` from its Cloudflare environment for `/bars`.
- Existing isolated V4 candidate and Miniflare/CI packaging are present; they have only been validated with offline fixtures.
- GitHub Actions access probe run 41153966190 failed `BLOCKED_CREDENTIALS`: GitHub Actions has neither key, and made no Alpaca request.
- No Cloudflare management connector is available in this chat. Existing production secrets cannot be read or automatically inherited by a new Cloudflare Worker. `keep_vars: true` applies to the existing Worker deployment and is not a secret-sharing mechanism.
- Existing scoped release plan `V046_SCOPED_CUTOVER_PREFLIGHT.md` remains PRODUCTION NO-GO.

## Safe execution choices
1. Preferred for a one-off test: a separate Cloudflare Worker (unique name and route) using the existing isolated V4 bundle; configure the two Alpaca credentials as Cloudflare secrets for that test Worker **through the Cloudflare dashboard**, not GitHub. Use narrowly authenticated route, strict date/symbol bounds, output only status, counts, normalized schema and non-sensitive hashes. No trading endpoints, no production routes, no automatic deployment.
2. Alternative: integrate a narrowly authenticated read-only route into the existing production Worker only after explicit release approval and all V0.4.46 release gates. Do not deploy merely to access secrets.

## Next action / blocker
Human Cloudflare access is required to create/configure an isolated Worker and secrets; neither existing production secrets nor Cloudflare account controls are available through connected tools. Do not request credentials in chat, commit them, print them in logs or copy production secrets into GitHub Actions. Obtain explicit go-ahead before changing Cloudflare. Once isolated access exists, request one bounded SPY 2024 cash-dividend sample and compare against issuer records; separately keep PIT/as-of, data usage rights, and reproducibility blocked until evidenced.

Gen17 DRAFT_ONLY/BLOCKED_DATA. Trading and Forward OFF. Main/production unchanged.
