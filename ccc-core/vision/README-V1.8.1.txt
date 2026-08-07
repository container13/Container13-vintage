CCC Vision v1.8.1
=================

Riktig uppdatering av Vision-modulen.

Ändrat:
- Vision börjar förbereda förslaget direkt när ett foto har tagits i CCC:s egen kameravy.
- Användaren kan fortfarande välja "Ta om" eller "Använd bild" medan Vision jobbar i bakgrunden.
- Om förslaget redan är klart markeras "Använd bild ✓" diskret.
- Kamerarullen stödjer upp till tre valda bilder. Vision startar direkt när mobilens bildväljare lämnar tillbaka valet till CCC.
- Ingen popup eller separat "Vision arbetar"-ruta används.
- Texten "Jag tror att det här är:" är borttagen; resultatvyn visar bara förslaget.
- Max tre bilder totalt: huvudbild + lapp + baksida.
- Riktig AI är ännu inte inkopplad; väntetiden simulerar framtida analys.

Teknisk begränsning:
Webbläsaren kan inte se markeringar medan iOS/Androids kamerarulle fortfarande är öppen. Analysen kan därför börja först när användaren bekräftat sitt bildval och filerna lämnas tillbaka till CCC.
