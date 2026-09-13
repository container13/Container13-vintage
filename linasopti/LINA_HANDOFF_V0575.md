# LINA HANDOFF – V0.57.5

## Context-preserving workflow
Lina must remember where the user came from when a shared tool such as Data is opened.

Flow example:
Dashboard → Forskning → Swing G2 → Data → Dagsdata klar → Till Swing G2.

General Data:
Dashboard → Data → Dagsdata klar → Kör test nu → Resultat.

## Permanent completion rule
A user-facing `Klar`, `Redo` or `Väntar` state must expose a concrete next action in the same view.

## Action semantics
- `Till/Öppna/Visa` = navigation.
- `Kör/Starta/Fortsätt` = performs the action.
- Never make a navigation button silently execute a research stage.

## G2
After Data completes from G2, `Till Swing G2` returns to the canonical G2 A–O module and highlights the next enabled canonical action. Existing G2 engine/state remains authoritative.

## Existing rules retained
Dashboard → category → module → work step.
Visible selection must match actual state.
Responsive mobile / 13-inch / large desktop.
Normal user info fits 13-inch without horizontal scrolling.
Two ZIPs per release.
Old handoff files are immutable history.
No generated images unless explicitly requested.

## Unchanged
No strategy/signal/risk/forward logic changed.
Jägaren anchor 2026-09-11.
Swing G1 anchor 2026-09-14.
Swing G1 hash 8f09f32a.
Swing G2 research rules/periods unchanged.
Handel AV.
Robotmognad 48/100.
