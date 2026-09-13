# LINA NAVIGATION & ORIENTATION AUDIT – V0.57.4

Package-wide static inspection focused on loss of context when moving from dashboard/category pages into detailed views.

## Root issue
The app had accumulated several generations of navigation:
- old tabs
- V0.56 workspace header
- V0.57 dashboard/categories
- V0.57.1 Data flow header

Depending on entry path, a detailed pane could be visible without a sufficiently prominent current-location indicator.

## Fix
One authoritative V0.57.4 context bar is used in detailed workspaces.
It includes Back + breadcrumb + current view + purpose.

The older detailed workspace headers remain in DOM for compatibility but are visually suppressed in the new workspace modes.

## Audited routes
- Forward detail modules
- Research/history lab modules
- Swing G2
- Swing G1 A–O
- Jägaren historical labs
- Tidsmaskin
- Data
- Test
- Result

## State mismatch audit
The screenshot also exposed a possible stale visual selection: a preset can remain highlighted while the symbol field contains another known group.

V0.57.4 reconciles the visible preset against the actual symbol list and removes false highlighting for custom lists.

No research engine logic changed.
