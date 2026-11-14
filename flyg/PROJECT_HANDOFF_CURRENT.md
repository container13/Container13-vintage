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

## Candidate 0.1.3 — journey evaluator
- New pure `journey-engine.js` returns ELIGIBLE, REJECTED or UNKNOWN for supplied flight segments, checked baggage, two-person price and **verified** ground-transfer/hotel-arrival deadline. Connections via intermediate airports supported; origin must be ARN.
- Added `tests/journey-engine.test.cjs` with 9 synthetic test cases. **Not yet executed**. GitHub exact readback PASS.
- Evaluator is **not wired into UI** and does not retrieve schedules, prices or ground transport. No deployment/device test. Avoid claiming an end-to-end flight search.

## Candidate 0.1.4 — hotel arrival time
- Hotel-arrival cutoff now editable in 30-minute steps (00:00–23:30), default 22:00. Search summary prints HH:MM without adding :00.
- Midnight/cross-date arrival requires an explicit local date and timezone in the later itinerary evaluator; current form only collects the time.
- Source committed and readback verified; no runtime/device tests or deployment.

## Candidate 0.1.5 — centralized updates
- Added release.json and a single auto-update.js owner imported by index.html. Network-first no-store checks on load, resume, focus, online and every 5 min. Defers automatic reload when form changed; prompts before manual reload; session guard prevents automatic loops.
- No service worker or offline caching is installed. Updater behavior is **source only, not runtime/device verified**. Asset-byte manifest/integrity and deployment gates remain open.
- Candidate v0.1.5, no deployment or release promotion.

## Candidate 0.1.6 — PWA foundation
- Added standalone manifest, SVG app icon, service worker (network-first shell, offline fallback), registration and Apple standalone metadata. Scoped to flyg/; flight API responses and release.json are not cached.
- iOS-compatible PNG touch icon still needed. Installability, offline, update lifecycle and real iPhone PWA behavior are **not tested**; do not claim installable until verified on HTTPS.
- Source committed/readback PASS, no deployment.

## Candidate 0.1.7 — selected globe icon
- Chosen globe-and-airplane image #3 rendered to 180, 192, 512, 1024 PNG files in local work environment.
- Manifest, Apple touch icon, favicon, SW cache list and release asset list wired to those paths. **Binary PNG files have not been committed to GitHub**; SW install will fail until all assets exist. Do not deploy.
- Next: GitHub binary upload with blob/tree/commit/ref and tree readback, then PWA tests.

## 2026-11-14 — icon upload pending
- User selected icon #3 (white airplane in front of Earth). Four actual PNG binaries exist as generated conversation artifacts, sizes 180/192/512/1024. They are not in GitHub yet.
- Candidate 0.1.7 HTML, manifest, release.json, version.js, SW point at these exact filenames. SW install updated to tolerate missing optional PNGs during staging (readback PASS), but iPhone icon will not be correct until PNG files are committed.
- Follow `solutions/github-binary-upload/README.md`: base64 blobs -> tree -> commit -> update_ref with expected SHA -> tree verification. Do not substitute a different generated SVG or claim upload done.
- The GitHub connector accepts base64 strings, but the working container's PNG bytes have not been bridged to the connector. No deployment, no device test. Need a verified binary transfer path.

## 2026-11-14 — Canonical handoff for Work (latest)
- User requires **GitHub-first handoff**, not a separate file to download and reattach. Work must read `flyg/START_HERE.md`, `flyg/PROJECT_CURRENT_STATE.json`, this handoff, `flyg/CONTINUITY_PROTOCOL.md`, project rules, and `solutions/github-binary-upload/README.md` before changes.
- Branch `flyg-alperna-init`, root `flyg/`. Protect main, CCC, Remember, LinaSopti. Candidate 0.1.7, **NOT DEPLOYED / NOT VERIFIED**.
- User approved **icon #3: globe with airplane**. Exact 180/192/512/1024 PNG images were generated and packaged in this conversation, but binary images are **not in GitHub**. HTML, manifest, SW and release.json point at `flyg/assets/flyg-icon-{180,192,512,1024}.png`. Avoid substituting other icon designs. GitHub connector binary upload workflow exists; use verified blob -> tree -> commit -> ref with expected SHA -> tree verification.
- Recent verified commits: worldwide headline `d2c574c506d453f88495610f263abc0c4e5e8b26`; optional PNG cache nonfatal SW `84dbe9d6ce7d5d9840f62efb4db7b441d189ba11`; canonical state checkpoint updated after these. The isolated branch head can advance; verify fresh head.
- First unfinished task: upload exact four PNG binaries, verify paths/blob SHAs/sizes. Next: run JS tests, verify deployed HTTPS installability/offline/update and real installed iPhone behavior. No live flight provider selected. No claim of completed PWA or release.
- User should only need a short resume instruction, not manually attach a second handoff. The generated icon archive exists in prior conversation; if Work cannot access it, report this specific limitation and request the existing archive rather than recreating a different icon.

## Latest checkpoint — 2026-11-14 Work, v0.1.8 (supersedes pending icon notes above)
- Attached globe icon is 180×180. Same image resized to 180/192/512/1024 PNG; larger sizes are upscaled, not new artwork. Four blobs committed and Git tree SHA/size verified.
- Runtime commit a87b93b97dcfb687fad5f8fa92dbf4a108a0da32. Only flyg/ subtree published via existing ccc-demo-public-test Pages chain: bd4228563d216c1cf4b6f250309bb03a714fc7e7. No changes to other project files. URL https://container13.se/flyg/. Pages success and HTTPS browser form submit PASS.
- Syntax PASS, nine synthetic journey cases PASS. SW mock harness PASS: complete shell, offline assets/navigation, release/API bypass, scoped cleanup, explicit activation. Local Chromium blocked by environment socket permissions; real browser offline/update and iPhone tests remain UNVERIFIED.
- Added pwa.js and shared mobile-view-policy.js to offline shell; atomic install requires all shell files. Cache-first versioned shell; updater coordinates worker activation while respecting dirty forms.
- iPhone: Safari -> Share -> Add to Home Screen -> launch globe icon. Then airplane-mode reopen test. Keep candidate unpromoted until actual device evidence; live prices/provider still absent.

## Latest checkpoint — iPhone offline PASS; update test 0.1.9
- User screenshots show standalone 0.1.8 and generated search summary in airplane mode (no Wi-Fi symbol), 2026-11-14. Installation/offline form accepted.
- Candidate 0.1.9 is a deliberate version/cache bump to test existing installed-app upgrade; no flight provider or new flight results.
- Added five VM regression tests: clean reload, dirty form deferral, offline no fetch, reload loop prevention, waiting-worker activation before reload. All PASS plus existing journey/SW checks. Real iPhone update still PENDING.
- Next: publish only Flyg subtree, verify deployed bytes, then user opens existing icon online; expect 0.1.9 or Update banner. No reinstall.

## Latest checkpoint — update failure / repair 0.1.10
- User Update button reloaded but kept 0.1.8. Treat 0.1.9 iPhone upgrade as FAIL; prior VM checks did not simulate HTTP caching.
- Reproduction: cache.addAll with default request caching can populate a new named SW cache using old version.js bytes. Actual hosting headers max-age=600. Regression fails on old worker and passes on fix. Device-specific cause still needs confirmation by successful recovery.
- Fix: all 14 shell requests use cache:no-store plus release query; SHA-256 validates every body before any cache writes. A partial/stale deployment is rejected, preserving active worker. No second updater, no root SW changes.
- All JS syntax, journey, five updater cases, stale-HTTP-cache and corrupt-rollout/offline SW tests PASS. Candidate 0.1.10; actual installed-iPhone update still UNVERIFIED.
- Rollback: previous source 452e6a458038294e3c3c427850daccef4ffcd8f0, public 94bb5cad5ceccb9d4f4cb243dbf62a0a932b5d81. Only flyg subtree deployment.

## Latest acceptance — 2026-11-14
User confirms existing installed iPhone app now displays 0.1.10 after Update. Recovery/upgrade PASS without reinstall. Initial installed 0.1.8 airplane-mode search form previously PASS. Dirty-form device upgrade and offline retest specifically on 0.1.10 remain untested. PWA task checkpoint IDLE; no live flight provider connected. Next development task: authorized real flight data, baggage-inclusive fares for two and booking links. No new runtime or publication in this documentation update.

## Latest checkpoint — provider access investigation 2026-11-14
See FLIGHT_DATA_ACCESS.md. No live provider connected. Official Skyscanner audience criteria exclude this personal app; Duffel services agreement restricts metasearch, so do not select it merely based on low search price. No credentials/accounts/costs activated. Current runtime remains 0.1.10. User decision/access required: interim outbound search hub vs authorized live-data provider. Do not imply links are in-app live results.

## Latest: zero-cost only, SerpApi proof pending
User explicitly requires 0 kr setup/ongoing; account allowed. SerpApi recurring Free 250 requests/month is a candidate, NOT connected/proven. See FLIGHT_DATA_ACCESS.md. User account/key needed for one real ARN-ZRH 2-adult SEK test. No paid plan, trial-only solution, code implementation or 23kg baggage guarantee. PWA remains 0.1.10. Read costConstraint in structured state.

## Latest checkpoint — secure key collection / probe-0.1.0
- User has copied SerpApi key. Never ask to paste into chat or public source. Exact secure entry: repository Settings > Secrets and variables > Actions > New repository secret, Name FLYG_SERPAPI_KEY. URL https://github.com/container13/Container13-vintage/settings/secrets/actions/new. Field is native GitHub; no custom key-collection website.
- New workflow .github/workflows/flyg-provider-probe.yml on isolated branch only, triggered by pushes to flyg/probes/** or workflow. No PR, schedule, write permission, deploy or auto-upgrade. First run without secret is WAITING_FOR_SECRET with zero calls.
- flyg/probes/serpapi_probe.py (probe-0.1.0) checks account.json before a single fixed ARN-ZRH call. Requires plan_id=free, monthly price=0 and monthly quota>0; rejects redirects; no retries; only allowlisted summary logged, no account response/key/errors. Five guard tests PASS.
- After user saves secret, push flyg/probes/request.json checkpoint to trigger. Read workflow evidence; do not assume green WAITING_FOR_SECRET means live PASS. No perpetual backend built yet; GitHub Actions here is only proof execution. PWA remains 0.1.10.
- Supabase inventory read-only: organization Container13-Remember plan free; remember-test INACTIVE, prod ACTIVE_HEALTHY. Neither restored/modified; no new project/function/secret. Avoid coupling Flyg to inactive test or production just to collect a key.

## Latest verified result — 2026-11-14 server-side live proof PASS
User saved repository Actions secret. Run https://github.com/container13/Container13-vintage/actions/runs/43559215595 at commit 6e793ae059dff7fce944dc03e44bae3d8d0c5991, job 132338923670: five guards PASS; actual Free plan/quota checked; 248 monthly searches before exactly one fresh ARN-ZRH 2027-03-14/18 query with adults=2, SEK. RESULTS_RECEIVED, 11 priced results. Lowest returned numeric price field 3674, but price scope for 2 and 23kg each remain UNVERIFIED; never describe 3674 as all-in total. Key was masked and not read by assistant. No PWA connection/backend deployment yet. Next: verify fare/baggage semantics and build a protected zero-cost runtime path. Do not re-request key or repeat onboarding.
