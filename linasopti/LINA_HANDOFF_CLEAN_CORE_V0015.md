# Lina Clean Core V0.1.5 – Handoff

## Bas
Byggd från senaste Clean Core V0.1.3 COMPLETE. V0.58.8 COMPLETE är permanent legacy-facit.

## Rotorsak i V0.1.3
`window.location.reload()` behöll `sessionStorage["linasopti_unlocked"] = "1"`. Därför öppnades Dashboard direkt efter Uppdatera och login visades aldrig. Befintligt `#dashboard` och gammal query kunde också ligga kvar.

## Ändring
- Uppdatera visar `Laddar…`.
- Rensar endast `linasopti_unlocked` i sessionStorage.
- Rör inte localStorage/checkpoints.
- Bygger ny URL av origin + pathname; gammal query och hash följer inte med.
- Lägger till `?update=<timestamp>` för cache-bust.
- Använder `window.location.replace()` så den gamla URL:en inte blir ett extra historiksteg.
- Efter laddning ska login visas igen.
- Login/Enter i övrigt orörd.
- Proven-function-first-regeln förtydligad: gammal fungerande lösning är referens, men måste matchas mot aktuellt krav innan den återanvänds.

## Live-test
1. Logga in.
2. Dashboard.
3. Tryck Uppdatera.
4. URL ska bli ren `.../linasopti/index.html?update=<timestamp>` utan `#dashboard` och utan gammal lösenkods-query.
5. Login ska visas.
6. Logga in igen och kontrollera Dashboard.

## Nästa steg efter PASS
Forskning → Swing G2 → Tillbaka. Därefter portas auktoritativ G2-motor och jämförs mot legacy innan acceptans.


## V0.1.5 – force-login vid Uppdatera
Uppdatera använder nu tvåstegs-säkring: först rensas `linasopti_unlocked` före navigering, därefter skickas `force_login=1` och login-booten rensar samma flagga igen innan auto-unlock kontrolleras. Detta ska garantera att Uppdatera alltid landar på login samtidigt som localStorage-data bevaras.
