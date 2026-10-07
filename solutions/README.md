# Verified Solutions Library

Purpose: prevent rebuilding solutions we already have.

## SEARCH BEFORE BUILD
Before designing a new mechanism or fixing a recurring problem:
1. Search this index and solution folders using problem words, symptoms and component names.
2. If a VERIFIED solution matches, inspect its current implementation and reuse/adapt it before inventing another.
3. If it only partly matches, reuse the proven principle but re-verify in the new context.
4. If no solution matches, build normally.
5. After a generally reusable fix is verified, add or update one small solution entry.

This library is intentionally lightweight. Do not document every change.

## Status
- VERIFIED: proven in the named project/runtime.
- PATTERN: proven principle, but implementation must be adapted/reverified.
- RETIRED: kept only to explain why it should not be reused.

## Index
| Solution | Status | Search terms | Proven in |
|---|---|---|---|
| [release-state-machine](release-state-machine/README.md) | VERIFIED | current previous pending promotion rollback release | CCC |
| [github-readback](github-readback/README.md) | VERIFIED | github write readback sha commit verify | CCC, Lina |
| [checkpoint-resume](checkpoint-resume/README.md) | VERIFIED | resume checkpoint crash recovery handoff state | CCC, Lina |
| [worker-source-chain](worker-source-chain/README.md) | VERIFIED | worker pending current previous deploy source wrangler | Lina |
| [mobile-selection-block](mobile-selection-block/README.md) | VERIFIED | ios selection callout text image magnifier editable | CCC |
| [mobile-longpress-owner](mobile-longpress-owner/README.md) | PATTERN | longpress touch pointer click gesture fullscreen image | CCC |

Keep descriptions factual. A solution being VERIFIED in one context does not make every future adaptation verified.
