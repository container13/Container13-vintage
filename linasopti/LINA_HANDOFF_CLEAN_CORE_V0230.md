# LINA HANDOFF – CLEAN CORE V0.2.30

## Status
G2–G12 historisk forskning är fryst. G2/G3 Real Forward aktiva från anchor 2026-09-11. Robotmognad 48/100. Handel AV.

## V0.2.30 – Forward Integrity & Sync
Forward-runtime kan flyttas mellan datorer med Backup/Import i Forward Evidence Center. Affärer identifieras deterministiskt och merge:as utan dubbelräkning. Import validerar anchor + G2 candidate `15efd75a` + G3 plan `75838ed5`; G3-modeller kontrolleras per månad. Konflikt stoppar importen. Permanent dokumenterad historik är fortsatt facit och påverkas inte av browser-import.

## Arbetsflöde mellan datorer
1. På dator A: Uppdatera G2+G3 och välj Backup Forward-state.
2. På dator B: välj Importera/synka state och välj backupfilen.
3. Lina merge:ar kompakt runtime, dubbelräknar inte samma trade-ID och behåller senaste kända marknadsdag.
4. Kör därefter vanlig Uppdatera G2+G3.

## Lagringsregel
README/handoff/evidence/archive/resultat = permanent projekthistorik. localStorage = kompakt runtime. IndexedDB = stora rådata/checkpoints/cache. Syncfilen är en transport/backup av kompakt runtime, inte ett nytt forskningsresultat.

## Nästa fas
Efter verifierad sync på två datorer bör utvecklingen pausas och G2/G3 få samla genuint ny Real Forward-evidens. Första formella milstolpe 60 stängda affärer per modell.

Cloudflare Worker: INGEN ÄNDRING.
