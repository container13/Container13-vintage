# G2 ROUTE AUDIT – V0.58.1

## Reproduced failure
V0.58.0 loaded correctly but after selecting G2 the visible screen was still generic Marknadsdata.

## Root cause
Multiple old and new navigation systems could call show('data') after the G2 route had been selected.

## Fix
v0581OpenG2() is now the sole authoritative G2 entry path.

It:
1. sets G2 route state
2. hides Data/Test/Result
3. shows Testlab
4. hides every lab except G2
5. paints G2 context
6. paints G2 guided run/export flow

A wrapper blocks legacy show() pane switches while G2 is active.

No engine logic changed.
