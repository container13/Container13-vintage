# Lina Clean Core Migration Checklist

- [x] Flat filstruktur.
- [x] Login/session portad och frikopplad från modul-loader.
- [x] En boot.
- [x] En router.
- [x] Central state.
- [x] Separat API-lager.
- [x] Dashboard-skal.
- [x] Forskning-skal.
- [x] G2 route/back-skal.
- [ ] Live-verifiera login → Dashboard → Forskning → G2 → Tillbaka.
- [ ] Porta auktoritativ G2-motor.
- [ ] Jämför G2-resultat mot legacy V0.58.8.
- [ ] Porta Jägaren.
- [ ] Porta G1.
- [ ] Porta Historik/Forward/Verktyg.

- [x] Uppdatera använder V0.58.8 som referens men korrigerad för Clean Core-kravet: rensa login-session, bevara localStorage, ren cache-bustad index-URL, visa login igen.
- [x] Regel: tidigare fungerande funktion testas först och jämförs mot aktuellt beteendekrav; ingen blind kopiering.

- [x] Portat legacy V0.46.3 loginfält-clear/autofill-skydd.
- [x] Browser reload tvingar login, localStorage bevaras.

## Swing G2 – V0.2.1
- [x] Fryst plan portad utan parameterändring.
- [x] Exakt grid 648 varianter.
- [x] A–O ordning portad.
- [x] M måste frysa kandidat/hash före N.
- [x] Ingen rescue efter N.
- [x] G2 hämtar egen data.
- [x] Rapport + Raw JSON export.
- [x] Strategi separerad från UI.
- [ ] Live reproducerbarhetskörning mot legacy-resultat – kräver lyckad historisk Worker-data och görs efter användarens första V0.2.1-körning.
