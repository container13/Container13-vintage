# LINA SINGLE BOOT AUDIT – V0.58.5

## Symptom
V0.58.4 login/page startup became extremely slow and could stall.

## Cause
Several historical DOMContentLoaded initializers were active simultaneously after family-guard cleanup. Multiple observers/listeners were therefore created.

## V0.58.5 correction
Historical timed autostarts are commented out.
Only `v0585CurrentBoot()` is registered for DOMContentLoaded.

The boot explicitly initializes lightweight permanent features once, then starts one observer of each type.

## Acceptance
- no delayed chain of 0/20/40/.../900 ms current initializers
- no duplicate current observer startup
- dashboard remains fresh-load destination
- G2 workspace isolation/run panel retained
- V0.58.3 daily-data fetch retained

No research engine changes.
