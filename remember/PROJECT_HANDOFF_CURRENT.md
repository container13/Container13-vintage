## 2026-10-23 – owner gallery unified (0.1.173)
- Direktinloggad albumägare använder nu samma `mountRememberGallery` som gäst/webmaster, inklusive vertikal bildsvepning och separat papperskorg via `remember-owner-manager`. Granskningsdialogen behålls separat. GitHub commit 05750eb. iPhone-test och Actions-resultat ännu inte verifierade.

# Remember – aktuell överlämning
Senast uppdaterad: 2026-10-23. Dokumentationsrelease: **0.1.172**.
**Läs denna fil först vid ”Fortsätt Remember”.** Den ersätts med senaste läget; den ska inte växa som en arbetslogg. Äldre versioner finns i Git-historiken.

## Projekt och miljö
- AKTIV UTVECKLING / TEST, INTE LANSERAD.
- Repo: container13/Container13-vintage. Aktiv arbets- och publiceringsgren: `ccc-demo-public-test`. Mapp: `remember/`.
- Webb: https://container13.se/remember/
- Ordinarie Remember: `wykvztfmfbboxiqvuvwr`. Separat testprojekt: `kauxrvshxgpbvptdwhog`. Kontrollera miljö före ingrepp.
- Starta med aktuell branch, `release.json` och `PROJECT_CURRENT_STATE.json`; verifiera verkligheten före nästa ändring.

## Senaste läge och evidens
- 0.1.168: 30 gratisbilder i mobil/digital kvalitet, längst1920px; publik formulering **Testa gratis**.
- Uppgradering förbättrar inte redan uppladdade bilder; original måste laddas upp på nytt. Högupplöst betaluppladdning är ännu inte implementerad.
- Installerad SQL-migration20261022112631: gräns30, bild31 nekas gäst/ägare/webmaster; återförsök tar ingen extra plats. Fyra befintliga gratisalbum höjda;13 bilder/13 objekt bevarade enligt installationsrapport.
- 0.1.168 Pages-körning **39771164981 SUCCESS** för commit `17a1365062c033b730751187c7abb72b23445bd7`, självständigt återläst2026-10-23. Tidigare samtal rapporterar livefiler verifierade; ingen ny live-bytejämförelse eller databasinspektion i denna dokumentationsändring.
- 0.1.169: kort löpande överlämning och obligatorisk sparrutin införs. Endast dokumentation och versionsmetadata; ingen funktions- eller Supabaseändring. Kontrollera denna commits GitHub/Actions separat.
- CURRENT/PREVIOUS är fortsatt null; grön CI är inte iPhone-godkännande.

## Kvar och nästa steg
1. Läs tillbaka denna dokumentationsrelease och kontrollera dess CI. Återuppta därefter första relevanta öppna punkt nedan; gör inte om redan accepterade breda tester.
2. Riktat iPhone-test: text vid Skapa album / Så fungerar Remember i .168 eller senare, hörnpapperskorg från .166 och tydligt granskningsval från .165. Dessa saknar dokumenterat nytt enhetsgodkännande.
3. Funktionellt iPhone-test av nytt öppet/granskat album och godkännande kvarstår separat. Automatisk72h-rensning är inte installerad; lova den inte.
4. Full releasepromotion har separata grindar. Läs RELEASE_PROMOTION.md och kontrollera dess äldre miljöuppgifter mot aktuell branch.
- Inget aktivt kamera-/uppladdningsjobb eller påbörjat destruktivt test har startats i denna ändring.
- Övriga önskemål/öppna kontroller: CHECKLIST.md och senaste strukturerade fält i PROJECT_CURRENT_STATE.json. Äldre daterade fält är historiska, inte nya uppdrag.

## Obligatorisk löpande sparrutin
- Uppdatera **denna samma fil** efter varje ändring, meningsfullt test och publicering samt före längre eller riskfyllda steg. Vänta inte på att chatten ska bli full eller på en begärd överlämning.
- Spara aktuell uppgift, version/kod-SHA, miljö, klart/verifierat, pågående/overifierat, eventuellt hinder och **ett konkret nästa steg**. Vid avbrott: IN_PROGRESS eller UNVERIFIED, aldrig PASS utan evidens.
- Spara checkpointen på GitHub och läs tillbaka exakt innehåll innan den kallas sparad. Lokal text och enbart chatten räcker inte. Om sparandet misslyckas: säg vad som inte är sparat.
- Håll PROJECT_CURRENT_STATE.json konsekvent. START_HERE.md och README.md ska länka hit, inte innehålla konkurrerande nulägen.
- Knyt en dokumentationsändring till ett nytt versionsnummer enligt Remember-regeln, men skapa inte en oändlig kedja av versioner bara för att notera samma commits readback.
- Detta är en arbetsrutin för assistenten, **ingen installerad bakgrundsautomation**. Arbete efter senast lyckade GitHub-sparning kan behöva återkontrolleras.
- Ny chatt: läs denna fil, kontrollera branch/release/verklig drift och fortsätt från första ofärdiga steg.

## Beslut för senare
Projektägaren2026-10-23: inför samma enkla löpande överlämning i **alla projekt och projektmallen**, stegvis. Endast Remember ändras nu. Uppgiften ska följa med i kommande överlämningar tills respektive projekt/mallen är uppdaterad.

## Regler och underlag vid behov
- ../project-template/PROJECT_MASTER_RULES.md, PROJECT_RELEASE_STANDARD.md och CONTINUITY_PROTOCOL.md.
- CHECKLIST.md, DECISIONS.md, OPERATING_LIMITS.md och RELEASE_PROMOTION.md.
- free-tier-30/README.md:30-gräns, verifiering och rollback.
- PHOTO_DELETION_0.1.161.md och guest-modes-candidate/INSTALLATION_2026-10-22.md: berörda funktioner.
- Äldre arbetslogg och detaljerad iPhone-evidens: PROJECT_HANDOFF_HISTORY_THROUGH_2026-10-23.md. Beslut om pausad iOS-systemremsa och skydd för godkända funktioner gäller fortsatt.
- Separat teståterställning är pausad, inte ett nytt jobb: simuleringen är USER-REPORTED PASS; kör inte om den enbart på grund av chattbyte. Testets befintliga karantän-cron får inte ändras utan kontroll av återaktivering och explicit uppdrag.
- Separat Remember Test/återställning: RECOVERY_CHECKPOINT.md; tillämpa inte testprojektets återställningsinstruktioner på ordinarie Remember.
- Skydda andra projekt på den gemensamma grenen, befintliga bilder och godkända funktioner. Minsta ändring=ny version; rapportera COMMITTED, DEPLOYED, RUNTIME PASS och DEVICE PASS separat.


## 2026-10-23 – Guest link first-time fix (0.1.170)
- Verified Halloween 2026 and Bruket med granskning had no guest_links or vault entries; Bruket utan granskning had both.
- Root cause: get returned needsReplacement for missing link regardless of first-time vs lost link; UI always warned about older link, and guest preview could not open without token.
- Deployed remember-share-manager edge function version 5, adding neverCreated when no guest_links row exists.
- Updated album-admin.html to show first-time Create guest link with no rotation warning, and clearer guest preview missing-link message.
- No guest links, albums, or photos modified in database. Await iPhone end-to-end test; CURRENT/PREVIOUS not approved.

## 0.1.172 – bildvisare (ej enhetstestad)
- Flyttade den gemensamma helskärmsvisaren till document.body för att undvika albumägarens överordnade layout/stacking context som kan få svep att påverka bakgrunden. Gäst och ägare använder samma touchlogik. Kod COMMITTED, enhetstest PENDING. Kontrollera Actions och prova albumägarens vertikala svep samt gästens funktion. 

## 0.1.171 – bildvisare
Helskärmslager och bakgrundslås för albumägarens och gästens bildvisare. Papperskorg och sveplogik oförändrade. Kräver iPhone-verifiering och gröna Actions-kontroller.
