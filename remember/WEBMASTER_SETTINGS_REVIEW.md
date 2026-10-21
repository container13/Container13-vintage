# Remember — webmastertider: granskningsunderlag
2026-10-21. Frontend 0.1.141. Backend NOT INSTALLED.

## Vad som är färdigt
Administration före bilder: ägare, uppladdningsstatus och aktuella tider visas via befintlig serverlista. Fler verktyg är stängd, galleri hämtas först vid Visa bilder. Kamera/uppladdning/delningspopup återanvänds. Ägarpreview behåller bildflödet.
Formulär för start/slut, +24 timmar, +7 dagar, tillfällig stängning och Spara är förberett. Nuvarande API annonserar inte albumSettings; reglagen förblir avstängda. Bildantal/bildgräns visas när det nya behörighetskontrollerade API:t levererar dem. Inga värden gissas.

## Faktisk åtkomst och baslinje
Läsningar 2026-10-21: original wykvztfmfbboxiqvuvwr och test kauxrvshxgpbvptdwhog ACTIVE_HEALTHY. Original remember-webmaster ACTIVE v2, verify_jwt=true; deployed source bevarad i review/remember-webmaster_BEFORE_0.1.141.ts.
Originalet har override_opens_at, override_closes_at, forced_closed, revision och schedule_audit. Ingen schemarutin installerad; Edge returnerar 501 för tidsändringar.
Git-baslinje före vyn: 4699064c56acb735214d5e820ab790e2ed25511a. Fotobok, bildvisare och gästlänkar oförändrade.

## Installation som kräver separat godkännande
1. Endast i remember-test: granska och installera review/migrations/20261021052446_remember_webmaster_album_settings.sql.
2. Kontrollera rättigheter; kör REVIEW-testfilen WEBMASTER_SETTINGS_TRANSACTION_TESTS.sql på godkänt testkonto/album. Testet gör rollback och måste följas av oberoende readback. Ingen automatisk skapning/radering av konton.
3. Deploya review/remember-webmaster_WITH_SETTINGS.ts i test med samma verify_jwt=true. Kör autentiserade och negativa HTTP-test samt två verkligt samtidiga skrivningar. Verifiera test-only frontend mot testprojekt, utan att växla befintlig Remember till test.
4. Först efter dokumenterat PASS: installera samma migrering och Edge-kandidat i originalprojektet inom användarens uttryckligen godkända scope. Läs tillbaka RPC-grants och exakt Edge-kod; testa användarens avsedda album med uttryckligt sparande.
5. Ingen massändring av album eller gästlänkar. Migreringen skapar endast en server-only RPC; redan lagrade tider ändras inte vid installation.

## Säkerhet och funktion
Servern verifierar inloggad identitet och befintlig webmasterroll. SQL-funktionen kontrollerar rollen på nytt, har tom search_path och kan inte köras av anon/authenticated/PUBLIC. SECURITY DEFINER följer befintlig server-only gateway; klienten får aldrig en privilegierad nyckel.
Albumrad låses. Tid och audit skrivs i samma transaktion; fel återställer båda. Revision skyddar mot olika samtidiga ändringar. Exakt upprepad sparning är en no-op. API accepterar bara tillåtna fält och giltig UTC-period; aktör tas alltid från verifierad session.
Förlängning räknas från senare av nu/sluttid. Tillfällig stängning kvarstår tills webmaster uttryckligen bockar ur den. Datumen visas i enhetens tydligt angivna tidszon; servern lagrar UTC. Bildgräns, ägare och namn ändras inte i denna funktion.

## Återställning
Före originalinstallation: spara ny gren på faktisk HEAD och exakt Edge-källkod. Vid fel: återställ tidigare Edge-kod först (inga settings-capabilities), då visar frontend åter read-only. Den nya RPC:n kan lämnas oanvänd med server-only grants tills separat återställning godkänns. Eventuella avsiktliga tidsändringar återställs selektivt från schedule_audit med ny audit/revision, aldrig genom blind rollback av hela databasen.

## Verifiering
PASS lokalt: syntax alla nio HTML-ingångar; datum/status/DST-gap och förlängning; disabled innan capability; UTC/revision i save; konflikt-readback; mockad Edge 401/403/400/409; lazy galleri och stängda sekundärverktyg; ägarpreview kvar.
SQL har granskats mot faktiskt kolumn-/constraint-/triggerunderlag men INTE installerats eller körts. Ingen DB/runtime/DEVICE PASS. Ingen mobil rendering verifierad här.
Godkännande som behövs: testinstallation och tester först, sedan kontrollerad originalinstallation endast om dessa passerar.
