# Gratisalbum:30 bilder i mobilkvalitet —0.1.168

## Beslut2026-10-22
Projektägaren: ”Då kör vi med mobilkvalitet på30 bilder tycker jag!!!” Detta ersätter tidigare preliminära50 bilder/tryckkvalitet. Synlig huvudformulering fortsätter vara **Testa gratis**. Villkoren vid albumskapande och startsidans informationsdialog anger30 bilder, digital kvalitet och att en uppgradering inte förbättrar tidigare uppladdningar: original måste laddas upp igen. Högupplöst betaluppladdning är inte implementerad här.

## Omfattning och en källa
- Ordinarie Remember utvecklingsprojekt `wykvztfmfbboxiqvuvwr`; remember-test används inte.
- `remember.albums.photo_limit` default30. Båda skapande-RPC:erna använder nu SQL DEFAULT i stället för ett inbakat10. Ingen ny klientstyrd kvotparameter.
- Befintliga album med den gamla standardgränsen10 höjs till30. Andra gränser lämnas orörda. Vid installation fanns fyra album, alla med gränsen10.
- Inga ändringar av befintlig bildförberedelse:1920px längsta sida, ingen uppskalning, WebP eller JPEG, mjukt mål600KiB, original högst10MiB, servergräns2MiB. Filstorlek är inte garanterad. Alla vanliga kamera-/filvägar använder redan den gemensamma förberedelsen.
- Oförändrad fotoboksmotor, autentisering, gästgranskning, avstängning, tidsregler, uppladdningsåterförsök, radering och Storage-policy.

## Installation och faktisk verifiering
- Migration `20261022112631_remember_free_mobile_30_0168` installerad. Källan är `migration.sql`.
- Före installation kördes samma migration + riktiga RPC-prov i transaktion med ROLLBACK. Samma prover passerade igen efter installation, utan permanent testdata.
- Öppen och granskad registrering får30; mode bevaras. Återförsök av konsumerad registrering bevarar ett särskilt ändrat45-värde i testtransaktionen.
- Webmaster-skapande ger30.
- Aktiv `remember_photo_upload_request` accepterar30, nekar31 för gäst/ägare/verifierad webmaster, och identiskt återförsök behåller30 poster.
- `verify-rollback.sql` är reproducerbart prov. Den äldre karakteriseringssviten `tests/upload-quota-rollback.sql` har också körts med30/31: kvot, blandade tillstånd, utgången reservation, deduplicering och behörighet PASS. Dess märkta KNOWN GAP-rader gäller enbart äldre RPC-svar; den aktiva retry-säkra vägen verifieras separat ovan.
- Exakt readback av två installerade funktionsdefinitioner mot migrationen:PASS. Tidigare ACL identisk, endast postgres/service_role. Säkerhetsrådgivarens fynd oförändrade när observed_at ignoreras.
- Före/efter:13 bildrader och13 Storage-objekt. Hela radinnehållets hash oförändrad för båda. För samtliga fyra befintliga album är alla andra fält än photo_limit exakt oförändrade. Ingen omkomprimering, radering eller filuppladdning utförd.
- Chromium153 formulärprov på320/390/768/1280: villkor läsbara, ingen horisontell overflow, granskningsval fortsatt användbara. Startsida informationsdialog öppnar/stänger och visar båda villkoren. Inline-script i alla nio HTML-ingångar syntaxkontrollerade.
- GitHub/Actions/publicerad HTML ska läsas tillbaka efter commit. Fullständig inloggad HTTP-uppladdning av30 foton och fysisk iPhonekontroll är inte utförda av assistenten. CURRENT/PREVIOUS förblir null.

## Återställning
Frontend-baslinje: `remember/before-mobile30-2026-10-22-0167`, commit `5b78e11f790f62b848d238517c7b3435138077fe`, skapad och exakt återläst före installation.
`before-functions.sql` innehåller de två ursprungliga definitionerna samt default10; filen återställer inte albumrader. För eventuell kvotåterställning måste de fyra faktiskt ändrade albumen identifieras från installationslogg/denna arbetskörnings baseline, och aktuellt bildantal kontrolleras. Sänk aldrig ett album till10 om det redan har fler räknade bilder. Återställning körs inte automatiskt; inga bilder får raderas för att passa en gammal gräns. Andra album/specialgränser måste bevaras.
