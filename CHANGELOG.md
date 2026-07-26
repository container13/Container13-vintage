# Ändringslogg

## Version 6.6.5

- Ger Bakgrundsbild och Bildanpassning samma visuella höjd.
- Samlar Spara kopia på mobilen och Snabbfotoläge i samma kamerablock.
- Visar kameravalen i två jämna kolumner på dator och staplade på mobil.
- Gör öppettidsrader och tidsfält försiktigt mer kompakta.

## Version 6.6.4

- Lägger till Aktivera på hemsidan direkt på förhandsvisningssidan.
- Skickar de testade tiderna tillbaka till den inloggade adminpanelen.
- Adminpanelen aktiverar sedan hela animationen, inklusive eventuell uppladdad bild.
- Visar bekräftelse eller fel direkt på förhandsvisningen.
- Skyddar aktiveringen med en unik engångskod för varje öppnad förhandsvisning.

## Version 6.6.3

- Lägger till redigerbara tider direkt på förhandsvisningssidan.
- Testaren kan ändra krymptid eller väntetid och stjärnöppningens tid.
- Kör testet igen använder de nya testvärdena omedelbart.
- Återställ tider återgår till värdena som skickades från adminpanelen.
- Testvärdena sparas eller aktiveras inte automatiskt.

## Version 6.6.2

- Förfinar bildanimationen till en sammanhängande tvåstegseffekt.
- En stor guldstjärna täcker först skärmen och krymper över bakgrundsbilden.
- När guldstjärnan försvunnit öppnas bilden med en växande genomskinlig stjärna.
- Hemsidan visas under öppningen och bilden försvinner.
- Stjärnfärgen kan även väljas för bildalternativet.

## Version 6.6.1

- Rätar upp färg-, tids- och bildfälten i separata jämna sektioner.
- Ersätter animationsrullistan på huvudsidan med fyra tydliga alternativkort.
- Flyttar aktiv status högst upp.
- Förbättrar bilduppladdningen med en större valyta.
- Förfinar knappordning och mobilanpassning utan att ändra animationsfunktionen.

## Version 6.6.0

- Ger Startanimation en egen flik i dashboarden.
- Lägger till fyra val: klassisk, krympande guldstjärna, bakgrundsbild och ingen animation.
- Låter administratören ladda upp en komprimerad bakgrundsbild.
- Erbjuder bildlägena Fyll skärmen och Visa hela bilden.
- Visar uppladdad bild och stödjer förhandsgranskning innan aktivering.
- Behåller reservfärg om bilden inte kan laddas.
- Förenklar valet under vanliga Inställningar.

## Version 6.5.4

- Visar separat vilken animation som är aktiv på hemsidan.
- Visar när formuläret innehåller ett val som ännu inte är aktiverat.
- Lägger till en egen knapp för att aktivera animationen direkt i animationssektionen.
- Aktiveringsknappen sparar endast animationens val, färger och tider.

## Version 6.5.3

- Markerar de utprovade originaltiderna med guldram och tydlig text.
- Tar bort markeringen direkt när tiden ändras.
- Lägger till knappen Återställ utprovade tider för 0,5 s + 1,0 s.

## Version 6.5.2

- Byter förhandsvisningens SVG-ritning mot stabil canvas-ritning.
- Rättar felet där knappen Kör testet igen inte visade någon animation i Chrome.

## Version 6.5.1

- Lägger till knappen Förhandsgranska animation i adminpanelen.
- Öppnar en mobilvänlig testsida med formulärets aktuella, även osparade, värden.
- Förhandsgranskningen sparar ingenting och påverkar inte den aktiva hemsidan.
- Animationen kan köras igen direkt på testsidan.

## Version 6.5.0

- Lägger till val av startanimation i adminpanelen.
- Erbjuder Klassisk stjärnöppning, Krympande guldstjärna och Ingen animation.
- Låter administratören välja bakgrundsfärg och stjärnfärg.
- Låter administratören ändra inledande tid och stjärnöppningens tid.
- Hämtar animationsinställningarna tidigt från Firestore på startsidan.

## Version 6.4.2

- Byter mobilens SVG-mask mot en stabil SVG-bana med `evenodd`.
- Visar svart skärm i 0,5 sekunder.
- Öppnar stjärnan på 1 sekund med jämnare rörelse.
- Behåller den fungerande canvas-animationen på dator.

## Version 6.4.1

- Byter till en JavaScript-styrd SVG-mask för stabilare stjärnöppning.
- Tar bort den osäkra kontrollen av föregående webbadress.
- Låter Hem-länkarna markera att stjärnan inte ska visas.
- Lägger till testadressen `?star=1`, som alltid visar animationen.
- Uppdaterar cacheversionen för den gemensamma layoutfilen.

## Version 6.4.0

- Lägger till en helsvart stjärnöppning på startsidan.
- Webbplatsen avslöjas genom en växande femuddig stjärna.
- Animationen visas bara vid första öppningen i den aktuella fliken.
- Klick på Hem från en annan Container13-sida visar startsidan direkt.
- Besökare som föredrar reducerad rörelse får ingen animation.

## Version 6.3.7

- Lägger loggstorleken direkt i Butiken, Nyinkommet, Kontakt och Hitta hit.
- Gör loggändringen oberoende av en äldre cachad CSS-fil.
- Höjer CSS-cacheversionen på alla publika sidor.

## Version 6.3.6

- Ger Butiken, Nyinkommet, Kontakt och Hitta hit samma stora logotyp som startsidan på dator.
- Minskar det visuella mellanrummet mellan logotypen och rubriken på dator.
- Behåller den godkända mobilstorleken på logotypen.
- Anpassar text och knappar i adminpanelens papperskorg till de kompakta bildkorten.
- Rättar Återställ-knappens gamla minsta bredd så att knapparna inte kapas.
- Uppdaterar CSS-cacheversionen på samtliga publika sidor.

## Version 6.3.5

- Förstorar startsidans logotyp från 560 px till 680 px på dator.
- Mobilstorleken lämnas oförändrad.
- Uppdaterar startsidans CSS-cacheversion.

## Version 6.3.4

- Gör listan med avvikande öppettider kompakt och centrerad.
- Drar ihop avståndet mellan datum och öppettid eller Stängt.
- Uppdaterar kontaktsidans CSS-cacheversion.

## Version 6.3.3

- Förstorar startsidans logotyp från 420 px till 560 px på skärmar från 900 px.
- Mobilstorleken lämnas oförändrad.
- Uppdaterar startsidans CSS-cacheversion så att ändringen syns direkt.

## Version 6.3.2

- Återställer ett tydligt mellanrum mellan ordinarie öppettider och rubriken Avvikande öppettider.
- Uppdaterar cacheversionen på kontaktsidan så att den nya stilen hämtas direkt.

## Version 6.3.1

- Nytt dashboardkort: **Öppnat från hemskärmen**.
- Kortet räknar unika enheter som faktiskt har öppnat Container13 i installerat appläge.
- Bygger vidare på den bekräftat fungerande besöksstatistiken i version 6.3.0.

## Version 6.3.0

- Anonym besöksstatistik på webbplatsens fem publika sidor.
- Unika besökare totalt, idag och senaste 7 dagarna i Dashboard.
- Totala sidvisningar och antal besökare som använt hemskärmsappen.
- Lista över mest besökta sidor.
- Ingen lagring av namn, e-postadress eller exakt position.
- Ny fil med Firestore-regler för statistik.

## Version 6.1.0

- Valbar visningstid för Nyinkommet: 7, 14, 30, valfritt 1–30 dagar eller manuell borttagning.
- Publika sidan och startsidan filtrerar bilder efter vald tid.
- Förhandsgranskning visar hur många bilder som visas respektive döljs.
- Ny kamerainställning som försöker ladda ner en kopia till mobilen efter publicering.
- Standard är 7 dagar och kopia på mobilen är avstängd.

# Version 5.1 – separata hemskärmsikoner

- Kundwebbplatsen heter **Container13** på hemskärmen.
- Adminpanelen heter **C13 Admin** på hemskärmen.
- Kundwebbplats och adminpanel har tydligt olika ikoner.
- Separata manifest, startadresser och PWA-identiteter används.
- Adminikonen har mörk bakgrund och tydlig ADMIN-märkning.

# Ändringslogg

## Version 4.0.0

### Städning och stabilisering

- Utgår från den fungerande version 3.6.1.
- Behåller galleri, Nyinkommet, informationsrad och avvikande öppettider oförändrade.
- Flyttar två äldre JavaScript-filer som inte längre används från den aktiva `js/`-mappen till `backup/legacy-js/`:
  - `bilder.js`
  - `script.js`
- Standardiserar cacheversionen för webbplatsens lokala CSS- och JavaScript-filer till `v=4.0.0`.
- Uppdaterar projektdokumentationen så att den beskriver den faktiska Firebase-baserade lösningen.
- Lägger till en testlista och en tydlig versionsfil.

### Ingen avsiktlig visuell förändring

Version 4.0.0 ska se ut och fungera som den godkända version 3.6.1. Syftet är att skapa en renare och säkrare grund inför kommande funktioner.

## Version 4.1
- Papperskorg för bilder från Nyinkommet och Galleri.
- Återställning och permanent radering.
- Automatisk rensning efter 48 timmar när adminpanelen öppnas.


## Version 4.2
- Dashboard visas som startsida efter inloggning.
- Statistik för Galleri, Nyinkommet och Papperskorg.
- Status för informationsrad och butikens öppet/stängt-läge.
- Nästa avvikande öppettid och snabbknappar till vanliga funktioner.

## Version 4.2.1
- Rättar navigeringen så att Dashboard alltid är klickbar från vänstermenyn.
- Lägger till tangentbordsstöd för Dashboard-knappen.


## Version 4.3
- Klickbar sida för Inställningar i adminpanelen.
- Kontaktuppgifter, sociala länkar och copyright kan ändras utan kod.
- Valbar lagringstid för papperskorgen mellan 1 och 7 dagar.
- Kontakt, Hitta hit och sidfoten hämtar automatiskt sparade uppgifter från Firestore.

## Version 4.3.1
- Rättar navigeringen till Inställningar i adminpanelen.
- Lägger till robust klickhantering och tangentbordsstöd för menyvalet.

## Version 5.0 – Admin som webbapp
- Adminpanelen kan läggas på mobilens hemskärm med egen Container13-ikon.
- Öppnas i fristående app-läge utan vanlig webbläsarram när plattformen stöder det.
- Manifest, Apple-inställningar och service worker har lagts till.
- Grundfiler cachas för snabbare start och enklare återöppning.

## Version 6.1
- Stor kameraknapp direkt på adminpanelens Dashboard.
- Kamera och bildbibliotek kan öppnas direkt från Dashboard.
- Förhandsvisning och möjlighet att ta om bilden före publicering.
- Ta nästa foto, återgå till Dashboard och ångra senaste uppladdningen.
- Ångrad uppladdning flyttas till befintlig papperskorg.
- Valbart snabbfotoläge under Inställningar.
- Dashboard visar dagens antal uppladdningar och den senaste uppladdningen.
- Administrationsappens service worker-cache uppdaterad till v6.
