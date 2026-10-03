# LINA HANDOFF – V0.58.1

## Critical navigation fix
G2 now owns the visible workspace until the user explicitly leaves G2.

### While G2 is active
- pane-data hidden
- pane-test hidden
- pane-result hidden
- pane-testlab visible
- only v0560SwingG2Lab visible
- legacy show('data'/'test'/'result') cannot hijack the view
- G2 context header remains visible
- V0.58.0 guided flow remains visible

### Entry
Any modern G2 card using data-v0570-lab="v0560SwingG2Lab" is intercepted and routed directly to v0581OpenG2().

### Exit
Dashboard/category navigation explicitly clears G2 active state.

## G2 primary workflow retained
Lås plan → Kör/Fortsätt A–O → Exportera rapport till ChatGPT.

## Permanent rule
A modern module route owns the visible workspace until explicit user navigation leaves it. Legacy pane switches cannot override an active module.

## Unchanged research
No strategy/signal/risk/forward/data-engine changes.
Jägaren anchor 2026-09-11.
Swing G1 anchor 2026-09-14.
Swing G1 hash 8f09f32a.
Swing G2 grid/periods unchanged.
Handel AV.
Robotmognad 48/100.
