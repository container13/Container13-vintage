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

## Latest — fare scope verified, 23kg remains unresolved
Evidence: flyg/evidence/fare-details-2026-11-14.json. Details run43559500002, pinned one-adult run43559664340 PASS. Same KLM itinerary 1840SEK one adult vs3680SEK two, roundtrip. Outbound14Mar2027 ARN06:25 AMS08:35/09:40 ZRH11:00; return18Mar ZRH14:20 AMS16:00/17:05 ARN19:05. Fare scope supported for this exact offer, not inferred globally. Booking policy ONLY '1 free carry-on'; absence of checked-bag detail is UNKNOWN, not proof of included or excluded23kg. Quota244 observed. No PWA integration; next obtain authoritative checked-bag weight/add-on cost before promising bag-inclusive total. Workflow now only triggers on request.json changes; code/docs changes no longer send provider searches. Free-only guard and no key logging retained.

## Latest: exact KLM Standard price blocked (2026-11-14)
Official KLM ticket/baggage pages confirm Economy Standard/Flex 1 checked bag max23kg. This does not establish that observed3680SEK fare is Standard or includes23kg. Booking homepage https://www.klm.se/ returned site-served Access Denied in cloud browser; one reload same outcome. Did not classify bare denial as proven bot challenge, bypass, probe alternate KLM booking routes or buy anything. Exact bag-inclusive price remains UNVERIFIED. No new provider calls. Current free source has not satisfied full baggage-inclusive comparison requirement; do not label the app live/all-in ready. Primary sources: https://www.klm.se/information/ticket-services/ticket-options and https://www.klm.se/en/information/baggage/checked-baggage-allowance.

## Latest: manually verified Swedish bag-inclusive quote (2026-11-14)
Expedia.se public UI review page confirms the exact same KLM ARN-ZRH roundtrip 14–18 March 2027, outbound06:25–11:00 and return14:20–19:05 via AMS: selected fare Standard, first checked bag included23kg, two adults2840SEK each, trip total5680SEK including displayed taxes/fees. Standard selected for both directions. Quote observed manually, no booking/payment/passenger data submitted. Swedish market quote supersedes preliminary USD569.60 display; do not currency-convert or treat different market prices as identical. Compared with API base3680SEK, this observed offer is2000SEK higher in total. No transfer/hotel feasibility verified. This proves an offer can be inspected manually, NOT that SerpApi supplies Standard upgrade prices or can automate bag-inclusive searches. API integration remains unresolved; no extra API requests, no runtime changes, zero-cost requirement unchanged. Never publish session journey tokens/URLs. Next: determine a documented free automated branded-fare/baggage price path, or explicitly limit live results to unverified baggage pending manual confirmation.

## Latest runtime implementation checkpoint — 2026-11-14
Backend candidate0.1.11 committed d465d6b83e3b483d8d3ec892500b0b9ddfc96e78 on flyg-alperna-init, files flyg/server/{worker.mjs,worker.test.mjs,wrangler.jsonc,preflight.py,README.md}. Twelve Node mock tests PASS; JS/Python syntax and disabled Worker target guards PASS; all server files exact GitHub readback PASS. Staged outbound -> returns -> details, fixedARN/two adults/SEK, single SQLite Durable Object quota180/month20/hour, serialized requests/cache, no client key/raw booking token, UNKNOWN baggage and hotel transfer. Origin guard is NOT authentication; bounded free quota can be exhausted by other clients. No full-all-in promise.
BLOCKER: read-only hosting preflight run43561640258,job132346435924 returns Cloudflare subscriptions HTTP403 with existing deployment token. Prior run43561373708 also failed. Cloudflare dashboard checked: logged out at https://dash.cloudflare.com/login. No Worker, namespace, DNS, plan or runtime secret changed; no provider calls; public PWA remains0.1.10. Do not bypass cost verification or request SerpApi key again. Need user/account evidence Workers Free (or authorized subscription read) before isolated deploy. Next after resolved: deploy disabled Worker, inject existing GitHub Actions secret server-side, bounded live verify, then wire/update/test/publish PWA. Do not claim livesearch is connected.

## Latest completed implementation — 2026-11-14,0.1.14 (supersedes hosting blocker)
User screenshot IMG_4260.png shows Workers Free,$0,Current plan; accepted evidence. No more plan/key onboarding. Separate Worker https://flyg-search-api.mangaj73.workers.dev deployed via existing Actions credentials; provider key injected server-side without assistant reading it. Backend commit317309aa8925954222ad6bd58c8bbf7e64a68d71,run43563231253 success. Public UI commitd2f8497540a04bc674a318084ab253b27df793d1,Pages run43563481145 success; sourceb16c882093bbd95c3cdce8caff5c3adb1df804d1.
Root cause of initial failed searches: Workers does not implement redirect:error and throws before network I/O. Official https://developers.cloudflare.com/workers/runtime-apis/request/ confirms. Fixed to manual plus reject all non-2xx, no redirects/key forwarding. Regression test fails old behavior,13 backend tests PASS. Global persistent reservations now precede account checks so failures count;180/month20/hour. Node tests are insufficient for runtime compatibility: verify target runtime.
Actual browser0.1.14 PASS:11 outbound results ARN-ZRH14–18Mar2027/two, selected KLM ARN06:25->ZRH11:00 viaAMS; return14:20->19:05 viaAMS; booking sellerKLM3680SEK roundtrip/two; only1freecarry-on. Checked23kg and transfer UNKNOWN explicitly shown. Cached replay all3stages PASS; no extra provider query for local cache replay. All15 deployed release files SHA256 byte-match PASS. Existing browser updated0.1.11->0.1.14. Real installed iPhone0.1.14 still UNVERIFIED; do not promoteCURRENT yet.
MVP limitation: exact dates and one airport roundtrip chosen explicitly; weeks/multiple airports/open-jaw not automatically compared. Requirement-summary form preserved. Airport/date suggestions are not fullski recommendations; no verified hotel-arrival/3ski-day guarantee. Google link opens same search, not guaranteed exact fare/booking. Free-only guard, unknown-baggage and no paid upgrade remain.
Next: user opens existing installed app online, checks0.1.14 and tests Sök aktuella flyg. No reinstall. Then improve coverage/baggage/transfer as separate scoped work. No other project or account plan changed.

## Latest0.1.15 — all-airports and cheapest-first PASS2026-11-14
User corrected Zurich-only search and requested cheapest-first. Live airport selector now includes all, defaults/synchronizes to requirements, no hardcodedZRH. Client searches23alp airports in8 groups of <=3 validated codes; backend uses documented comma-separated arrival_id and sort_by2. Existing180/month20/hour Free guards unchanged; partial/failed/unsearched coverage explicitly shown, never claimed complete. Source835afc19587ae30579ea7fe699d8bbb3e5870ab9; backend run43564377349 success. Publice69c5aa57da461881e04ae84f40c40dd47675578; Pages run43564396245 success. Exact GitHub readbacks PASS;15 HTTPS assets SHA256 match PASS;15 backend tests plus journey/update/SW suites PASS.
Browser0.1.15 evidence: successful query coverage all23,94 offers, DOM all94 prices nondecreasing. FirstBGY1808,then1886,thenVIE3156,thenMXP3444. Prices are unverified-baggage source quotes, NOT complete23kg-inclusive totals. All currently in explicitly labelled unknown-baggage section. Selected cheapestBGY -> returnFR3655 Thu18Mar18:50->ARN21:35 -> Ryanair1808SEK two roundtrip; baggage policies carry-on332–958 and checked572–1598 ranges, no verified23kg scope. Do not add ranges to base or assert final total. Back twice restores all94 without provider calls. Existing same-airport roundtrip restriction remains; week/open-jaw/transfer automation unimplemented. User-installed iPhone0.1.15 pending; do not promoteCURRENT. No new accounts/plans/key request.

## Latest0.1.16 — editable max price2026-11-14
User asks max5000kr editable in100kr increments. Implemented default5000SEK total for TWO, min100/step100/numeric keyboard. Same live results filtered locally for outbound/returns/booking details; no provider calls on editing. Existing quote-only bag-unknown limitation explicit. Source265ee763888b772935b6e1fe22af5d098be1780f,public18b826077884fe40150ef1396db433f3b29f7e60,Pages run43564996553 success. Backend0.1.15 unchanged.15 deployed assets exact SHA256 match PASS; exact source/public readbacks PASS; JS syntax and updater/SW/journey regression PASS.
Browser0.1.16 PASS: default5000,ArrowUp->5100;94 fetched offers filtered59<=5000 ascending;1800->0 with useful empty message;1900->2 (1808/1886); fetchedAt unchanged on edits; restored5000 and59 sorted offers. Max applies returned quote, NOT guaranteed total including unknown checked baggage. User preference persisted searchDefaults.maxPriceForTwoSEK5000/maxPriceStepSEK100. Installed iPhone0.1.16 pending; do not promoteCURRENT. No new provider plan or credentials.

## Latest0.1.17 — selected-flight link repair2026-11-14
User iPhone screenshot IMG_4261.png showed generic Google start screen/1traveler/no dates after opening link. Root cause: client constructed q-only general search URL; it did NOT encode actual selected flights and was never a reliable booking link. Removed at all stages. Backend details now expose exact provider search_metadata.google_flights_url only after allowlist validation: HTTPS www.google.com,/travel/flights or /travel/flights/booking,tfs required,no secret/api-key params. URL retained as returned, no guessed tfs construction. Public Google navigation token is allowed only in this validated navigation URL; SerpApi credential/raw provider selection tokens remain server-side. If absent, UI states exact link unavailable, never falls back to generic page. Details cache versioned to avoid reusing prior bodies missing link; outbound/return cache preserved.
Sourceb6db083b0a8d9cd1144c9a710d797f52a7ac33f9,backend run43565788012 success; public674ebd05ab2ce14c3c7a45f61811d567569796b0,Pages run43565792586 success.16 backend tests plus journey/updater/SW PASS;15 deployed HTTPS assets SHA256 match; exact GitHub readbacks PASS.
Actual frontend0.1.17 browser click PASS: link opened Google Itinerary summary,Selected flights,2passengers. Expanded cards confirm FR4680 ARN06:15->BGY09:00 Sun14Mar2027 andFR3655 BGY18:50->ARN21:35 Thu18Mar2027. Ryanair seller1808SEK; another agency1778 lowest shown, so itinerary link does not lock seller/price. No booking/purchase or Continue pressed. Screenshot saved as task proof. Real iPhone0.1.17 link acceptance still pending. Next user opens installed app online/updates17,reselects outbound/return,opens Öppna valt flyg i Google Flights.

## Ryanair23kg policy verified — 2026-11-14
User requested official Ryanair lookup after Google screenshot IMG_4262.png displayed checked-bag1598SEK per person for whole trip. Official https://help.ryanair.com/hc/en-gb/articles/12888036565521-Ryanair-s-Bag-Policy explicitly offers one23kg checked bag per passenger. https://www.ryanair.com/gb/en/useful-info/help-centre/terms-and-conditions says23kg only available at initial booking and charged per one-way flight. Official fees table https://www.ryanair.com/content/ryanair/gb/en/useful-info/help-centre/fees.tab-content.html lists23kg28.99–80.99EUR/GBP per bag/flight, dependent on dates/route. These are generic rules/ranges, not exact ARN-BGY14–18Mar2027 quotes. Google's generic20kg description is incomplete relative to current Ryanair policy. Assistant earlier arithmetic1808+2*1598=5004SEK is conditional on that Google allowance, NOT a verified23kg-inclusive total. Do not label Google1598 as23kg from generic carrier eligibility; exact selected23kg price remains open. No runtime change/provider API calls or purchase in this lookup.

## Latest0.1.18 — revised baggage requirements and fee visibility2026-11-14
USER CHANGED minimum to19.9kg CHECKED PER PERSON (20kg qualifies), superseding23kg default. Ski additionally requires pjäxor in a SEPARATE CABIN BAG plus an EXTRA SMALL PERSONAL ITEM. New independent checkbox defaults true/true for ski; football keeps no checked bag,boot bagfalse,personal itemtrue. Requirements summary/live stages include all3; do not treat generic carry-on inclusion as proof both cabin pieces fit/are allowed together. Exact boot bag weight/dimensions remain unknown.
Source013c3a52885555cf2f6a1a900689333f9c3d5edd,public253b510fc76fd589ef6648751d06a1313d8e845c,Pages run43568078744 success. Backend0.1.17 unchanged. Source/public exact readbacks PASS;15 HTTPS release asset hashes match; JS syntax and SW/updater/journey regressions PASS. Browser0.1.18 default19.9/boots=true/personal=true PASS; summary records all3; real singleBGY outbound/return/details PASS. Ryanair fee strings are translated to clear cabin332–958SEK and checked572–1598SEK price intervals, weight not specified; source route-specific policies fallback displayed when present. No fee summation or scope/eligibility inference. Earlier flight cards explicitly explain available fees fetched after selecting return; do not imply all94 fares were enriched automatically. Existing exact Google itinerary link preserved.
This is preference and presentation implementation; carrier eligibility, cabin dimensions/weight and exact both-direction/person fee scope are STILL UNKNOWN, not a matching-filter PASS. General carrier20/23kg availability alone does not associate a source fee with a specific allowance. Installed iPhone0.1.18 pending. Next user device test then allowance/fee verification. No new provider calls merely to display/edit requirements; real smoke used normal staged requests within existing Free guards.


## Latest 0.1.19 — selection feedback, 2026-11-14
Reproduced on0.1.18: outbound selection succeeded but new heading was above viewport (top -83px,936px viewport). Canonical live-search.js now gives inline loading/error feedback at clicked button and reveals/focuses next-stage heading. selection-feedback.js is presentation-only, imported before live-search.js; no second search owner or updater. Invalid max price is explicitly reported before selection. Source e9f12bb5465e00de7f076fd7dfe0fc46c14e8866; public e8e0a11f7faf0da29bc9a4f13db41c4fac7742aa; Pages43569118594 SUCCESS. All16 HTTPS release assets SHA256 match local. Four new selection-feedback tests plus updater/SW/journey suites PASS. Browser0.1.19 actual cached BGY Välj utresa -> Välj hemresa PASS; heading focused at15.94px inside936px viewport. Loading/error presentation verified by unit tests. Backend17/free quota unchanged. Installed iPhone19 UNVERIFIED; do not promoteCURRENT. Next user tests existing installed app online, version19; no reinstall. Exact carrier baggage eligibility/all-in total remains UNKNOWN.


## Latest0.1.20 — compact destination/start view2026-11-14
User wants only destination visible until changing choices. Alperna preselected in tripRegion menu; Maldiverna,Thailand,Zanzibar,Mauritius,Seychellerna,Karibien,Mexiko listed as disabled upcoming destinations (backend still Alps/Europe; no false active search). Native details#searchChoices hides both existing forms, all fields and requirements summary by default. External liveSearch submit button uses form=liveForm so search stays visible. No duplicated controls or search owner; original IDs/values retained. Invalid controls expand settings before validation/focus; valid search collapses settings, results remain outside. Installation instructions also native collapsed details. Owner index.html/style.css; live-search.js owns validation/reveal; same single updater. Changed scope only flyg; all16 shell assets preserved; version20. Structure parser, JS syntax and existing selection/updater/SW/journey suites PASS. Source 987631639d6362ec311f33f4bcc759211b17824d, public a06c833e5145edef4ce5b19d1e172f77d4915a49. Deployment/browser verification pending; iPhone20 remains UNVERIFIED. Backend17/no plans or keys changed.

Verification completed: Pages43569684218 success,16 asset hashes PASS; browser collapsed default, preserved5100 on search and hidden invalid5050 recovery PASS. iPhone20pending.


## Latest authoritative checkpoint — Work2026-11-14 backend0.1.29
Supersedes BLOCKED_DEPLOY and old START_HERE0.1.20. Frontend remains0.1.28; prior user screenshot confirms installed version. Backend0.1.29 from59888cb2c2d17deec067dae9ef747a28243f3af4 deployed by43588143545 SUCCESS to existing flyg-search-api. All24 backend tests PASS; stale test rejecting canonical CSV FR corrected. Same secrets, Free plan, DO binding/global-v1/schema preserved; single deploy with keep-vars and observed existing enabled=true; no disable/inject-secret sequence.
Live public POST with Origin container13.se: ARN to TRN,MXP,BGY14–18March2027,2adults,SEK,excludeFR ->10offers, no FR segments;207Free remaining observed. Exact replay cached:true, identical fetchedAt/results/quota;1800second expiry. No INVALID_AIRLINES. Historical lastFailure in /health remains timestamped09:41; it is not a new failure. Python urllib public call403 occurred at Cloudflare edge; curl actual request200, no security bypass used.
Old flyg-resort-static-check workflow hardcoded0.1.24 and attempted auto-committing candidates. Retired mutation job and obsolete generation; now syntax/mock tests/whitespace only. Canonical integrity/drift guard remains read-only;43588143619 PASS. Frontend unchanged, CURRENT/PREVIOUS not promoted from backend smoke. Next: installed iPhone0.1.28 search acceptance. Baggage-inclusive totals and hotel transfers remain UNKNOWN.


## Latest authoritative checkpoint —2026-11-14 frontend0.1.31
User IMG_4277 exposed missing journey filters: AF1230 landing23:00 after12h15 inCDG was offered because live-search only filtered price/carriers. Fixed canonical journey-engine.checkSchedule and live rendering. Airport cutoff20:00 default, same-day arrival, reject landing at/after hotel deadline22:00, apply direct-only; add editable4h default maximum layover for both directions. Unknown timetable hidden; transfer and hotel arrival remain explicitly UNVERIFIED. No fabricated transfer duration or claim of all-criteria eligibility. Filters rerender fetched results locally; calendar still preliminary until actual flights selected.
Sourcef26702aadf4973ee85477da3988bb778b14126da; public51daa57ac981448690a0ee4713712d2b7afd4d8d; Pages43589293287 SUCCESS. Exactly6Flyg runtime files changed.18published asset/manifest SHA256 PASS. All backend/journey/schedule/week/selection/update/SW regression suites PASS; updated stale week test fixture for existing carrier/resort controls and added immediate-filter/no-extra-provider-call case. Browser existing0.1.28 ->0.1.30 ->0.1.31 observed; real TRN,MXP,BGY14–18Mar excludesFR:4of10 visible; first retainedAF1130 arrival11:45. Screenshot23:00 itinerary hidden. Editing layover1h->1offer,4h->4offers verified immediately on0.1.31. Prior0.1.30 numeric change waited for blur;0.1.31 uses input event and is final candidate.
Backend0.1.29, secrets, Free plan and30min server cache unchanged. User screenshot proves previous backend repair works on iPhone0.1.28. iPhone0.1.31 upgrade/search still pending. CURRENT/PREVIOUS not rotated. Next user opens existing icon online and expects0.1.31. Baggage-inclusive total, verified resort transfer/hotel deadline and full ski days remain unfinished.


## Latest authoritative checkpoint —2026-11-14 frontend0.1.32
User priority: same-evening arrival at resort in time to check in, eat dinner and sleep; city first-night fallback only, city after skiing preferred. Added source-backed Cervinia road estimates in existing journey engine: official resortTRN102/MXP136/LIN149min; operatorBGY170min. See TRANSFER_PLANNING.md. Add editable60min airport/baggage+30road margin+30checkin. Default dinner target20:00, hard hotel cutoff22:00. Estimates are NEVER verified transfers, booked availability, exact hotel/traffic or total prices. Other resorts/public transit remain UNKNOWN in separate collapsed list. Later arrivals only shown as optional collapsed reserves with extra-night/full-ski-day warning.
Source12066815a600699ca1af6e070b06a4f42ab7274c; publicf02fc969da44d2ead0530202dd74b56cc8cc18ed; Pages43590271969 SUCCESS. All60 backend/UI engine/week/update/SW checks PASS.18 published asset/manifest hashes PASS. Browser0.1.32 actual14–18Mar TRN,MXP,BGY excludingFR:3of10main; AF1130landing11:45 ->estimated15:31resort/16:01ready. Dinner16:00->1offer;restore20:00->3;optionalreserves2;publictransit0primary/4unknown. Restored defaults. No extra API calls for setting edits; same backend0.1.29/Free/secrets/30min cache. Only7publicFlygtextfiles changed. iPhone0.1.32 acceptance remains pending;CURRENT/PREVIOUS unrotated. Next: device acceptance and broaden sourced transfer coverage; verify real transfer availability/costs/baggage/full ski days before a complete trip recommendation.


## Latest authoritative checkpoint —2026-11-14 frontend0.1.33
User IMG_4278 requested times on date cards when calendar prices differ30SEK. Calendar feed has no timetables. UI now fetches matched outbound then selected return before showing local start/end times, stops, segments, trip-specific roundtrip quote for2 and resort arrival estimate inline. Calendar floor retained as separate label. No guessed times/combining unrelated fares. At most3distinct date pairs auto-enriched when a resort selected, max2search requests each; additional rows on demand, no query on filter edits, Free-only/cache unchanged. Existing price/carrier/arrival/resort constraints used; no qualifying route displays a clear message. Date list remains in history; choosing matched trip goes to details.
Sourced25d46525a09ba20532d92cacd631a17744dd852;public355519f6543a3cc50be4a4eb07fab1e7aaf51cfe;Pages43591060305 SUCCESS.61tests PASS;18published hashes PASS; integrity/staticCI PASS. Browser0.1.33Cerviniaweek11:17cards.16–20MarMXP3410calendar/3414matched,06:10–11:45out,06:30–11:55back.14–18Mar3440calendar/3636matched.15–19Mar3440calendar/3462matched,06:00–10:30out,20:45–23:25back. Last two compared plans have different dates; do not present them as identical flights. Selected15–19 ->details contextPASS; actual source returned no seller options but exactGooglelink existed. No seller-price or all-in guarantee. Back restored17cards and all timings, no new search.
Only4runtimeFlygfiles changed. Backend0.1.29 unchanged; no secrets/plans/other projects changed. User-installediPhone0.1.33 acceptance remains pending;CURRENT/PREVIOUS not rotated. Next device acceptance; baggage/ground costs/availability/full skiing and city-night feasibility still open.


## Latest authoritative checkpoint —2026-11-14 frontend0.1.35
User continued fromv33. Added canonical journey-engine.skiTrip: planned full ski dates, max nights through home arrival (overnight flight counts), final city night after skiing vs direct resort return, earliest hotel departure. Defaults09–16ski day,hotel07:00earliest,airport120min,city-airport90min are editable PLANNING ASSUMPTIONS,not actual timetables/carrier rules/lift hours. Cervinia->Milano146/Turin101min uses operator's city-to-Cervinia road estimate in reverse as explicit assumption. Hotel/transport availability,endpoints,weather,ground/baggage/hotel prices remain unknown. See TRANSFER_PLANNING.md.
Matched returns now reject too-early hotel departure,insufficient ski days,excess nights/city deadline failure. All fetched return alternatives retained for local re-selection on input changes. Same model in inline calendar,manual return selection,and details. Browserv34 caught calendar3410becoming4182after feasible return while another trip3462was better; finalv35 sorts matching known quotes first and separates unchecked calendar-only rows. No global cheapest/all-in claim.
Source4ed9f7af3274c0998397d2de702652a9a82e1a77;public7813e4265fb2a9a007ac4e4f4fa34ac6199fe038;Pages43592210140 SUCCESS.72tests PASS;18published asset/manifest hashes PASS;final integrity/staticCI PASS. Realv35Cerviniaweek11:matched prices3462,4006,4182ascending. Cheapest15–19Mar out06:00–10:30,return20:45–23:25;planned ski16/17/18Mar;leaveCervinia18Mar16:00,estimateMilano18:56,last city night,hotel departure19Mar17:15. These are model assumptions/source fare quotes,not bookings. Earliest02:00 restores cheap06:30return;07:00excludes it.4skiDays->0selectable;restore3/direct/city PASS;no new queries on edits. Calendar->outbound->returns->details cached sequence carries plan;Back3times restores17cards.
Only7publicruntimeFlygtextfiles changed;backend0.1.29,Free,secrets,30min cache untouched. iPhone0.1.35 remains pending;CURRENT/PREVIOUS unrotated. Next device acceptance,broader transfer coverage and actual all-in baggage/ground/hotel validation. First-night city fallback remains unverified; current complete model concerns resort-first/final-city-night or direct return.


## Latest authoritative checkpoint —2026-11-14 frontend0.1.36
BINDING USER UPDATE supersedes fixed4nights and defaultcity:3whole ski days suffice; one extra night is welcome even about1000SEK MORE WHOLE-TRIP TOTAL FOR TWO. City night optional,useful near early flight but can precede late flight too; skip it when direct resort departure permits calm breakfast. No hard08–12rule.
Implemented4+5night calendar variants,8query jobs/batch,per-airport/duration completion/resume,no repeated completed jobs; toggling extra off skips pending longer jobs. First3time-enriched date pairs deliberately cover base and extra variants. Model allows5nights with3ski days;additional skiing optional. AUTO prefers direct after breakfast(default09:00),otherwise city;explicitcity valid at any qualifying flight time. Resort earliest07:00/city05:00 are editable planning assumptions. Existing source road estimates and unknown transfer constraints unchanged.
Incremental estimate requires qualifying MATCHED baseline plus explicitly entered whole-trip hotel,ground,baggage,other cost DIFFERENCES for TWO. Blanks stayUNKNOWN,signed savings permitted. Never infer1000compliance from cheaper fare alone or from calendar-floor comparison. Unknown extra-night cards separate;over-estimate not selectable as compliant. These are user estimates,not hotel quotes or verified all-in totals. See TRANSFER_PLANNING.md.
Source796e2f5030643576312e7fb932221f6049b9aa50;public32f7936a0be39f236001f073c47a4024b149ad6b;Pages43594560066SUCCESS.84tests PASS;18published hashes PASS;integrity/staticCI PASS. Browserv36Cerviniaweek11:35cards spanning4/5nights;off17/on35 without new search;auto direct after breakfast;explicit city with later flight supported;restoredauto. Temporary TEST inputs hotel-difference1200,other0 gave906within1000 and1576over1000 relative matched baseline4182. All test cost inputs CLEARED afterward;real hotel/ground/bag costs remainUNKNOWN. No booking.
Only7publicFlyg runtime textfiles changed;backend0.1.29,Free,secrets,30min cache untouched. iPhone0.1.36pending,CURRENT/PREVIOUS unrotated. Next device acceptance,actual cost sources and broader verified transfer coverage. First-nightcity remains unverified fallback,not an automatically validated package.
