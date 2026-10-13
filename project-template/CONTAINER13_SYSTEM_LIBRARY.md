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
