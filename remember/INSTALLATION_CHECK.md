# Remember – installationskontroll

Status: kodförberedelse, ej driftsatt eller testad mot Supabase.

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
