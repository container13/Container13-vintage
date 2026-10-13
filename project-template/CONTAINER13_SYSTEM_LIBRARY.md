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
