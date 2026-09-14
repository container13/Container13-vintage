# Lina Clean Core Architecture V0.1.6

- `index.html`: skal + robust login gate.
- `app.js`: exakt en app-boot och vyregistrering.
- `router.js`: exakt en router.
- `state.js`: centralt state/localStorage.
- `api.js`: extern data/API-trafik.
- `g2.js`: isolerad G2-vy/modulskal.
- `style.css`: gemensam responsiv UI.

Ingen ES-module-loader krävs för grundstarten. Script laddas deterministiskt med `defer`. Login kan därför låsa upp sidan även om en senare modul skulle få fel. Inga exakta versionsguards, clone/rebind-system eller historiska bootkedjor får återinföras.

## Proven-function-first
När en funktion fungerat i legacy används den implementationen som förstahandsreferens och regressionstest innan ny lösning byggs. V0.1.6 återanvänder V0.58.8:s `v0512Refresh`-beteende.


## Auth/refresh invariant V0.1.6
`Uppdatera` får aldrig kunna återöppna Dashboard genom en kvarvarande sessionflagga. Refresh-flödet skickar därför explicit `force_login=1`; auth-bootstrap behandlar denna före auto-unlock och bevarar endast persistent appdata i localStorage.


V0.1.6: loginfältets autofill-skydd är portat från legacy V0.46.3. Browser reload tvingar ren login utan att röra localStorage.
