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
