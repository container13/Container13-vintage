# Installerade gästnivåer 0.1.162
Datum 2026-10-22. Ordinarie Remember UTVECKLING, Supabase wykvztfmfbboxiqvuvwr.
Projektägaren godkände uttryckligen SQL-installation och publicering efter färdigställt förslag.

## Källa och återställningspunkt
- Godkänt förslag: dddc9b3729337c0a86563b1f5905954b64d4d47a på remember/guest-modes-0162.
- Före publicering: a33cef3996f63235a2426c3f537d1f6943e69bb7 (.161).
- Ny säkerhetsgren remember/before-guest-modes-2026-10-22-0161 exakt verifierad på före-commit.
- Två installerade Edge-källor före ändring matchade before/-arkivet exakt: onboarding v1 och guest-metadata v2, båda verify_jwt=false.
- Befintliga tre SQL-definitioner matchade before/functions.sql före installation.
- .137-säkerhetsgrenen bevaras. Detta är inte ett fullständigt tjänsteåterställningstest. Följ README:s skyddade rollback om granskade album hunnit skapas; ta inte bort granskning eller kolumner blint.

## Databas
Godkänd INSTALL_REVIEW_FIRST.sql installerad med apply_migration som remember_album_guest_modes_0162, migrationsversion 20261022054607. Verktyget svarade success:true.
Fyra installerade prosrc-källor exakt jämförda med godkänt förslag:
remember_complete_album_registration, remember_security_effective_feature_read, remember_photo_gallery_read, remember_guest_metadata_read.

Ny RPC har ACL endast postgres/service_role. has_function_privilege ger anon=false, authenticated=false, service_role=true. Verkliga anrop under SET LOCAL ROLE anon respektive authenticated i READ ONLY/ROLLBACK gav insufficient_privilege, assertion PASS.
Befintliga två album har guest_mode=open. Global photo_approval fortfarande OFF; granskade nya album styrs av sitt uttryckliga val.

Hela ROLLBACK_TEST.sql kördes i originalets databas. Resultat guest_modes_and_approval_pass:true. Testet skapade endast syntetiska metadatafixturer i transaktionen och återställde dem med ROLLBACK. Verifierar båda lägena, sparat val, idempotent färdigställning, ready-trigger, väntande köpost, osynlig gästbild före beslut, synlig efter godkännande och gästmetadata. Ingen Storageoperation.

## Bevarad data
Före/efter: 2 album, 11 fotorader, 11 privata Storageobjekt. Inga kvarvarande testalbum.
Digests jämfördes efter avdrag av tillagda guest_mode-fält:
- Album: 1b1948730e9b517ce8425417355eb396
- Foton: 7d5033100cce424e05bd08706fcb15bb
- Registreringsutkast: b3ed1701caf5932d398d7f96fd8eb83a
- Säkerhetsinställningar: d41d8cd98f00b204e9800998ecf8427e
- Funktionsflaggor: 4bdd8f41c223445195ebcb7524f4cc6e

Säkerhetsråd exakt oförändrade när observed_at ignoreras: befintliga 3 WARN/10 INFO. Ingen ny funktion tillgänglig för anon/authenticated. Inga ändringar i CCC/Lina.

## Edge och HTTP
remember-onboarding uppdaterad till v2; remember-guest-metadata till v3. Båda ACTIVE, exakt installerad källreadback, verify_jwt=false bevarad. Onboarding complete verifierar fortfarande auth.getUser och bekräftad e-post; RPC:n kontrollerar dessutom konto/e-post och utför atomisk skrivning.

Verklig HTTP med versionsheader 0.1.162:
- Complete utan session: 401.
- Complete med avsiktligt ogiltig session: 401.
- Fel Origin: 403.
- Stage med ogiltigt gästläge: 400, ingen registreringsrad skapas.
- Okänd korrekt formad gästtoken: 200 found:false.

Inget mejl skickat av assistenten och inget befintligt album/bild raderat. Ingen riktig användarsession har lästs eller kopierats.

## Publicering och kvarvarande verifiering
Frontendens funktionskod är samma som godkänd kandidat; denna commit uppdaterar installationsstatus och dokumentation. Nio entrypoints och release/version är .162. Kontrollera CI/Pages och livebytes för slutcommit efter push; grön CI är inte iPhone-PASS.

Nästa användartest: skapa ett granskat album i vanliga Remember, öppna dess gästlänk och ladda upp en bild. Gästen får väntemeddelande; bilden ska inte synas i gästgalleriet. Godkänn som faktisk albumägare i owner.html under granskningen och kontrollera gästgalleriet igen. Öppet läge ska fortsatt visa bilder direkt. Befintliga album behöver inte ändras för testet.

Inloggade gäster, egna gästraderingar, personliga inbjudningar och automatisk 72h-rensning ingår inte. Även ägarens egna nya uppladdningar går genom kön i granskat album. Autentiserad HTTP-/iPhone-acceptans och HTTP-samtidighet är inte utförda. CURRENT/PREVIOUS fortfarande null.
