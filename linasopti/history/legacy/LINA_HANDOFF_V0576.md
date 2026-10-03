# LINA HANDOFF – V0.57.6

## Root cause
V0.57.4–V0.57.5 depended on route/body classes. Legacy Lina can display the same pane through multiple older paths, so fixes could silently fail.

## New permanent rule
VISIBLE VIEW IS AUTHORITATIVE.

Layout, breadcrumb/context, market selection and next-step UI are derived from what is actually visible, not from which route/body class was expected to be active.

## Visible pane behavior
- Data visible → one-column Data workspace + `Dashboard › Data › Marknadsdata`
- Test visible → `Dashboard › Data › Test`
- Result visible → `Dashboard › Data › Resultat`
- Testlab visible → context from the actually visible lab/module

## Market state
The symbol input is compared with every known MARKET_GROUPS symbol list.
Exact match → correct group highlighted.
No match → no false preset highlight + `Egen symbolista`.

## Existing rules retained
Dashboard → category → module → work step.
Klar/Redo/Väntar must expose the next action.
Kör/Starta/Fortsätt executes; Öppna/Visa navigates.
Responsive mobile / 13-inch / large desktop.
Normal user info fits without horizontal scroll on 13-inch.
Two ZIPs per release.
Old handoff files are immutable.
No image generation without explicit request.

## Unchanged
No strategy/signal/risk/forward logic.
Jägaren anchor 2026-09-11.
Swing G1 anchor 2026-09-14.
Swing G1 hash 8f09f32a.
Swing G2 rules/periods unchanged.
Handel AV.
Robotmognad 48/100.
