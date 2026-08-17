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
