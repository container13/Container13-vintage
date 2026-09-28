# LINA — AKTUELL HANDOFF / STATUS

Aktuell release: V0.3.00
Uppdaterad: 2026-09-28

## Aktuellt säkert läge
- Handel AV.
- Gen7 är immutable och får aldrig rerunnas.
- Gen8-plan `be68328d` är mänskligt godkänd men ännu EJ LÅST.
- Gen8 runnerspec är EJ LÅST och Engine EJ VERIFIERAD; Gen8 research har inte startat.
- Senast verifierade Generation Engine-läge efter Worker-fixen: `PLAN_APPROVED_AWAITING_LOCK`, Robotmognad 70/100, GitHub/State/Evidence grönt.
- G2 och G3 Real Forward fortsätter separat som paper/forward och får inte påverka frysta forskningsregler.

## V0.3.00 — bekvämlighet utan forskningsändring
- Global 📸 Bild-knapp i headern.
- Ett tryck sparar hela den aktuella Lina-vyn som PNG, inte webbläsarens flikar/adressfält.
- Filnamn innehåller vy, Lina-release och tidsstämpel.
- Skärmbild skapas lokalt i webbläsaren; funktionen ändrar inget forskningsstate och startar inte Gen8/Forward/Handel.
- Vid renderingsfel visas explicit felstatus på knappen; inget falskt lyckat läge.

## Permanent incidentlärdom
- App-state ska verifieras end-to-end: frontend write → sync → Worker/API validate → GitHub → GET/restore → hydrate → localStorage → boot → monotont slutstate.
- `lina_generation_engine_v0273` kräver explicit Worker-allowlist utöver `lina_clean_*`.
- Feltext ska spåras till producerande kod före fix. Inga gissnings-hotfixar.
- Releasepåståenden om kod, syntax, ZIP eller deploy måste vara faktiskt verifierade.

## Styrdokument
- `LINA_MASTER_RULES.md` är permanent regelbok.
- `LINA_RELEASE_CHECKLIST.md` är gemensam releasekontroll.
- Denna fil, `LINA_HANDOFF_CURRENT.md`, uppdateras i stället för nya versionsspecifika handoff-filer.
