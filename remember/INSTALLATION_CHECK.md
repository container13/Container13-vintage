# Remember – installationskontroll

Status: databasgrund installerad i separat testprojekt 2026-10-13; strukturell säkerhetskontroll PASS. Edge Function/webbdrift ej verifierad. Historiska avsnitt nedan beskriver tidigare kodkandidater.

## Funktion
Den skyddade Remember-webmasterfunktionen har åtgärden `installation_status`. Efter verifierad Supabase-inloggning och kontroll av webmasterrollen kontrollerar den åtkomst till fem Remember-tabeller samt högsta registrerade schemaversion (förväntad version 1).

Svarsfält: `ready`, `schemaVersion`, `expectedVersion`, `checks` och `note`. `ready=true` betyder enbart att tabellerna kan nås med serverns privilegierade anslutning och att versionsmarkören stämmer. Det är **inte** en säkerhets-, RLS-, lagrings- eller driftsättningsverifiering.

## Installationsordning
1. Välj ett isolerat Supabase-testprojekt och granska `001_schema_DRAFT.sql`.
2. Testa schema, åtkomst och RLS i en disponibel testmiljö. Granska även PostgREST-exponering av `remember`.
3. Kör först därefter `001_schema_DRAFT.sql` och `002_version_marker_DRAFT.sql` i kontrollerad ordning.
4. Skapa en verifierad webmasteranvändare genom en skyddad administrativ rutin. Ingen publik självregistrering av webmaster.
5. Driftsätt separat Remember-funktion med projektets serverhemligheter. Testa att obehöriga får 401/403.
6. Kör `installation_status`, verifiera schemaversion och tabellåtkomst. Testa dessutom RLS, storage, migrering, rollback och enheter innan produktion.

Ingen migration körs automatiskt av webbläsaren eller denna kontroll. Byte av Supabase-konto kräver ny installation och konfiguration. Befintliga album/bilder flyttas inte automatiskt.

## Statisk förkontroll utan Supabase-konto

Kör från repositoryts rot:

```bash
node remember/scripts/check-installation.mjs
```

Kontrollen läser endast lokala källfiler och verifierar förväntade tabeller, RLS-deklarationer, versionsmarkör, serverautentisering, rollkontroll, skyddad installationsstatus och att skrivning är avstängd. Den behöver inga API-nycklar och gör inga nätverksanrop eller databasändringar.

**Begränsning:** PASS innebär enbart att källkodens förväntade mönster finns. Det bevisar inte att SQL fungerar i PostgreSQL, att RLS är säker, att API-funktionen kan anropa ett oexponerat schema eller att Supabase-miljön är rätt konfigurerad. Sådana tester kräver en separat verifierad testmiljö.

**Viktig integrationsrisk:** `remember` är inte exponerat i PostgREST enligt schemadraftens säkerhetsriktlinjer, men nuvarande Supabase JS-anrop använder `.schema("remember")`. De anropen kan misslyckas även med service role. Granska en säker serverbaserad åtkomstväg (exempelvis granskade RPC-funktioner med snäva rättigheter) innan driftsättning. Exponera inte schemat bara för att få en grön installationsstatus.


## Kontroll före första installationen (2026-10)
Separat Supabase-projekt `container13-remember` i Stockholm har skapats. Användaren har med SQL Editor verifierat att schemat `remember` inte finns (0 rader). Detta bevisar inte att övriga inställningar är rätt eller att schemautkasten är runtime-testade.

Kör INTE schemautkasten innan slutgranskning av databasåtkomst och bootstrap. `003_harden_default_privileges_DRAFT.sql` återkallar schema- och tabellrättigheter, inklusive framtida standardrättigheter för tabeller som skapas av rollen `postgres`. `004_verify_installation_READ_ONLY.sql` är en skrivskyddad efterkontroll. Default-privileges är rollspecifika och måste utökas om annan migrationsroll används.

Installationsordning efter godkännande: 001 schema, 002 versionsmarkör, 003 privilegier, därefter 004 verifiering. Alla körs endast i separat Remember-projekt. Ingen Micke50-ändring. Projektet har ännu ingen säker serverbaserad SQL/RPC-väg för `remember`; detta är fortfarande en blockerare för Edge Function-runtime.

## Privat schema via RPC (kodkandidat)
SQL-utkastet 005_private_webmaster_gateway_DRAFT.sql definierar en snävt begränsad read-only RPC i public, med EXECUTE endast för service_role och webmasterkontroll inne i funktionen. Edge Function verifierar först användarens JWT och anropar sedan RPC via servernyckel. Schemat remember behöver inte exponeras. Observera att installation_status i denna första RPC-kandidat bara kontrollerar versionsmarkören, inte tabellnärvaro eller RLS. Testa nekad åtkomst för anon/authenticated och falsk webmasteridentitet innan driftsättning. Ingen SQL har installerats.

## Granskning av behörigheter före installation
Ny `006_security_verification_READ_ONLY.sql` ger en kontrolltabell över schemaåtkomst, RLS på fem tabeller och EXECUTE-rättigheter för webmaster-RPC. Den ska köras först **efter** att installationen är utförd. Alla kontroller måste ge true, och schemaversionens faktiska rad ska kontrolleras separat. Ett grönt resultat är inte en penetrationstestning.

**Risk kvar:** `security definer`-funktionen tar `p_actor` från en server med `service_role`. Den kan inte användas som fristående säkerhetsgräns mot en komprometterad service-nyckel. Service-nyckeln får aldrig lämna Edge Function. JWT måste alltid verifieras innan RPC-anropet, och tester ska bevisa att anon/authenticated inte kan anropa RPC direkt. Även avsaknad av bootstrap för första webmaster är blockerande för komplett runtime-test. Installera inte från GitHub-kandidaten utan att dessa villkor granskas.

## Faktisk installation och verifiering – 2026-10-13 (ersätter tidigare installationsstatus)

- Användaren godkände installationen efter projekt- och SQL-granskning.
- Verifierat i Supabase General Settings: organisation `Container13-Remember`, projekt `container13-remember`, projektref `wykvztfmfbboxiqvuvwr`, Stockholm `eu-north-1`. Överlämningens `wykvztfmfbboxiquvuwr` var felaktig och ska inte användas.
- Före installation: remember saknades i schemalistan, public saknade Remember-RPC. Micke50 öppnades eller ändrades inte.
- INSTALL_REMEMBER_REVIEW_FIRST.sql, blob `921bb4e86ccc9daa916dfca1af63099b34f566d5`, kördes i SQL Editor: `Success. No rows returned`.
- Statisk Node-preflight: 20/20 PASS (endast källkod).
- 006_security_verification_READ_ONLY.sql kördes: 12 rader, alla `true`:
  - remember schema exists
  - anon cannot use remember schema
  - authenticated cannot use remember schema
  - five required tables with RLS enabled
  - anon cannot SELECT any remember table
  - authenticated cannot SELECT any remember table
  - RPC exists
  - RPC is security definer
  - anon cannot execute RPC
  - authenticated cannot execute RPC
  - service_role can execute RPC
  - schema version 1 installed
- Separat SELECT av högsta schema_migrations.version gav exakt `1`.
- Dessa resultat är strukturell databasverifiering, inte HTTP/Edge Function-, penetration-, storage-, kvot- eller enhetstest. Skrivåtgärder är fortsatt avstängda i serverkandidaten. Webmaster-bootstrap och serverdeploy återstår.
- Installationen består av separata transaktioner. Återkör inte för att felsöka runtime; inspektera först verkligt databasläge. Inga befintliga data raderades.
