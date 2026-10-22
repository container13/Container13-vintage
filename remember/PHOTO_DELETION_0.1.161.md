# Bildradering 0.1.161
Datum: 2026-10-22. Miljö: ordinarie Remember UTVECKLING, Supabase wykvztfmfbboxiqvuvwr.

## Problem och ändring
Skärmbilder .160 visar delade galleriet i webmastervyn. Det saknade raderingskontroller; albumägarens separata owner.html hade redan papperskorg och bekräftelse. Gemensamma hanterade galleriet har nu Ta bort under varje inramad bild med permanent native-bekräftelse. Avbryt gör inget anrop; väntande radering spärrar dubbeltryck. Fel behåller bilden och visar återförsöksbart meddelande. Gästgalleriet får ingen raderingscallback eller knapp. Helskärmsvisaren och fotoboken ändras inte.

album-admin.html använder befintlig autentiserad owner-manager även i webmasterkontots ägarförhandsvisning. Verkliga albumägaren använder befintlig owner.html. Endast action deletePhoto har utökad serverbehörighet: faktisk albumägare eller verifierad webmaster via befintlig service-only rollkontroll. Ägare kan inte ändra avstängt album; webmaster kan rensa det. Andra ägaråtgärder behåller tidigare ägarbegränsning.

Servern läser fotot inom valt album och väljer object_key själv. Storagefel lämnar fotot ready och kvoten upptagen. Efter lyckad Storage-radering sätts metadata state=deleted, vilket behåller request-ID/digest och blockerar gammalt uppladdningsåterförsök. Förlorat framgångssvar kan upprepas utan ny radering. Ingen schemamigrering eller ACL-ändring. Ingen transaktion över Storage/Postgres: misslyckad metadatauppdatering efter Storage kan tillfälligt lämna en ready-post vars objekt saknas; samma åtgärd kan återförsökas. Slutraderingen tar bort originalobjektet; redan sparade/kopierade bilder eller cachade signerade svar kan inte återkallas.

Efter radering uppdateras galleriet. Webmasteröversiktens kvot använder serverns exakta antal reserved/uploading/ready, inte galleriets begränsade/modererade bildlista. Enbart antalsraden uppdateras, så osparad sluttid bevaras. Om antalsfrågan ensam misslyckas är raderingen ändå lyckad; översiktsantalet uppdateras vid senare omladdning.

## Faktiskt underlag
- 17 mocktester av faktiska Edge-handlern: ägare, webmaster i annans/avstängt/eget avstängt album; saknad/felaktig session; annan användare; avstängd ägare; rollfel; fel foto/annat album/pågående uppladdning; fel UUID; förfalskad objektnyckel; Storage-/metadatafel; tappat framgångssvar.
- 5 DOM-fall: bekräfta, avbryt, fel, gäst utan kontroll + bildvisare, exakt antalsuppdatering utan återställning av osparad sluttid.
- 5 befintliga ägarvytester PASS: aktiv/inaktiv ägare i båda vyerna samt webmaster.
- 4 Chromium 153-fixturer: admin/gäst vid 390/1280 px, rätt 2/3 kolumner, 5px varmvit ram, ingen horisontell overflow, native avbryt/bekräfta, öppna/stäng helskärm och ingen miniatyrram i helskärm. Mobilrender inspekterad. Mockade API-svar, ingen användarsession.
- Verkligt SQL-test i ROLLBACK: syntetiskt album/foto, state=deleted frigör kvot och gammalt upload request-ID ger reason=deleted. Identiteten bevaras. Ingen Storageoperation.
- Installerad owner-manager v6: exakt källreadback, verify_jwt=false bevarad; body kräver auth.getUser. HTTP utan session: 401, X-Remember-Version 0.1.161.
- Efteråt 2 album, 11 fotorader, 11 privata Storageobjekt; oförändrade rad-digests före/efter Edge-deploy. Inga kvarvarande testalbum. Säkerhetsråd identiska bortsett från observed_at.
- Användaren har godkänt .160-inramningen: ”Blev tip top!”, bilder IMG_3898–3900. Det är inte .161-raderings-PASS.

## Körbara tester
`node remember/tests/photo-delete-edge.cjs`
`node --experimental-vm-modules remember/tests/photo-delete-dom.cjs` (jsdom 26.1.0 krävs)
`node --experimental-vm-modules remember/tests/album-owner-access.cjs` (jsdom krävs)
SQL: `remember/tests/photo-delete-rollback.sql`, alltid hela BEGIN–ROLLBACK. Inga befintliga bilder får användas som automatiska destruktiva testfixturer.

## Återställning
Säkerhetsgren: remember/before-photo-delete-2026-10-22-0160.
Exakt commit: 9ddacccf39b7feca3938d72d8b30dd731f81bf21.
Gren och arkiverad tidigare Edge-källa exakt återlästa före deploy:
remember/development-installed/2026-10-21-owner-status/remember-owner-manager/index.ts.
Vid kodrollback återställ berörda frontendfiler och den tidigare Edge-källan (v5-kod), bevara tidigare verify_jwt=false och kontrollera body-autentisering. Publicera med ny version enligt projektregeln och läs tillbaka. Tombstoner ska behållas; inga raderade original återställs automatiskt. Detta är kodåterställningsunderlag, inget genomfört fullständigt tjänsteåterställningstest. .137-säkerhetsgren behålls.

## Återstår
Exakt slutcommit, CI, Pages och livefiler kontrolleras efter push. Riktat användartest som webmaster och faktisk ägare med en bild som får tas bort: avbryt först, bekräfta, kontrollera bestående radering och korrekt antal efter återöppning. Ingen autentiserad fysisk bildradering utförd av assistenten. CURRENT/PREVIOUS fortfarande null.
