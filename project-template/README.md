# Project Template v1

Golden template for new Container13 projects.

## Start a new project
1. Copy this folder into the new project root.
2. Replace PROJECT_NAME, PROJECT_ROOT and repository/branch placeholders in PROJECT_CURRENT_STATE.json.
3. Choose the first version in version.js.
4. Add project-specific rules below the shared standard; never weaken the shared safety rules silently.
5. Install/adapt the release-integrity workflow at repository .github/workflows/ when the project is ready for CI.

Before new mechanisms are built, search the repository-level `solutions/` library for already verified solutions.
Also consult [`CONTAINER13_SYSTEM_LIBRARY.md`](CONTAINER13_SYSTEM_LIBRARY.md) for cross-project components **and integrations**. Required decision sequence: search existing code and catalog → verify implementation/test status → reuse or adapt safely → build new only if needed. Register reusable work with source path, dependencies, access model and verification status; never record credentials. Do not assume catalog entries are already production-ready.

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

## Album ordering identity and guest access
For projects offering shared albums, the album purchaser enters an email address during album creation for confirmation and album-related communication. Collecting an email does not itself verify ownership or grant administrator access. Album owner management must require a separately verified, scoped mechanism (for example, a single-use email link). QR-code guests must not be asked to enter email, create an account, or log in to view an album permitted by their valid guest token. Webmaster authentication is separate from both roles.

## Startup update check (all installed web apps / PWAs)
Check the deployed version from the network on every page startup and every return to foreground, not only on a periodic timer. A new release must be fetched without requiring the user to remove/reinstall the PWA. Avoid stale navigation cache using a fresh request URL and verify the deployed bytes; don't treat a GitHub commit as proof of deployment. Do not block updates just because ordinary buttons are disabled. Defer reload while users are typing, uploading, or performing an in-flight operation; retry on the next safe activation. Continue offline with the existing version and retry once connected. Test actual installed iPhone PWA startup/resume behavior before declaring PASS.


## Mandatory shared-foundation gate (all projects, 2026-10-16)
Before implementing a fix, use the **Shared foundation first** gate in [PROJECT_MASTER_RULES.md](./PROJECT_MASTER_RULES.md), check the [PROJECT_RELEASE_CHECKLIST.md](./PROJECT_RELEASE_CHECKLIST.md) and consult the [shared component register](./SHARED_COMPONENT_REGISTER.md). Changes to a shared concern must originate in its canonical owner and be verified across affected views. After two unsuccessful attempts at the same defect, stop patching and diagnose the root cause. Track coded, committed, deployed and device-tested status independently.


## Build update handling centrally from the beginning
For every new web app/PWA, the first working version must include a shared updater, canonical release manifest/ID, asset/cache policy and explicit entry-route inventory. Apply the mandatory rules in [PROJECT_MASTER_RULES.md](./PROJECT_MASTER_RULES.md) and the release checks in [PROJECT_RELEASE_CHECKLIST.md](./PROJECT_RELEASE_CHECKLIST.md). Do not defer auto-update architecture until the app has many pages.
