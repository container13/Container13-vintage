CCC VISION
==========

Syfte
-----
Vision hjälper användaren från foto till ett färdigt, redigerbart produktförslag. Arbetsflödet prioriteras före AI-tekniken.

Aktuellt – v2.5.6
------------------
- Dashboard öppnar Vision direkt.
- Första Vision-skärmen har tre tydliga kort: Ta ett foto, Välj från kamerarullen och Tillbaka.
- Ta ett foto är största/primära kortet. Kamerarullen använder samma designspråk men lägre visuell tyngd. Tillbaka är ett mindre navigationskort.
- Den stora fotoytan är själva kameraknappen; ingen separat Börja fota-knapp används.
- ← Tillbaka går direkt till dashboard om inget arbete påbörjats. Finns bilder i aktuell omgång frågar CCC innan Vision lämnas.
- Reset-pilen visas först när det faktiskt finns ett påbörjat Vision-utkast och använder enkel text: Börja om.
- Demo-val visas inte längre på den vanliga första Vision-skärmen.
- Ett foto per plagg är standard.
- CCC förbereder förslag tyst i bakgrunden medan användaren fortsätter fotografera.
- Kamerarulle kan ge flera plagg; varje vald bild behandlas som ett plagg.
- Efter fotograferingen granskas plaggen ett i taget.
- Godkänn & nästa går vidare direkt.
- Ändra öppnar kompakt redigering och Spara & nästa fortsätter.
- Extra bilder på samma plagg läggs bara till vid behov, högst två extra i nuvarande testflöde.
- Slutvyn innehåller Alla plagg klara, Fota fler plagg och Till dashboard.
- Bilderna är local-first. Råbilder laddas inte till Firebase som mellanlager.
- Vision-resultaten är fortfarande simulerade; riktig AI kopplas in senare.

Design
------
Vision ska använda samma CCC-skal som dashboarden. Versionsnumret visas via ../version.js och ska inte upprepas inne i Vision-innehållet.

Nästa
-----
Finputs av kamera/design, därefter Firebase för relevant runtime/metadata och återupptagning – utan att göra Firebase till mellanlager för opublicerade råbilder.

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
