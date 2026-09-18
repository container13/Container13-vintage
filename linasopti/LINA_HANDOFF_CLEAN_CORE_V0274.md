# Lina Clean Core V0.2.74 — handoff

- Bas: V0.2.73, Gen5-plan `d501a5e1` redan mänskligt låst/FROZEN · GITHUB ✓.
- Ny separat motor: `gen5-generation-engine.js` (legacy `g5-engine.js` för gamla Swing G5 lämnas orörd).
- Gen5 runnerspec hash: `db1c4d7f`.
- Runnerspec + verifiering sker deterministiskt efter planlås utan att observera research.
- En knapp `▶ Kör hela Gen5 självkörande` startar research. Kedjan använder TRAIN för parameterurval före varje OOS-fold, sparar full fold/variant-evidens före continuation, fryser summary, gör deterministiskt kandidatval om möjligt och skapar Gen6-underlag.
- Kombinerad ensemble simuleras som signaler före exekvering i en gemensam portfölj/equity curve. `riskSlots` är borttagen.
- Ingen Gen6 research, ingen Forward, Handel AV. Cloudflare Worker: INGEN ÄNDRING.
- MASTER RULES + RELEASE CHECKLIST lästa och uppdaterade. Syntaxkontroller genomförda. ZIP verifieras före leverans.
