# Remember — uppladdningsgranskning 2026-10-21

Granskad appkod: 0.1.156, commit c2a92d5543859bc5adda883dc37ab4a0db0138ac, gren ccc-demo-public-test. Dokumentations-/testcheckpoint 0.1.157. Ingen uppladdningslogik, Edge-installation eller bestående databasändring gjord i detta steg. CURRENT/PREVIOUS är fortsatt null.

## Tidigare användartest är klart
Projektägaren förtydligade: ”Det är testat redan, liksom att det fungerar som albumägare och gästläge.” Det avser den föreslagna webmasterförlängningen/spara/återöppna och ägar-/gästflödena. Notera USER-REPORTED PASS. Begär inte samma test igen. Detta är inte ett nätverksspår eller godkännande av avbrottshantering och samtidiga sista-platsen-anrop.

## Faktiskt kontrollerad kedja
- Supabase direktåtkomst fungerar: container13-remember, wykvztfmfbboxiqvuvwr, ACTIVE_HEALTHY. Ordinarie Remember är utvecklingsmiljön enligt projektägaren; separat testinloggning används inte.
- Aktiv remember-photo-upload v3 hämtad direkt; verify_jwt=false, funktionen verifierar själv gästtoken eller ägarens bearer-session. Källan matchar exakt development-installed/2026-10-21-controls/remember-photo-upload/index.ts i den granskade commiten.
- Sju installerade uppladdnings-RPC:er lästa med pg_get_functiondef. Sex relevanta reserv-/claim-/complete-/fail-RPC:er har execute=false för anon/authenticated och true för service_role.
- Aktiva klientvägar: album.html bibliotek och kamera, owner.html samt album-admin.html. Alla skapar crypto.randomUUID() inne i varje nytt försök och komprimerar om filen.
- photo-upload-preparation.js är en äldre fristående förberedelse, inte ägare till de aktuella upload-anropen. Ingen ny parallell uploader infördes.
- Albumradlås används vid reservation och ett unikt partiellt index skyddar (album_id, content_sha256) i uploading/ready. Det visar skyddets konstruktion; inga verkligt samtidiga HTTP-anrop utfördes här.

## Verkliga SQL-tester — en transaktion, ROLLBACK
Körfil: tests/upload-quota-rollback.sql. Använder tre nya slump-UUID-album med en befintlig ägare; inga befintliga album ändras. SQL-complete anropas med syntetiska metadata enbart i transaktionen; det motsvarar inte uppladdade bildfiler.

- PASS: default 10; guest + owner 11th blocked with mixed counted states
- PASS: duplicate against ready photo rejected; slot released
- PASS: expired reserved slot reclaimed without exceeding quota
- KNOWN GAP REPRODUCED: guest replay preserves photo ID; Edge currently rejects existing
- KNOWN GAP REPRODUCED: owner retry after successful commit returns existing denial
- PASS: same digest in another album accepted
- PASS: same digest in same album rejected; no extra counted slot
- PASS: uploading slot never released solely on timeout
- PASS: wrong owner, closed guest and inactive owner denied

Efter sista ROLLBACK verifierades: 2 album, 10 fotoposter, 10 Storage-objekt; 0 DISPOSABLE UPLOAD REVIEW-album. Samma fullständiga album-/fotodigests före och efter (md5 av sorterade JSON-rader; används bara för ändringskontroll):
- album: cccec37e02ececbfd752aaa7926062dd
- foto: fba1dd505acc953a9d3ce5e0a19c5d74
Inga Storage-anrop gjordes av SQL-testet eller Node-testet.

## Automatiskt Node-test av faktisk kod
Kör: `node remember/tests/upload-retry-characterization.cjs` (kört med Node 24.19.0, inga externa paket). Läser verkliga upload-funktioner ur HTML samt ovanstående live-matchade arkiverade Edge-källa. Auth/HTTP/Storage är mockade, ingen riktig mobilwebbläsare.

8 Edge-assertioner passerade och 7 förekomster av kända luckor reproducerades. ”KNOWN GAP REPRODUCED” är inte feature PASS. Testet bevarar nuvarande fel som karakterisering, och måste ändras till positiva återhämtningskrav när rättningen byggs.
- Kvotstopp och dubblett går inte till Storage; dubbletten har svenskt meddelande.
- Både gäst och ägare får 409 på befintligt request-ID; ingen återhämtning sker.
- Alla fyra klientvägar behåller den misslyckade filen men skapar nytt request-ID vid manuellt nytt försök efter förlorat svar.
- Storage-fel + misslyckad kontroll lämnar uploading räknad, vilket skyddar mot för tidigt släppt kvot men saknar återupptagningsväg här.
- Bevisat saknat objekt släpper slot; normal sparning jämför återlästa byte före complete; felaktiga byte markeras inte ready.

## Bekräftad brist och nästa sammanhängande rättning
Nuvarande felkedja: server kan ha sparat filen men klienten förlorar svaret -> nytt försök skapar ny reservation -> samma bytes blir dubblett, eller tidigare uploading blockerar. Att bara behålla request-ID i klienten räcker inte: Edge avvisar reason=existing för både gäst och ägare, och ägar-RPC returnerar inte photoId vid replay.

Nästa kodarbete:
1. Behåll samma request-ID och färdigkomprimerade bytes för varje köpost, även vid manuellt och automatiskt återförsök. Begränsad automatisk retry bara för tillfälliga fel, aldrig för kvot/dubblett/behörighet. Hantera osäkert utfall genom statuskontroll.
2. Serververifierad status/replay/resume för samma auktorisation, album, request-ID och innehållsdigest. Redan ready ska kunna bekräftas som sparad; uploading ska verifieras mot privat Storage. Ingen blind upsert, borttagning eller förtida kvotfrisläppning. Ny kontroll av gästlänk/albumstatus/tidsfönster innan nya writes.
3. Bestäm återställningsväg för övergivna uploading-poster och tydlig köåterkoppling för permanent avvisad bild. Separat beslut krävs om kö ska överleva att appen stängs; det är inte implementerat av nuvarande minneskö.
4. Före backendinstallation: sparade före-källor/RPC/grants, granskad ändring och migrations-/versionsregler. Bevara fungerande albumkontroller, bildvisare och fotobok. Tester av förlorat svar i varje steg, exakt ett foto/en kvotplats, parallell sista plats, samtidiga replay och stängning/återkallad token under överföring.

Återstår: verkligt samtidiga DB/HTTP-anrop, fysiskt nätavbrott i iPhone och positiv verifiering av den framtida rättningen. Inga sådana PASS påstås här. Ingen funktionell rättning installerad i denna checkpoint.
