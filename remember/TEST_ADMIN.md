# Remember – separat testvy för albuminställningar
2026-10-21. Kandidat **0.1.152**. Endast remember-test.

## Öppna
https://container13.se/remember/test-admin.html

Logga in med befintligt konto i remember-test och dess lösenord. Kontot är separat från vanliga Remember. Läsning före bygget bekräftade att ett befintligt bekräftat testkonto har lösenord och webmastermedlemskap; inga lösenord lästes, återställdes eller ändrades.

1. Testalbumen visas efter serverns behörighetskontroll.
2. Tryck eller dra reglaget, avbryt först och kontrollera att inget sparas. Bekräfta sedan avstängning och återaktivering.
3. Öppna albumet för tider. För passerad sluttid räknas återöppning från nu; framtida vald sluttid förlängs från den tiden.
4. Knappen ändrar bara utkastet. Välj **Spara ändringar**, gå tillbaka och öppna albumet igen för att kontrollera återläsningen.
5. Tillfällig uppladdningsstängning behålls tills den uttryckligen avmarkeras. Återaktivering förlänger inte tiderna.
6. Logga ut från testvyn när kontrollen är klar.

## En ägare per beteende
Testsidan importerar samma `webmaster-album-activation.js` och `webmaster-album-settings.js` som ordinarie frontend. Inga kopior eller alternativa reglage-/förlängningsalgoritmer. Gemensam design-CSS återanvänds med en liten testspecifik layout. Befintliga controllers och fotobokens kod ändras inte.

`test-admin.js` har en fast test-URL och egen auth-storage key `container13-remember-test-admin-auth-v1`. Den kan inte välja miljö via URL eller formulär. Ingen original-URL eller originalnyckel finns i testadapterkoden. Endast publicerbar nyckel ingår, aldrig service_role/hemlig nyckel. Serverns befintliga Auth/rollkontroll krävs för varje anrop. Tillåtna anrop är list/read/save för de två funktionerna. Ingen signup, mejlsändning, tokenrotation eller automatisk testdatasimulering.

Inloggningen används endast i testsidan; den vanliga appens sessionsnyckel och inloggning påverkas inte. Inga sessioner/lösenord skrivs till diagnostik eller testprotokoll. Testsidan upptäcker inte sessioner från URL och skickar inte användaren vidare till originalets dashboard.

Initialt spärras tidsfälten tills en färsk serverläsning är klar. Sparande bekräftas av servern. Konflikt hämtar aktuella uppgifter utan automatisk omskrivning. Navigering/utloggning varnar vid osparat tidsutkast. Sessionbyte tömmer testdata; sena svar från tidigare konto får inte fylla vyn igen.

## Verifiering
- Node syntax PASS.
- jsdom 26.1.0: isolerad URL/nyckel, felaktig inloggning och tömt lösenordsfält, activation read/save/avbryt/återaktivering, tidsutkast från nu/framtida slut, manuell stängning bevarad, osparat-navigering, revisionskonflikt/readback utan autoretry, 403 stänger listan och lokal testutloggning PASS.
- Chromium 153 med Playwright 1.62.1: motsvarande interaktioner PASS med mockad Auth/HTTP; list- och tidsvyer kontrollerade i 360/390/768/1280 px utan horisontell överströmning. Skärmbild granskad separat. Detta är ingen iPhone-PASS eller autentiserad Supabase-PASS.
- Supabase-klienten är låst till 2.118.0; exakt CDN-URL returnerade HTTP 200. Relevanta aktuella Auth-dokument och TLS-changelog lästa.
- Faktisk publicering/klientstart kontrolleras efter commit. Autentiserad test-HTTP och iPhoneacceptans är fortfarande PENDING tills verkligt testkonto används.
- Inga databas- eller Edge-skrivningar utförda i detta frontendsteg. Tidigare testinstallation: [protokoll](test-installed/2026-10-21-settings-activation/README.md).

DOM-test finns i `tests/test-admin-dom.cjs`. Kör med Node 24 och jsdom 26.1.0, exempelvis installera jsdom i en temporär katalog och ange dess node_modules via NODE_PATH. Tester använder bara lokala mocksessioner/HTTP och .invalid-adresser.

## Versions- och livscykelregel
Denna diagnostiska testsida använder samma aktuella versionsnummer men ligger utanför de nio ordinarie releaseingångarna. Den har ingen appinstallation eller auto-update-reload, så ett pågående tidsutkast inte avbryts av originalappens updater. Ladda om testsidan vid ny testversion.

Ägare/syfte: projektägaren Magnus, verifiering av två installerade testfunktioner. Behåll tills autentiserad HTTP/iPhone är godkända och originalportning granskats; ta därefter uttryckligt beslut om avveckling. Ingen automatisk promotion. Originalets backendfunktioner är fortfarande inte installerade. CURRENT/PREVIOUS förblir null.

Återställningsbas före testsidan: `a8f62f7256b07d6171364aa016cba124071dc7f7`. Vid frontendrollback återställ endast testsidans filer och gör ordinarie versionssynk enligt projektregeln. Rör inte testbackendens audit/state/spärrar eller andra delar av repot.
