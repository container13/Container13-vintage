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
Remember iPhone installed PWA occasionally exposes a dark bottom strip / inconsistent initial scroll. Earlier view-specific CSS patches did not resolve it. Shared foundation and consumer version parity were adjusted, but **not device verified**. Treat as OPEN; investigate real viewport, root/background rendering and deployed CSS rather than stacking further overrides.
