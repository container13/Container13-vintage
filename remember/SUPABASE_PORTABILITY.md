# Remember – utbytbar Supabase-anslutning

Status: kodförberedelse, inte driftsatt eller funktionstestad.

## En gemensam anslutningsmodul
Serverfunktionen för Remember använder nu `supabase/functions/_shared/remember-supabase.ts`. Den läser projektadress och nycklar från servermiljön, inte från hårdkodade värden. För ett annat Supabase-projekt byts miljöinställningarna och Remember-schema/funktioner installeras i det nya projektet.

Inställningar: `SUPABASE_URL`, `SUPABASE_ANON_KEY` eller `SUPABASE_PUBLISHABLE_KEY`, samt `SUPABASE_SERVICE_ROLE_KEY`. Service-role-nyckeln är hemlig och får aldrig hamna i webbläsaren, GitHub-koden eller en publik inställningssida. `REMEMBER_ALLOWED_ORIGIN` styr tillåten webbursprung för API:t.

## Installera säkert
1. Bekräfta ett separat Supabase-testprojekt utan påverkan på Micke50.
2. Granska och testa `remember/sql/001_schema_DRAFT.sql` inklusive RLS, schemaexponering och roller.
3. Konfigurera hemligheter på servern och driftsätt enbart Remember-funktionen.
4. Verifiera inloggning, rollkontroll och avvisning av obehöriga användare.
5. Bygg atomiska ändringar och revisionslogg innan tidsredigering aktiveras.
6. Skapa därefter en säker statusvy för anslutning och schemaversion.

## Viktig skillnad
Ett nytt tomt Supabase-projekt ska kunna anslutas utan kodändring. Att flytta befintliga album, konton, länkar och bilder är däremot en separat migrering med backup, verifiering och återställningsplan. Den funktionen finns ännu inte.
