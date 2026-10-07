# Mobile Long-Press Ownership

Status: PATTERN
Tags: ios longpress touch pointer click gesture fullscreen image canvas
Proven in: CCC for image paths; canvas coverage is not universal

## Problem
Multiple local long-press handlers and mixed touch/pointer/click logic create inconsistent behavior and repeated fixes.

## Verified solution
Inventory all touch/pointer/click owners first, then centralize one canonical long-press owner where possible. Use movement cancellation and deliberate click suppression. Resolve the actual media target even when the event lands on a wrapper.

## Reuse checklist
Inventory local handlers before adding another. Test tap, long-press, swipe and close behavior together on a real device. Treat IMG and CANVAS separately unless the implementation explicitly supports both.

## Traps / failed approaches
Do not claim global coverage merely because a shared handler exists. CCC showed that canvas-based views need explicit support and that synthetic-click suppression can interfere with immediate close behavior.
