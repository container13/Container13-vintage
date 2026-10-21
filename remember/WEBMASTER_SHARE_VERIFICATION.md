# Webmaster delningspopup — 0.1.140
Datum: 2026-10-21. Risk MEDIUM (frontend UI). Baslinje för selektiv rollback: 1b5bf9e0c87e95c114cf9dd3a26e02e958083223.

Ändring: album-admin.html använder befintliga loadShare/displayShare/shareRequest/copy-funktioner i en native dialog endast i webmasterläge. Popup flyttar befintliga noder; ingen kopia av QR-/länk-/ersättningsflödet skapas. Delningsknappen ligger före galleriet. Ägarpreview behåller details; owner.html ändras endast i releaseversion.

Verifierat lokalt:
- Node syntaxkontroll av samtliga nio HTML-ingångars inline-JavaScript.
- jsdom-test med mockad autentisering, listning och share-get: ingen hämtning före öppning, kopiering ger exakt befintlig URL, stäng återställer scroll/fokus, fel visas och återöppning kan lyckas, dubbelöppning skapar inget extra anrop, inga duplicerade QR-/kopieringsnoder.
- Mocken avvisar varje share-action utom get; inga länkändringar sker i testerna.
- Ägarpreview behåller inline-delning.
- Versionsparitet kontrolleras för nio ingångar, reservversion och manifest.
- Fotobok och bildvisarlogik oförändrade.

Begränsningar: DOM-test använder dialogpolyfill och QR-fixture. Ingen faktisk mobil rendering, Safari-gestik eller QR-skanning verifierad för popupen. Lokal webbläsarrendering var otillgänglig; ingen visuell PASS påstås. Testet ersätter inte autentiserad live-/iPhone-kontroll.

iPhone-test: öppna samma album i Webmaster; välj Delning och QR-kod; kontrollera popupens placering, läsbar QR, Kopiera gästlänk, Visa länk, Stäng och att bakomliggande album står stilla/återkommer till samma position. Bekräfta 0.1.140. Ägarens vanliga delning och gästflöde ska fortsätta fungera.
Albumtider ändras inte här. CURRENT/PREVIOUS förblir oförändrade.
