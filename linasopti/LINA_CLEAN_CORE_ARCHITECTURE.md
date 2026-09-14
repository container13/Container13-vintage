# Lina Clean Core Architecture V0.2.5

- `index.html`: skal + robust login gate.
- `app.js`: exakt en app-boot och vyregistrering.
- `router.js`: exakt en router.
- `state.js`: centralt state/localStorage.
- `api.js`: extern data/API-trafik.
- `g2.js`: isolerad G2-vy/modulskal.
- `style.css`: gemensam responsiv UI.

Ingen ES-module-loader krävs för grundstarten. Script laddas deterministiskt med `defer`. Login kan därför låsa upp sidan även om en senare modul skulle få fel. Inga exakta versionsguards, clone/rebind-system eller historiska bootkedjor får återinföras.

## Proven-function-first
När en funktion fungerat i legacy används den implementationen som förstahandsreferens och regressionstest innan ny lösning byggs. V0.2.5 återanvänder V0.58.8:s `v0512Refresh`-beteende.


## Auth/refresh invariant V0.2.5
`Uppdatera` får aldrig kunna återöppna Dashboard genom en kvarvarande sessionflagga. Refresh-flödet skickar därför explicit `force_login=1`; auth-bootstrap behandlar denna före auto-unlock och bevarar endast persistent appdata i localStorage.


V0.2.5: loginfältets autofill-skydd är portat från legacy V0.46.3. Browser reload tvingar ren login utan att röra localStorage.

## V0.2.5 – G2-modulgräns
- `g2-engine.js`: fryst strategi, datainsamling, checkpoints, A–O, rapport/export.
- `g2.js`: endast vy och användarflöde.
- `app.js`: endast registrering/routing; ingen G2-strategilogik.
- Legacy V0.58.8 används som beteende- och regelreferens, men legacy-boot/navigation portas inte.

## Initial route policy – V0.2.5
Clean Core har en explicit startgräns: autentisering öppnar alltid Dashboard. Router-hashar är endast intern sessionsnavigation och återanvänds inte som initial vy efter en ny start/inloggning.


## G2 storage invariant – V0.2.5
Efter M är DEV-rådata och full grid inte längre runtime-krav för N/O. De komprimeras bort, medan A–M-resultat, fryst kandidat och pågående OOS-checkpoint bevaras. State-nyckeln `lina_clean_swing_g2_v0200` behålls avsiktligt för checkpoint-kompatibilitet och är inte appversionsnumret.
