# CCC Core

CCC Core är den gemensamma plattformen som framtida CCC-moduler bygger ovanpå.

Ansvar:

- identitet
- databas
- lagring
- säkerhet
- konfiguration
- gemensamma tjänster

Container13 fungerar som första referensimplementation.

## Utvecklingsstruktur från v2.5.0

- En modul = en mapp under `ccc-core/`.
- HTML, CSS och JavaScript för modulen ligger direkt i samma modulmapp.
- Inga extra `css/`- eller `js/`-undermappar skapas under bygg/testfasen.
- En README per modulmapp. Samma README uppdateras löpande; nya versions-README skapas inte.
- Gemensamma filer hålls minimala. `version.js` är gemensam versionskälla.


## Navigationsprincip från v2.7.11

- Varje modul ska hålla ett explicit internt vy-state i stället för att gissa aktuell vy via synliga/dolda element.
- Headerns Tillbaka betyder alltid ett steg bakåt utan att radera pågående arbete.
- Destruktiva funktioner som Börja om hålls separata från Tillbaka.
- Vision är pilotmodul för detta mönster; kommande moduler ska kunna följa samma princip.
- Vid varje release ska `ccc-core/version.js` uppdateras och cache-bumpen i berörda modulfiler verifieras.
