# Lina Clean Core V0.1.6 – handoff

## Bas
Byggd från Clean Core V0.1.5. Legacy V0.58.8 är permanent facit/checkpoint.

## Ändrat
- Exakta V0.46.3-mönstret för att hålla loginfältet tomt har portats från fungerande legacy-Lina.
- Vanlig browser reload rensar endast `linasopti_unlocked` och visar login.
- Linas egen Uppdatera fortsätter cache-busta och tvinga login.
- Ingen `localStorage`-data rensas.

## Testkrav
1. Öppna sidan: loginfält tomt.
2. Password manager/autofill får inte lämna synligt förifyllt fält.
3. Logga in -> Dashboard.
4. Firefox Reload -> loginfält tomt.
5. Logga in -> Linas Uppdatera -> loginfält tomt.
6. Enter och knappen ska båda logga in.

## Nästa större steg
När login/refresh är godkänt: fortsätt kontrollerad migrering av G2 utan att ändra frysta strategiregler.
