# Remember Test – kopieringsstatus (2026-10-17)

Mål: fullständig, funktionslik kopia av `remember/` i `remember-test/`, med separat Supabase-projekt och separata Auth-sessioner. Originalet får fortsätta utvecklas som vanligt.

## Verifierat kopierade filer
- index.html
- login.html
- dashboard.html
- album-admin.html
- webmaster.html
- camera-session-test.html
- photo-gallery.js
- upload-prepare.js
- image-compress.js
- remember-design.css
- auto-update.js
- remember-version.js

De listade filerna har lästs tillbaka från GitHub. Kontrollerade filer innehåller inte originalprojektets Supabase-referens eller dess publika nyckel.

## Kvar att kopiera eller ersätta med faktisk originalkod
- register.html (test har en separat förenklad variant)
- activate.html (test har en separat förenklad variant)
- owner.html
- album.html
- remember-account-access.js
- photo-crop.js
- manifest.webmanifest
- release.json
- pwa-display-test.html (diagnostiksida)

Vissa skrivningar har blockerats av anslutningens säkerhetskontroller. Ingen fil ska räknas som kopierad innan GitHub-readback lyckats. Undvik att använda en alternativ väg för att kringgå blockeringen.

## Isolering och driftsättning
- Test-Supabase: kauxrvshxgpbvptdwhog
- Test-webb: https://container13.se/remember-test/
- Originalets databas, användare och filer ska inte ändras.
- Gemensamma statiska resurser under `../project-template/` används av båda och ska inte ändras som del av kopieringen.
- Bakgrundsbilden i testets CSS refererar till `../remember/assets/backgrounds/inloggning.webp`; det är en läsresurs, inte en skrivkoppling.
- Testversionens `auto-update.js` är kopierad men bör granskas mot versionsfilen innan mobilacceptans.
- Registrering, aktivering, albumskapande, bilduppladdning och gästlänk har INTE end-to-end-testats i testmiljön.
- Säkerhetsmodulens SQL är fortfarande REVIEW ONLY och har INTE installerats.

## Acceptanskriterium
Först när alla nödvändiga filer finns, all API- och Auth-trafik pekar på testprojektet och hela användarflödet fungerar får testkopian märkas klar.
