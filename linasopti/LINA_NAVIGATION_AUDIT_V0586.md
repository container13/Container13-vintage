# LINA NAVIGATION AUDIT – V0.58.6

## Findings in V0.58.5
- context back used clone/rebind patterns in more than one layer
- workspace back also had clone/rebind history
- Data back had its own rebound handler
- `v0570ShowCategory` had 4 wrapper generations
- `v0570RenderHome` had 3 wrapper generations
- `v0570OpenLab` had 6 wrapper generations

This explains why a button can display the correct destination while its current DOM node no longer owns the expected handler.

## Fix
A capture-phase delegated router now handles all current back controls before historical handlers.

## Routing semantics
- G2 context back -> Research
- generic workspace back -> current owning category
- Data/flow back -> Data
- category breadcrumb -> Dashboard
- workspace isolation and G2 state are released before navigation

## Boot
Only V0.58.6 registers the current DOMContentLoaded boot. V0.58.5 remains a callable base boot.

No research logic changed.
