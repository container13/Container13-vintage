# LINA HANDOFF – V0.58.4

## Root architecture fix
Permanent UI/navigation features must not be tied to one exact patch version.

## New current-app boot
`v0584CurrentBoot()` is the authoritative boot for all V0.58.x releases.

It starts:
- header / refresh
- context/orientation
- responsive table support
- completion/next-step observer
- visible-view normalization
- market-state sync
- workspace-isolation observer
- G2 guided run/export panel

Then Dashboard is rendered last and becomes the final fresh-load state.

## Why
Legacy startup still contains `show('data', false)`. Historical code may remain, but it cannot determine the final initial screen anymore.

## Permanent rule
Patch-version increments inside an active architecture family must never disable permanent features.

## Research unchanged
No strategy/signal/risk/forward/data-engine changes.
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
