# PROJECT MASTER RULES

Status: ACTIVE. Shared rules come from PROJECT_RELEASE_STANDARD.md.

## Before every change
Read PROJECT_RELEASE_STANDARD.md, this file, PROJECT_CURRENT_STATE.json and the relevant checklist. If workCheckpoint is IN_PROGRESS or UNVERIFIED, verify reality and resume before unrelated work unless the user explicitly changes priority.

Inspect actual affected source/config and trace source -> state/storage -> build/deploy -> runtime -> UI before writing when the chain matters.

## SEARCH BEFORE BUILD
Before designing a new mechanism or solving a recurring problem, search the repository-level `solutions/` library using the symptom, component and intended behavior. If a VERIFIED solution matches, inspect its current canonical implementation and reuse/adapt it before inventing another. A reused solution must still be verified in the target project. If a generally reusable fix is newly proven, add/update one lightweight solution entry. Do not document trivial one-off work.

## Change discipline
Use the smallest coherent change that fixes the verified root cause. Do not stack speculative patches. Preserve unrelated working behavior. Inventory legacy/parallel implementations first.

Every runtime change gets a new version. Documentation-only version policy may be project-specific but must be explicit.

## State and recovery
PROJECT_CURRENT_STATE.json is the compact machine-readable continuation point. Critical continuation context must not live only in chat. Checkpoints are IDLE, IN_PROGRESS or UNVERIFIED.

## Promotion
Candidate remains PENDING until all gates required by its risk class pass. Only then promote candidate -> CURRENT and old CURRENT -> PREVIOUS.

## Project-specific additions
Add stricter project rules here. Never silently weaken the shared standard.

## Shared anti-shortcut rules
- Follow `PROJECT_RELEASE_STANDARD.md` § Cross-project anti-shortcut contract before changing any active project.
- Existing verified implementation first; do not create a second test engine, login, token, deploy chain or handler without an explicit reason and retirement plan.
- Document actual evidence and outstanding gates; never call COMMITTED/DEPLOYED a real-device PASS.
- A project-specific CI workflow is advisory until its enforcement as a required check is verified.

## Mandatory CCC design system (all CCC modules and views)
- Dashboard and the shared CCC shell are the canonical visual and interaction reference, not optional inspiration.
- All CCC views must reuse shared design tokens and components for header/brand/version, colors/themes, typography, spacing, cards, buttons, icons, help, settings, navigation, hover/focus/pressed feedback and responsive behavior.
- Before modifying any CCC screen, inspect the corresponding canonical Dashboard/shared-shell implementation and compare mobile and desktop layouts. Prefer shared styles/components; do not append a new local override for a pattern that already exists.
- A module-specific variation is permitted only when the workflow requires it; record the reason and keep shared look, interaction and accessibility.
- Review mobile and wide desktop for readable content density, consistent alignment, no oversized empty cards, no clipping or unintended scrolling, and matching hover/pressed motion.
- Treat mismatched CCC styling or interactions as a release-blocking defect. Do not declare visual parity without actual rendered client evidence.

## Copy-ready text (all projects)
Whenever proposing an exact value, command, URL, filename, prompt, setting, or text that the user should enter or paste elsewhere, provide a directly adjacent copy control (copy icon/button) for that exact value. Keep the copied value clean: no explanatory prose, quotation marks, or extra whitespace. For multiple values, provide a separate copy control for each. Use the platform's real copy action, not a decorative icon. If interactive copying is unavailable, give a clearly delimited copyable code span/block and state the limitation. Applies across CCC, LinaSopti, Remember, and future projects.

## Mobile page zoom — explicit user rule (2026-10-13)
- Default for every project's mobile views: no page pinch-zoom, either in or out. This includes login, dashboards, forms, previews and admin views.
- Zoom is permitted only when the user specifically requests it, for example inside an image viewer. Enable image-only zoom in that explicit viewer; never enable page zoom as a side effect.
- Use one shared owner: project-template/mobile-view-policy.js, together with viewport initial-scale=1, maximum-scale=1 and user-scalable=no. The guard handles cancelable multi-touch and Safari gesture events; ordinary single-touch scrolling and inputs remain untouched.
- data-image-zoom="true" is an opt-in hook only for an explicitly requested image viewer with its own image-only zoom controller. Do not add it speculatively.
- Preserve readable typography and OS text-size support. This explicit preference supersedes earlier template guidance to enable accessibility page pinch-zoom by default.
- Verify real mobile behavior. Document any untested browser/device; do not claim success from source patterns alone.
- Apply to active projects on their next relevant change. Do not redeploy unrelated projects just to copy this rule.


## Shared foundation first — mandatory change gate (2026-10-16)
Applies to **all projects**, including CCC, Remember, LinaSopti and future work. A shared design or behavior requirement is a contract, not a suggestion.
1. **Scope first:** before editing, enumerate every affected view, component, breakpoint, theme and device context; inspect the actual imports and shared source of truth.
2. **Single owner:** fix the shared component, design token, stylesheet or policy at its canonical location. A view-local override is allowed only with a documented reason and affected-view inventory.
3. **Conflict cleanup:** inspect existing rules and specificity, remove/replace obsolete conflicting overrides instead of stacking more CSS or duplicated handlers.
4. **Version parity:** check all consumers import the same intended release of the shared asset, and verify the published asset rather than only its repository commit.
5. **Regression evidence:** verify the changed view and other affected views, including installed iPhone PWA startup/resume, safe areas, background, scrolling and interaction when applicable.
6. **Truthful status:** distinguish CODED, COMMITTED, DEPLOYED, DEVICE TESTED and USER APPROVED. Never call a commit a verified fix.
7. **Two-failure stop rule:** if the same defect persists after two attempted fixes, STOP incremental patches; perform and document root-cause analysis, shared-owner inventory, competing CSS/JS rules, deployed-version check and a targeted verification plan before the next fix.
8. **Template register:** maintain a discoverable registry of canonical components, owners, consumer views, asset/version policy, exceptions and verification status; update it whenever a shared component changes.
This gate must be completed before implementation and checked again before release. Record any exceptions explicitly; do not silently bypass it.
