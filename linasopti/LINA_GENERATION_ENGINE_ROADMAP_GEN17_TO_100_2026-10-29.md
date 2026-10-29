# Linas Opti – forskningsmotor från Gen17 till Gen100

Status: DRAFT / PROCESS DESIGN. Datum 2026-10-29. Endast isolerad dokumentation. Ingen Gen17-planlåsning, forskning, handel, Forward eller deploy.

## Prior-art-granskning och kvarstående lucka
Gen9–16 låsta planer granskade: breadth stop/exponering, sektortak, ranking, signalbekräftelse, exitändring, pris-kanal-breakout. Ingen särskild entry-gate för föregående kursvolatilitetskontraktion. G2/G3/G5 faktisk handelslogik granskad: breakout, trend, volym (omsättning) och SPY-regim, ingen motsvarande kursvolatilitetskontraktion. Gen4/6/7/8 har endast övergripande bevarade resultat i denna granskning, inte tillräcklig fullständig källkodskontroll. Gen1-identitet ej verifierad. Därför är unikhet för Gen17 UNVERIFIED; ingen retroaktiv upprepning av frysta körningar.

## Gen17 kandidat – endast en ändring
Undersök om en enskild akties föregående OHLC-baserade kursvolatilitetskontraktion före breakout kan minska falska inträden jämfört med fryst Gen16-kontroll. Inte samma sak som Gen16:s volatilitetsbaserade positionsstorlek eller G2/G3/G5:s handelsvolymfilter. Exakt indikator/tröskel/lag och förregistrerad riskgrind måste fastställas innan planlåsning. Observerade 2021–24 får aldrig kallas osedd holdout. Kontrollera äldre Gen1/4/6/7/8-kod innan nyhetsanspråk.

## Generation Engine – skalbar standard för Gen18–100
För varje generation N: (1) Läs senaste verifierade CURRENT_STATE, HANDOFF och fryst föregående runnerspec/resultat; gör kompakt prior-art-matris över tidigare hypoteser och datakrav. (2) Föreslå EN kausalt motiverad förändring med explicit nollhypotes och motiverat datakontrakt. (3) Kontrollera rättigheter, fullständighet, corporate actions, tidskorrekt tillgänglighet och läckage; STOP vid blockerare. (4) Skriv PROPOSAL, exakt deterministisk RUNNERSPEC, immutable inputmanifest, testprotokoll och resultatgrindar; begär uttryckligt godkännande för PLAN_LOCK. (5) Efter godkännande: kör CI-säkerhet, isolerad forskning, inga produktionseffekter. (6) Spara råresultat, trade ledger, daglig mark-to-market equity, årsfolds, kostnader, koncentration, hash, jämförelse mot fryst kontroll och felanalys. (7) Beslut PASS/NO_CANDIDATE utan rescue, parameterjakt eller omkörning av frysta generationer. (8) Uppdatera både CURRENT_STATE och HANDOFF med commit och exakt readback. (9) Ny generation endast efter dokumenterad slutstatus; separat uttryckligt beslut krävs för Forward/handel.

## Kapacitet och stoppvillkor
Gen18–100 är en målram, INTE 83 godkända eller förhandsplanerade strategier. Generationsnumret får aldrig ersätta evidens. Varje generation måste ha genuint ny, datamässigt genomförbar hypotes och en förregistrerad jämförelse. Förhindrad plan => BLOCKED, inte artificiellt FAIL/PASS. Framtida holdout måste uppstå efter låsning, inte genom återanvändning av kända år. Kontrollera multiple testing / data snooping över många generationer och redovisa urvalsbias. Kör aldrig 83 generationer automatiskt utan separat tillstånd, budget och skydd för dataläckage.

## Operativ checklista för nästa tillfälle
- Sök och läs bevarad Gen1/4/6/7/8 källkod och eventuella fullständiga specs för kontraktions-/ATR-/range-/Bollinger-entry; markera luckor.
- Definiera Gen17 exakt indikator, en tröskel och tidslag utifrån teori eller fristående utvecklingsperiod, utan 2021–24 facit.
- Verifiera OHLC och corporate-actions-proveniens samt att jämförelsen inte ändrar fryst Gen16-identitet.
- Presentera komplett plan för uttryckligt godkännande; behåll Gen17 DRAFT_ONLY, trade/Forward OFF tills dess.
