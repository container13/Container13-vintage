# Remember – aktuell överlämning

## Starta här
Läs ../project-template/PROJECT_RELEASE_STANDARD.md, PROJECT_MASTER_RULES.md och PROJECT_RELEASE_CHECKLIST.md. Läs sedan README.md, DECISIONS.md, IDEBANK.md och PROJECT_CURRENT_STATE.json. Kontrollera branch-head, verklig deploy och klient innan fortsatt arbete. Sök ../solutions/ för verifierade lösningar.

## Produkt
Container13 är varumärket. Remember är arbets-/mappnamn. Adress avsedd: https://container13.se/remember/. Fiskeresa är första pilot. Gratis upp till 10 bilder, därefter eventuell betaluppgradering. Se DECISIONS.md för fastställt kontra öppet.

## Nuvarande leverans
remember/index.html är en fristående UI-prototyp kopierad från test/micke50-produkt/ med Remember-branding. Formuläret förhandsgranskar lokalt, skapar inga verkliga konton eller album. Micke50-originalet och tidigare test är orörda.

## Nästa steg
Verifiera faktisk deploy/UI och mobil; inventera befintlig backend innan registrering. Auth, kvoter och betalningar är HIGH-risk. Håll COMMITTED, DEPLOYED, RUNTIME PASS och DEVICE PASS åtskilda. Fortsätt från första ej verifierade steg, aldrig genom att återuppfinna ett parallellt system.

## Backendinventering och nästa kontroll
Micke50 har Supabase Storage och en separat admin Edge Function; dessa får inte användas som gemensam oskyddad fler-album-backend. Se BACKEND_ARCHITECTURE.md för ett föreslaget separat albumregister, ägarautentisering, skyddad gästdelning, atomisk kvot och betalningsflöde. Detta är en designkandidat, inte implementerat. Nästa steg: bekräfta faktisk hosting/testmiljö och Supabase-åtkomst, besluta albumens synlighet, därefter bygg och verifiera en isolerad migration med RLS och uppladdningsreservationer. Live- och enhetstest saknas fortfarande.

## Senaste beslut: tidsfonster
Alla med en delningslank eller QR kan delta under oppet fonster. Fest och brollop: 24 timmar fran start. Resor: fran start till 24 timmar efter slut. Sedan fortsatt visning men ingen uppladdning. Agaren kan stanga tidigare. Designbeslut, inte implementerat.

## Webmaster schedule requirement
Webmaster has secure, server-enforced authority to edit any album's upload window, close/reopen it and restore defaults after creation. Keep audit log and separate owner defaults from webmaster overrides. This is documented only; not implemented or deployed.

## Webmasterpanel prototyp
remember/webmaster.html är en fristående responsiv DEMO med tre påhittade album, statusfilter, tidsredigering, stäng/öppna och lokal ändringshistorik. Ingen inloggning, riktig albumdata, beständig lagring eller backend finns i denna vy. Nästa steg är säker serverauth/rollstyrning och verifierad backend; aldrig exponera riktiga administratörsåtgärder via demon.

## Backend draft checkpoint
Added remember/sql/001_schema_DRAFT.sql and SECURE_BACKEND_NEXT.md. Neither is deployed/executed. Dedicated schema with default-deny RLS and webmaster audit is only a candidate; review in isolated test project before API/auth and real UI data. Do not connect webmaster demo to production directly.

## Serverfunktion kandidat
supabase/functions/remember-webmaster/index.ts har förberetts som en separat, EJ DEPLOYAD kandidat. Den verifierar Supabase-session och webmasterroll före listning; skrivåtgärder är medvetet blockerade tills atomisk databastransaktion och audit finns. Ingen isolerad Supabase-testmiljö kunde verifieras i repositoryt. Micke50 är orört.

## Supabase-portabilitet
Remember-webmaster använder gemensam serveradapter supabase/functions/_shared/remember-supabase.ts. remember/SUPABASE_PORTABILITY.md beskriver byte av projekt via miljöinställningar. Kod endast COMMITTED-kandidat, inte driftsatt. Flytt av befintliga data kräver separat migration.

## Installationskontroll (kodkandidat)
Ny skyddad installation_status i Remember-webmasterfunktionen, schema-versionmarkör 002_version_marker_DRAFT.sql och INSTALLATION_CHECK.md. Endast GitHub-kod, ingen migration eller deploy. Kontroll av tabeller/version ersätter inte RLS- och säkerhetstester.

## Gemensam kopieringsregel
Projektmallen kräver kopieringssymbol med fungerande kopiering direkt efter varje föreslaget värde eller text som användaren ska klistra in på annan plats. Regeln gäller alla projekt, inte bara Remember.

## Verifierat nuläge 2026-10-13 02:46 (ersätter äldre ej-installerat/ej-driftsatt-status)

- Separat testprojekt: container13-remember, ref wykvztfmfbboxiqvuvwr, organisation Container13-Remember. Micke50 orört.
- Basdatabas installerad med godkännande; 006 strukturell kontroll 12/12 true; högsta version 1. Faktiska skrivskyddade RPC-rolltester PASS (008).
- remember-webmaster driftsatt från kanonisk serveradapter/handler. HTTP-negativtester: 401 utan session, 401 ogiltig JWT, GET 405, OPTIONS 204 med snäv CORS, otillåtet Origin POST 403.
- remember/login.html kandidat 0.1.1 är live. Godkänd Site URL och exakt allowlist https://container13.se/remember/login.html sparade. Inga wildcard-returadresser.
- Användaren valde nilsmagnusalvin@gmail.com som testkonto. Inbjudan skickad, e-post och inloggning bekräftade i Supabase. Verifierat UID 75b71f6c-97b7-4de1-ad14-292b4af4e1fa.
- Före roll: verklig användare rapporterade HTTP 403, kontot saknar webmasterbehörighet.
- Separat godkänd 009_test_webmaster_REVIEW_FIRST.sql körd. En medlemsrad exakt återläst. Rollen saknar automatisk utgångstid. 007 för Holmen-adressen har INTE körts.
- Auktoriserad RPC testad via service_role: role_check authorized=true; installation_status ready=true, schemaVersion=1; list authorized=true, albums=[].
- Verkliga webbtester rapporterade av användaren: installationsstatus “Webmasteråtkomst godkänd (schemaversion: 1.)”; Visa album “Webmasteråtkomst godkänd.” Detta är USER PASS för det begränsade läsflödet; det senare HTTP-innehållet fångades inte oberoende.
- Resultaten är inte verifiering av komplett Remember-drift. Inga riktiga album, lagring/uppladdning, atomisk 10-bildersgräns, tidsändringar, betalning eller verifierad enhetsmatris ännu. Full release förblir PENDING/UNVERIFIED.
- Fortsätt från nästa albumlivscykelsteg med befintlig auth/RPC. Kör aldrig om basinstallation eller rolltilldelning blint. Se PROJECT_CURRENT_STATE.json för aktuell evidens.

## Faktiska resultat – migration 2, 2026-10-13

Godkänd 010 installerad i container13-remember (wykvztfmfbboxiqvuvwr): Success. 011 assertions PASS; kompletterande 012 trip/fishing/timezone/type/party-end assertions PASS. Alla testskrivningar återställdes. Separat readback: total_albums=0, test-ID:n saknas, högsta schemaVersion=2. Nya create-RPC: anon/authenticated nekas, service_role tillåts. Läs-RPC installation_status: authorized=true, ready=true, schemaVersion=2, expectedVersion=2. Ursprunglig säkerhetskontroll006: åter 12/12 true (versionsrad1 finns kvar; högsta version2 kontrollerades separat).

Detta är installerad och databasprovad funktion, inte verifierad HTTP/UI-albumskapning. Verklig samtidighet från två klienter, create-API/klient, storage, uppladdningskvot, gäståtkomst och schemaändringar/audit återstår. Befintlig läs-API är fortsatt driftsatt. Inga album/testdata finns kvar. Micke50 orört. Återkör inte migration010; den avvisar version>=2. Aktuell evidens finns i PROJECT_CURRENT_STATE.json.

## Faktisk verifiering 2026-10-13 (ersätter äldre ej-kört/ej-driftsatt-status)

Användaren godkände test013/014/015 och villkorad API-deployment. Två färdigladdade SQL Editor-anslutningar visade samtidigt Running. A PID34280 gav created=true; B PID34281 gav created=false för samma album-ID a2c13000-0000-4000-8000-000000000040. Avgränsad städning genomförd; separat/efterföljande readback totalAlbums=0,testAlbumCount=0. Ett tidigare varv kontrollerades och städades före den tydligt överlappande körningen.

Remember-webmaster0.1.3 driftsatt i samma separata testprojekt efter godkända DB-resultat. Deployerad kodeditor matchade kandidatbundlen exakt. Faktiskt create_album utan användarsession gav401 Authentication required, x-remember-version0.1.3. Klient0.1.3 är publicerad; form visas först efter verifierad auth/roll och serverns createAlbum capability. Verklig auktoriserad HTTP/UI-skapning, retry och mobilform återstår; ingen komplett produktrelease verifierad. Schema2 och auth-testrollen kvarstår. Micke50 orört. Se PROJECT_CURRENT_STATE för nästa steg.


## AKTUELL HANDOFF — 2026-10-13 kväll (ersätter äldre "Nästa steg" ovan)

**Källstatus:** dokument- och GitHub-kodinventering, INTE ny live-/Supabase-verifiering. Äldre avsnitt ovan är historiska checkpoints. `PROJECT_CURRENT_STATE.json` är föråldrad för den senare utvecklingen och får inte användas som ensam aktuell status. Ingen CURRENT/PASS-promotion utan verklig verifiering.

### Beslut som ska bevaras
- Remember är pilot för en **ny, förbättrad och framtida gemensam kamera**. Vi beslutade uttryckligen att inte kopiera CCC:s gamla kamera som färdig lösning. Kamerakärna/granskning ska vara separerade från uppladdning.
- Webmaster ska, efter säker serverbaserad behörighetskontroll och tydlig information till användare, kunna administrera och hämta bilder från **alla** album. Albumägare hanterar egna album; gäster får endast tokenbaserad åtkomst. Detta senare användarbeslut ersätter motsägande formuleringar i `project-template/CONTAINER13_SYSTEM_LIBRARY.md`; dokumentkonflikten återstår att rätta i kanoniskt bibliotek.
- Behåll befintliga album (bl.a. **Bergeforsen 2026**), länkar och foton. Ändra inte Micke50 eller CCC oavsiktligt. Mobil sidnypzoom av, uttryckligen tillåten bildzoom endast i bildvisare.
- Radering, sessionsrensning och faktisk publicering kräver separat bekräftelse. `Godkänn valda` betyder inte publicering.

### Kodläget vid GitHub-inventering
- `remember/camera-session-test.html` är kamerans prototyp med granskning. Knappen **Ta bort markerade** har ersatt **Ta bort senaste** i grenens kod. Detta är **inte verifierat i live-UI**: användaren såg fortfarande den gamla knappen även efter Remember-uppdatering.
- `remember/album-admin.html` och `remember/album.html` bäddar in kameran med versionsparameter `?embedded=1&v=b5bfe3d` efter tidigare cachefelsökning. Parametern är inte bevis för att live-klienten hämtar korrekt innehåll.
- Kamera/granskning har ännu inte verifierad serveruppladdning till album; `remember/deploy/remember-photo-upload_REVIEW_ONLY.ts` är en kandidat, inte bevisat deployad. Markera aldrig fotosession som publicerad utan backend-bekräftelse.
- `remember/dashboard.html` är inte verifierad vanlig albumägarvy; den bygger på äldre webmaster-gateway. Faktisk rollseparation kräver servergranskning.
- Remember har egen uppdateringsknapp men uppdateringskedjan är **inte verifierad**. Granska rotens `sw.js`, dess registrering/scope, `ignoreSearch:true`-cacheuppslag, eventuella root-PWA-styrningar, assetversioner, GitHub Pages och den faktiskt körda iframe-versionen innan ytterligare cachepatchar. Ändra inte CCC:s root-service-worker utan konsekvensanalys.

### Nästa säkra arbetsordning
1. Läs gemensam standard, solutions, denna handoff och berörda Remember-specifikationer; jämför med faktiskt repo och live innan kodändring.
2. Kartlägg exakt aktiv uppdaterings-/service-worker-/iframe-kedja och förklara varför användaren såg gammal kamera. Ingen ny spekulativ cacheparameter.
3. Säkerställ korrekt dokumentation av det nya kamerabeslutet och webmasterbehörigheten i kanoniska regler utan att försvaga befintlig backend/RLS.
4. Koppla och verifiera den nya kamerans valda bilder till **säker** albumuppladdning, inklusive serverkvot, privata objekt, bekräftelse, idempotens och mobiltest. Ingen osäker genväg för att få knappen att fungera.
5. Uppdatera `PROJECT_CURRENT_STATE.json` med enbart återläst, verifierad aktuell evidens efter teknisk inventering. Historiska migreringsuppgifter får inte skrivas över som om de aldrig skett.

**Risk:** HIGH för auth, data, uppladdning, service worker och releasekedja. GitHub-dokumentationsändring ensam är LOW. Nuvarande projektstatus: UNVERIFIED, inte CURRENT.


### Användarverifiering — kameraknapp och cache (2026-10-13)
Efter ändringen av rotens `sw.js` (commit `235372a9fb990ae1e77f5680e5cc937698ddf8e2`) rapporterade användaren uttryckligen: **"nu syns ta bort markerade"**. Detta är USER PASS för att den uppdaterade knappen visas i Remember på användarens enhet. Orsakssambandet till service-worker-ändringen är sannolikt men inte isolerat bevisat; fullständig regressionskontroll av CCC, SW-aktivering och säker albumuppladdning återstår. Markera inte kameran eller Remember som helhet CURRENT/PASS på denna grund.


### Säker uppladdning — faktisk READ-ONLY preflight 2026-10-13
- Direkt i Supabase-projekt `wykvztfmfbboxiqvuvwr`: schemaVersion=5, album_count=1, photo_rows=0, bucket `remember-private-photos` saknas. Inga skrivningar utförda.
- Aktiva Edge Functions: `remember-webmaster`, `remember-guest-link-webmaster`, `remember-guest-metadata`; `remember-photo-upload` saknas.
- Källkandidater: `remember/sql/022_guest_photo_reservation_MIGRATION6_REVIEW_FIRST.sql`, `024_private_photo_bucket_REVIEW_FIRST.sql`, `025_photo_upload_transitions_MIGRATION7_REVIEW_FIRST.sql`, `remember/deploy/remember-photo-upload_REVIEW_ONLY.ts`. Dessa är INTE installerade/deployade.
- Säkerhetsgrind: nuvarande kandidat saknar komplett serververkställd albumunik SHA-256-dubblettkontroll, verifierad idempotent återhämtning/reconciliation och komplett mobil/E2E-test. Ändra inte produktionsdata eller installera kandidaterna före granskning och godkännande.
- `remember/album.html` har befintlig enbilds-HTTP-uppladdningsknapp som riktar sig till ännu icke-deployad funktion; kamerans godkända flerbildsresultat är fortfarande enbart lokala. `remember/album-admin.html` har också enbart lokal granskning.
- Nästa steg: slutför säkerhetsgranskad migrations- och endpointdesign, testa med avgränsade transaktioner och säker lagring; därefter koppla kamerans markerade bilder via en återupptagbar kö med explicit publiceringsbekräftelse. Befintligt album och token ska bevaras.


### Uppladdningskandidat: atomisk SHA-256-claim (2026-10-13)
- Review-only SQL `remember/sql/026_content_dedup_MIGRATION8_REVIEW_FIRST.sql` innehåller nu albumunik partial index på (album_id,content_sha256) för uploading/ready samt service_role-only `remember_photo_claim_upload(uuid,bytea)`. Claim gör reserved→uploading med digest i samma databastransaktion och returnerar duplicate vid unique violation.
- Review-only endpoint `remember/deploy/remember-photo-upload_REVIEW_ONLY.ts` beräknar SHA-256 på uppladdningsbytes och anropar claim-RPC. Bytea-hexkodning korrigerad och återläst.
- **BLOCKER innan deployment:** nuvarande `remember_guest_photo_reserve` returnerar `reason=existing` och endpoint avvisar varje retry; efter timeout/avbruten lagring saknas fullständig storage-aware reconciliation. Felsäkra retry med samma requestId måste återläsa state och verifiera objektet utan dubbel lagring/kvot. Nuvarande duplicate-index hanterar inte ersättning efter permanent lagringsfel förrän objektets frånvaro bekräftats. Testa race, avbruten uppladdning, samma requestId, annan requestId/samma bytes, återkallad token, stängt fönster och kvot 10/11 innan drift.
- Inga Supabase-migrationer eller Edge Function-deployments utförda i detta steg. Album och delningslänkar oförändrade. Status: KODKANDIDAT, EJ TESTAD I RUNTIME.


### V1 enkelt kameraflöde (2026-10-13)
- Beslut i `remember/DECISIONS.md` styr: riktig bild först, inga avancerade auto-retry-system i V1.
- `remember/album.html` uppdaterad: kamerans lokalt godkända bilder kan nu väljas för **Publicera godkända bilder**, med explicit confirm, sekventiell prepare/upload och räknare. Bekräftat sparade tas bort från den lokala kön; ej bekräftade finns kvar för manuellt nytt försök så länge sidan är öppen. Ingen permanent kö eller automatisk återupptagning.
- Källkod i GitHub återläst PASS (`31416c8`); inte testad i webbläsare. `remember-photo-upload` är fortfarande inte deployad och därför kan verklig bilduppladdning inte lyckas ännu. Den nya UI-knappen får INTE kallas fungerande liveuppladdning.
- Nästa steg: säker serveruppladdning enligt senaste V1-beslut och ett verkligt test med en bild. Befintligt album/token orörda.


### SQL-installationsprov med ROLLBACK 2026-10-13
- Senaste beslut läst i `remember/DECISIONS.md`: håll V1 enkel, testa riktig bild först.
- Read-only före: schema=5, album=1, foton=0, aktiva gästlänkar=1, öppna album=1, bildgräns 10.
- Migration 8 uppdaterad så att service_role inte kan använda äldre `remember_photo_begin_upload(uuid)` utan digest; GitHub commit `ba44c06` och readback PASS.
- Verklig Supabase SQL-transaktion med migration 6 + privat bucket + migration 7 + migration 8 kördes inom `BEGIN; ... ROLLBACK;` och gav `dry_run_version=8`, `claim_exists=true`, `test_bucket=1`.
- Separat read-only kontroll EFTER rollback: schema=5, bucket=0, foton=0. Ingen migration/bucket installerad permanent.
- **Återstår:** runtime-/HTTP-granskning av Edge Function, deployment och verklig bilduppladdning samt bildvisning. Ingen PASS för komplett flöde.


### Verklig Supabase-installation och Edge Function 2026-10-13
- Projektidentitet verifierad: `wykvztfmfbboxiqvuvwr` = `container13-remember`, ACTIVE_HEALTHY.
- Via Supabase apply_migration installerades migration 6 (reservation), privat bucket, migration 7 (upload transitions), migration 8 (albumunik SHA-256-claim). Alla fyra returnerade success.
- Efterkontroll: schemaVersion=8, albums=1, photo_rows=0, active_guest_links=1, bucket.public=false, anon/authenticated EXECUTE på claim=false, service_role=true, legacy begin_upload service_role=false.
- Edge Function `remember-photo-upload` driftsatt ACTIVE version 1 med verify_jwt=false och egen gästtokenkontroll via service-only RPC. Deployerad källa: `remember/deploy/remember-photo-upload_REVIEW_ONLY.ts` (filnamnet är historiskt och bör uppdateras först efter verifierat E2E). Ingen gästtoken exponerad i loggen.
- **ÄNNU EJ VERIFIERAT:** verklig multipart HTTP-uppladdning från gäst, korrekt bildvisning från privat storage, kvot/dubblett/felhantering i runtime. Kalla inte Remember V1 PASS eller färdigt.
- Nästa steg: testa verklig uppladdning med användarens befintliga gästlänk via klienten; bygg/anslut behörig bildlista och privat bildvisning om den ännu saknas. Håll V1 enkel enligt DECISIONS.


### Kameraflöde förenklat 2026-10-14
- Enligt användarbeslut har gästalbumets kamera nu ett enda godkännande: **Godkänn valda** skickar godkända bilder direkt till servern. Extra publiceringsknapp/bekräftelse borttagen. Retryknapp visas endast efter fel.
- GitHub commit `01f7cff` återläst PASS. Ingen runtime- eller mobilverifiering ännu; begär verkligt test i befintligt album. Backend uppladdningsfunktion ACTIVE men E2E och privat bildvisning ej verifierade.


### Webmasteruppladdning 2026-10-14
- SQL migration 9 `remember/sql/027_webmaster_photo_upload_MIGRATION9.sql` installerad. Endast service_role får anropa webmaster-reserve/complete; behörighet verifieras i RPC mot `remember.webmasters`.
- Edge Function `remember-photo-upload` v2 ACTIVE: exakt en av gästtoken eller webmaster albumId + giltig Bearer-session; serververifiering med `auth.getUser`, kvot/tid/digest kontrolleras av RPC.
- `remember/album-admin.html` använder nu befintlig inloggad session, inte gästlänk, för både kamerabilder och filval. GitHub commit `d69a834` återläst PASS.
- Efterkontroll: schema=9, album=1, bilder=0, anon execute på reserve=false, authenticated execute på complete=false, service_role reserve=true.
- **E2E-bilduppladdning fortfarande inte verifierad på iPhone.** Nästa steg: en testbild i webmasterläge; granska serverresultat, sedan privat bildvisning.


## LATEST HANDOFF — 2026-10-14 — Remember login redesign (supersedes older next-step directives for this work)
- User approved a previously generated login mockup as the target design. The actual deployed login through reported version 0.1.12 did NOT match it; user reported no meaningful visible improvement. **Design NOT approved in production.**
- Target visual elements described from the approved mockup: warm photographic background with sunlight/depth, elegant logo, dark semi-transparent compact login panel, balanced spacing and mobile proportions. Previous implementation had flat/gradient background, oversized pale/double-framed form and too much empty space.
- Explicit user decision: restart visual implementation FROM the approved sketch, as closely as feasible; treat approved mockup as binding visual specification, not general inspiration. Preserve all real login functionality and fields. Do not add speculative functionality. Focus ONLY on login until actual iPhone screenshot has been compared side-by-side with the reference and user approves. No further illustrative proposals requested.
- Reference asset: previously shared in chat; **not yet verified saved in repository**. Identify and store exact approved image with user authorization before claiming parity; do not substitute an invented reconstruction as exact reference.
- Status: prior assistant reported login 0.1.12 committed/published and user observed no difference. This checkpoint records conversation/user evidence, NOT independently verified branch/deploy/runtime. Inspect current source and deployments before editing. Do not claim a new redesign has been implemented.
- Next action: retrieve the approved image/reference, inspect current login HTML/CSS and live state, implement faithful photographic layout without touching authentication, verify deployment and actual iPhone rendering against reference, then request user acceptance.
- Cross-project requirement: update shared project templates with mandatory handoff/readback and approved-design-fidelity rules so short resume commands work reliably. Do not overwrite more recent verified backend/photo-upload work documented elsewhere in this handoff.


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


## Latest task — Auth mail setup — 2026-10-14
User authorized fixing email delivery after actual login-link failures. Auth logs at15:45:18/26 Europe/Stockholm show HTTP429 over_email_send_rate_limit on/otp. Not a visual/header regression.
Read-only public DNS: NS lucy.ns.cloudflare.com / zod.ns.cloudflare.com, root MX5 smtp.rzone.de. Existing incoming email must stay on the current MX; add only exact Resend-issued sending/authentication records after provider domain registration. Do not replace root MX or guess DKIM/SPF contents.
Resend SMTP selected as free-plan candidate; official docs https://resend.com/docs/send-with-supabase-smtp confirmed host smtp.resend.com, port465, username resend, API key as server-side password, verified sender domain prerequisite. Sender candidate noreply@container13.se, name Container13 Remember. Official pricing currently shows Free daily cap100; not unlimited email. No payment/overages authorized or enabled. Avoid open/click tracking on auth links.
Available Supabase connector cannot change Auth SMTP config. Resend connector found but not installed/connected; installation/connection suggested. Cloudflare connector search returned none. Setup is PREPARED, NOT CONFIGURED, NOT MAIL PASS. Do not claim connection or mail success. No credentials obtained, DNS/SMTP changes or test messages performed. UI remains0.1.23; documentation-only changes do not bump runtime version.
Next concrete action: user installs/connects Resend; confirm actual connection, inspect account/domain, create/verify sender with provider-issued DNS records, configure SMTP via supported native integration or permitted UI, then request/test intended recipient's auth flow and verify delivery. Never request secret API keys/passwords in chat. Resume existing task after connection; do not ask user to repeat goal or reinstall DB.


## Latest SMTP checkpoint — 2026-10-14
Resend tools are now available and authenticated. list-domains returned empty; created container13.se in eu-west-1, domainID db880ddc-dfdf-4f9b-9162-eabb096d1782; get-domain confirmed not_started, sending enabled, receiving disabled, open/click tracking false. Exact DNS records displayed to user and recorded under mailSetup.dnsRecords in state. No DNS/SMTP changes or API credentials created; no test email sent. Previous missing-Resend-connection blocker is superseded.
Cloudflare requires sign-in. Secure browserAuth offered current methods; user chose GitHub. GitHub OAuth asks Cloudflare to read email addresses only (no repository permission). Automatic approval review rejected click Authorize Cloudflare because method choice was not explicit authorization for email-address access. Stop this grant until explicit user approval; do not bypass by indirect execution. Existing cloud browser tab5 holds OAuth step; do not persist the OAuth query/state URL. Next: explicit approval for read-only GitHub email grant, or user choice of another method, then authenticated DNS setup and verification. Full mail delivery remains NOT CONFIGURED/UNVERIFIED.


## Latest SMTP checkpoint — 2026-10-14 17:28 Europe/Stockholm
Supersedes earlier connection/OAuth blockers. User added exact four Resend DNS records manually in Cloudflare. Public DNS lookup confirmed every value; Resend get-domain subsequently confirmed domain and all four records verified, sending enabled, receiving disabled, tracking disabled. Existing root incoming MX and DMARC were not edited by agent.
Supabase browser GitHub sign-in succeeded. User created Remember Supabase SMTP key and saved SMTP in their browser. Fresh reload of the existing Remember project SMTP page confirms enabled, host smtp.resend.com, port465, sender name Container13 Remember, minimum interval60, stored password hidden, Save changes disabled. Sender email and username are redacted by browser; intended values noreply@container13.se and resend were supplied to user. Resend list-keys confirms name only; permission/domain restriction not exposed by this read. No secret values, auth links, cookies or OAuth URLs persisted.
Status SMTP_CONFIGURED_DELIVERY_UNVERIFIED: no real mail delivery or login success yet verified. Next user requests an auth link from Remember, then verify actual Auth/Resend delivery and user inbox/login result. No paid plan or overages enabled. Runtime stays0.1.23; docs-only evidence checkpoint.


## Capacity checkpoint — 2026-10-15
Read [OPERATING_LIMITS.md](./OPERATING_LIMITS.md) at handoff and before quota/hosting/upload decisions. Official Free limits verified; snapshot3 objects/794834bytes, physical DB11867827bytes. Billing counters remain unknown. Webmaster capacity panel specified, NOT implemented; reuse existing server authorization, never expose provider keys. Runtime remains0.1.23, docs-only. Auth mail delivered09:27; user confirmed inbox and successful link login. Overall product remains PENDING with earlier device/E2E gates.

User clarification09:41: primary purpose is troubleshooting: check service availability, paused projects, quotas/rate limits, album windows and actual error before code changes. Capacity charts are secondary. See OPERATING_LIMITS.md troubleshooting-first checklist.


## Approved decision — 2026-10-15 09:56 Europe/Stockholm
User confirms standalone operations panel, separate from Remember: own code/version/deployment, read-only protected service connections, potentially shared across Remember/CCC/other projects. Remember keeps album/access/window administration. Supersedes embedded capacity panel proposal. No implementation or new credential/hosting setup performed. Primary purpose: obvious service/quota/configuration checks before code debugging.

## AKTUELL ÖVERLÄMNING — 2026-10-16 (ersätter äldre nuläges- och nästa-steg-påståenden)

**Läsordning före fortsatt arbete:** `../project-template/PROJECT_RELEASE_STANDARD.md`, `PROJECT_MASTER_RULES.md`, `PROJECT_RELEASE_CHECKLIST.md`, `SHARED_COMPONENT_REGISTER.md`, därefter `remember/PROJECT_CURRENT_STATE.json`, `DECISIONS.md`, denna senaste handoff och berörd specifikation. Sök `../solutions/` och kontrollera aktuell källkod, deploy och verklig klient innan kodändring. Äldre avsnitt i denna fil är historik och kan innehålla uppgifter som nu är ersatta.

**Versionsläge:** `remember/release.json` på `ccc-demo-public-test` anger **0.1.60 / remember-0.1.60**. Användaren har visat iPhone-skärmbild av albumägarvyn med versionsetikett 0.1.60. Detta är INTE en fullständig kontroll av publicerade filbytes, alla vyer, kallstart/återupptagning eller kameran. `PROJECT_CURRENT_STATE.json` har 2026-10-16 korrigerats från historisk 0.1.23 till kandidat 0.1.60 med status UNVERIFIED; tidigare test- och databashistorik är bevarad.

**Bakgrund på installerad iPhone PWA – ÖPPET, INTE DEVICE PASS:** På riktig iPhone mättes `screen.height=874`, `innerHeight=812`, skillnad 62 CSS-px; separat test gav `env(safe-area-inset-bottom)=54px`. En mörk nederremsa reproducerades även i separat installerad PWA via `pwa-display-test.html` och egen manifest. Det talar emot att felet enbart beror på Remember-dashboardens CSS. iOS 27/WebKit viewport-/målningsbeteende är en **hypotes**, inte slutligt fastställd orsak; WebKit bug 301994 är en möjlig relaterad rapport, inte bevisad identitet. Användaren beskriver att bakgrunden i **Mina album** automatiskt ändrar läge efter öppning medan **albumägarvyn** kräver svep för motsvarande korrigering. **Önskat resultat: båda vyerna har stillastående korrekt bakgrund direkt från första ritningen, utan remsa eller synligt hopp.** Försök inte kopiera det automatiska hoppet mellan vyerna. Dokumenterat beslut: **inga fler spekulativa CSS-höjdpatchar**; tidigare försök har misslyckats. Behåll separat testfall och mätdata, analysera iOS/WebKit och verifiera på enheten före ny lösning.

**Kamera:** `owner.html` integrerade flervalskameran i iframe i 0.1.59 och fick helskärms-CSS i 0.1.60 efter att kameran synts i smal kolumn. Kamerans faktiska helskärmsbeteende och flertagning på installerad iPhone återstår att användartesta. Blanda inte ihop kameratester med bakgrundsproblemet. Gästens kamera har egen konsumentväg och kräver separat regressionskontroll.

**Övriga bevarade beslut:** Befintliga album, foton och delningslänkar får inte påverkas. Ändra inte Micke50 eller CCC som bieffekt. Remember har central `auto-update.js`, `remember-version.js` och `release.json`; verifiera alla nio användarvyer och deras versionsparitet vid runtime-ändring. Mobil sidnypzoom av; bildzoom endast i uttrycklig bildvisare. Den separata, skrivskyddade drift-/webmasterövervakningspanelen är beslutad som framtida eget projekt, **inte implementerad**. För driftfel: läs `OPERATING_LIMITS.md` och kontrollera leverantörsstatus/kvoter/åtkomst innan kodfelsökning.

**Arbetsdisciplin:** två misslyckade fixförsök => stoppa patchning och dokumentera grundorsaksanalys; gemensam ägare för gemensamt beteende; versionera varje runtime-ändring; GitHub exact readback, faktisk deploy och iPhone DEVICE PASS är separata bevisnivåer. Dokumentationsändringar i detta avsnitt ändrar ingen app-runtime.

### Användarverifiering — kamera 2026-10-16
Användaren rapporterar uttryckligen **”Kamera ok nu”** efter 0.1.60-ändringen. Registrera **USER PASS för kamerans nu testade beteende på användarens enhet**. Detta innebär inte automatiskt att alla gästflöden, backenduppladdning, avbrott/retry eller övriga kameraregressioner är E2E-verifierade. iOS-bakgrundsremsan är ett separat, fortsatt öppet problem.

### Akut versionskonflikt / automatisk omladdning — 2026-10-16
Användaren rapporterade att installerade Mina album på iPhone med etiketten `Remember · v0.1.61 · uppdatering finns` hackade/uppdaterade sig upprepade gånger. GitHub-readback visade att `dashboard.html` hade 0.1.61 i HTML/assetreferenser, men `release.json`, `remember-version.js` och `owner.html` låg på 0.1.60. `auto-update.js` kan navigera om vid dokumentfingeravtrycksavvikelse och även vid **vilken som helst** manifest-releaseavvikelse, utan att kontrollera om manifestet är nyare. Detta kan skapa en reload-loop vid felaktig versionsparitet; den exakta runtime-mekanismen på enheten är inte isolerat bevisad.

**Åtgärd (GitHub COMMITTED + exact readback, DEVICE PENDING):** Återställde `dashboard.html` referenser/metadata från 0.1.61 till 0.1.60 och tog bort det oavslutade 0.1.61-`100lvh`-blocket från `remember-design.css`. Behöll `release.json` 0.1.60 och övrig appkod. Commit dashboard `f8469e065f5883c55000631d6bf2fd29eb836375`, CSS `1f39294071f6bba24b132c80f0d2807d9aeec905`. Nästa steg: verifiera på installerad iPhone att uppdateringsloopen upphör. Undvik att lägga på ny bakgrundspatch. Framtida förbättring: updater får inte ladda om när manifestet är äldre än klienten, och måste begränsa upprepade omladdningar; genomför med separat komplett release och regressionstest.

### USER PASS — Mina album uppdateringsloop avhjälpt (2026-10-16)
Efter att ofullständig 0.1.61-dashboardreferens återställdes till 0.1.60 och 0.1.61-CSS-experimentet togs bort, rapporterade användaren på sin installerade iPhone att Mina album nu **visar 0.1.60** och bekräftade uttryckligen **ja** på frågan om vyn står stilla utan hackningar eller upprepade automatiska uppdateringar. Status: **USER PASS för versionsvisning och frånvaro av observerad uppdateringsloop i denna vy**. Detta är inte verifiering av samtliga vyer eller en fullständig kallstart-/långtidstest. Den mörka iOS-remsan är parkerad och inte åtgärdad; enhetlig bakgrund utan automatisk nedglidning är fortsatt separat acceptanskriterium.

### 0.1.63 — inbjudan och gästgalleri (2026-10-16)
Ägarvyns `Dela` använder nu inloggad användares e-post och albumtitel i inbjudningstexten, med samma befintliga gäst-URL. `Kopiera` kopierar text + URL. Gästsidans `#rememberGallery` har en mörk halvtransparent panel. Alla nio HTML-vyers release- och assetreferenser samt `release.json`/`remember-version.js` är synkroniserade till 0.1.63 och verifierade via GitHub readback. **DEVICE PASS saknas**: testa Dela/iMessage, Kopiera, QR-skanning, gästens bildruta och att ingen uppdateringsloop återkommer. iMessage Open Graph-förhandsvisning har ännu statisk titel; fragment-token kan inte läsas av förhandsvisningsboten. Gör ingen dynamisk publicering av ägarens e-post eller token i offentliga metadata utan separat integritets- och arkitekturbeslut.

### 0.1.64 — iMessage textdelning (2026-10-16)
Användaren visade iMessage efter Dela i 0.1.63: enbart länkkortet `Remember – album`, ingen personlig text. Kodgranskning: `navigator.share` skickade både `text: invitationText()` och separat `url: shareUrl`; iOS kan prioritera URL-förhandsvisning. Ändrat till **en enda text-payload** `navigator.share({text:invitationText()})`, där inbjudan redan innehåller den befintliga gästlänken sist. Samtliga nio HTML-vyer samt central releaseversion synkroniserade till 0.1.64, kontrollerade i GitHub. **USER/DEVICE PASS saknas**: testa Dela → Meddelanden och bekräfta att e-postadress, albumtitel, text och URL syns. Länkförhandsvisningens titel `Remember – album` ändras inte av detta och kräver separat servermetadataarbete.


### 2026-10-16 kl. 11:42 — dagsbok: webmaster och PWA-uppdatering 0.1.65–0.1.68
**Beslut/krav:** Samma inloggning för albumägare och webmaster. Endast serververifierad webmaster får se tydlig administrationsidentitet; albumägarens ordinarie vy ska vara oförändrad. Webmasterverktyg och egna album ska vara separata sektioner. Riktig webmasterhantering får inte förväxlas med statisk demo i `webmaster.html`. Användaren vill ha kompakt, varm Remember-design, inga överlappande versionsetiketter och inga självgående omladdningsloopar. Mörk iOS-systemremsa är fortsatt parkerad.
**Implementerat:** Dashboard fick rollstyrd rubrik/identitet `Administration`/`Webmaster`, kompakt banner, hopfällbara administrationsverktyg, separat `Mina album`-rubrik och extra nedre utrymme. Användarens skärmbild kl. 11:38 visar nya layouten. `auto-update.js` gick först från automatisk `location.replace` till passiv upptäckt (stoppade en tidigare möjlig loop), sedan till en versionsstyrd automatisk uppdatering med ett försök per målrelease i `sessionStorage` och manuell återförsöksknapp vid misslyckande. Därefter infördes jämförelse som bara accepterar **nyare** semantiska versioner, inte enbart annorlunda versionssträngar (commit `8824e101`).
**Observerad på iPhone:** Safari visade 0.1.67 medan installerad PWA fortfarande visade 0.1.66 efter omstart. Senare skärmbild från installerad PWA visar 0.1.68 och den felaktiga varningen `Ny version finns. Automatisk uppdatering kunde inte slutföras.` Detta sammanföll med att `release.json` låg på 0.1.67 medan dashboard redan var 0.1.68; versionsjämförelsen behandlade då äldre manifest som avvikelse. Bilden bevisar att PWA kunde visa 0.1.68, inte att uppdateringsflödet är slutligt godkänt.
**GitHub-status vid denna dokumentation:** Efter ett avbrutet/partiellt versionslyft synkroniserades alla nio HTML-vyer, `remember-version.js` och `release.json` till 0.1.68. Exakt readback av dessa elva filer visade inga kvarvarande 0.1.67-markörer i release/assetreferenser. Uppdateringskontrollen har ändrats i GitHub, men ny iPhone-kallstart efter den sista rättningen är **INTE användarverifierad**. Även faktisk deploy för sista commit och slutlig uppdateringsfunktion är **UNVERIFIED**. Versionsskriptet bör kontrolleras mot aktivt laddad fil, och uppdateringskontrollens fall för samma/äldre/nyare manifest bör testas innan USER PASS.
**Kvar att göra:** Kontrollera GitHub Actions senaste lyckade deploy, kontrollera installerad iPhone PWA efter senaste kod, verifiera att 0.1.68 visas utan felvarning och utan omladdningsloop, samt kontrollera formulär-/uppladdningsskydd, återupptagning och att ny release verkligen uppdateras vid kallstart. Fortsatt observerad skärmmätningskontroll på login är en separat öppen UI-fråga. Undvik fler blinda versionshöjningar. Versionshantering ska vara central och konsekvent.

### 2026-10-16 — 0.1.71: Micke50-bildvisning i Remember
Gästläge saknade vertikala svep och zoom trots tidigare beslut. Verifierat att Micke50/index.html hade touchstart/touchmove/touchend och 8× zoom, medan remember/photo-gallery.js bara öppnade en enskild bild. Den delade bildvisaren har nu vertikala svep med mjuk animation, zoom upp till 8×, panorering med två fingrar, återställning efter 3 s/beröring, stängning och tangentbordsstöd. Används av remember/album.html (gäst) och remember/album-admin.html (albumadministration). Import cache-bustad till photo-gallery.js?v=0.1.71. Nio HTML-filer, release.json och remember-version.js synkroniserade och lästa tillbaka (11/11). GitHub-kod verifierad; faktisk iPhone-gesttest och deploy-status EJ verifierade. Nästa test: minst två foton, upp/ner, horisontellt ignoreras, 8× zoom och återställning; kontrollera att vanlig sidskrollning inte påverkas när visaren är stängd.
