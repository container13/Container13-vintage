# CCC HANDOFF CURRENT

This file is the human-readable entry point for continuing CCC in a new chat.

## Bootstrap
1. Read CCC_MASTER_RULES.md.
2. Read CCC_CURRENT_STATE.json.
3. Read CCC_RELEASE_CHECKLIST.md.
4. If workCheckpoint is IN_PROGRESS, resume exactly there.
5. Do not ask the user to reconstruct context already stored here/repository.

## Current baseline
- Repo: container13/Container13-vintage
- Branch: ccc-demo-public-test
- App root: ccc-core/
- Verified baseline entering this rules implementation: v2.10.169.
- CCC versioning lives only in ccc-core/version.js.
- User wants finished project files transferred to GitHub automatically and verified.
- Code updates are reported as changed files only.

## Current product direction
- CCC is the Container13 control center: capture -> Vision -> review/adapt -> publish.
- Vinted exploration is PAUSED after a local prototype; do not merge that prototype into CCC until work resumes.
- The next priority is to finish adopting the transferable LinaSopti operating discipline in CCC and verify it.

## Core lesson
Verify reality, not assumptions: inspect the actual source/runtime/storage/deploy chain before modifying it. A commit is not a release and source code is not proof of real-device behavior.


## Verified continuation — 2026-10-08
- Current verified release: **2.10.180**; previous verified baseline: **2.10.176**.
- User confirmed on real iPhone that pinch zoom is gone after central multitouch prevention in `ccc-core/core.js`.
- Keep pinch zoom disabled in CCC views. Preserve the improved Vinted-inspired layout; do not restore earlier cluttered layout.
- `ccc-core/version.js` is the CCC version authority.
- Work checkpoint is IDLE. Continue with Vinted workflow improvements from 2.10.180, after inspecting live source and verifying each change.
