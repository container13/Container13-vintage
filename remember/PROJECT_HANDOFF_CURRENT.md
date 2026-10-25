## 2026-10-25 – 0.1.203 login method cleanup
- Removed obsolete `backMethods` button and click handler from login.html; preserved signup, password login and recovery. Candidate awaiting CI/Pages and iPhone verification. CURRENT/PREVIOUS remain null.
- Next: free-album quota tests, then configurable free-photo limits.

## 2026-10-24 – 0.1.202 screenshot detail corrections
- Removed manually inserted duplicate version label; existing global version display retained. Removed overlapping decorative image icon from album title field. Tightened vertical gap between primary CTA and 'eller'/login while preserving one unified card. No auth, database, quota, or photobook engine changes.
- Pending CI/Pages and mobile visual check. Follow-up free-album quota verification and configurable global/per-user photo limits.

## 2026-10-24 – 0.1.201 iPhone screenshot visual corrections
- Removed decorative guest-choice glyphs; retained native radio inputs and labels. Removed overlapping email icon, tightened radio rows and quality disclosure. Wrapped form and login footer in one shared card with an internal 'eller' separator. Moved version label below card away from Safari toolbar. No backend or photobook engine changes.
- Await CI/Pages and iPhone visual verification. Follow-up: free-album quota tests and configurable global/per-user photo limits.

## 2026-10-24 – 0.1.200 approved create-album visual redesign
- Implemented approved mockup in register.html: refined hero, warm translucent form, icon-decorated name/email inputs, aligned date/duration, subtle info divider, compact illustrated guest review choices, dark green 30-photo disclosure and joined login footer. Native inputs, radio state, date prefill, submit/auth and backend untouched. No database changes.
- Pending: CI/Pages, mobile screenshots, iOS datetime picker, review radios, quality disclosure, logged-in and logged-out states; check long emails and small screens. Follow-up free album quota tests and configurable photo limits.

## 2026-10-24 – 0.1.199 create album form refinement
- Native datetime-local prefilled from the user's device local clock once on page open, preserving later manual edits. Guest-review choices and email field compacted; photo-quality details placed in accessible expandable disclosure with 30-photo headline always visible; login/footer spacing tightened. No changes to creation flow, auth, backend or photo-book engine.
- Verify mobile date rendering and interaction, native datetime picker, review choice, details disclosure, logged-in and guest views. Pending CI/Pages and user approval.
- Follow-up unchanged: verify default/per-owner free-album quotas and implement configurable global/per-owner photo limits (30 default).

## 2026-10-24 – 0.1.198 compact create album fields
- Create album form: reduced name field height, grouped start datetime and upload duration side by side with responsive layout, tightened header and form spacing. Preserved existing native datetime and duration controls, validation, guest review selection and onboarding behavior. No Supabase changes.
- Follow-up: verify free album quotas and implement configurable global/per-owner photo limits (default 30). Candidate pending CI/Pages and mobile screenshot.

## 2026-10-24 – 0.1.197 offer leaf overlap fix
- Based on 0.1.196 mobile screenshot, moved flower into separate upper area, headline and quote below it, CTA toward bottom. Landing CSS only; footer and approved photobook engine unchanged.
- Pending: release safety, Pages, mobile visual check. Follow-up: test free-album quotas and implement global/per-user photo quota settings.

## 2026-10-24 – 0.1.196 landing offer and footer visual refinement
- Adjusted offer-leaf quote and center group spacing to avoid the bottom decorative border; refined CTA and footer buttons. Landing CSS only: no flip engine, database, album or quota mutations.
- Pending next: test default and per-user free-album limits; add webmaster-configurable free photo counts, global and per-user, retaining 30 as default. Verify 0.1.196 CI/Pages and screenshot before approval.

## 2026-10-23 – 0.1.195 newest album owner preselection
- Owner dropdown preselects the most recently NEW album owner, derived from existing server-sorted newest-first album catalog by tracking each owner's oldest appearance. Loads selected user's server-verified free quota automatically. Explicit manual selection is preserved during the session. No Supabase changes. Candidate awaiting CI/Pages and mobile verification.

## 2026-10-23 – 0.1.194 compact dropdown alignment
- Owner dropdown now displays only email (no album count in options). Quota dropdown narrowed to 62px; both native selects have equal 52px height and open on direct tap. No database changes or quota mutations. Candidate awaiting CI/Pages and mobile verification.

## 2026-10-23 – 0.1.193 dropdown 0–9
- Changed webmaster individual quota input to native select 0–9, with narrow right-hand column, wide owner selector, and client-side 0–9 validation. No Supabase schema/function changes; existing server maximum remains unchanged for backward compatibility. Release candidate pending CI/Pages and mobile verification.

## 2026-10-23 – 0.1.192 compact inline owner quota
- Condensed webmaster individual quota UI into one mobile-friendly row: album-owner dropdown left, numeric max free albums right, compact save/reset beneath. Numeric input disabled until a user is resolved. Existing backend authorization and quotas unchanged. Candidate awaiting CI, Pages and mobile verification.

## 2026-10-23 – 0.1.191 compact album owner dropdown
- 0.1.190 CI/Pages PASS. Replaced tall owner cards and filter with native mobile-friendly select listing unique owners from existing authorized album catalog. Selecting an owner loads server-verified free quota; existing fallback exact-email search retained. No Supabase changes. Candidate awaiting CI/Pages and mobile test.

## 2026-10-23 – 0.1.190 album-owner picker
- Webmaster quota UI now derives selectable distinct owner emails from the existing authorized webmaster album catalog. No new Supabase endpoint or user-directory permissions. Existing exact-email lookup remains for users without albums. No album or quota mutations. Candidate pending CI, Pages and UI validation. Album list counts may include paid albums and are labeled as total albums, while server lookup gives authoritative free count.

## 2026-10-23 – 0.1.189 release guard repair
- 0.1.188 hotfix failed version bump guard (runtime changed without release.json). Following mandatory rule every runtime change bumps version, 0.1.189 synchronizes all HTML and gallery cache keys. Await CI and Pages verification.

## 2026-10-23 – 0.1.188 CI hotfix
- Release Safety failed because gallery imports remained at 0.1.187 after version bump. Corrected all three to 0.1.188 without changing gallery logic or incrementing release number (same unreleased candidate). Reverify CI and Pages.

## 2026-10-23 – 0.1.188 individual free album limits
- 0.1.187 release safety and Pages PASS. Production migration remember_individual_free_album_limits_0188 applied: private per-user quota table, webmaster-only lookup/set/reset RPC, atomic album creation honors override before global limit. Production remember-webmaster Edge Function deployed v5 with authenticated lookup/save/reset actions. Dashboard includes email search, count, effective quota, save and reset. No existing albums changed. Candidate UNVERIFIED pending CI/Pages and functional authorization tests. Previous 0.1.187 remains known CI PASS.

## 2026-10-23 – 0.1.187 gallery cache-key CI fix
- Diagnosed 0.1.186 GitHub Actions failure at Check photo gallery import cache keys. Guest/owner/webmaster imports still used 0.1.182. Synced all three to 0.1.187 and release metadata/cache keys across nine HTML entrypoints. No photo-gallery engine or Supabase changes. Candidate UNVERIFIED pending CI, Pages and device tests. Next: verify release safety and global quota, then implement individual overrides.

## 2026-10-23 – 0.1.186 free-album quota
- Installed Supabase migration remember_free_album_quota_webmaster_20261023: remember.albums.plan_type (free default/paid reserved), remember.global_settings.free_album_limit (initial 2), webmaster-only RPC read/write, and atomic free-quota check in remember_complete_album_registration using per-owner advisory lock. Existing albums preserved. Deployed remember-webmaster Edge Function v4 and remember-onboarding v3. Webmaster dashboard provides minus/plus/input/save. Paid albums excluded by plan_type; no payment feature implemented. **CI/Pages, webmaster save and user E2E tests pending.**

## 2026-10-23 – 0.1.185 date summary
- Contextual labels Öppnades/Öppnar and Stängdes/Stänger; compact two-column date display; edit fields toggle via Ändra tider. Preserves existing extension, saving, and forced-close controls. Pending CI/Pages and iPhone acceptance.

## 2026-10-23 – 0.1.184 compact album header and overview
- Shared CSS only: smaller webmaster badge, shorter album heading preserving prominent title, tighter Dashboard link, two-column compact overview with owner full-width, subtle upload status, larger image count, small timezone. Shared role-switch button spacing refined. Cache keys refreshed for all nine views. No auth, behavior, gallery or photobook changes. Await Actions/Pages and iPhone visual acceptance.

## 2026-10-23 – 0.1.183 webmaster album visual polish
- Shared remember-design.css updates: dark high-contrast save button, compact date fields and extension actions, accessible toggle, tidier tool group. Refreshed stylesheet cache keys to release 0.1.183 across views. CSS-only, no behavior/auth/DB changes. Pending CI/Pages and iPhone acceptance.

## 2026-10-23 – 0.1.182 stale photo-gallery cache hotfix
- iPhone screenshot unchanged after 0.1.181 despite successful CI/Pages. Root cause: owner.html, album.html and album-admin.html imported photo-gallery.js?v=0.1.179, bypassing updated module. Bumped all three import cache keys to 0.1.182 and added release guard to ensure cache keys match manifest. 0.1.181 gallery swipe and control changes preserved. Pending CI/Pages and iPhone validation.

## 2026-10-23 – 0.1.181 mobile gallery gesture and controls
- iPhone screenshot showed swipe threshold too long and close/crop buttons clipped at right edge. Reduced swipe threshold from 50% to 25% of viewer height. Viewer used width:100vw together with padding:14px and inherited content-box, making fullscreen layout wider than viewport; enforce border-box and max-width and explicitly position controls within safe areas. Same shared gallery for all roles; photo book unchanged. Await CI/Pages and iPhone acceptance.

## 2026-10-23 – 0.1.180 photo gallery hotfix
- Root cause: four literal \\n sequences in initial comment of photo-gallery.js commented out SWIPE_SETTLE_MS, SWIPE_RETURN_MS, SWIPE_THRESHOLD_RATIO and ENDPOINT. Replaced with real newlines. Reviewed 28 active HTML/JS files for same declaration pattern; only gallery affected. Added regression guard in release safety workflow. Candidate UNVERIFIED pending Actions/Pages and iPhone tests; no database or photobook changes.

## 2026-10-23 – gemensamt bildsvep 0.1.179
- Shared photo-gallery.js: 50 % av viewer-höjd krävs för att byta foto. Släpp före halvvägs ger animerad återgång 380 ms; efter halvvägs mjukare sidbyte 680 ms. Samma beteende i gäst, albumägare och webmaster. Pinch/pan och fotobokens motor oförändrade. iPhone-test och Actions-verifiering kvarstår.

## 2026-10-23 – 0.1.178 preflight-korrigering
- Rättade escapning av radslut i sync-release.py:s --bump/--write-läge. Ingen runtime-logik ändrad. Invändar CI och Pages.

## 2026-10-23 – release preflight 0.1.177
- Behåller GitHub Pages 'Deploy from a branch' och ändrar inte publiceringsinställningarna. Infört lokalt preflight-kommando som höjer patchversionen och synkroniserar nio HTML-sidor, release.json, JS-fallback och statusfil före atomär commit. Riktiga negativa tester kontrollerar att versionsdrift upptäcks. GitHub Actions är efterhandskontroll; inte teknisk publiceringsspärr.

## 2026-10-23 – Release guard 0.1.176
- Added canonical version sync/check script (remember/scripts/sync-release.py). GitHub Actions rejects drift and runtime edits without a version bump. Negative test fixtures check rejection of mismatched versions. Atomic commit includes all nine HTML entrypoints, fallback, manifest, state and handoff. Release is NOT accepted until CI and Pages green; Safari test pending.
- GitHub Pages default publishing is independent of this safety workflow: without branch protection or gated deployment configuration, a red safety job cannot technically prevent Pages publication. Enable required status check/controlled deployment separately.

## 2026-10-23 – versionssynkronisering 0.1.175
- Atomär release: synkroniserade release.json, nio ingångssidors remember-release och cache keys för auto-update.js/remember-version.js, gemensam fallback och PROJECT_CURRENT_STATE.json. Ändringen löser konstaterad release-drift; inväntar GitHub Actions safety PASS och mobilkontroll. Ingen ändring av fotobok eller bilddata.

## 2026-10-23 – owner thumbnail grid 0.1.174
- Korrigerade CSS för direktinloggad albumägares gemensamma galleri: 2-kolumners miniatyrer, bildkort och överlagrad papperskorg. Det gemensamma svepet är oförändrat. Verifiering i mobil och Actions återstår.

## 2026-10-23 – owner gallery unified (0.1.173)
- Direktinloggad albumägare använder nu samma `mountRememberGallery` som gäst/webmaster, inklusive vertikal bildsvepning och separat papperskorg via `remember-owner-manager`. Granskningsdialogen behålls separat. GitHub commit 05750eb. iPhone-test och Actions-resultat ännu inte verifierade.

# Remember – aktuell överlämning
Senast uppdaterad: 2026-10-23. Dokumentationsrelease: **0.1.179**.
**Läs denna fil först vid ”Fortsätt Remember”.** Den ersätts med senaste läget; den ska inte växa som en arbetslogg. Äldre versioner finns i Git-historiken.

## Projekt och miljö
- AKTIV UTVECKLING / TEST, INTE LANSERAD.
- Repo: container13/Container13-vintage. Aktiv arbets- och publiceringsgren: `ccc-demo-public-test`. Mapp: `remember/`.
- Webb: https://container13.se/remember/
- Ordinarie Remember: `wykvztfmfbboxiqvuvwr`. Separat testprojekt: `kauxrvshxgpbvptdwhog`. Kontrollera miljö före ingrepp.
- Starta med aktuell branch, `release.json` och `PROJECT_CURRENT_STATE.json`; verifiera verkligheten före nästa ändring.

## Senaste läge och evidens
- 0.1.168: 30 gratisbilder i mobil/digital kvalitet, längst1920px; publik formulering **Testa gratis**.
- Uppgradering förbättrar inte redan uppladdade bilder; original måste laddas upp på nytt. Högupplöst betaluppladdning är ännu inte implementerad.
- Installerad SQL-migration20261022112631: gräns30, bild31 nekas gäst/ägare/webmaster; återförsök tar ingen extra plats. Fyra befintliga gratisalbum höjda;13 bilder/13 objekt bevarade enligt installationsrapport.
- 0.1.168 Pages-körning **39771164981 SUCCESS** för commit `17a1365062c033b730751187c7abb72b23445bd7`, självständigt återläst2026-10-23. Tidigare samtal rapporterar livefiler verifierade; ingen ny live-bytejämförelse eller databasinspektion i denna dokumentationsändring.
- 0.1.169: kort löpande överlämning och obligatorisk sparrutin införs. Endast dokumentation och versionsmetadata; ingen funktions- eller Supabaseändring. Kontrollera denna commits GitHub/Actions separat.
- CURRENT/PREVIOUS är fortsatt null; grön CI är inte iPhone-godkännande.

## Kvar och nästa steg
1. Läs tillbaka denna dokumentationsrelease och kontrollera dess CI. Återuppta därefter första relevanta öppna punkt nedan; gör inte om redan accepterade breda tester.
2. Riktat iPhone-test: text vid Skapa album / Så fungerar Remember i .168 eller senare, hörnpapperskorg från .166 och tydligt granskningsval från .165. Dessa saknar dokumenterat nytt enhetsgodkännande.
3. Funktionellt iPhone-test av nytt öppet/granskat album och godkännande kvarstår separat. Automatisk72h-rensning är inte installerad; lova den inte.
4. Full releasepromotion har separata grindar. Läs RELEASE_PROMOTION.md och kontrollera dess äldre miljöuppgifter mot aktuell branch.
- Inget aktivt kamera-/uppladdningsjobb eller påbörjat destruktivt test har startats i denna ändring.
- Övriga önskemål/öppna kontroller: CHECKLIST.md och senaste strukturerade fält i PROJECT_CURRENT_STATE.json. Äldre daterade fält är historiska, inte nya uppdrag.

## Obligatorisk löpande sparrutin
- Uppdatera **denna samma fil** efter varje ändring, meningsfullt test och publicering samt före längre eller riskfyllda steg. Vänta inte på att chatten ska bli full eller på en begärd överlämning.
- Spara aktuell uppgift, version/kod-SHA, miljö, klart/verifierat, pågående/overifierat, eventuellt hinder och **ett konkret nästa steg**. Vid avbrott: IN_PROGRESS eller UNVERIFIED, aldrig PASS utan evidens.
- Spara checkpointen på GitHub och läs tillbaka exakt innehåll innan den kallas sparad. Lokal text och enbart chatten räcker inte. Om sparandet misslyckas: säg vad som inte är sparat.
- Håll PROJECT_CURRENT_STATE.json konsekvent. START_HERE.md och README.md ska länka hit, inte innehålla konkurrerande nulägen.
- Knyt en dokumentationsändring till ett nytt versionsnummer enligt Remember-regeln, men skapa inte en oändlig kedja av versioner bara för att notera samma commits readback.
- Detta är en arbetsrutin för assistenten, **ingen installerad bakgrundsautomation**. Arbete efter senast lyckade GitHub-sparning kan behöva återkontrolleras.
- Ny chatt: läs denna fil, kontrollera branch/release/verklig drift och fortsätt från första ofärdiga steg.

## Beslut för senare
Projektägaren2026-10-23: inför samma enkla löpande överlämning i **alla projekt och projektmallen**, stegvis. Endast Remember ändras nu. Uppgiften ska följa med i kommande överlämningar tills respektive projekt/mallen är uppdaterad.

## Regler och underlag vid behov
- ../project-template/PROJECT_MASTER_RULES.md, PROJECT_RELEASE_STANDARD.md och CONTINUITY_PROTOCOL.md.
- CHECKLIST.md, DECISIONS.md, OPERATING_LIMITS.md och RELEASE_PROMOTION.md.
- free-tier-30/README.md:30-gräns, verifiering och rollback.
- PHOTO_DELETION_0.1.161.md och guest-modes-candidate/INSTALLATION_2026-10-22.md: berörda funktioner.
- Äldre arbetslogg och detaljerad iPhone-evidens: PROJECT_HANDOFF_HISTORY_THROUGH_2026-10-23.md. Beslut om pausad iOS-systemremsa och skydd för godkända funktioner gäller fortsatt.
- Separat teståterställning är pausad, inte ett nytt jobb: simuleringen är USER-REPORTED PASS; kör inte om den enbart på grund av chattbyte. Testets befintliga karantän-cron får inte ändras utan kontroll av återaktivering och explicit uppdrag.
- Separat Remember Test/återställning: RECOVERY_CHECKPOINT.md; tillämpa inte testprojektets återställningsinstruktioner på ordinarie Remember.
- Skydda andra projekt på den gemensamma grenen, befintliga bilder och godkända funktioner. Minsta ändring=ny version; rapportera COMMITTED, DEPLOYED, RUNTIME PASS och DEVICE PASS separat.


## 2026-10-23 – Guest link first-time fix (0.1.170)
- Verified Halloween 2026 and Bruket med granskning had no guest_links or vault entries; Bruket utan granskning had both.
- Root cause: get returned needsReplacement for missing link regardless of first-time vs lost link; UI always warned about older link, and guest preview could not open without token.
- Deployed remember-share-manager edge function version 5, adding neverCreated when no guest_links row exists.
- Updated album-admin.html to show first-time Create guest link with no rotation warning, and clearer guest preview missing-link message.
- No guest links, albums, or photos modified in database. Await iPhone end-to-end test; CURRENT/PREVIOUS not approved.

## 0.1.172 – bildvisare (ej enhetstestad)
- Flyttade den gemensamma helskärmsvisaren till document.body för att undvika albumägarens överordnade layout/stacking context som kan få svep att påverka bakgrunden. Gäst och ägare använder samma touchlogik. Kod COMMITTED, enhetstest PENDING. Kontrollera Actions och prova albumägarens vertikala svep samt gästens funktion. 

## 0.1.171 – bildvisare
Helskärmslager och bakgrundslås för albumägarens och gästens bildvisare. Papperskorg och sveplogik oförändrade. Kräver iPhone-verifiering och gröna Actions-kontroller.
