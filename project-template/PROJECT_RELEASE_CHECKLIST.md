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

## Multi-device release gate - all web projects
- [ ] Mobile, tablet, and desktop layouts reviewed; relevant orientations considered.
- [ ] No clipped content, unwanted horizontal scroll, or inaccessible controls.
- [ ] Touch, mouse, keyboard, focus states, and readable text verified as applicable.
- [ ] Navigation, forms, images, uploads, and status feedback usable across target devices.
- [ ] Actual device/browser evidence recorded where needed; untested combinations identified, with no unsupported DEVICE PASS.

## Mobile page-zoom gate — mandatory (2026-10-13)
- [ ] Mobile views cannot pinch-zoom the entire page in or out.
- [ ] Viewport restriction AND shared touch/gesture guard applied; do not rely on viewport alone on iPhone Safari.
- [ ] One-finger scrolling, text entry, controls and keyboard remain usable.
- [ ] Image zoom is enabled only after an explicit user request; an opted-in image viewer zooms its image, never the entire page.
- [ ] Real iPhone Safari/Android pinch behavior tested where relevant; code/desktop inspection does not count as DEVICE PASS.


## Shared foundation first — all-project mandatory gate (2026-10-16)
- [ ] Listed every affected view, shared consumer, breakpoint and device context before editing.
- [ ] Located the canonical shared owner and verified each consumer's import/path/version.
- [ ] Changed the canonical implementation first; justified any view-specific exception in writing.
- [ ] Removed/reconciled conflicting old CSS, event handlers and duplicate overrides rather than layering patches.
- [ ] Checked version parity and actual deployed assets, not just GitHub commit status.
- [ ] Tested representative affected views and regressions, including PWA safe-area, viewport, scroll and foreground resume where relevant.
- [ ] Recorded CODED / COMMITTED / DEPLOYED / DEVICE TESTED / USER APPROVED separately.
- [ ] If two fixes failed for the same issue, stopped patching and recorded root cause and a fresh verification plan.
- [ ] Updated the shared component register with owner, consumers, exceptions and test status.
