# LINA HANDOFF – Clean Core V0.2.20
Datum: 2026-09-15

## Syfte
UI-hotfix för Lina-watermark. Ingen forsknings- eller handelslogik ändrad.

## Ändring
V0.2.19 kopierade legacy V0.20/V0.21 men missade den senare effektiva overlay-stacken i Linas Opti V0.58.8.
V0.2.20 lägger därför på legacy V0.22 samt de efterföljande opacity-stegen V0.23/V0.24/V0.25: watermark z-index 50, mix-blend-mode multiply och slutlig opacity .112 desktop/.12 mobil. Detta gör att Lina ligger som riktig watermark ovanpå gränssnittet och därför syns genom korten såsom i gamla Linas Opti.

## Fryst / ej ändrat
- G5 plan 6ec36eb2 oförändrad.
- G5-resultat/logik oförändrad.
- G2/G3/G4/Forward oförändrade.
- Handel AV.
- Robotmognad 48/100.
