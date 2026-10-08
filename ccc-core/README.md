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

## Permanent arbetshandbok från v2.10.170

Innan CCC ändras ska följande läsas i ordning:

1. `CCC_MASTER_RULES.md`
2. `CCC_CURRENT_STATE.json`
3. `CCC_RELEASE_CHECKLIST.md`
4. `CCC_HANDOFF_CURRENT.md` vid ny chatt/överlämning.

Grundprincip: verifiera faktisk source/runtime/storage/deploy-kedja före ändring. En commit är inte en verifierad release. CURRENT/PREVIOUS flyttas endast efter verifiering, och koduppdateringar rapporteras som ändrade filer.

## Gemensam header och logotyp – Vinted och övriga CCC-moduler

- Vinted ska använda CCC:s befintliga gemensamma header och samma CCC-logotyp som övriga CCC-vyer.
- Logotypen ska ha **exakt samma placering, storlek och utseende** som i de övriga CCC-vyerna; återanvänd befintlig header/komponent och tillgångar, skapa inte en egen Vinted-variant.
- **VINTED** är modulens namn; CCC-logotypen visar plattformens identitet.
- Undvik extra CCC-loggor på knappar, inne i annonser eller på andra ställen i Vinted-vyn.
- Detta är ett **beslutat designkrav**, ännu inte en verifierad kodändring. Vid implementation: inspektera först vilken header och logotyp övriga CCC-vyer faktiskt använder.
