# Albumreglage och tider i ordinarie Remember
2026-10-21. Kandidat 0.1.154. DEPLOYED på backend; användarens inloggade iPhoneacceptans återstår.

## Beslut
Projektägaren klargjorde att ordinarie Remember är utvecklingsmiljön och gav uttryckligt uppdrag att införa funktionerna där. Tidigare krav på separat originalgodkännande är därmed uppfyllt. Användaren behöver inte återställa/logga in i separat remember-test för att fortsätta detta uppdrag. Remember-test behålls för teknisk diagnostik; ingen borttagning eller automatisk avveckling.

## Installerat
- Ref wykvztfmfbboxiqvuvwr, befintlig Remember-backend.
- is_active NOT NULL DEFAULT true; privata state/audit-tabeller med RLS och utan klient-/service_role-tabellgrants.
- Server-only activation/settings RPC, gemensam revision, lås, idempotens, atomisk audit och kontroll av bekräftad/ej spärrad/ej raderad webmaster.
- 13 befintliga RPC-definitioner jämfördes mot före-underlaget (identiska utom normaliserade radslut/slutsemikolon). CREATE OR REPLACE bevarar deras tidigare grants.
- De sex verkliga före-Edge-källorna var exakt identiska med granskningsbaslinjen. Originalets egna kandidater användes; testmiljöns särskilda modererings-/återställningskod kopierades inte.
- CLI 2.121.0 genererade migrationen 20261021120017_remember_album_settings_activation.sql. Remote migration heter remember_album_settings_activation.
- Edge återlästa exakt: guest-metadata v2, photo-gallery v5, photo-upload v3, owner-manager v4, share-manager v4, webmaster v3. Webmaster annonserar både albumActivation och albumSettings; X-Remember-Version 0.1.154.
- Aktiveringsspärrarnas Edge-funktioner publicerades före webmaster/capabilities. Samtliga befintliga album förblev aktiva.
- Befintlig dashboard och album-admin återanvänder redan rätt kontroller; endast versions/cachemetadata ändrades i ordinarie frontend. Ingen ny inloggningsväg eller sessionsnyckel.

## Före-kopia och återställning
Säkerhetsgren **remember/development-checkpoint-2026-10-21-before-controls**, commit **843aa45f09995986a525993463ed6b3945433903**.
Filer under remember/development-backups/2026-10-21-before-controls/: schema/RPC/ACL/constraints/triggers/räkning och sex verkliga Edge-källor. Databasföre-kopian exakt återläst via grenen. Detta är kod-/strukturunderlag, inte backup av alla konto-/bilddata eller ett fullständigt tjänsteåterställningstest.
Fotobokens tidigare säkerhetsgren 0.1.137 bevaras. Vid fel: stoppa nya ändringar/capability först och granska aktivt avstängda album. Ta inte bort spärrar, audit eller state blint som rollback.

## Faktisk verifiering i Remember
- pglast 7.21: 28 SQL-statements och PL/pgSQL-parser PASS.
- Alla sex Edge-källor Node TS/ESM syntax PASS, därefter deploy + exakt serveråterläsning PASS.
- Activation-transaktion PASS: behörighet/grants, avstängning, audit/retry/stale revision, gästspärr, påbörjad upload blockeras, adminläsning, återaktivering och bevarade tider/länk/ägare/kvot. Eget temporärt album/foto i transaktion, ROLLBACK.
- Settings-transaktion PASS: eget temporärt album, behörighet/grants, sparande/revision/audit, idempotens, konflikt och ogiltiga datum, ROLLBACK.
- Oberoende återläsning efter båda: **3 Auth-konton, 1 webmaster, 2 album, 10 foton; 0 temporära testalbum; 0 activation-state/auditposter**.
- Kontrolldigest före/efter: album exklusive nya is_active = 4c1e120db3942182764813e32312ebc9; foto-rader = fba1dd505acc953a9d3ce5e0a19c5d74. Befintliga fält/rader ändrades inte av installationen/testerna.
- Läsning med befintlig bekräftad webmaster: båda nya RPC authorized=true; listan har verkliga booleska is_active; alla befintliga album active=true; anon/authenticated nekas nya admin-RPC:er.
- Negativ HTTP efter deploy: webmaster utan session 401; ogiltig gästtoken ger metadata 200/found:false.
- Separat SQL-samtidighet verifierades tidigare i remember-test, se dess protokoll. Det räknas inte som nytt original-HTTP-/iPhone-PASS.
- **Autentiserad HTTP i användarens riktiga session, fysisk iPhone och full releasepromotion är fortfarande PENDING.** Ingen session/lösenord har hämtats/fabricerats åt användaren.
- Fotobokens sidvändningslogik, bildvisare, normala auth-/backendadresser och appikonens filer är oförändrade. CURRENT/PREVIOUS förblir null.

## Användarens nästa kontroll
Öppna https://container13.se/remember/dashboard.html, välj Webmaster och kontrollera version 0.1.154.
1. Reglagen ska visa Aktivt. Avbryt en avstängning och kontrollera att inget ändras. Bekräfta sedan avstängning/återaktivering på valt utvecklingsalbum.
2. Öppna albumet, välj återöppning/förlängning, kontrollera utkastets nya sluttid och välj Spara ändringar.
3. Lämna/öppna albumet igen och kontrollera att tidsändringen finns kvar. Manuell uppladdningsstängning bevaras tills den uttryckligen avmarkeras.
4. Återaktivering ändrar aldrig tiden. Stängd uppladdningsperiod är skild från avstängt album.

Redan signerade bildlänkar (120s) samt cachade/sparade bilder kan inte återkallas.

## Advisors
Ingen ny WARN/ERROR jämfört med läsning före installation. Två nya privata RLS-tabeller ger avsedd INFO no-policy. Tre befintliga varningar kvarstår och ändras inte i detta uppdrag:
- [anon-exekverbar SECURITY DEFINER](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable)
- [authenticated-exekverbar SECURITY DEFINER](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable)
- [Läckta lösenordsskydd avstängt](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)
