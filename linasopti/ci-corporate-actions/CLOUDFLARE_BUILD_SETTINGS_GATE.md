# Cloudflare Workers Builds gate – 2026-10-28

Evidence from the previously observed live dashboard: Worker linas-opti-api, production branch ccc-demo-public-test, root directory linasopti/worker, deploy command npx wrangler deploy. The current build command has NOT been confirmed (do not assume blank or populated).

Cloudflare Workers Builds executes dashboard build command before the deploy command. Official documentation (Sep 22 2026): https://developers.cloudflare.com/workers/ci-cd/builds/configuration/ . Workers Builds does not honor Wrangler custom build settings.

For the isolated V4 candidate, the proposed build command relative to the observed root directory is `bash ../ci-corporate-actions/cloudflare-prebuild.sh`. Keep the existing deploy command `npx wrangler deploy`. This is a PROPOSAL, not a dashboard update. The generated Worker target must exist prior to deploy, and its bytes/SHA must match the tested V4 bundle. An isolated GitHub CI PASS does not prove Cloudflare's dashboard build command is configured.

Next human/dashboard check: Worker linas-opti-api -> Settings -> Build: inspect Build command, Root directory, Deploy command, Production branch. Never save a changed build command until explicitly approving a production release, because future pushes could automatically deploy. Confirm rollback and version integrity before release.

NO-GO for deploying. V0.4.45 live; V0.4.46 isolated candidate. Gen17 DRAFT_ONLY, trading and new Forward OFF.
