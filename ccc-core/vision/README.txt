CCC VISION
==========

Syfte
-----
Vision hjälper användaren från foto till ett färdigt, redigerbart produktförslag. Arbetsflödet prioriteras före AI-tekniken.

Aktuellt – v2.6.1
------------------
- Dashboard öppnar Vision direkt.
- Första Vision-skärmen har tre fristående kort direkt på CCC-bakgrunden: Ta ett foto, Välj från enheten och Tillbaka.
- Ta ett foto är största/primära kortet. Välj från enheten är nästan lika stort. Tillbaka är ett mindre navigationskort.
- Den stora fotoytan är själva kameraknappen; ingen separat Börja fota-knapp används.
- ← Tillbaka går direkt till dashboard om inget arbete påbörjats. Finns bilder i aktuell omgång frågar CCC innan Vision lämnas.
- Reset-pilen visas först när det faktiskt finns ett påbörjat Vision-utkast och använder enkel text: Börja om.
- Demo-val visas inte längre på den vanliga första Vision-skärmen.
- Ett foto per plagg är standard.
- CCC förbereder förslag tyst i bakgrunden medan användaren fortsätter fotografera.
- Välj från enheten kan ge flera plagg; varje vald bild behandlas som ett plagg.
- Efter fotograferingen granskas plaggen ett i taget.
- Godkänn & nästa går vidare direkt.
- Ändra öppnar kompakt redigering och Spara & nästa fortsätter.
- Extra bilder på samma plagg läggs bara till vid behov, högst två extra i nuvarande testflöde.
- Slutvyn innehåller Alla plagg klara, Fota fler plagg och Till dashboard.
- Bilderna är local-first. Råbilder laddas inte till Firebase som mellanlager.
- Vision kan nu använda riktig AI via en säker server/Cloudflare Worker. Om endpointen inte är konfigurerad faller den tillbaka till tydligt märkt demoläge.
- Bilder är fortfarande local-first. För AI-analys skickas endast en till tre komprimerade analyskopior till AI-endpointen; originalbilderna sparas inte i Firebase eller Worker.
- OpenAI API-nyckeln får aldrig läggas i Vision/HTML/JS som körs i webbläsaren.

Design
------
Vision ska använda samma CCC-skal som dashboarden. Versionsnumret visas via ../version.js och ska inte upprepas inne i Vision-innehållet.

Nästa
-----
1. Publicera `cloudflare-worker.js` som en Cloudflare Worker.
2. Lägg `OPENAI_API_KEY` som Worker Secret och sätt `ALLOWED_ORIGINS` till den/de CCC-adresser som ska få anropa den.
3. Skriv Worker-adressen i `vision-ai-config.js` under `endpoint`.
4. Testa med en verklig tröja och finslipa prompt/resultat.
5. Firebase tas därefter bara in där synk, konto eller publicering faktiskt kräver det – inte som mellanlager för råbilder.

v2.5.3
- Justerad storlekshierarki på Vision-starten efter mobiltest.
- "Ta ett foto" är tydligt största ytan.
- "Välj från kamerarullen" är näst störst.
- "Tillbaka" är minst och tydligt navigation.
- Målet är fortsatt att hela startvyn ska rymmas utan scroll på mobil.


v2.5.4
- Vision-starten finputsad efter mobiltest och godkänd mockup: foto störst, kamerarulle tydligt sekundärt kort, Tillbaka kompakt navigationskort.
- Kamerarullen har ikon, rubrik och kort hjälptext.
- Tillbaka har tydligare ikon och hjälptext men lägre visuell tyngd.
- Papperskorgens Ångra-toast är lägre, ligger ovanför nederkanten/navigeringen och försvinner snabbare.
- Slutvyn använder användarspråk: “Klart!”, “X plagg är klara att publiceras.” och “Till startsidan”. Firebase nämns inte i användargränssnittet.


v2.5.5
- Frivilliga tillägg förklarar nu exakt vad som läggs till och var det hamnar.
- “Visste du?” visas som en förhandsvisning och läggs sist i produktbeskrivningen först när användaren väljer “Lägg till i beskrivningen”.
- “Nyskick” förklaras på samma sätt och läggs i nuvarande prototyp sist i beskrivningen.
- Frivilliga tillägg har tydlig Stäng/Klar-väg så användaren aldrig fastnar i vyn.
- Vision-startens tre val fyller skärmen bättre och använder större ikoner, med foto störst, kamerarullen näst störst och Tillbaka minst.
- Papperskorgens Ångra-toast flyttad högre för att inte täcka arbetsknappar.


v2.5.6
- Vision-starten följer nu Dashboard-principen: tre stora kort fyller den tillgängliga mobilskärmen.
- Foto är störst, kamerarullen näst störst och Tillbaka tydlig navigation.
- Ikoner och rubriker är större för bättre touch/premiumkänsla.
- Startvyn ska fortfarande rymmas utan scroll på normal mobilhöjd.
- Korrigerade ett CSS-radbrytningsfel från v2.5.5 så den versionens tillägg verkligen appliceras.


v2.5.7
- Vision-startens stora omslutande panel är borttagen; de tre valen ligger som fristående action-kort direkt på appbakgrunden, som i Dashboard.
- "Välj från kamerarullen" heter nu "Välj från enheten" för att fungera på mobil, Chromebook och dator.
- Hjälptexten är enhetsneutral: "Välj bilder som redan finns sparade".
- Kortens färgtoner, radier, skuggor och mobilmarginaler följer Dashboard närmare.
- Foto är primärt, Välj från enheten sekundärt och Tillbaka navigation.


V2.5.8 – Dashboard-synk av Vision-start
- Vision-startens tre val använder samma visuella uppbyggnad som Dashboard: diskret ikon till vänster, vänsterställd text och pil till höger.
- Emojiikoner på startvyn ersatta av enkla linjeikoner i samma stil som Dashboard.
- Kortens proportioner, avstånd och färghierarki synkas med Dashboard utan att ändra Vision-flödet.
- Vision-headerns mobila placering låses till samma höjd/padding som Dashboard.


v2.5.9 – Modulmarkör
- Dashboard och Vision behåller samma header och samma kortspråk.
- Vision får en diskret modulmarkör direkt under headern: “VISION” och “Foto & produktanalys”.
- Syftet är att användaren tydligt ska märka vybytet utan att Vision ser ut som en annan app.
- Ingen ändring av Vision-flöde, kamera eller kortfunktioner.


v2.5.10 – centrerad modulidentitet
- “VISION” och “Foto & produktanalys” centreras.
- Modulmarkören matchar Arbetsytans två-radersstruktur storleksmässigt.
- Inga ändringar av Vision-flöde, kamera eller kortfunktioner.


v2.6.1 – riktig AI förberedd
- `vision-ai.js` läser och komprimerar en till tre bilder för analys utan att ersätta originalfilerna.
- `vision-ai-config.js` håller endast endpoint-konfiguration; inga hemligheter får finnas där.
- `cloudflare-worker.js` är serverdelen som anropar OpenAI Responses API och returnerar ett strukturerat produktförslag.
- Worker-anropet använder `store: false`.
- Standardmodell i Worker är `gpt-5.6-terra`, men kan bytas med miljövariabeln `OPENAI_MODEL`.
- Om AI inte är ansluten eller testanropet misslyckas fortsätter prototypen i demo, och förslagsvyn markerar att det är testläge.
- Högerpilen på Vision-kortet “Tillbaka” är borttagen; endast vänsterpilen visas.


v2.6.1 – första livekopplingen till CCC Vision API
- Vision-klienten pekar nu på `https://ccc-vision-api.mangaj73.workers.dev`.
- Klientens requestformat är synkat med den deployade Workern (`image` i stället för `images`).
- Worker-svaret `{ ok, product }` översätts till CCC Visions befintliga fält utan att UI-flödet ändras.
- Första live-testet använder en bild per plagg; stöd för extra analysbilder kan läggas tillbaka när basflödet är verifierat.
- Bilderna är fortsatt local-first; endast en komprimerad analyskopia skickas till Workern/OpenAI.
