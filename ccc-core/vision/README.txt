CCC VISION
==========

Syfte
-----
Vision hjälper användaren från foto till ett färdigt, redigerbart produktförslag. Arbetsflödet prioriteras före AI-tekniken.

Aktuellt – v2.5.2
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
