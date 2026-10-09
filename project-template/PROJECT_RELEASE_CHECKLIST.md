# PROJECT RELEASE CHECKLIST

## Before change
- [ ] Release standard, master rules and current state read.
- [ ] Existing IN_PROGRESS/UNVERIFIED checkpoint handled.
- [ ] Actual affected source/config inspected.
- [ ] Competing/legacy implementations inventoried where relevant.
- [ ] Risk classified LOW / MEDIUM / HIGH.
- [ ] Rollback point known for MEDIUM/HIGH.

## During change
- [ ] Smallest coherent change.
- [ ] One owner per behavior.
- [ ] Retry/double tap/reload/resume is idempotent where relevant.
- [ ] Persistent schema change has version/migration.
- [ ] Navigation cannot accidentally destroy state.
- [ ] State-changing actions have visible feedback.
- [ ] No secrets committed.
- [ ] Runtime change bumps single version source.

## Static/readback
- [ ] Syntax/structure checks PASS.
- [ ] Required project files exist.
- [ ] State JSON parses and release fields are coherent.
- [ ] GitHub exact readback PASS.
- [ ] Changed files only.

## Runtime gates
- [ ] LOW: static/readback sufficient unless behavior changed.
- [ ] MEDIUM: deployed version + smoke test PASS.
- [ ] HIGH: deploy + smoke + required real-device/human/domain gate PASS.
- [ ] No silent failure observed.
- [ ] Intended effect verified, not merely deployment.

## Promotion
- [ ] Candidate has passed all required gates.
- [ ] Old CURRENT -> PREVIOUS.
- [ ] Candidate -> CURRENT.
- [ ] Checkpoint -> IDLE.
- [ ] Current state records what was actually verified.

## Anti-shortcut checks for every project
- [ ] Searched active implementation and `solutions/` before designing anything new.
- [ ] One owner per user-facing behavior; any duplicate mechanism has an approved sunset plan.
- [ ] Exact runtime endpoint, deployment workflow and source file identified.
- [ ] Version and relevant browser cache keys are coherent for the changed runtime.
- [ ] Final commit deployment checked; cancelled/older runs do not count.
- [ ] Evidence stage reported precisely; device/AI/business outcome never inferred from CI success.
- [ ] Handoff/state reconciled or clearly marked UNVERIFIED; historical notes marked superseded.
- [ ] CI guard tested with a known failure; required-check enforcement confirmed separately.

## CCC design parity gate (mandatory for any CCC UI change)
- [ ] Compared changed view with canonical Dashboard and shared CCC shell.
- [ ] Shared tokens/components reused for typography, colors, spacing, headers, cards, controls, icons and navigation.
- [ ] Hover, pressed, focus, and disabled feedback matches Dashboard where applicable.
- [ ] Mobile and desktop layouts checked for proportions, content alignment, density, overflow and readable type.
- [ ] Any intentional deviation documented; no unreviewed local CSS override.
- [ ] Visual parity confirmed with rendered evidence before marking UI VERIFIED.
