# Shared component register — Container13 projects

Purpose: canonical ownership, consumers, version policy, exceptions and verification. Update before/with any change to a shared concern. Do not infer a PASS from a code commit.

| Concern | Canonical source | Known consumers | Version/rollout rule | Exceptions and verification |
| --- | --- | --- | --- | --- |
| All-project change process | project-template/PROJECT_MASTER_RULES.md; PROJECT_RELEASE_CHECKLIST.md | CCC, Remember, LinaSopti, new projects | Consult before change; document impacted consumers | Two failed fixes => root-cause stop; review before release |
| Mobile page zoom policy | project-template/mobile-view-policy.js | Mobile views that explicitly import it | Confirm every relevant view imports the policy | Image-only viewer opt-in; test actual iPhone |
| Reusable photo session | project-template/container13-camera-session.js | Consumers to be inventoried per project | No assumptions about integration based on existence of file | Guest and owner camera behavior must be tested separately |
| Remember design foundation | remember/remember-design.css | remember/login.html, register.html, dashboard.html, owner.html, album.html, album-admin.html | Same cache-busting version for all affected consumer views; audit on each design change | index.html, activate.html, webmaster.html and test pages are not currently shell consumers; review separately before adding |
| Remember startup/resume updater | remember/auto-update.js | Confirm imports across Remember pages before change | Network-first and safe reload; test installed PWA | Do not interrupt edits/uploads; record device test |
| CCC design system | CCC shared shell and canonical Dashboard (locate exact source before editing) | All CCC views | Match Dashboard tokens and interaction patterns | Any deliberate exception must be documented |

## Required change record
- Issue and reproduction:
- Scope: affected pages/components/devices:
- Canonical owner and actual imports:
- Existing conflicts/overrides removed:
- Change and documented exceptions:
- Versions aligned and deployed bytes checked:
- Regression checks and evidence:
- Status: CODED / COMMITTED / DEPLOYED / DEVICE TESTED / USER APPROVED:
- Repeated failure count; if >=2, root-cause report before another fix:

## Current open issue
Remember installed iPhone PWA consistently reproduces a dark bottom strip, including in an independent installed test PWA (2026-10-16: screen.height 874, innerHeight 812; separate safe-area bottom 54 CSS px). Mina album visibly repaints/repositions its background automatically; owner album requires a swipe. **Neither behavior is acceptable**: the desired shared behavior is a stationary correct background from first paint, without strip or jump. iOS 27/WebKit is a hypothesis, not a proven root cause. Two-plus speculative CSS attempts failed: **STOP further CSS-height patches**, preserve diagnostic test, investigate WebKit/viewport behavior and only propose a targeted fix with real-device evidence. See remember/DECISIONS.md and remember/PROJECT_HANDOFF_CURRENT.md latest sections. OPEN / NOT DEVICE PASS.


## Centralized update system — implementation contract
- **Template requirement:** project-template/PROJECT_MASTER_RULES.md (centralized update architecture gate).
- **Remember current controller:** remember/auto-update.js; consumer pages: index, login, register, activate, dashboard, owner, album, album-admin. remember/release.json and embedded running release IDs exist (repository candidate 0.1.60 as of 2026-10-16), but actual deployed asset-byte integrity and verified installed-PWA upgrade path remain **OPEN / NOT DEVICE VERIFIED**.
- **New-project requirement:** one canonical release ID/manifest, one shared bootstrap imported by every user-facing entry route, a single cache strategy, safe pending updates and production/device verification.
- **Maintenance rule:** when a new page is added, add it to the consumer inventory and updater integration in the same change; fail the release checklist otherwise.


## Visible version ownership
All projects: one centrally owned version/footer component per project, driven by its running release identity. Remember: `remember/remember-version.js` and `remember/release.json` own version identity; all nine production-facing HTML routes must use the version footer. `remember/remember-viewport.js` was disconnected from production after failed viewport-height mitigations and is **not** a required version-footer import. Verify actual consumer imports before changing this register. Do not claim installed-device verification until tested.
