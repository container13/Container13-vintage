# Ändringslogg

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
