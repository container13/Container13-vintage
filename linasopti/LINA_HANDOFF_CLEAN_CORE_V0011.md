# LINA HANDOFF – CLEAN CORE V0.1.1

Datum: 2026-09-14

## Varför releasen finns
V0.1 hade ett blockerande loginproblem: godkänd kod kunde lämna användaren kvar utan att Dashboard startade. V0.1.1 gör login oberoende av ES modules och startar Clean Core efter unlock-event/session.

## Verifieringsflöde
1. Öppna `/linasopti/index.html`.
2. Logga in med samma kod som gamla Lina.
3. Dashboard ska visas direkt.
4. Öppna Forskning.
5. Öppna Swing G2.
6. Tillbaka ska gå till Forskning och därefter Dashboard.

## Arkitektur
En boot, en router, ett state-lager, ett API-lager. Flat filstruktur. Ingen legacy-initkedja. V0.58.8 COMPLETE är facit och permanent återställningspunkt.

## Nästa steg
Efter live PASS: migrera G2-motorn och jämför resultaten mot legacy-facit innan modulen godkänns.
