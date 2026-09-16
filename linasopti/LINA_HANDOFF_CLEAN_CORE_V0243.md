# LINA HANDOFF – CLEAN CORE V0.2.43

Datum: 2026-09-16

## Syfte
Automatisk Real Forward catch-up vid Lina-start, utan att behandla en pågående USA-marknadsdag.

## Viktigt livefynd från V0.2.42
Vid ca 17:54 svensk tid 2026-09-16 uppdaterades Forward manuellt och state visade marknadsdag 2026-09-16 trots att USA-marknaden fortfarande var öppen. Detta får inte användas som avslutad forward-dag. V0.2.43 inför därför safe completed market cutoff.

## V0.2.43
- G2/G3 refresh hämtar endast t.o.m. säkert avslutad USA-marknadsdag.
- Lina-start triggar automatisk pull -> catch-up -> push när master inte ligger på säker cutoff.
- Före 16:15 America/New_York används föregående vardag; helg backas till fredag. Börshelgdagar hanteras genom att datakällan saknar bar för dagen.
- Om gammal master ligger framför cutoff kan Worker endast rollbacka när autentiserad inkommande state uttryckligen anger completedThrough och den omräknade staten ligger <= cutoff.
- Handel AV. Robotmognad 48/100. Inga frysta forskningsresultat ändras.

## Live-test efter deploy
Deploy Worker först, sedan CHANGED FILES ONLY. Öppna Lina och Forward Evidence Center. Under pågående USA-session 2026-09-16 ska master repareras från 2026-09-16 till senaste avslutade handelsdag 2026-09-15. F5 och GitHub forward-state.json verifieras före PASS.
