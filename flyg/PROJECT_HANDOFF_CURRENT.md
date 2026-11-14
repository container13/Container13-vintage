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

## Global flight search defaults — user confirmed 2026-11-14
- **All flight searches depart from Stockholm Arlanda (ARN)** unless the user explicitly changes this.
- **Always search for 2 travelers** unless explicitly changed.
- **Checked baggage is required for both travelers** for normal trips; bag weight is configurable and not globally fixed (Alps initial profile: at least 23 kg per person).
- **Exception: football trips within Europe**, for example Cologne or London: checked baggage is **not required** by default. Offer cabin baggage/hand baggage and optionally checked baggage, with the true total price.
- Treat these as shared defaults for future destinations, not only Alps. Football travel should be a separate editable search profile.

## Candidate prototype progress — 2026-11-14
- Added `index.html`, `style.css`, `app.js` on isolated branch. Mobile-first search form, skiing vs European football profile, ISO week date ranges, 2 travelers and ARN defaults; profile-dependent checked baggage; no invented flights.
- Exact GitHub file readback PASS. No actual JS syntax/interaction or mobile-device test performed. No deployment and no provider access. Candidate remains UNVERIFIED.
- Before any release: implement shared release manifest/updater, test syntax and UI, verify deployment and iPhone; use only an authorized flight data provider.

## Alpine airport coverage — 2026-11-14
- Expanded `app.js` catalog to 23 candidate airports including Zurich (ZRH), Geneva (GVA), Innsbruck, Salzburg, Milan (MXP/LIN), Bergamo, Turin, Munich, Lyon, Basel, Verona, Venice, Bologna, Stuttgart, Vienna and Nice, plus secondary airports requiring direct-route verification.
- User flew via Zurich to St Anton last year; include Zurich as a strong St Anton gateway but do not assume live price or schedules.
- Candidate airports are not confirmed nonstop routes for every date. Filter by actual ARN nonstop availability, arrival time, bag-inclusive total price, and ground transfer to chosen resort before recommendations.
- Candidate v0.1.1 committed only, no deployment/device test. Flight provider not connected.

## Connection policy — confirmed 2026-11-14
- Direct flights preferred, but one-stop itineraries via e.g. Oslo, Copenhagen or Frankfurt are allowed when useful.
- **Hard arrival target: at hotel no later than 22:00 local time**, not airport landing. Calculate actual hotel arrival from airport landing plus baggage reclaim, transfer wait, train/car travel and realistic buffer; do not suggest a connection that cannot satisfy this.
- Evaluate whole journey, including total elapsed time and all-in fare for two with required baggage. Do not disqualify a stop purely because it is not direct.
- Example: Zurich to St Anton by train takes roughly 3 hours; do not assume evening Zurich landings are compatible with hotel arrival by 22:00.
- Implemented in requirements only; runtime form and actual ground-transfer engine still pending.

## Candidate 0.1.2 — connections and hotel arrival
- Search UI now has direct-only vs connections-allowed selection and a separate **hotel arrival cutoff (default 22:00)**. Generated search requirements include these settings, for both profiles.
- Airport-arrival preference is not the hotel deadline; actual feasibility must account for baggage, transit and transfer schedules. No live route/transfer computation implemented yet.
- All changed files verified via GitHub readback; no deployment or device verification.
