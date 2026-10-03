# LINA HANDOFF – V0.58.5

## Performance/root fix
V0.58.4 reactivated many historical DOMContentLoaded initializers and overlapping observers.

V0.58.5 rule:
- only `v0585CurrentBoot()` autostarts
- historical init functions remain but their autostarts are disabled
- one table observer
- one completion observer
- one visible-view observer
- one workspace leak observer
- dashboard is final fresh-load state

## Permanent rule
One release = one authoritative boot.
Permanent observers/listeners must be idempotent and start once.
Historical code must never autostart just because a family guard matches.

## G2
G2 guided panel and workspace isolation are still initialized by the single boot.
Daily-data transport from V0.58.3 remains unchanged.

## Research unchanged
No strategy/signal/risk/forward changes.
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
