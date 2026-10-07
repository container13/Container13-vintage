# Mobile Selection Blocking

Status: VERIFIED
Tags: ios safari selection callout text image drag editable magnifier
Proven in: CCC mobile UI

## Problem
App-like mobile UIs can trigger unwanted text selection, image callouts, drag behavior and tap highlights, while form fields still need normal editing.

## Verified solution
Apply global non-editable selection/callout blocking at shared CSS/JS level, with explicit exceptions for input, textarea and contenteditable. Treat editable controls as a separate interaction class.

## Reuse checklist
Test on real iPhone. Preserve text editing. Check image dragging/callout and tap behavior. Re-test gesture features because selection and touch rules can interact.

## Traps / failed approaches
A global blanket rule without editable exceptions breaks legitimate editing. Gesture fixes must be checked together with selection CSS.
