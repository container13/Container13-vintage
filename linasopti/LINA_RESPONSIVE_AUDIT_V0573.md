# LINA RESPONSIVE AUDIT – V0.57.3

## Package-wide inspection
Reviewed CSS/HTML structure for:
- `min-width`
- `max-width`
- `overflow-x`
- generic `.tablewrap`
- generic tables
- workspace widths
- multi-column layout
- mobile breakpoints

## Root cause found
The original global table rule contained:
`table { width:100%; min-width:760px; }`
and `.tablewrap { overflow:auto; }`.

That design was acceptable in the early lab but forces horizontal scrolling when an eight-column result table sits inside a ~900–980 px detailed workspace on a 13-inch display.

## Corrective architecture
1. Dashboard/category grids remain multi-column navigation.
2. Detailed workspaces remain one primary column.
3. On >=900 px, detailed workspace width may grow to 1180 px.
4. User-facing tables use the available width and wrap text.
5. Main Affärslogg gets purpose-specific proportions.
6. On mobile (<700 px), user-facing tables become labelled card rows.
7. Raw/technical diagnostics can be explicitly marked `v0573-raw` and retain horizontal scrolling.

## Scope
The responsive rules apply package-wide to `.tablewrap` inside the new workspace and Data/Test/Result flows, not only to the screenshot's Affärslogg.

No strategy logic changed.
