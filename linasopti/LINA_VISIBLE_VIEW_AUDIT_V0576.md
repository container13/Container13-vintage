# LINA VISIBLE VIEW AUDIT – V0.57.6

## Problem
Recent screenshots showed that route-based CSS could be bypassed by old navigation paths:
- Data still appeared in two columns
- orientation bar was absent
- stale market highlight could remain

## Fix architecture
Instead of trusting route/body classes, V0.57.6 watches the actual visible panes:
`pane-data`, `pane-test`, `pane-result`, `pane-testlab`.

CSS uses `:not(.hidden)` on the panes themselves.
JS observes class/hidden/style changes and derives:
- current context bar
- market group truth
- next action refresh

## Why this is stronger
Old and new navigation can coexist during migration, but the visible UI is now normalized after either one changes the current pane.

No research/trading engine changes.
