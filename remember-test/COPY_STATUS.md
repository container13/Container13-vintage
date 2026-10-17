# Remember Test – kopieringsstatus (2026-10-17)

## Resultat
De 21 identifierade webbappsfilerna i `remember/` har kopierats till `remember-test/` på grenen `ccc-demo-public-test`. De nio tidigare saknade eller avvikande filerna är nu skrivna och återlästa från GitHub.

- Riktiga `register.html` och `activate.html` har ersatt tidigare förenklade testvarianter.
- `owner.html`, `album.html`, `remember-account-access.js` och `photo-crop.js` finns.
- `manifest.webmanifest`, `release.json` och `pwa-display-test.html` finns.
- Tidigare kopierade 12 filer finns enligt föregående inventering.
- Supabase-referenser och publicerbar nyckel har ersatts med testprojektets uppgifter i kopiorna.
- Registrering och login använder separat Auth-storage-key för testet.
- Kopierade HTML-sidor har tydlig TEST-markering.

## Viktiga gränser
- GitHub-readback är verifierad för de nio senast kompletterade filerna; inga påståenden om fullständig E2E eller mobil-PASS.
- Test-Supabase: `kauxrvshxgpbvptdwhog`; original: `wykvztfmfbboxiqvuvwr`.
- Gemensamma `../project-template/`-resurser och originalets statiska bakgrundsbild återanvänds enbart för läsning.
- Ingen kopiering av verkliga användare, album eller bilder.
- Ingen ändring av originalets Supabase-projekt eller säkerhetsmodul.
- Webbdrift, alla Auth-redirects, Edge Function-hemligheter, registrering, albumskapande, uppladdning, gästlänk och mobilupplevelse är ännu inte end-to-end-verifierade.
- Detta är en källkodskopia, inte ett verifierat produktionsklart test.

## Nästa acceptanssteg
1. Kontrollera HTTP-leverans av testfrontend och att manifest, JS och CSS laddas.
2. Kontrollera att samtliga externa API-anrop går till testprojektet och att testets Auth redirect-allowlist är korrekt.
3. Registrera ett nytt testkonto, aktivera via test-SMTP och prova album, bilder och gästlänk.
4. Först efter godkänt E2E: börja säkerhetsmodulens tester i testmiljön.
