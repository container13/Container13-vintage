# LINA WORKSPACE ISOLATION AUDIT – V0.58.2

## V0.58.1 leak audit result
- 35 legacy lab IDs
- 36 vlab class modules
- multiple older lab roots not using `.v0413-lab-section`
- legacy navigation blocks still present in DOM

Examples of old roots:
- v0423Lab / Regim Lab 2
- v0422Lab
- v0421Lab
- v0420Lab
- v0410Lab
- v0411Lab
- v0412Lab

## Root fix
Visibility is now token-based on root-level `vlab-*` membership, not one CSS generation.

When module X is active:
- only root nodes with `vlab-X` (or exact id X) remain visible
- all sibling lab roots are hidden
- old global navigation is hidden
- a MutationObserver enforces this after later DOM/style mutations

This solution applies to G2 and all future/older lab modules opened through the modern router.

## Separate bug found and fixed
V0.58.0's G2 paint function used an exact version guard and stopped in V0.58.1.
That caused the G2 primary lock button to have no active handler.
The permanent G2 flow now accepts the V0.58.x release family.

No research engine changes.
