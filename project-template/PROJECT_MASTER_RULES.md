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
