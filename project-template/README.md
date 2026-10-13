# Project Template v1

Golden template for new Container13 projects.

## Start a new project
1. Copy this folder into the new project root.
2. Replace PROJECT_NAME, PROJECT_ROOT and repository/branch placeholders in PROJECT_CURRENT_STATE.json.
3. Choose the first version in version.js.
4. Add project-specific rules below the shared standard; never weaken the shared safety rules silently.
5. Install/adapt the release-integrity workflow at repository .github/workflows/ when the project is ready for CI.

Before new mechanisms are built, search the repository-level `solutions/` library for already verified solutions.

Shared truth lives in this template. Project-specific manuals may add stricter rules.

Core flow:
CHANGE -> STATIC CHECK -> COMMIT -> READBACK -> DEPLOY -> SMOKE TEST -> REAL DEVICE when required -> PROMOTE CURRENT -> PREVIOUS

## Existing projects and shared rules
The shared standard is `PROJECT_RELEASE_STANDARD.md`; it applies to **CCC, LinaSopti, and all other Container13 projects**. Project-specific manuals remain authoritative for stricter project/domain safeguards. Apply at the next planned change, without bulk redeploys or rewriting locked evidence. Use the shared anti-shortcut checklist; do not create a second project template or parallel rulebook.

## Copy-ready input rule
The shared MASTER RULES require an actual adjacent copy action for every proposed value/text the user needs to enter in another app or site. This applies to every project built from this template.

## Authenticated entry rule (all projects)
When an existing valid session is detected, do not show the login form or password setup screen. Automatically route the user to the authenticated dashboard. Login is shown only when authentication is needed. Keep account/password management inside authenticated settings, not on the default landing page. Never claim authentication is valid from cached UI state alone; verify the session and server-side permissions. Prevent redirect loops and do not reveal protected content before authorization.

## QR-code guest access (all projects)
A valid QR-code guest link must open its intended guest resource directly, without an account, password or webmaster login. The QR URL carries a scoped, unguessable guest access token; validate it server-side on every protected request, honor expiry/revocation and never grant administrator privileges. Invalid or revoked links show a clear guest-access error, not an administrator login prompt. QR access does not bypass the guest token's permissions.
