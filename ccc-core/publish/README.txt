CCC Publish v2.8.1

Mobil först. Läser opublicerade produkter från IndexedDB ccc-local-workspace/images.
Flöde: miniatyrer -> stor bild -> svep mellan plagg -> beskär -> lokal WebP.
Beskärning sker först när användaren väljer att publicera, inte i Vision.
WebP: kvadratisk 1:1, max 1600 px, kvalitet 0.84.
Ingen Firebase-publicering är aktiverad i v2.8.1. Nästa integrationssteg är Container13 Nyinkommet.

CCC Publish v2.9.15
- Bildräknaren i detaljvyn (t.ex. 7 av 7) är centrerad horisontellt över bilden.
- Pilar, bildyta och övrig detaljlayout är oförändrade.


CCC Publish v2.9.16
- Bildräknaren ligger i en egen centrerad rad ovanför bildytan i detaljvyn.
- Samma fasta placering används i Anpassa bild, så räknaren inte hoppar åt höger när bildytan ändrar storlek.
- Pill-design, pilar och övrig detaljfunktion är oförändrade.

v2.9.17
- Publicera: behåller den raka Core-skiljelinjen under modulhuvudet men tar bort extra kant/kurva i innehållsvyerna.
- Detaljvyn och Anpassa bild använder nu samma yttre bildbredd/geometri så bildytan inte växer när man går in i anpassning.
- Bildräknaren behåller den enhetliga centrerade placeringen ovanför bildytan från v2.9.16.

v2.9.18
- Publicera: detaljvyn, Anpassa bild och vyn för att spara anpassningen använder samma höjdbegränsade kvadratiska bildyta.
- Bildytan växer inte längre till full viewportbredd i Anpassa bild.
- Nederdelen har reserverad safe-area/bottenmarginal så Spara anpassning och den lilla status-/hjälptexten under Anpassa bild inte kapas på mobil.
- Bildräknarens centrerade placering från v2.9.16 lämnas oförändrad.


v2.9.20
- Alla färdiga publiceringsbilder standardiseras till kvadratisk 1:1-canvas.
- Beskuren bild fyller canvasen; Behåll hela bilden visar hela originalet centrerat i samma canvas utan beskärning.
- Extra kant/pseudolinje under Core-linjen i Publicera-vyerna tas bort.
- Bildräknaren flyttas upp 6 px och görs något större.
- Spara anpassning återgår till detaljvyn för exakt samma plagg-ID.
- README_CHATGPT_CCC.txt och ccc-core/version.js ska följa med Changed-files vid versionsleverans.
