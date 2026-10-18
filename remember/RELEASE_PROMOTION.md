# Remember – godkänd CURRENT/PREVIOUS (releasegrindar)

Senast granskad: 2026-10-18. **Detta är en processbeskrivning, inte ett godkännande av en release.**

## Grundprinciper
- CANDIDATE = senaste byggda utvecklingsversion; den kan vara trasig. `release.json` och `PROJECT_CURRENT_STATE.json.release.candidate` måste stämma.
- CURRENT = en uttryckligen godkänd, verifierad release som användaren faktiskt har testat på målmiljön (iPhone Safari) **och** vars exakt samma kod kan återställas från ett verifierat Git-arkiv.
- PREVIOUS = senast godkända CURRENT som ersattes av en ny CURRENT. Är null tills minst två releaser godkänts.
- Aldrig fylla CURRENT/PREVIOUS genom att kopiera CANDIDATE automatiskt, gissa eller tolka grön CI som iPhone PASS.
- GitHub Actions-artifact (90 dagar) och Git-arkiv skyddar kod; ingen av dem återställer Supabase, uppladdade bilder, autentisering eller publicerad webbplats på egen hand.

## Promotion – obligatoriska kontroller
1. Bekräfta korrekt utvecklingsgren `remember-development`, kandidatversion och samma version i manifest, versions-JS och alla HTML-entrypoints.
2. CI `preserve-and-check` PASS för exakt commit, med push-steget `Preserve permanent immutable Git snapshot for this push` SUCCESS (inte skipped).
3. Verifiera att `remember/archive-<full commit SHA>` finns och pekar på exakt samma commit. Arkivnamn är SHA-baserat, men grenen är inte GitHub-skyddad mot framtida borttagning/ändring.
4. Verifiera att rätt kandidat verkligen är driftsatt på avsedd testadress; notera adress, datum och observerad version. En commit i `remember-development` publiceras **inte automatiskt** till nuvarande GitHub Pages-källa `ccc-demo-public-test`.
5. Projektägaren genomför och godkänner iPhone Safari-test av berört flöde (för fotoboken: sidbläddring, layout, knappar, återöppning; inga JS-fel eller blockerade interaktioner).
6. Dokumentera godkännandet, testdatum, målmiljö, Git commit SHA, archive-ref och faktisk deploy. Först därefter: flytta tidigare CURRENT till PREVIOUS och sätt CURRENT till den godkända kandidaten. Om ingen tidigare CURRENT finns: PREVIOUS förblir null.
7. Ändringen av release-status ska ske via PR och versionssynk enligt projektregeln. Statusändringens eget commitnummer är **inte** samma sak som den godkända app-kodens SHA.

## Rollback – aldrig tyst
- Identifiera CURRENT eller PREVIOUS via deras **dokumenterade kod-SHA**, inte versionsetiketten ensam.
- Läs arkivets manifest och kontrollera arkivets commit-SHA före återställning.
- Gör först en plan för selektiv återställning av `remember/` till aktuell deploy-källa. Byt **inte** hela GitHub Pages-grenen: den innehåller andra Container13-projekt.
- Ta ny snapshot före återställning, använd PR och CI, testa faktisk publicerad URL samt iPhone. Databas/Storage återställs endast via separat godkänd backup-procedur.
- Vid osäkerhet: stoppa, behåll fungerande version och märk status UNVERIFIED.

## Nuläge 2026-10-18
- Kandidat `0.1.109` på `remember-development`; publicerad webb använder annan gren.
- Automatisk Git-arkivgren för merge-commit `74f9e3c3a9cd3c033a2837d91e1112a57bdaa918` har observerats och release.json lästs tillbaka; arkivets version är 0.1.109.
- CURRENT = null; PREVIOUS = null. Ingen iPhone-verifiering av kandidat 0.1.109.
