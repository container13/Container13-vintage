# Remember – START HÄR (aktuell arbetsstatus)
Senast uppdaterad: 2026-10-18. **Detta är den korta ingången**, inte en fullständig historik.

## Projektläge – obligatorisk utgångspunkt
**AKTIV UTVECKLING / TEST. INTE LANSERAD.** Album och bilder som används nu är utvecklings- och testmaterial, inte kunddata. Att webbplats och Supabase använder driftsatta adresser betyder **inte** att produkten är lanserad. Ändra aldrig projektläget till PILOT/LANSERAD utan uttryckligt beslut från projektägaren.

**Praktisk konsekvens:** prioritera snabba, reproducerbara tester och enkelt underhåll. Undvik standardvarningar om ”riktiga kunder” i varje svar. Fortsätt ändå att skydda autentisering, nycklar, dataintegritet och återställningsmöjligheter. Ingen oavsiktlig radering av testmaterial.

## Start på 60 sekunder
1. Läs **denna fil** och `PROJECT_CURRENT_STATE.json` (fältet `projectMode` och aktuell release). Läs sedan berörd kod.
2. Läs vid behov `../project-template/PROJECT_MASTER_RULES.md`, `PROJECT_RELEASE_STANDARD.md`, `SHARED_COMPONENT_REGISTER.md`, `DECISIONS.md` och `OPERATING_LIMITS.md`. Öppna **inte** 50 000 teckens historik för ett enkelt ärende.
3. Kontrollera verklig GitHub-branch, Supabase-projekt och versionsparitet; använd aktuell kod som sanning när gamla handoffs motsäger den.
4. Sök grundorsak, återanvänd gemensamma moduler, gör en sammanhängande ändring. **Varje ändring = nytt versionsnummer**, även dokumentationsändringar enligt projektägarens regel. Synka manifest, versionskälla och nio HTML-ingångar.
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
- `CURRENT` och `PREVIOUS` är ännu inte godkända; `candidate=0.1.108`. Fotoboken kräver separat iPhone PASS före promotion.
- Viktigt: GitHub Actions-token kan sakna behörighet att skapa refs; vid röd kontroll granska Actions-tokenens `contents: write` och branch-/repository-regler. Inga automatiska snapshots får påstås fungera före lyckat push-test.

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
