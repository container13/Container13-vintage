# ÖVERLÄMNING – LINAS OPTI GEN17 – 2026-11-02

## STARTA HÄR I NÄSTA CHATT
Fortsätt Linas Opti från denna verifierade överlämning i GitHub. Läs först:
1. linasopti/LINA_GEN17_BRANCH_AND_DEPLOY_SAFETY_RULES.md
2. linasopti/LINA_CLOUDFLARE_GITHUB_DEPLOY_HANDOFF.md
3. linasopti/LINA_MASTER_RULES.md
4. linasopti/LINA_SYSTEM_MANUAL.md
5. linasopti/LINA_CURRENT_STATE.json
6. senaste avsnitten i linasopti/LINA_HANDOFF_CURRENT.md
7. denna fil.

## ABSOLUTA REGLER
- Repo container13/Container13-vintage; arbeta endast på ccc-demo-public-test.
- main får INTE ändras, användas, mergas eller deployas. Inga genvägar via main för GitHub Actions.
- Produktions-Worker linas-opti-api får INTE ändras/deployas; produktionens wrangler.jsonc och secrets ska förbli orörda.
- Enda möjliga staging-mål: linas-opti-gen17-sse-staging via linasopti/worker/wrangler.gen17-sse-staging.jsonc.
- Ingen automatisk deploy; kontrollera mål och be om uttryckligt godkännande före första verkliga staging-deploy.
- Gen17 DRAFT_ONLY / PIT_UNVERIFIED, handel och Forward OFF; Gen8–16 frysta.
- Dokumentera viktiga fynd direkt och verifiera GitHub-readback. Gör inte om redan avslutat arbete.

## VERIFIERAT NULÄGE
- Cloudflare Worker linas-opti-gen17-sse-staging skapad manuellt 2026-11-02 i Cloudflare dashboard med Hello World. Dashboard visade Ready och URL linas-opti-gen17-sse-staging.mangaj73.workers.dev. Gen17-kod är INTE ännu publicerad dit.
- Gen17 staging config finns: linasopti/worker/wrangler.gen17-sse-staging.jsonc, name linas-opti-gen17-sse-staging, main ./WORKER_GEN17_SSE_CANDIDATE.mjs, workers_dev true.
- Gen17 kandidat: linasopti/worker/WORKER_GEN17_SSE_CANDIDATE.mjs och linasopti/ci-corporate-actions/sse_diagnostic_candidate.mjs. Endpoint /corporate-actions-sse-diagnostic, SSE diagnostik, inte PIT-bevis.
- GitHub Actions SSE tests och Wrangler dry-run PASS: https://github.com/container13/Container13-vintage/actions/runs/41368786330.
- Existerande GitHub Actions workflow .github/workflows/ccc-vision-worker-deploy.yml använder cloudflare/wrangler-action@v3, secrets CCC_CLOUDFLARE_API_TOKEN och CCC_CLOUDFLARE_ACCOUNT_ID.
- Nytt isolerat preflight-workflow .github/workflows/lina-gen17-cloudflare-credentials-preflight.yml på ccc-demo-public-test. PASS https://github.com/container13/Container13-vintage/actions/runs/41370551566 : båda Cloudflare secrets PRESENT, staging target guards PASS, Wrangler dry-run PASS. Detta bevisar INTE att token har tillräckliga rättigheter för staging deploy.
- Manuellt staging-only workflow .github/workflows/lina-gen17-sse-staging-deploy.yml finns på ccc-demo-public-test, commit d9fb88b2. Det visas INTE i GitHub Actions sidopanel enligt användarens screenshot; troligen pga workflow_dispatch på icke-defaultgren. DETTA ÄR INTE SKÄL ATT ÄNDRA MAIN.
- Säkerhetsregler separat sparade i linasopti/LINA_GEN17_BRANCH_AND_DEPLOY_SAFETY_RULES.md commit 186b605b.
- Cloudflare GitHub handoff separat sparad i linasopti/LINA_CLOUDFLARE_GITHUB_DEPLOY_HANDOFF.md commit 80266e1a.

## NÄSTA KONKRETA STEG
Undersök hur en säker, branch-isolerad, manuellt godkänd staging deploy kan startas via befintlig GitHub Actions-kapacitet UTAN att använda main. En möjlig väg är ett strikt avgränsat push-triggat workflow på ccc-demo-public-test med hårdkodad staging-config och kontroller, men det kräver separat godkännande före någon live deploy. Alternativt verifiera om ett existerande workflow kan användas säkert utan att röra produktionsmål. Använd aldrig standard wrangler.jsonc eller npx wrangler deploy utan explicit --config wrangler.gen17-sse-staging.jsonc. Bekräfta att staging-Worker har nödvändiga separata secrets före att köra SSE endpoint; be aldrig om hemliga värden i chatten.

## ANVÄNDARENS ÖNSKEMÅL
- Var konkret, utför GitHub-arbete själv där det går, minimera klick och onödiga frågor.
- Ett steg i taget vid Cloudflare UI; undvik upprepningar och main-diskussioner.
- Överlämningar ska vara helt kopieringsbara med ett klick.
