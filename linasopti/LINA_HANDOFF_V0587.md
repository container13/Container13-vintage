# LINA HANDOFF – V0.58.7

## Live issues fixed
- G2 A failed on AMD Jan 2020 with 0 daily rows.
- G2 context back `← Forskning` still did nothing.

## G2 data transport
Historical daily fetch order:
1. `/eod-bars` with plain ticker
2. `/eod-bars` with `.US`
3. `/bars` Alpaca 1Day fallback

Rows are normalized back to the requested frozen ticker.
Checkpoint mode: `g2-symbol-month-daily-3`.

## Navigation
`v0587BackToResearch()` is attached as an inline onclick attribute to G2's context back button. This survives older cloneNode-based context replacements.

## Research unchanged
No strategy/grid/risk/period changes.
G2 DEV 2020–2022 and locked pseudo-forward 2023–2026 unchanged.
Handel AV. Robotmognad 48/100.

## Release rules
Two ZIPs per release. Old handoffs immutable. No image generation unless explicitly requested.
