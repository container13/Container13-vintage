# LINA HANDOFF – V0.56.2

## Huvudändring
Dashboard-scroll fixad på både mobil och större skärmar.

### Rotorsak
V0.56.1-dashboarden låg inne i den äldre `.sticky-top`-containern. Sedan V0.38.3 är `.sticky-top` `position:fixed`, vilket gjorde att dashboardens fulla höjd inte räknades in i dokumentets scrollhöjd. Därför syntes nästa sektion längst ned men gick inte att nå.

### Fix
I `body.v0561-dashboard-mode` går `.sticky-top` tillbaka till normal dokumentflow (`position:relative`) och `.wrap`/dashboard får automatisk full höjd och vertikal sidscroll. Arbetsvyerna behåller tidigare beteende.

## Permanenta leveransregler
1. Varje Lina-release levereras som två ZIP:
   - COMPLETE
   - CHANGED_FILES_ONLY
2. Gamla handoff-filer skrivs aldrig om retroaktivt.
3. Ny version får ny handoff.
4. README + LINA_PROJECT_HISTORY ska bära de permanenta projektreglerna vidare.

## Permanent bildregel
Skapa/generera aldrig bilder för Lina om användaren inte uttryckligen ber om en bild.
En bifogad skärmdump ska analyseras som UI/buggbevis.
`kör` betyder bygg/ändra Lina-koden, inte skapa en bild.

## Oförändrat
- Jägaren forwardankare: 2026-09-11
- Swing G1 forwardankare: 2026-09-14
- Swing G1 hash: 8f09f32a
- Swing G2 A–O-regler/perioder
- Handel AVSTÄNGD
- Robotmognad 48/100
