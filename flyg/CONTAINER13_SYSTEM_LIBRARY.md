# Container13 — gemensamt systembibliotek

## Grundregel för ALLA projekt
**Sök → Återanvänd → Anpassa → Bygg nytt endast vid behov.**

Före ny funktion, integration, UI-komponent eller säkerhetslösning: kontrollera detta register och relevant befintlig kod. Att något finns i registret betyder inte att det fungerar: verifiera alltid implementation, versionsläge och tester innan återanvändning. Kopiera aldrig hemliga nycklar eller credentials.

## Första inventering (2026-10-13)
| Lösning | Källa | Status i biblioteket | Återanvändning / kontroll |
| --- | --- | --- | --- |
| CCC fotosession / flera foton i följd | CCC-koden i detta repo; exakt sökväg **ej verifierad** | **Att inventera** | Undersök faktisk kamerafunktion, session och bildgranskning innan Remember-portning. |
| Micke50 bilduppladdning och helskärmsvisare | `micke50/index.html` | **Källkod identifierad; inte godkänd som generell komponent** | Återanvänd UI-idéer, inte dess direkta lagringsåtkomst i Remember. |
| Remember bildvalidering + SHA-256 för exakt dubblett | `remember/photo-upload-preparation.js` | **Implementerad kod; integration och mobiltest återstår** | Endast exakt samma filbytes, inga perceptuella varningar; serverkontroll krävs. |
| Remember uppladdnings- och visarkrav | `remember/PHOTO_UPLOAD_AND_VIEWER_ACCEPTANCE.md` | **Specifikation; ej komplett funktion** | Säker privat lagring, albumkvot, sessionshantering, 8× helskärmszoom. |
| Remember privat bildlager | Supabase-bucket `remember-photos` | **Installerad; fullständigt uppladdningsflöde återstår** | Privat bucket, serverkontrollerad åtkomst. |
| Gemensam mobilpolicy | `project-template/mobile-view-policy.js` | **Källfil refererad i Remember; verifiera implementation** | Ingen sidnypzoom; undantag för helskärmsbild. |

## Obligatorisk checklista vid nyutveckling
1. Sök i registret och i källkoden efter motsvarande lösning.
2. Kontrollera om lösningen faktiskt fungerar, är testad och passar det nya säkerhetsbehovet.
3. Återanvänd via avgränsad komponent eller adapter. Ändra inte ett fungerande originalprojekt oavsiktligt.
4. Registrera källa, beroenden, API-/integrationskrav, konfiguration (utan hemligheter), ansvarig projektgren, teststatus och begränsningar.
5. Om en lösning saknas: bygg nytt och registrera den efter verifiering.

## Komponentkort (mall)
- Namn och syfte:
- Kodplats och version/commit:
- Projekt som använder den:
- Integrationer och beroenden:
- Konfiguration och behörigheter (inga hemligheter):
- Testad miljö och resultat:
- Begränsningar / risker:
- Status: idé / specificerad / implementerad / verifierad / återanvändbar

**Nästa inventering:** identifiera CCC:s exakta kamerakod och jämför med Micke50 och Remember innan kameraläget byggs in.

## Gemensam kameramodul — beslut 2026-10-13
Mål: förbättrad återanvändbar kamera för Remember, CCC och framtida Container13-appar. Remember är pilot; ändra inte CCC eller Micke50 utan separat godkännande.

Funktionskontrakt: helskärmskamera, automatisk start där behörighet tillåter, kontinuerliga foton, bildräknare, centrerad avtryckare, kamerans egen tvåfingerszoom där webbläsaren stöder den, aldrig sidzoom, granskning/urval och fortsatt fotografering utan bildförlust. Kamerakärna och bildgranskning ska vara separata från uppladdning och albumkvoter. Hantera iOS Safari, nekad behörighet, kamerabyte, minnesstädning och tillgänglighet.

Status: remember/camera-session-test.html är en isolerad prototyp, ännu INTE en gemensam modul. CCC:s exakta kamerakod är INTE identifierad eller återanvänd. Nästa steg: inventera CCC-källan, extrahera komponent med tydligt API, anslut Remember via adapter och testa på iPhone innan komponenten märks återanvändbar.


## Utvecklingsverktyg för PWA — beslut 2026-10-13
- Endast i explicit utvecklingsläge (inte publikt/vanliga gäster): knapparna **↻ Uppdatera** och **📸 Fånga hela vyn**.
- Uppdatera: begär uppdatering av eventuell service worker och ladda om sidan. Varna för osparade ändringar innan omladdning.
- Fånga hela vyn: skapa nedladdningsbar PNG av den aktiva sidans hela scrollbara innehåll, inte bara synlig viewport. Ge filen begripligt namn med vy och tidpunkt. Visa förhandsvisning och möjlighet att spara/dela.
- Hantera scrollcontainrar, fixed/sticky-element, långa sidor, mobilskärm och mörkt tema utan att duplicera fasta element eller förstöra layouten. Maskera känslig information, token och lösenord; fånga inte andra flikar eller systemgränssnitt.
- Teknisk begränsning: webbläsare ger inte webbsidor generell åtkomst till native full-page screenshot. DOM-rendering kan missa cross-origin-bilder, canvas/video/kameraflöden och inbäddat innehåll. Visa tydlig varning vid ofullständig bild; påstå inte pixelperfekt skärmdump.
- Status: krav dokumenterade. Uppdatera-knapp finns i remember/index.html men är ännu inte dev-only. Helvy-PNG ännu inte implementerad eller verifierad. Bygg och verifiera verktygen som gemensam modul före utrullning.

### Delning av helsidesskärmdump (2026-10-13)
När utvecklaren trycker på 📸 öppnas en förhandsvisning med separata val: **Kopiera bild** till urklipp (Clipboard API med PNG där webbläsaren tillåter), **Dela…** via systemets delningsruta (Web Share API med PNG-fil; iOS kan då erbjuda AirDrop), och **Spara PNG** som reserv. AirDrop är ett val i iOS-delningen, inte en funktion webbappen kan starta direkt. Om bildkopiering eller fildelning saknar webbläsarstöd visas tydlig information och Spara PNG. Kräv aktivt användartryck och hantera tillståndsfel. Ingen automatisk extern överföring. Status: krav specificerade, ännu ej implementerade.


## Obligatorisk regel: användbar funktion från rätt ingång (lärdom 2026-10-13)
**Ingen funktion är färdig bara för att dess kod eller testsida fungerar.** Den ska gå att hitta och slutföra från användarens naturliga väg i appen.

1. **Börja med användarresan:** dokumentera var användaren befinner sig, vilken tydlig knapp/åtgärd som startar funktionen, vad som händer under arbetet, hur man kommer tillbaka och vad som räknas som färdigt resultat. Anpassa för mobil/dator och roller (webmaster/gäst).
2. **Inga föräldralösa funktioner:** en isolerad prototyp eller test-URL är aldrig en ersättning för en synlig ingång i ordinarie navigation. Bygg och testa integrationen innan detaljpolering.
3. **Återanvänd först:** inventera faktiskt fungerande kod från CCC, Micke50, Remember och systembiblioteket. Kontrollera hela kedjan och säkerhetskrav, inte bara en komponent.
4. **Kontrollera hela flödet:** start → funktion → granskning/bekräftelse → spara/publicera → återgång. Inga brutna länkar, förlorade bilder eller knappar som lovar mer än de gör. Behåll originalfunktioner oförändrade om inte ändring uttryckligen godkänts.
5. **Skilj statusnivåer:** specificerad → prototyp → inkopplad → funktionellt testad → deploy verifierad → användarverifierad. Ange alltid ärligt vilken nivå som är uppnådd. GitHub-commit är inte samma sak som färdig deploy.
6. **Acceptanstest utan guidning:** kan en ny användare hitta funktionen, förstå den och slutföra uppgiften utan separat testlänk eller förklaring från utvecklaren? Om nej: inte klart.
7. **Arbetsordning:** prioritera synlig ingång och fungerande helhet före extra animationer, zoomdetaljer och kosmetik. Förbättra först när grundflödet är användbart.

### Konkret avvikelse: Remember-kameran
Kameraprototypen förbättrades före den hade en naturlig ingång i albumet. En senare länk från albumet till testsidan räcker inte som färdigt flöde: kamerabilderna måste kunna granskas, överföras till albumets uppladdning och bevaras när man återgår. Visa tydligt om backend-uppladdningen inte är aktiverad. Status: **inkoppling påbörjad, ej färdig/verifierad**.


## Obligatorisk rollseparation: tjänsteadministratör, albumägare, gäst (2026-10-13)
- **Webmaster** administrerar Remember-tjänsten och systemfunktioner via separat skyddad webmasterpanel. Webmasterrollen ger **inte** automatiskt tillgång till privata album eller deras bilder.
- **Albumägare** är en vanlig inloggad användare som får skapa och hantera **sina egna** album, använda kamera, välja bilder och hantera delning utan webmasterbehörighet. Kontrollera ägarskap per album på servern.
- **Gäst** får via giltig, icke återkallad albumlänk använda endast de gästfunktioner som albumets tidsfönster och behörigheter tillåter, utan inloggning.
- Rollkontroll och ägarskap måste ske i serverns auktorisering/RLS; att dölja UI är aldrig säkerhetskontroll. Ingen global läsrätt till album enbart för att användaren är webmaster.
- **Mina album** är vanlig albumägarvy. **Webmasterpanel** är separat administrativ vy. Ingen blandning av systemdiagnostik, webbmasterkontroller och ägarens vardagsflöde.
- Vid migration av befintliga prototyper: kartlägg befintliga Edge Functions, SQL/RLS och faktiska rättigheter innan ändring. Försvaga inte befintliga kontroller, radera inte album och rotera inte gästlänkar. Märk implementation som **ej klar** tills backend och UI båda verifierats.
- Tidigare Remember-dashboard använde `remember-webmaster` för albumlistning och albumskapande. Den är därför en **webmasterprototyp**, inte ett verifierat albumägarflöde. Kalla den inte färdig vanlig ägardashboard innan separat ägarauktorisering är implementerad och testad.


## Bekräftelse före oåterkalleliga åtgärder
- Kräv uttrycklig bekräftelse med tydligt val **Avbryt** före borttagning av en bild, rensning av en fotosession och publicering/uppladdning av bilder. Ange antal bilder när flera påverkas.
- **Godkänn valda** betyder enbart lokal granskning/urval och får aldrig automatiskt betyda publicering. **Publicera** är en separat, bekräftad åtgärd.
- Samma skydd gäller alla Remember-roller och framtida albumvyer. Bekräftelse i UI ersätter inte serverns behörighetskontroller.
