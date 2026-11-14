# Shared component register — Container13 projects

Purpose: canonical ownership, consumers, version policy, exceptions and verification. Update before/with any change to a shared concern. Do not infer a PASS from a code commit.

| Concern | Canonical source | Known consumers | Version/rollout rule | Exceptions and verification |
| --- | --- | --- | --- | --- |
| All-project change process | project-template/PROJECT_MASTER_RULES.md; PROJECT_RELEASE_CHECKLIST.md | CCC, Remember, LinaSopti, new projects | Consult before change; document impacted consumers | Two failed fixes => root-cause stop; review before release |
| Mobile page zoom policy | project-template/mobile-view-policy.js | Mobile views that explicitly import it | Confirm every relevant view imports the policy | Image-only viewer opt-in; test actual iPhone |
| Reusable photo session | project-template/container13-camera-session.js | Consumers to be inventoried per project | No assumptions about integration based on existence of file | Guest and owner camera behavior must be tested separately |
| Remember design foundation | remember/remember-design.css | remember/login.html, register.html, dashboard.html, owner.html, album.html, album-admin.html | Same cache-busting version for all affected consumer views; audit on each design change | index.html, activate.html, webmaster.html and test pages are not currently shell consumers; review separately before adding |
| Remember startup/resume updater | remember/auto-update.js | Confirm imports across Remember pages before change | Network-first and safe reload; test installed PWA | Do not interrupt edits/uploads; record device test |
| CCC design system | CCC shared shell and canonical Dashboard (locate exact source before editing) | All CCC views | Match Dashboard tokens and interaction patterns | Any deliberate exception must be documented |

## Required change record
- Issue and reproduction:
- Scope: affected pages/components/devices:
- Canonical owner and actual imports:
- Existing conflicts/overrides removed:
- Change and documented exceptions:
- Versions aligned and deployed bytes checked:
- Regression checks and evidence:
- Status: CODED / COMMITTED / DEPLOYED / DEVICE TESTED / USER APPROVED:
- Repeated failure count; if >=2, root-cause report before another fix:

## Current open issue
Remember installed iPhone PWA consistently reproduces a dark bottom strip, including in an independent installed test PWA (2026-10-16: screen.height 874, innerHeight 812; separate safe-area bottom 54 CSS px). Mina album visibly repaints/repositions its background automatically; owner album requires a swipe. **Neither behavior is acceptable**: the desired shared behavior is a stationary correct background from first paint, without strip or jump. iOS 27/WebKit is a hypothesis, not a proven root cause. Two-plus speculative CSS attempts failed: **STOP further CSS-height patches**, preserve diagnostic test, investigate WebKit/viewport behavior and only propose a targeted fix with real-device evidence. See remember/DECISIONS.md and remember/PROJECT_HANDOFF_CURRENT.md latest sections. OPEN / NOT DEVICE PASS.


## Centralized update system — implementation contract
- **Template requirement:** project-template/PROJECT_MASTER_RULES.md (centralized update architecture gate).
- **Remember current controller:** remember/auto-update.js; consumer pages: index, login, register, activate, dashboard, owner, album, album-admin. remember/release.json and embedded running release IDs exist (repository candidate 0.1.60 as of 2026-10-16), but actual deployed asset-byte integrity and verified installed-PWA upgrade path remain **OPEN / NOT DEVICE VERIFIED**.
- **New-project requirement:** one canonical release ID/manifest, one shared bootstrap imported by every user-facing entry route, a single cache strategy, safe pending updates and production/device verification.
- **Maintenance rule:** when a new page is added, add it to the consumer inventory and updater integration in the same change; fail the release checklist otherwise.


## Visible version ownership
All projects: one centrally owned version/footer component per project, driven by its running release identity. Remember: `remember/remember-version.js` and `remember/release.json` own version identity; all nine production-facing HTML routes must use the version footer. `remember/remember-viewport.js` was disconnected from production after failed viewport-height mitigations and is **not** a required version-footer import. Verify actual consumer imports before changing this register. Do not claim installed-device verification until tested.

## Remember webmaster sharing — 0.1.140 (2026-10-21)
- Owner: remember/album-admin.html reuses existing loadShare/displayShare/shareRequest/copy handlers; no new backend or link-generation owner.
- Styles: remember/remember-design.css, scoped remember-admin-share-* rules. Only album-admin imports updated CSS key 0.1.140; new selectors have no effect on older consumers.
- Consumers: webmaster album; owner preview retains inline details and owner.html retains its existing poster dialog.
- Purpose: reserve sharing on explicit user request; QR/copy are modal, raw URL collapsed. Read on open only. No change to links, gallery, photobook, auth, or schedule.
- Verification: JavaScript syntax checked; DOM fixture tests and deployment recorded in current checkpoint; iPhone popup acceptance pending.
- User correction: Remember image viewer resets after 3 seconds idle; double-tap reset is not a current Remember requirement (2026-10-20 user instruction supersedes older template baseline).

## Remember webmaster administration — 0.1.141
Canonical settings UI: remember/webmaster-album-settings.js, consumed by album-admin.html only in webmaster mode. Canonical presentation: admin-* selectors in remember-design.css; affected album-admin imports CSS 0.1.141. Existing photo-gallery.js stays canonical and loads/mounts only on explicit Visa bilder in webmaster mode. Owner preview keeps eager gallery. Existing popup/camera/upload handlers are secondary tools, not duplicated. Backend candidates are review-only; new capability albumSettings defaults false. DOM/date/UTC/mock-Edge tests PASS; SQL/runtime/device checks pending. No changes to other apps.

## Remember webmaster visual polish — 0.1.142
Owner: existing admin-* block in remember-design.css, edited in place; album-admin loads CSS 0.1.142. Grid min-content track sizing and native date-value alignment constrained without clipping. Settings module localizes Europe/Stockholm and omits duplicate same-zone note; date conversions untouched. Secondary tools share one scoped rule; owner/guest tools are outside #adminExtraTools. iPhone visual PASS pending. Database permission remains pending.

## Flyg staged livesearch0.1.14
Owner: flyg/live-search.js consumed by flyg/index.html; existing style.css panels/fields/buttons reused. New flight-card block scoped to live results. No shared mobile-policy/updater implementation fork. Bootstrap still auto-update.js/pwa.js/version.js with15-resource integrity-checked SW shell. Worker SearchGate solely owns provider tokens/cache/quotas. Backend0.1.14,public frontend0.1.14, browser staged search and upgrade PASS; real iPhone/tablet/Android0.1.14 unverified. Exact-date single-airport MVP exception documented; requirements summary unchanged.


## Latest 0.1.19 — selection feedback, 2026-11-14
Reproduced on0.1.18: outbound selection succeeded but new heading was above viewport (top -83px,936px viewport). Canonical live-search.js now gives inline loading/error feedback at clicked button and reveals/focuses next-stage heading. selection-feedback.js is presentation-only, imported before live-search.js; no second search owner or updater. Invalid max price is explicitly reported before selection. Source e9f12bb5465e00de7f076fd7dfe0fc46c14e8866; public e8e0a11f7faf0da29bc9a4f13db41c4fac7742aa; Pages43569118594 SUCCESS. All16 HTTPS release assets SHA256 match local. Four new selection-feedback tests plus updater/SW/journey suites PASS. Browser0.1.19 actual cached BGY Välj utresa -> Välj hemresa PASS; heading focused at15.94px inside936px viewport. Loading/error presentation verified by unit tests. Backend17/free quota unchanged. Installed iPhone19 UNVERIFIED; do not promoteCURRENT. Next user tests existing installed app online, version19; no reinstall. Exact carrier baggage eligibility/all-in total remains UNKNOWN.


## Latest0.1.20 — compact destination/start view2026-11-14
User wants only destination visible until changing choices. Alperna preselected in tripRegion menu; Maldiverna,Thailand,Zanzibar,Mauritius,Seychellerna,Karibien,Mexiko listed as disabled upcoming destinations (backend still Alps/Europe; no false active search). Native details#searchChoices hides both existing forms, all fields and requirements summary by default. External liveSearch submit button uses form=liveForm so search stays visible. No duplicated controls or search owner; original IDs/values retained. Invalid controls expand settings before validation/focus; valid search collapses settings, results remain outside. Installation instructions also native collapsed details. Owner index.html/style.css; live-search.js owns validation/reveal; same single updater. Changed scope only flyg; all16 shell assets preserved; version20. Structure parser, JS syntax and existing selection/updater/SW/journey suites PASS. Source 987631639d6362ec311f33f4bcc759211b17824d, public a06c833e5145edef4ce5b19d1e172f77d4915a49. Deployment/browser verification pending; iPhone20 remains UNVERIFIED. Backend17/no plans or keys changed.

Verification completed: Pages43569684218 success,16 asset hashes PASS; browser collapsed default, preserved5100 on search and hidden invalid5050 recovery PASS. iPhone20pending.
