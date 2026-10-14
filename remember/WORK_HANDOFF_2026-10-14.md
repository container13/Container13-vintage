# Remember – överlämning till ChatGPT Work (2026-10-14)

## Läs först
1. Läs denna fil och `remember/DESIGN_AND_ALBUM_THEMES.md`.
2. Kontrollera aktuellt repo och gren innan någon ändring. Repo: `container13/Container13-vintage`, gren: `ccc-demo-public-test`.
3. Läs projektets CURRENT_STATE/INSTALLATION_CHECK och relevanta projektmallar/masterregler innan utveckling. Kontrollera externa tjänster, anslutningar och behörigheter tidigt.
4. Bevara all befintlig funktionalitet. Minsta faktisk ändring = nytt versionsnummer. Rapportera bara verifierade resultat; inga påståenden om publicering utan kontroll.

## Bakgrund och designbeslut
- Remember är en återanvändbar albumtjänst för fester/resor, utvecklad ur Micke50.
- Godkänd riktning: varm, fotografisk och nostalgisk, träbord med utspridda fotografier och mjukt gyllene solljus. Elegant Remember-typografi; mindre, balanserade rubriker och formulär, halvtransparenta mörkbruna paneler. Den tidigare skissen är referens; ändra inte till en generisk mörkgrön app.
- Fem fotografiska bakgrunder till APPENS vyer (inloggning, Mina album/dashboard, Skapa album, Titta på minnen, Inställningar/profil). De är separata från albumteman. Använd rena bilder utan inbakad UI/text, mobil/surfplatta/dator, läsbar överläggstoning.
- Albumägare ska kunna välja per-album-tema (Nostalgi, Fest, Semester, Bröllop, Natur, Minimalistiskt) eller eget foto som bakgrund, med förhandsvisning, beskärning/positionering, läsbarhet och möjlighet till omslag. Gäller även delad albumvy, inte appens övriga vyer. Behörighet och lagring ska verifieras före implementation.
- Mobilvyer får inte nypzoomas utom uttryckligen tillåten bildvisning. QR-gäst ska kunna se/ladda upp enligt albumregler utan att behöva logga in. Albumägaren anger e-post. Tyst retry vid tillfälliga avbrott.
- Följ projektmallar för samma utseende, mobilregler, tydliga hjälptexter och kopierasymbol när användaren ska kopiera föreslagen text.

## Faktiskt genomfört och verifierat i GitHub
- `remember/DESIGN_AND_ALBUM_THEMES.md`: beslut och avgränsningar dokumenterade.
- `remember/remember-design.css`: delad grunddesign skapad, internt märkt v0.1.17.
- `remember/login.html` och `remember/dashboard.html`: delad CSS länkad och body-klassen `remember-shell` införd på grenen. Dashboardens synliga versionsetikett ändrad till 0.1.19. Dessa ändringar har kontrollerats genom återläsning från GitHub, INTE visuellt i webbläsare.
- Inloggningens gamla Unsplash-bakgrund ligger fortfarande i tidigare CSS. Nya bilder är INTE bekräftat uppladdade till GitHub. Färdig visuell publicering är INTE verifierad.
- Inga albumtema-databasändringar eller fullständig UI-implementation har verifierats.

## Bildpaket och omedelbart nästa steg
- Bildpaket: `remember-bakgrunder.zip`, fem WebP-bilder. Bifoga paketet i Work; förlita dig inte på att det finns i GitHub. Originalreferenser kan också finnas i chatten.
- Använd Work för att packa upp och ladda upp exakt fem WebP-bilder i `remember/assets/backgrounds/` på `ccc-demo-public-test`. Bevara kvalitet. Kontrollera filnamn, faktiska filstorlekar och att GitHub kan servera bilderna.
- Koppla därefter bilderna till rätt appvy i delad CSS/HTML, avlägsna gamla bakgrundsberoenden och verifiera publicerad mobil- och desktopvy. Bevara befintlig auth, album, QR och gästfunktioner.
- Fortsätt sedan med albumteman först efter kontroll av Supabase-datamodell, RLS, lagring och behörigheter.
- Var särskilt noga med att det användaren godkänner visuellt är det som faktiskt implementeras. Visa aldrig en illustrerad mockup som om den vore verklig produkt. Användaren har uttryckligen sagt att fler illustrationer inte behövs.

## Övrig funktionell bakgrund att kontrollera mot CURRENT_STATE
- Album med namn och tidsfönster; fest ca 24 h, resa plus 24 h, webbmaster kan ändra tider. QR/länkdelning, mobilvänlig foto-uppladdning, komprimerad lagring.
- Plan: gratis 10 bilder med uppgraderingsmöjlighet; kontrollera om implementerat innan påstående.
- Inloggning med lösenord och e-postlänk finns i projektet. Tidigare test har bekräftat att album kunde sparas och delningslänk fungerade; kör om relevanta tester innan release.
- En äldre Supabase-installation/åtkomst har verifierats tidigare, men kontrollera aktuell behörighet och miljö igen.

## Överlämningsregel
Vid nytt chattbyte: läs detta dokument, DESIGN_AND_ALBUM_THEMES, aktuell state, faktiska källfiler och senaste commits. Fortsätt från verifierad status, inte från antaganden. Dokumentera varje betydande beslut, implementering, test och kvarstående fel i GitHub.


## Latest checkpoint — 2026-10-14 — UI 0.1.20 (supersedes older next-step directives)
User authorized exact five-image upload/mapping and subsequently a broader concrete improvement review. Candidate0.1.20 prepared with original WebP assets, shared background mapping and warm legible panels. Existing profile is the Dashboard details section; its open state uses profil.webp. No new illustration or theme/database implementation. Old login Unsplash background removed; welcome-book photos are content and preserved.
Concrete fixes: broken CTA CSS from literal backslash-n; silent album-list error→visible retry; registration waits for initialization; owner upload goes directly to existing guest link, without automatic replacement. Auth/API permissions, camera, quota, album storage and QR generation are preserved.
Source/fixture tests PASS; publication/readback still pending at this checkpoint. See BACKGROUND_VERIFICATION_0.1.20.md for exact assets, tested viewport/fixture scope and remaining device/E2E gates. Actual Supabase preflight is schema10,2 albums,3 ready photos and private bucket, superseding earlier counts only; no backend writes. Full release remains PENDING/UNVERIFIED.


## Publication evidence — 2026-10-14
- Runtime commit: `732369e79e6c5071af3288e1bed4b4bc030cf210` on `ccc-demo-public-test`.
- Exact GitHub readback PASS for all17 paths (5 binary assets +12 text files). Tree matched local expected tree exactly. Ref updated with expected SHA, no force.
- Pages run `38568594091`: completed/success for the runtime commit.
- All5 public assets: HTTP200, image/webp, decoded as valid WebP, exact original bytes. All6 HTML files +shared CSS also match public bytes exactly.
- Actual Chrome desktop at container13.se: login0.1.20, correct photographic background visible, SDK initializes/enables login controls, no horizontal overflow. Registration correct background, controls and SDK initialization PASS. Album with no guest token shows denial and hides upload.
- Actual HTTP negative regression: owner-manager/list without session401; photo-gallery without session401; guest-metadata invalid token200/found=false. No privileged bypass and no test writes.
- Responsive mobile/tablet checks are the21 local rendered fixtures listed above, not live physical-device PASS. Additional live testing through local headless networking was unavailable; cloud Chrome desktop provided actual client evidence.
- Authenticated live album/QR/upload regression and physical iPhone/Android remain UNVERIFIED. Overall product stays PENDING; this is a scoped deployed UI improvement.
- Documentation-only verification updates do not change version0.1.20.


## Latest user correction and candidate 0.1.21 — 2026-10-14
User says ordinary accounts must see no webmaster information and the0.1.20 mobile Dashboard is too busy with very blurry backgrounds. Screenshot observed: duplicate Mina/Dina album headings, two help paragraphs, expanded welcome/identity card. Source diagnosis: four supplied motifs have only469–762px width, background cover enlarges them and their upper room/window areas are already deliberately out of focus; backdrop blur further softens panel regions.
Implemented: one Mina album heading, album list and create CTA; account identity/password/logout folded under Konto. Warm design retained; effective panel backdrop filters removed. Reuse the existing approved1536×1024 inloggning.webp across app shell views, center/bottom mobile crop. The other four original images are retained unchanged for future higher-resolution replacements. This supersedes0.1.20's per-view/profile motif mapping; no new illustration or synthetic enlargement. Physical perceived sharpness remains user acceptance, not guaranteed.
Webmaster tools are default-hidden on login and Dashboard and revealed only after existing remember-webmaster installation_status endpoint returns HTTP success AND authorized===true. Ordinary403 and service error produce no technical text in normal UI. Shared helper is remember-account-access.js. Session changes hide tools immediately; stale async role/action replies cannot reveal the previous account's tools. Protected backend endpoints still authorize every operation; no backend permission/database changes.
Tests:21 rendered fixture states at mobile/tablet/desktop, no overflow; eight role fixtures across both pages (403,503,200, delayed positive response after logout); regression of login choices, album retry, account folding, owner QR/upload navigation, legacy-link protection, invalid guest link, registration initialization/error and portrait/landscape overflow. STATIC/FIXTURE PASS; publication and live check pending. Real ordinary/webmaster authenticated tests and physical-device acceptance still pending. No real data or links changed.


### Publication evidence0.1.21
Runtime commit9002051bc7aa7ea36a514c2eac80cb315fd02d66; exact GitHub readback14 files PASS; Pages38571568443 success. All eight runtime files (six HTML, CSS, shared role helper) served exact bytes. Actual live Chrome login shows0.1.21, SDK ready, effective backdrop-filter:none and adminHidden:true. Anonymous live smoke only; authenticated ordinary/master cases are fixture PASS, not actual user-session PASS. User must reload the existing page to review compact/sharper Dashboard0.1.21 and ordinary-account role visibility. No new link or credential required. Physical-device and full product acceptance remain UNVERIFIED.


## Latest checkpoint — UI0.1.22 — 2026-10-14
User supplied actual Dashboard0.1.21 screenshot and says top looks visually dull. Presentation-only refinement: centered serif Remember identity with discreet byline and warm divider, smaller album title, accessible42px home icon link and44px collapsible Konto pill. No additional explanatory text or duplicate headings. Existing high-resolution background and no-blur policy retained. No changes to page scripts, server role helper, auth, album/QR/data behavior. Shared CSS header/cache/version labels0.1.22. Rollback f07a309222b73fb713a4dea349bfe8832518a6ae.
21 fixture render states at390×844,820×1180,1440×900 PASS, no horizontal overflow; Dashboard script exact equality PASS; git diff --check PASS. Publication/readback pending at checkpoint. Actual authenticated Dashboard appearance and physical iPhone acceptance remain user gate; source fixtures are not DEVICE PASS. Full product remains PENDING.


## Final header candidate0.1.23 — 2026-10-14
Extra320px rendering found0.1.22 brand/home overlap: fixed minimum font42px exceeded reserved header space.0.1.23 scales brand32px–56px with viewport width. Final28 rendered fixture states across320×568,390×844,820×1180,1440×900 PASS with no horizontal overflow; narrow Dashboard visually inspected with clear logo/home separation. Page scripts and role helper unchanged.0.1.22 runtime commit72b993279e5cb6d1657bd6bd280624e6d512053a is superseded for this header.0.1.23 readback/deploy/live pending at checkpoint. Actual user visual/device acceptance remains pending; no full release promotion.


### Publication evidence0.1.23
Runtime commit1e4b4119ccb65202ee4cf0a6c4d0a177eba886ff; exact GitHub readback12 changed paths PASS; Pages38573323203 completed/success. Public Dashboard, shared CSS and login exactly match current files. Actual Chrome login0.1.23 initializes; webmaster tools hidden. Header reviewed in28 rendered fixture states including320px; actual authenticated Dashboard/device visual acceptance remains user gate. Full product still PENDING. All page scripts and shared role helper unchanged from0.1.21. Documentation-only evidence updates preserve version0.1.23.
