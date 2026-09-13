# LINA HANDOFF – V0.57.4

## Navigation/orientation
Permanent hierarchy:
Dashboard → Category → Module → Work step.

Every detailed view must visibly answer:
1. Where am I?
2. What am I doing here?
3. Where does Back take me?

V0.57.4 introduces one authoritative context bar for detailed workspaces. Old competing detailed headers are hidden while it is active.

Examples:
Dashboard › Forskning › Swing G2 · Breakout/Momentum · A–O
Dashboard › Data › Marknadsdata
Dashboard › Data › Test
Dashboard › Data › Resultat

## State correctness
A highlighted choice must equal the state actually used by Lina.
Market Group is reconciled with the symbol list:
- exact known group → correct preset highlighted
- custom list → no false preset highlight; `Egen symbolista`

## Existing rules retained
Responsive: mobile / 13-inch / large desktop.
Normal user info fits without horizontal scroll on 13-inch.
Detailed workspaces primarily one column.
Kör/Starta/Fortsätt performs the action; Öppna/Visa navigates.
Two ZIPs per release.
Old handoff files are immutable history.
No generated images unless explicitly requested.

## Unchanged research
No strategy/signal/risk/data/forward logic changed.
Jägaren forward anchor 2026-09-11.
Swing G1 forward anchor 2026-09-14.
Swing G1 frozen hash 8f09f32a.
Swing G2 research periods/rules unchanged.
Handel AV.
Robotmognad 48/100.
