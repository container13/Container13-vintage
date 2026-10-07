# CCC Vinted Vision — specification

Status: DESIGN ONLY — no runtime/UI/Worker change
Baseline: CCC 2.10.170 verified live on real iPhone
Benchmark: one-photo Levi's denim/shearling-collar jacket comparison against List It, 2026-10-07.

## Goal
Turn 1–9 photos of ONE item into a rich, reviewable Vinted listing without presenting uncertain inference as fact.

## Core rule
CCC may reason beyond what is certain, but it must never present an uncertain claim as a verified fact.

Each product field therefore carries its own evidence state:
- VERIFIED — supported strongly enough by visible/readable evidence to autofill.
- REVIEW — plausible/useful suggestion, but user must confirm before it becomes fact.
- UNKNOWN — insufficient evidence; do not guess. Ask/check manually.

A global confidence value must never replace field-level evidence.

## Language
Listing language is user-selectable:
- sv-SE — Swedish
- en — English

Product understanding is language-neutral. Language selection controls generated listing text, not the underlying product facts.

## Images
- Minimum: 1 image.
- Maximum: 9 images.
- All images belong to the same item.
- The same images are both listing images and AI evidence.
- Analyze all supplied images together.
- More images may resolve fields that were REVIEW/UNKNOWN from fewer images.

## Product intelligence model
The analysis should be able to represent at least:

- department / audience
- garment type
- garment subtype / style
- brand
- model / product line
- category
- Vinted category path
- size
- color
- secondary colors
- material
- era / year / season
- manufacturer
- visible labels / identifiers / product codes
- construction and design details
- condition
- visible wear
- visible defects
- notable features

Every factual field must include:
- value
- evidenceState: VERIFIED | REVIEW | UNKNOWN
- short evidence/reason when useful

Do not force a value when evidenceState is UNKNOWN.

## Vinted listing output
Generated from Product Intelligence, not directly from guesses:

- title
- description
- Vinted category path
- brand
- size
- condition
- color
- material
- price suggestion

Title and description use the selected language.

Price suggestion is a suggestion, never a verified product fact, and must be visibly reviewable.

Condition is never silently asserted from incomplete evidence. Visible wear/defects may be described from images, while the final condition selection remains reviewable by the user.

## Review behavior
VERIFIED:
- may be filled automatically.

REVIEW:
- show proposed value clearly marked "Kontrollera" / "Check".
- user confirmation promotes it to accepted product data.

UNKNOWN:
- show that information is missing when the Vinted field needs it.
- never invent a replacement value.

Examples:
- Clearly readable Levi's label -> brand = Levi's / VERIFIED.
- Sherpa/trucker style inferred from construction -> may be REVIEW unless evidence is strong enough for VERIFIED.
- Size not visible -> UNKNOWN, "Kontrollera storlek".
- Material not readable/otherwise reliable -> UNKNOWN, "Kontrollera material".

## Safety / truth constraints
- Never invent size, model number, product code, material composition, exact year/season, player name or other specific identifiers.
- Do not convert a plausible inference into fact merely to make the listing richer.
- Generated prose must inherit the evidence states: REVIEW/UNKNOWN claims must not leak into title/description as unqualified facts.
- User-entered/confirmed data outranks AI inference.
- Existing verified CCC product data must not be overwritten by a weaker inference.

## Benchmark acceptance
The one-photo Levi's benchmark remains the first regression case.

With the same single image, the Vinted flow should:
1. Produce materially richer useful output than current CCC Vision.
2. Match or exceed the useful field coverage demonstrated by List It where the image supports it.
3. Explicitly surface missing fields rather than silently omitting them.
4. Never gain apparent richness by inventing facts.
5. Keep uncertain useful inference visible as REVIEW instead of either asserting it or discarding it.

Observed List It benchmark fields included:
- title
- description
- Vinted category path
- brand
- size/check marker
- condition/check marker
- color
- material/check marker
- price suggestion

This benchmark records field coverage and workflow behavior, not a requirement to copy List It's wording.

## Architecture
1. Photos (1–9)
2. Product Intelligence analysis
3. Per-field evidence state
4. User review/completion
5. Vinted listing generator (sv/en)
6. Copy/use in Vinted

Product Intelligence should remain reusable by other CCC channels later.

## Out of scope for this design step
- Direct Vinted API publishing
- automatic Vinted account actions
- UI implementation
- Worker deployment
- changing existing CCC Vision behavior

No existing runtime behavior changes until this specification is implemented as a separately verified candidate release.
