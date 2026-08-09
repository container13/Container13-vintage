CCC VISION
==========

Syfte
-----
Vision hjälper användaren från foto till ett färdigt, redigerbart produktförslag. Arbetsflödet prioriteras före AI-tekniken.

Aktuellt – v2.6.2
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


v2.6.2 – diagnostik för riktig AI-koppling
- Visar nu verkligt AI-/HTTP-fel i Vision i stället för generella "AI ej ansluten".
- Lägger tydliga console-loggar före bildförberedelse, före fetch, efter serversvar och vid fallback.
- AI-anrop använder cache: no-store och Accept: application/json.
- Timeout, nätverksfel, HTTP-fel och felaktigt svar skiljs åt.
- Demo finns kvar som fallback så flödet inte låser sig under utveckling.


v2.7.1
- Fixad frontend-mappning för nya Worker-svaret (summaryTitle/summaryBrand/summarySeason/fields).
- Behåller bakåtkompatibilitet med äldre Worker-schema.
- Ingen ändring av Vision-flödet i denna patch.


v2.7.2
- Ren UI-fix av Vision-arbetsytan under pågående AI-analys.
- Fångstvalen blir kompakta när minst ett plagg finns och behåller ikon + rubrik + underrad utan överlapp.
- Arbetsytan får egen vertikal scroll på mobil om innehållet inte ryms.
- Status, miniatyrer, komplettering och Visa förslag ligger i separata stabila rader.
- Ingen ändring av AI-logik, Worker eller analysflöde.


v2.7.3
- Hela plaggminiatyren är klickyta (även själva bilden) och markerar valt plagg tydligt.
- Ett andra tryck på redan markerad och färdiganalyserad miniatyr öppnar just det plaggets förslag.
- Huvudknappen visar dynamiskt om den öppnar markerat plagg eller granskar färdiga plagg.
- Komplettera markerat plagg fortsätter alltid att gälla vald miniatyr.


v2.7.4
- Tog bort den stora textstatusen ovanför miniatyrerna.
- Varje plagg har nu ett enkelt stoppljus i miniatyrens hörn.
- Punkten morfar mjukt röd → orange → gul → gulgrön medan CCC arbetar.
- Fullt grönt betyder alltid att analysen faktiskt är klar.
- När analysen blir klar pulserar den gröna punkten tre gånger och visar därefter ett fast grönt ✓.
- Ingen falsk 0–100 %-progress visas.


v2.7.5
- Fixade stoppljuset: v2.7.4-blocket hade råkat skrivas med bokstavliga \n-tecken och CSS-reglerna kunde därför inte tolkas korrekt.
- Statuspunkten startar röd och morfar nu steglöst via orange, gul och gulgrön medan analysen pågår.
- Fullt grönt används först när AI-resultatet verkligen är klart; då pulserar punkten tre gånger och visar ✓.
- Huvudknappen används inte längre som statusrad: den heter Visa förslag även medan den är grå/inaktiv.
- Om andra plagg redan är klara kan knappen i stället visa Granska X klara plagg.
- Ingen ändring av AI- eller Cloudflare-logik.


v2.7.6
- Tog bort gula numrerade märken på miniatyrerna; stoppljuset är enda statusmarkören.
- Tog bort texten X plagg i Vision-arbetsytan.
- Lade Tillbaka i Vision-headern.
- Tillbaka från ett förslag går till alla miniatyrer utan att radera bilder eller analyser.
- Tillbaka från redigering går till förslaget; från Vision-arbetsytan går den till Dashboard.
- Den stora Tillbaka-rutan i fångstvyn togs bort.


v2.7.7
- Återställde start-/arbetsytans layout efter att imageCount-elementet tagits bort; CSS använder nu batchStrip som verklig tillståndskälla.
- Gjorde headerns tre mobilikoner mindre så bakåt, tema och profil ryms utan att trycka sönder helheten.
- Behåller stoppljus, klickbara miniatyrer och bakåtnavigering.


v2.7.9
- Dubbel text under miniatyrer ersatt med gemensam hjälptext ovanför.
- AI-timeout höjd från 45 till 90 sekunder; inga automatiska omförsök.
- Efter 15 sekunder visas diskret information om att analysen tar längre tid medan samma anrop fortsätter.


v2.7.10
- Tog bort texten om att analysen tar längre tid; stoppljuset är enda normala statusindikatorn.
- AI-timeout ligger kvar på 90 sekunder och inget automatiskt dubbelanrop görs.
- Miniatyrer går nu att öppna även medan AI analyserar.
- Under pågående analys öppnas manuell redigering direkt så användaren kan arbeta vidare utan att vänta.
- Användarens manuella ändringar sparas separat och skrivs inte över när AI-resultatet kommer tillbaka.
- Tillbaka från manuell redigering under pågående analys går tillbaka till arbetsytan utan att avbryta analysen.


v2.7.11
- Vision använder nu explicit intern vy-state i stället för att gissa aktuell vy via hidden-element.
- Headerns Tillbaka fungerar från första Vision-vyn: start → Dashboard.
- Navigationskedjan är nu start → arbetsyta → förslag → redigering, med konsekvent ett steg tillbaka utan att börja om.
- Från arbetsytan går Tillbaka till Vision-starten utan att radera den pågående sessionen.
- Om en pågående session finns när man går tillbaka till Vision-starten visas "Fortsätt pågående arbete" så sessionen kan återupptas utan dataförlust.
- Strukturen är avsedd som pilot för samma navigationsmönster i kommande CCC-moduler.


v2.7.15 DEBUG
- Tillfällig kostnadsdiagnostik visas direkt på huvudraden i kostnadsrutan.
- Visar usage JA/NEJ, input/output/total tokens och modell efter nästa AI-analys.
- Ingen AI-, Worker- eller flödeslogik ändrad.


v2.7.22
- Fixar kostnadsrutan för kameraflödet: om AI hinner bli klar innan "Klar" trycks uppdateras kostnaden när plagget läggs till i sessionen.
- Kostnadsrutan visar åter Session, Idag och Senaste AI-analys i stället för DEBUG-raden.
- Senaste analysen visar input/output-token för verifiering medan 6 decimaler behålls under kostnadstestet.
