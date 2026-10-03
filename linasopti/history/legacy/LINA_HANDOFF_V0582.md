# LINA HANDOFF – V0.58.2

## Workspace isolation
The leak problem was package-wide, not G2-only.

`pane-testlab` contains several historical lab markup generations. Modern routing must not depend on `.v0413-lab-section`.

V0.58.2 rule:
- inspect direct children of pane-testlab
- any root with a `vlab-*` class is a lab root
- hide every lab root
- show only roots that have the active lab's `vlab-<id>` token or exact id
- this preserves companion cards for older labs when intentionally opened
- hide legacy Forward / Research / Tester navigation inside module workspaces
- MutationObserver re-applies isolation if legacy code attempts to reveal something

## G2 lock bug fixed
`v0580PaintG2Flow()` was guarded by exact V0.58.0 and therefore returned immediately in V0.58.1.
It is now permanent across V0.58.x, so `Lås G2-planen` is wired again.

## Permanent rule
One active module owns the workspace. Historical DOM/class differences are not allowed to determine what is visible.

## Research unchanged
No signal/strategy/risk/forward/data-engine changes.
Jägaren anchor 2026-09-11.
Swing G1 anchor 2026-09-14.
Swing G1 hash 8f09f32a.
Swing G2 grid/periods unchanged.
Handel AV.
Robotmognad 48/100.

## Release rules
Two ZIPs per release.
Old handoff files immutable.
No image generation unless explicitly requested.
