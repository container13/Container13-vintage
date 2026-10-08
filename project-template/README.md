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
