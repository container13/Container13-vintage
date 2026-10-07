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
