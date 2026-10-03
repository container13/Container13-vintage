# LINA HANDOFF – V0.58.6

## Navigation fix
Problem: G2 `← Forskning` could be visible but not work. The same structural risk existed on several back controls because older generations clone/rebind buttons and wrap navigation functions.

## Current architecture
- one DOMContentLoaded boot: `v0586CurrentBoot`
- it calls the proven V0.58.5 single/base boot
- then installs one delegated capture-phase navigation router
- router owns current back controls and releases module isolation before routing

## Covered back paths
- G2 -> Forskning
- category -> Dashboard
- generic lab/workspace -> owning category
- Data workspace -> Data
- guided flow -> Data

## Permanent navigation rule
A current navigation button must not depend on a handler attached to a particular cloned DOM node. Current back navigation is delegated and centralized.

## Research unchanged
No strategy/signal/risk/data-engine changes.
G2 daily 1Day transport retained.
Jägaren/G1 forward anchors unchanged.
Handel AV.
Robotmognad 48/100.

## Release rules
Two ZIPs per release.
Old handoffs immutable.
No image generation unless explicitly requested.
