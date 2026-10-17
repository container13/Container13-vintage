# Remember Test — isolerad Supabase-kopia

Verifierad: 2026-10-17. Status: BACKEND DEPLOYED / READBACK PASS / begränsad negativ HTTP-smoke PASS. Inte komplett E2E eller färdig mobiltestmiljö.

## Syfte och ägare
Container13/Magnus använder detta projekt för tester av Remember och säkerhetsmodulen med egna testadresser och skräpbilder. Miljön får inte användas för riktiga kundalbum. Behåll den tills säkerhetsmodulens isolerade tester och kontrollerad överföring är färdiga; därefter ta uttryckligt beslut om fortsatt drift eller avveckling. Ingen automatisk promotion till originalprojektet.

| | Original | Test |
| --- | --- | --- |
| Projekt | container13-remember | remember-test |
| Ref | wykvztfmfbboxiqvuvwr | kauxrvshxgpbvptdwhog |
| Organisation | Container13-Remember | Container13-Remember |
| Region | eu-north-1 | eu-north-1 |
| API | https://wykvztfmfbboxiqvuvwr.supabase.co | https://kauxrvshxgpbvptdwhog.supabase.co |
| Dashboard | https://supabase.com/dashboard/project/wykvztfmfbboxiqvuvwr | https://supabase.com/dashboard/project/kauxrvshxgpbvptdwhog |

Supabase get_cost för nytt projekt i organisationen angav 0 per månad. Ingen betald uppgradering har beställts.

## Vad som kopierats
Snapshot av faktisk installerad struktur från originalet, inte blind återkörning av äldre DRAFT-migrationer:
- 8 tabeller, kolumner, defaults, identity, check/unique/primary/foreign-key constraints och 3 fristående index.
- RLS på samtliga tabeller. Ingen schema-USAGE för anon/authenticated. Motsvarande service_role-tabellrättigheter.
- 16 public remember*-databasfunktioner; alla 16 pg_get_functiondef jämförda exakt med originalet efter installation.
- Schema-versionmarkörer 1–10 med beskrivningar. installed_at i test beskriver testinstallationen.
- 2 privata buckets, remember-photos och remember-private-photos, max 10485760 byte och MIME image/jpeg, image/png, image/webp.
- PostgREST-schemaexponering public, graphql_public, remember på authenticator, enligt originalet.
- 8 Edge Functions: remember-webmaster, remember-guest-link-webmaster, remember-guest-metadata, remember-photo-upload, remember-photo-gallery, remember-share-manager, remember-owner-manager, remember-onboarding.
- Samtliga Edge Functions återhämtade efter deploy: filer exakt lika originalets driftsatta filer, samma verify_jwt-inställning. Ny deployversion 1 i test ska inte jämföras numeriskt med originalets versionsräknare.
- Funktionerna använder testprojektets egna automatiska SUPABASE_* servermiljövariabler. Ingen källfil innehåller originalets project ref.

Installationssnapshot: remember/test-environment/installed-schema-snapshot.sql. Den har ett schema-exists-stopp och får INTE köras i originalet eller blint återköras i test. Supabase-migration: remember_test_installed_schema_snapshot.

## Avsiktligt inte kopierat eller aktiverat
- Inga Auth-användare, lösenord, sessioner, webmastermedlemskap, album, bilder, gästlänkar eller krypterade länkvalv kopierades.
- Inga SMTP-lösenord, egna serverhemligheter eller originalprojektets nycklar hämtades/kopierades.
- Auth Site URL, redirect-allowlist, SMTP och andra Dashboard-inställningar är INTE verifierade som en kopia.
- Ingen frontend är ännu ansluten till testprojektet. Originalets frontend och koppling är oförändrade.
- remember/security/SETTINGS_SCHEMA_REVIEW.sql är fortfarande REVIEW ONLY och har INTE installerats.
- Micke50-radering är användarrapporterad; ingen administrativ oberoende raderingskontroll har varit möjlig.

## Verifiering
- Test: 8/8 tabeller med RLS, schemaVersion 10.
- Test: 0 Auth-användare, 0 webmasters, 0 album, 0 bildrader, 0 Storage-objekt.
- 0 SECURITY DEFINER Remember-RPC:er med EXECUTE för anon/authenticated.
- Fyra verkliga HTTP-anrop utan session gav 401: webmaster, owner-manager, share-manager och photo-gallery i ägarläge.
- Gästmetadata med påhittad 43-teckens token gav 200 och exakt found:false enligt endpointens kontrakt. Första kontrollskriptet antog felaktigt 404; koden granskades och svarsbody verifierades i nytt läsanrop. Ingen funktion ändrades.
- Supabase security advisor: endast INFO för RLS utan policies på de åtta tabellerna, samma avsiktliga server-only/default-deny-modell. Se https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy
- Ingen auktoriserad användar-/uppladdnings-E2E eller DEVICE PASS påstås.

## Ärvt beteende att känna till
Kopian bevarar befintligt beteende, inklusive att remember_webmaster_read installation_status fortfarande jämför schemaversion med 2 medan installerad version är 10. Detta är inte korrigerat i samband med kopiering. Säkerhetsgranskning av RPC:er, delningslänkens atomicitet och uppladdnings-retry kvarstår enligt befintliga reviewdokument. Kopiering innebär inte ett säkerhetsgodkännande.

## Nästa steg
1. Förbered separat testfrontend med tydlig TEST-markering och endast testprojektets API/publishable key; granska alla entry points, Auth storage key, PWA scope, manifest, updater och redirect-URL så att ingen testväg skriver till originalet.
2. Konfigurera testets Auth Site URL och exakt redirect-allowlist. Säker SMTP/testleverans utan att flytta originalets hemligheter via chatt eller GitHub.
3. Skapa nya konton för användarens egna godkända testadresser i testprojektet; tilldela webmaster enbart där efter verifierad identitet.
4. Testa inloggning, rollseparation, två användare, testalbum, skräpbilder, kvot, gästlänk och återförsök.
5. Först därefter granska/installera säkerhetsmodulens kandidat i test, aldrig direkt i originalet.

## Återställning
Originalet har inte ändrats. Testet är självständigt utan produktionsdata och ingen frontend har växlats över. Vid fel: stoppa testning och granska snapshot/deploy-readback; originalet fortsätter som tidigare. Radera inte projekt eller data automatiskt och återkör inte snapshot över befintligt schema.
