# Lina incident V0.2.93–V0.2.99

## Slutlig rotorsak för Synkfel i V0.2.98
V0.2.97 gjorde `lina_generation_engine_v0273` till en obligatorisk frontend-synknyckel. V0.2.98 gjorde felet synligt i stället för att hoppa över state tyst. Den faktiska Worker-koden `validateAppState()` accepterade fortfarande endast nycklar som började med `lina_clean_` och kastade exakt `Otillåten App-state nyckel`.

Detta verifierades i faktisk V0.2.98-kod före V0.2.99. Felet låg alltså i ett kontraktsglapp mellan frontend och Worker/API, inte i Gen8-state eller forskning.

## V0.2.99 permanent korrigering
Worker accepterar nu exakt `lina_generation_engine_v0273` utöver `lina_clean_*`. Ingen bred generell nyckelöppning infördes. Worker- och frontendgränser för entry/package harmoniserades till 2 000 000 / 5 000 000 tecken.

## Permanent processregel
Varje ny permanent state-nyckel kräver kontraktstest frontend ↔ Worker i samma release. Syntax/ZIP-test räcker inte. Exakt API-fel ska spåras till producerande kod före ändring.

Ingen Gen7/Gen8 research kördes om under incidentfixarna. Handel förblev AV och Forward stängd.
