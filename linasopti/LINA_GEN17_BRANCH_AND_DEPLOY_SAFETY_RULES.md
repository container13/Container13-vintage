# Linas Opti Gen17 – OBLIGATORISKA branch- och deployregler (2026-11-02)

LÄS DENNA FIL FÖRST vid varje ny chatt som arbetar med Gen17, tillsammans med LINA_MASTER_RULES.md och LINA_CLOUDFLARE_GITHUB_DEPLOY_HANDOFF.md.

## Användarens uttryckliga säkerhetskrav
- Arbeta ENDAST på GitHub-grenen **ccc-demo-public-test** för denna Gen17-insats.
- **main får INTE användas, ändras, mergas till eller deployas från.** Föreslå inte att lägga workflow-filer på main som lösning på GitHub Actions UI-begränsningar.
- Produktions-Worker **linas-opti-api** får inte ändras, deployas eller påverkas.
- Enda tillåtna deploymål för denna insats är **linas-opti-gen17-sse-staging**, med exakt staging-config `linasopti/worker/wrangler.gen17-sse-staging.jsonc`.
- Kontrollera branch, konfigurationsfil, Worker-namn och trigger före varje skrivning eller deploy. Ingen automatisk deploy av Gen17. Be om klartecken före första verkliga staging-deploy.
- Om GitHub Actions workflow_dispatch inte visas eftersom workflow-filen inte finns på default branch: ANVÄND INTE main som genväg. Utred i stället säker branch-isolerad lösning; inga produktionsändringar.
- Bevara tidigare framsteg; undvik att be användaren göra om redan avklarade Cloudflare-steg.
- Uppdatera och verifiera GitHub-överlämningen efter väsentliga fynd.

## Senast verifierat
- Separat staging-Worker skapad i Cloudflare, med Hello World; Gen17-kod ännu ej deployad.
- GitHub preflight https://github.com/container13/Container13-vintage/actions/runs/41370551566 PASS: staging-guards, båda befintliga CCC Cloudflare-secrets finns, Wrangler dry-run PASS. Behörighet att deploya staging är inte bevisad.
- Workflow `.github/workflows/lina-gen17-sse-staging-deploy.yml` finns på ccc-demo-public-test och är manual-only; det syntes inte i GitHub Actions-listan i användarens skärmbild. Ingen deploy genomförd.
- Användaren påpekade uttryckligen att upprepade main-förslag är oacceptabla. Återupprepa inte.
