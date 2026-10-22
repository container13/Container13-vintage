# Bildkvalitet inför upp till 50 bilder — 0.1.167
2026-10-22. Förberedande jämförelse, inte införd kvot-/komprimeringsändring.

## Verklig nuvarande uppladdningsväg
Källa caf97fa333ea44f42fef03caaac2cf7cc516a511 (.166): album.html, album-admin.html och owner.html anropar createRememberUploader från upload-session.js, som använder upload-prepare.js och image-compress.js. De äldre kommentarerna ”Not wired”/”NOT enabled yet” i modulerna beskriver historik och stämmer inte med den faktiska kopplingen.

Dagens preparer: högst 1920 px längsta sida, ingen förstoring, mål 600 KiB, WebP om browsern stöder det annars JPEG. Kodningsinställning börjar på0.86 och kan sänkas till0.80/0.74/0.68 tills målet nås eller golvet nåtts. 600KiB är ett mål, inte en garanterad maxstorlek. Källfil får vara högst10MiB och JPEG/PNG/WebP.

Förslaget från tidigare diskussion var upp till50 bilder med fotoboksvänlig komprimering, preliminärt ca2400px och JPEG80–85. Detta är inte fastställt eller installerat. Den tekniska befintliga albumkvoten är oförändrad.

## Jämförelseverktyg
Adress: https://container13.se/remember/image-compress-test.html
Den gamla enkla bildtestvyn har utökats. Ingen inloggning eller testprojekt krävs. Bilden väljs lokalt och skickas inte till Remember, Supabase eller någon annan server. Ingen automatisk releaseuppdatering i den här diagnostiska sidan, så en vald bild avbryts inte av appens updater.

Fyra versioner:
- Originalfilen orörd som referens.
- Dagens exakta produktionsfunktion, importerad oförändrad.
- Förslag högst2400px, JPEG-inställning0.82.
- Förslag högst2400px, JPEG-inställning0.85.

Små original förstoras inte. Samma normaliserade motivdel visas förstorad i varje version och kan flyttas med två reglage. Filstorlek, pixlar och ren pixelberäkning vid300ppi visas. Testversionerna går att spara lokalt för ytterligare jämförelse. Kandidater över befintliga2MiB-gränsen flaggas; ett sådant förslag kan inte bara kopplas in i uppladdningen.

Exempel för en4:3-bild, före beskärning:
| Version | Pixlar | Storlek vid300ppi |
|---|---|---|
| Dagens max | 1920×1440 | ca16.3×12.2cm |
| Förslag max | 2400×1800 | ca20.3×15.2cm |

Det är geometri, inte ett löfte om tryckkvalitet. Motiv, rörelseoskärpa, beskärning och storlek i boken påverkar bedömningen. JPEG-kvalitetstalen kan inte jämföras som en uppmätt procentuell bildkvalitet, särskilt inte mellan WebP/JPEG eller olika webbläsare.

Volymen för50 bilder räknas som50×den testade filens storlek. Det är ett exempel på bilddata, inte leverantörens samlade användning, trafik eller pengar. Ingen aktuell plan/pris har verifierats i detta arbete; faktiska kostnader behöver kontrolleras innan kapacitetsbeslut.

## Verifiering
Playwright1.62.1/Chromium153 på lokal fixturserver. Verklig canvas-komprimering, inga mockade kodningsresultat:
- 800×600 förblir800×600 i alla versioner.
- 3024×4032 ger1440×1920 med dagens kod och1800×2400 för båda JPEG-förslagen.
- Kontrollerad4032×3024-JPEG-fixtur ger1920×1440 respektive2400×1800 och tre fungerande nedladdningar.
- Tom, feltyp och överstor fil avvisas. Trasig JPEG rensar gamla resultat och återställer knappar.
- Samma detaljutsnitt ändras via reglage.
- Inga nätverksanrop alls efter att fixturbilden valts och bearbetats. Endast initiala GET för HTML/JS.
- Ingen horisontell overflow vid320/390/1280px; mobilrender granskad.

Körbart test: remember/tests/image-quality-browser.cjs. Kräver Playwright1.62.1 och installerad Chromium. REMEMBER_CHROMIUM_MODULE kan anges för en befintlig paketerad Chromium-runtime. Testbilderna genereras av testet och är ingen representativ fotobokskvalitets-/lagringsmätning.

## Återstår
Välj riktiga mobiloriginal med ansikten, hår, små detaljer och svårare ljus. Granska utsnitt och tänkt storlek i fotoboken, helst även verkligt provtryck. Jämför filstorlekar på flera motiv och kontrollera verklig plan/användning före ett50-bildersbeslut. EXIF-/HEIC-/fysisk iPhone-acceptans är inte verifierad av syntetiska Chromium-fixturer.

Produktionskomprimeraren, backend, albumkvoter, befintliga bilder, bildvisare och fotobok ändras inte av detta testverktyg. Ingen bild raderad eller uppladdad av assistenten. CURRENT/PREVIOUS null. Före-kod finns på .166-commit ovan; diagnostiken kan selektivt återställas utan databasåtgärd.
