# LINA WORKFLOW OWNER AUDIT – V0.57.8

Inspected shared views that can be reached from multiple strategy contexts.

## Shared views
- Data
- Test
- Result

## Problem
Generic pane identity (`Data`, `Test`, `Resultat`) overwrote the strategy context that brought the user there.

## Fix
A small workflow-owner state records the opening module and category.

Known owners:
- Swing G2
- Swing G1 forward
- Jägaren forward
- Swing G1 history
- Jägaren history

Shared panes render breadcrumb, owner, step, purpose and Back using that owner.

Opening top-level Data intentionally clears the strategy owner, so direct Data use remains generic.

No research engine logic changed.
