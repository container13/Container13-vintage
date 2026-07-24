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
