# LINA HANDOFF – V0.57.0

## Arkitekturbrytpunkt
Lina är från denna version en riktig hierarkisk applikation:

Dashboard → kategori → underkategori / arbetsvy.

Dashboarden visar inte längre testverktyg, stora historikblock eller dataytor.

## Huvudkategorier
- Forward
- Forskning
- Historik
- Data
- Verktyg
- Om Lina

## Navigation
Dashboard:
- kort lägesbild
- nästa steg
- sex huvudkategorier

Kategorisida:
- visar bara relevanta underkategorier

Arbetsvy:
- visar själva detaljerna
- tydlig tillbaka-knapp till föräldrakategorin

## Permanent designregel
Ny funktionalitet får inte automatiskt ge mer information på dashboarden.
Dashboarden är status + navigation. Detaljer hör hemma längre ner i hierarkin.

## Permanenta leveransregler
- Två ZIP per release: COMPLETE + CHANGED_FILES_ONLY.
- Gamla handoff-filer är orörda historiska snapshots.
- Varje ny version får en ny handoff.
- `LINA_PROJECT_HISTORY.md` är löpande projekthistorik.
- Generera aldrig bilder om användaren inte uttryckligen ber om en bild.
- `kör` betyder Lina-kod/build.

## Oförändrat
- Jägaren forwardankare 2026-09-11.
- Swing G1 forwardankare 2026-09-14.
- Swing G1 hash 8f09f32a.
- Swing G2 A–O-regler och perioder.
- Handel AVSTÄNGD.
- Robotmognad 48/100.
