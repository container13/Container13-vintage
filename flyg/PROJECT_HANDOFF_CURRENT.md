# Flyg – Alperna | PROJECT HANDOFF CURRENT

## Bootstrap
1. Read `START_HERE.md`, `CONTINUITY_PROTOCOL.md`, `PROJECT_RELEASE_STANDARD.md`, `PROJECT_MASTER_RULES.md`, `PROJECT_CURRENT_STATE.json`, `PROJECT_RELEASE_CHECKLIST.md`.
2. Verify branch `flyg-alperna-init` and current live dependencies before modifying anything.
3. Read the repository-level `solutions/` library and the system library before implementing.
4. Treat candidate 0.1.0 as NOT DEPLOYED and NOT DEVICE VERIFIED.

## Scope
Personal flight search beginning with the Alps, extensible later to Thailand, Zanzibar, Maldives, Mauritius, Seychelles, Caribbean and Mexico. Flight results must be grounded in an authorized provider, not invented or scraped in violation of terms.

## Initial travel profile (editable defaults)
- Departure: Stockholm Arlanda (ARN); two travelers.
- First priority: ISO weeks 11 and 13, 2027; other weeks 1, 5, 7 optional.
- Candidate airports: Milan, Turin, Innsbruck, with optional Bergamo, Verona, Munich.
- Max four nights; aim for three complete skiing days; no late arrival; at least 23 kg checked baggage per person.
- Option to return from a different airport; possible last night in a larger city.
- Compare all-in costs and realistic transfer feasibility; do not infer live fares.

## Current status
- Shared template foundation initialized on isolated branch; no runtime, API credentials, CI or deployment configured.
- Next: inspect shared solution catalog, choose a legally accessible live-data provider, define search contract and implement MVP.
- No existing project or production environment changed.
