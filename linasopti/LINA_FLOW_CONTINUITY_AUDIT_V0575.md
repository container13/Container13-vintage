# LINA FLOW CONTINUITY AUDIT – V0.57.5

## Problem reproduced
The Data completion card could say `Dagsdata klar` / `Data klar` without telling the user what to do next.

## Root cause
Data is a shared tool. Previous versions knew which pane was open, but did not reliably retain the workflow origin that led into Data.

## Fix
A small persistent workflow context is stored in localStorage.
Known origins can provide context-specific continuation.

Current explicit routes:
- Swing G2 → Data → complete → Swing G2
- General Data → complete → canonical test execution

## Package-wide guard
Known completion-like blocks (`klar`, `redo`, `väntar`) are audited at runtime and marked internally as having or missing a visible action. This is diagnostic and does not guess actions for historical/technical states.

## UX safety
The G2 continuation navigates to the canonical G2 module rather than auto-running an unknown research stage. This preserves the A–O locking/review workflow.
No strategy engine was duplicated or altered.
