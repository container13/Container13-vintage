# Linas Opti Clean Core V0.2.94 — blockerfix

## Orsak
V0.2.93 introducerade en rekursionsbugg när Generation Engine öppnades: `state()` anropade `gen7Integrity()`, som i sin tur anropade `state()` igen. Webbläsaren stoppade med `Maximum call stack size exceeded`.

## Fix
- `gen7Integrity(snapshot)` kan nu verifiera ett redan laddat state utan att anropa `state()` igen.
- Gen8-initieringen i `state()` skickar sitt befintliga state till integritetskontrollen.
- Ingen forskningsstate, Gen7-evidens, Gen8-plan, Forward eller Handel ändras av fixen.
- Gen8 Auto Pipeline från V0.2.93 är i övrigt oförändrad.

## Säkerhet
Handel AV. Forward öppnas inte. Gen7 körs inte om.
