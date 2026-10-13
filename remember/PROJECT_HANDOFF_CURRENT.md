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
