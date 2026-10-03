# LINA HANDOFF – V0.57.7

## Critical root cause found
The V0.57 architecture itself was not consistently booting in later versions.

Several generations used exact-version guards:
`if(APP_VERSION!=='V0.57.x') return;`

Therefore permanent features silently stopped initializing after the next version bump, while old legacy startup still ran:
`show('data', false)`.

This explains screenshots where:
- Lina opened in generic Data
- the user could not tell that G2 had been selected
- orientation/context fixes appeared to make no difference

## Fix
V0.57.7 has one authoritative current-app boot.

On every fresh page load it:
1. initializes current header/Refresh
2. initializes orientation/context
3. initializes responsive table support
4. initializes completion/next-step monitoring
5. initializes visible-view state normalization
6. synchronizes Market Group with actual symbols
7. finally renders Dashboard as the authoritative starting view

Legacy pane startup can still exist under the hood, but it cannot win the final initial screen.

## Permanent engineering rule
A permanent current feature must not depend only on an exact historical version initializer.
Every release must have one authoritative boot path for the entire current architecture.

## UX hierarchy retained
Dashboard → Category → Module → Work step.

## Existing rules retained
Klar/Redo/Väntar must show next action.
Visible state is authoritative.
Selected UI state must match actual state.
Responsive mobile / 13-inch / large desktop.
Two ZIPs per release.
Old handoff files are immutable.
No image generation unless explicitly requested.

## Unchanged research
No strategy/signal/risk/forward/data-engine logic changed.
Jägaren anchor 2026-09-11.
Swing G1 anchor 2026-09-14.
Swing G1 hash 8f09f32a.
Swing G2 rules/periods unchanged.
Handel AV.
Robotmognad 48/100.
