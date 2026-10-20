# Remember – START HÄR (aktuell arbetsstatus)
Senast uppdaterad: 2026-10-20. **Detta är den korta ingången**, inte en fullständig historik.

## Projektläge – obligatorisk utgångspunkt
**AKTIV UTVECKLING / TEST. INTE LANSERAD.** Album och bilder som används nu är utvecklings- och testmaterial, inte kunddata. Att webbplats och Supabase använder driftsatta adresser betyder **inte** att produkten är lanserad. Ändra aldrig projektläget till PILOT/LANSERAD utan uttryckligt beslut från projektägaren.

**Praktisk konsekvens:** prioritera snabba, reproducerbara tester och enkelt underhåll. Undvik standardvarningar om ”riktiga kunder” i varje svar. Fortsätt ändå att skydda autentisering, nycklar, dataintegritet och återställningsmöjligheter. Ingen oavsiktlig radering av testmaterial.

## Start på 60 sekunder
1. Läs **denna fil** och `PROJECT_CURRENT_STATE.json` (fältet `projectMode` och aktuell release). Läs sedan berörd kod.
2. Läs vid behov `../project-template/PROJECT_MASTER_RULES.md`, `PROJECT_RELEASE_STANDARD.md`, `SHARED_COMPONENT_REGISTER.md`, `DECISIONS.md` och `OPERATING_LIMITS.md`. Öppna **inte** 50 000 teckens historik för ett enkelt ärende.
3. Kontrollera verklig GitHub-branch, Supabase-projekt och versionsparitet; använd aktuell kod som sanning när gamla handoffs motsäger den.
4. Sök grundorsak, återanvänd gemensamma moduler, gör en sammanhängande ändring. **Varje ändring = nytt versionsnummer**, även dokumentationsändringar enligt projektägarens regel. Synka manifest, versionskälla och samtliga faktiska HTML-ingångar. Verifierat 2026-10-20: nio release-märkta HTML-ingångar (index, login, register, activate, dashboard, owner, album, album-admin, webmaster). Se release.json.entrypoints och CI:s versionskontroll. Den äldre sjulistan missade activate och album-admin.
5. Läs tillbaka GitHub och skilj alltid **COMMITTED**, **DEPLOYED**, **RUNTIME PASS** och **IPHONE PASS**. Be om ett avgränsat iPhone-test när det behövs.

## Miljöer
- GitHub: `container13/Container13-vintage`, gren `ccc-demo-public-test`, mapp `remember/`.
- Webb: https://container13.se/remember/ (driftsatt **utvecklingsprodukt**).
- Supabase Remember: projekt `wykvztfmfbboxiqvuvwr`. Separat testprojekt finns. Kontrollera alltid vilket projekt du ändrar.
- iPhone-test i **vanlig Safari-flik**, inte Privat. Privat surfning orsakade att sessionen försvann vid omstart; vanlig flik verifierades fungera.

## Senast verifierat av användaren
- Webmaster kan se bilder i andra album efter serverrättning i `remember-photo-gallery` v4.
- Gemensam bildvisare klipper nypzoom till bildens ursprungliga ruta: **v0.1.87 iPhone PASS**.
- Inloggningens försvinnande efter Safari-omstart löstes genom att lämna privat surfning.
- Versionsdokumentationen kan innehålla äldre checkpoints: kontrollera före åtgärd.

## Release-säkerhet (2026-10-18)
- Utvecklingsgren: `remember-development`; skyddad med pull request och obligatorisk statuskontroll `preserve-and-check` enligt användarens GitHub-skärmbilder. GitHub-regeln är skapad; kontrollera fortsatt faktisk enforcement vid PR.
- `remember-release-safety.yml` bevarar 90-dagars rollback-artifact och testar isolerad återläsning samt SHA256. Befintliga manuella rollback-grenar kontrolleras.
- Föreslagen förbättring på `remember/automatic-snapshots-01109`: skapa separat permanent `remember/archive-<commit-SHA>` för varje push, utan force update, med fjärr-readback. **Inte verifierat i Actions förrän PR har slagits ihop och ett push-test är grönt.**
- `remember/safety-baseline-2026-10-18` är en manuellt skapad säkerhetsgren, inte godkänd CURRENT.
- `CURRENT` och `PREVIOUS` är ännu inte godkända; `candidate=0.1.117`. Fotoboken kräver separat iPhone PASS före promotion.
- Viktigt: GitHub Actions-token kan sakna behörighet att skapa refs; vid röd kontroll granska Actions-tokenens `contents: write` och branch-/repository-regler. Inga automatiska snapshots får påstås fungera före lyckat push-test.

## CURRENT/PREVIOUS
- Läs `RELEASE_PROMOTION.md` före promotion eller rollback. Grön CI räcker inte: verifierad deploy och uttryckligt iPhone PASS krävs. CURRENT och PREVIOUS förblir null tills detta är uppfyllt.
- Arkivgren för 0.1.109 skapades och dess release.json lästes tillbaka från GitHub. Skydd mot att flytta/radera arkivgrenen saknas ännu.

## Nästa arbete
- Bildgranskning: bygg webmasterstyrd tidsgräns **5 minuter–72 timmar** för snabbtest; 72 timmar standard. Säkerställ att serverns rensning faktiskt körs inom testintervallet. Detta är **önskat, inte färdigimplementerat**.
- Rensa synlig sessionsdiagnostik från ägarvyn, behåll vid behov felsökning i utvecklarläge.
- Verifiera kamera Avbryt och uppladdning i ägar- och gästflöden.
- Behåll aktuella album/testbilder om inte projektägaren uttryckligen ber om radering.

## Dokumentkarta
- **Denna fil:** nuläge, 60-sekunders start och nästa steg.
- `PROJECT_CURRENT_STATE.json`: maskinläsbar status och tekniska fakta (äldre historiska fält kan finnas).
- `DECISIONS.md`: beslut och öppna frågor.
- `PROJECT_HANDOFF_CURRENT.md`: **historik**, inte primär startpunkt.
- `OPERATING_LIMITS.md`: kvoter och felsökning av leverantörer.
- `../project-template/`: regler, releaseprocess, delade komponenter.
- Undvik att duplicera historik här; uppdatera bara **projektläge, senaste verifierade resultat och nästa arbete**.

## Vid ny chatt
Säg: **”Fortsätt Remember. Läs remember/START_HERE.md och aktuell projektstatus på GitHub först.”**

## iPhone feedback 2026-10-18 (0.1.110)
- User confirmed page turning works but rejected quality: too slow between pages; underlying sheets appear to alternate between two colors.
- Candidate 0.1.117 shortens animation 1350→720 ms and auto interval 4600→2900 ms, harmonizes paper back and decorative paper palette. Requires fresh iPhone visual PASS; do not promote CURRENT.

## Fotobok 0.1.117 – skuggfix (iPhone-test väntar)
- Feedback på 0.1.111: bladet under blir mörkare vid vänsterkanten cirka 1 sekund efter sidvändning.
- Trolig orsak: tillfällig CSS-regel `.book:has(.paper.turn) #under` med extra inset-skugga.
- Kandidat 0.1.117 tar bort den extra regeln och behåller normal skuggning. Ej verifierad i Safari; CURRENT/PREVIOUS förblir null.

## Startsida 0.1.117 – förenkling
- Användaren vill ta bort prickarna under fotoboken och den synliga versionsetiketten på startsidan.
- Sidprickarna tas bort inklusive JS-uppdatering; versionsetiketten visas diskret längst ned till höger på startsidan, utanför fotoboken; versionsuppgifter bevaras även i release.json och meta-taggar.
- Kandidat 0.1.117 kräver iPhone-test; CURRENT/PREVIOUS förblir null.

## Sidvändning – teknisk utvärdering 2026-10-18
- Nuvarande CSS-lösning roterar en enda .paper 178 grader, byter innehåll efter timer och använder en separat under-sida. Den saknar fysisk bladkrökning och fingerföljning.
- Undersökt StPageFlip (https://github.com/Nodlik/StPageFlip): HTML-sidor, mjuka/hårda blad, portrait, touchdrag, flippingTime och maxShadowOpacity. Rekommenderas som prototyp i separat gren, inte som obeprövad live-ersättning.
- Alternativ Turn.js (https://www.turnjs.com/), med jQuery-beroende. Ingen motor installerad ännu.
- Testkrav före byte: iPhone Safari, portrait, enhetlig pappersfärg, skuggor utan eftersläpning, inga sidglapp, minskad rörelse, offline/fallback och bibehållen storlek/layout. CURRENT förblir null.

## Prototyp 0.1.117 – naturlig sidvändning
- Isolerad sida: `remember/book-prototype.html`, StPageFlip via jsDelivr `page-flip@2.0.7`, ingen ändring av den riktiga startsidans fotobok.
- Prototypen behöver kontrolleras i iPhone Safari; extern modul, CSP/nätverk och användning har inte runtime-verifierats. Ingen automatisk publicering.
- Jämför fingerdrag, papperskrökning, skugga och sidbyte med den befintliga lösningen. CURRENT/PREVIOUS null.

## Prototyp 0.1.117 – automatiska blad och baksidor
- Varannan sida har ett kompletterande, dämpat fotomotiv utan text på baksidan, inte spegelvänd framsida.
- Auto: 1 800 ms stillbild och 680 ms bläddring; slump mellan övre/nedre ytterhörn. Biblioteket stöder inte valfri punkt längs kanten via dokumenterat flipNext-gränssnitt.
- Manuell bläddring pausar auto ca 4,5 s. Vid sista sidan återgår prototypen till första sidan med flip(0); behöver iPhone-verifiering för omstartens estetik.
- Inga ändringar av ordinarie sidvändning. Externa bild-URL:er och CDN kräver visuell test. CURRENT/PREVIOUS null.

## Prototyp 0.1.117 – hastighet
- Användaren tycker att 0.1.115 ser bra ut men att 680 ms sidvändning är för snabb.
- Ändrat enbart prototypens sidvändning till 1000 ms och synkroniserat auto-timer; stillbild 1800 ms oförändrad.
- Kräver användarens iPhone-PASS innan fotoboken kan godkännas och införas på startsidan.

## Startsida 0.1.117 – StPageFlip integrationskandidat
- Fotoboken i remember/index.html använder nu samma StPageFlip-motor som prototypen, med separata rättvända baksidesmotiv, 1000 ms blad, automatisk bläddring var 2800 ms (cirka 1800 ms stillbild), slumpmässigt övre/nedre hörn och 4500 ms paus efter manuell interaktion.
- Startsidan behåller Remember-identitet, ingress, informationsdialog, registrering, inloggning, versionsetikett nere till höger och övrig layout.
- Motorn laddas externt från jsDelivr. Om modulen inte laddas visas en statisk första sida i stället för tomt utrymme.
- Ändringen ligger ENDAST i kandidatgren/PR tills iPhone Safari och release-säkerhet kontrollerats. CURRENT/PREVIOUS null. Prototypen book-prototype.html finns kvar för jämförelse.
- Testa iPhone: layout utan klippning, automatisk sidvändning, manuell touch, återstart efter paus, modalpaus, rättvända baksidor, version och återhämtning vid CDN-fel.

## 0.1.119 – iPhone-fix av ny fotobok
- Återinför StPageFlip på startsidan efter 0.1.118 återställning, men med explicit höjd på foto (sidans höjd minus 48 px bildtext) så att den stora beige tomytan inte uppstår när StPageFlip skriver över sidans display.
- Separata kompletterande bilder finns på varje baksida. Baksidesbilderna motvänds i CSS för att motverka 3D-motorns spegling under bladrotation. Detta är en hypotes som måste testas på iPhone; inte verifierat i mobilruntime.
- Bladvändning 1000 ms, visning cirka 1800 ms, övriga startsidan bibehållen. CURRENT/PREVIOUS ej uppgraderade före användarens PASS.

## 0.1.120 – bladens fysiska baksidor
- 0.1.119 underkänd av användaren: samma motiv visas på bladens fram- och baksida.
- Varje främre blad får nu en egen bakåtvänd bildyta med kompletterande motiv, CSS rotateY(180deg) och backface-visibility:hidden. De separata sidorna med kompletterande motiv behålls.
- Ändringen är en riktad hypotes för StPageFlips 3D-återgivning; faktiskt utfall på iPhone är ännu INTE verifierat. Ingen rollback, startsidans övriga design oförändrad.

## 0.1.121 – sidornas fram-/baksidor
- 0.1.120 underkänd på iPhone: baksidan återgav samma motiv och tänkt baksidesmotiv dök upp som ny framsida.
- Tar bort alla fyra extra flip-physical-back-lager och deras 3D-CSS. Behåller ordnade, separata HTML-sidor (fram/bak i följd) för StPageFlips interna bladmodell. Hypotes; kräver faktisk iPhone-PASS.
- **Obligatorisk visuell leveransregel:** Efter varje publicerad ändring som användaren behöver kontrollera manuellt ska svaret innehålla klickbar GitHub Actions-länk (https://github.com/container13/Container13-vintage/actions), direktlänk till testad sida, versionsnummer och vad som ska kontrolleras. Länka till exakt workflow-körning när tillgänglig. GitHub CI är inte visuell iPhone-PASS.

## Aktuell kontrollpunkt 2026-10-20 — 0.1.138
Detta avsnitt ersätter äldre nuläges-/kandidatuppgifter ovan. Aktiv gren är ccc-demo-public-test. Kandidat 0.1.138 rättar direktinloggning (?mode=login): setEye använde const eyeIcon före initiering och avbröt skriptet innan auth-init/felhantering. Ikonens initiering flyttas före första anropet. Gemensam reservversion synkas från 0.1.133. Fotobokens sidvändningslogik är oförändrad från användargodkända 0.1.137. GitHub/Actions/deploy och iPhone-inloggning ska verifieras separat; CURRENT/PREVIOUS förblir null. Säkerhetsgren remember/safety-checkpoint-2026-10-20-0137 ska behållas. GitHub-grenstädning är pausad: raderingsfunktion/körmiljö saknas; inga grenar raderade. Gamla fotoboksexperiment får enligt projektägaren raderas efter beroendekontroll utan nya arkiv; skydda andra projekt och nödvändiga refs.

## Aktuell kontrollpunkt 0.1.139 — 2026-10-20
Ersätter föregående kandidatuppgifter. Användaren bekräftar lösenordsinloggning och bibehållen session efter omstart i 0.1.138. Webmasteralbumets uppdateringsvarning berodde på att album-admin.html fortfarande deklarerade 0.1.105 trots manifest 0.1.138; aktiveringssidan var kvar på 0.1.106. Nio release-märkta ingångar synkas nu till 0.1.139 och kontrolleras av release-safety. Ingen ändring av updaterns logik, fotobok eller backend. Publicering/uppdatering på iPhone återstår. CHECKLIST.md är den gemensamma checklistan. Inbäddade camera-session-test.html saknar release-bootstrap och behöver separat granskning med skydd för pågående kameraarbete; inga kameraförändringar här.
