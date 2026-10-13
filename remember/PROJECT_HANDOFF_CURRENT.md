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
