# Lina Clean Core — Handoff V0.2.85

V0.2.85 automatiserar det säkra steget efter låst Gen6-plan: runnerspec byggs, canonical-hashas, låses och verifieras mot planens metod/gates. Ingen Gen6-forskning startas.

- Gen6 planhash: `206c11d7` (oförändrad).
- Ny modul: `gen6-generation-engine.js`.
- Runnerspec innehåller 16-symbolsuniversum, fyra TRAIN→OOS-folds 2020–2024, oförändrade gates och exakt hashad rankingformel.
- Gen6 testar pre-execution risk-/regimstyrd exponering och volatilitetsskalad positionsrisk. Ingen efterhandsfiltrering.
- Generation Engine kör `prepare()` automatiskt endast när Gen6-planen redan är låst; resultatet är RUNNERSPEC_LOCKED + ENGINE_VERIFIED_READY_FOR_RESEARCH.
- UI visar planhash, runnerspechash, verifieringsstatus och export av Gen6-runnerspec.
- Ingen runAll/research-action exporteras i Gen6-modulen i denna release. Handel AV, Forward stängd, Robotmognadsmodell oförändrad.
- Single Version Source kvar: `version.js` = V0.2.85 / cache 0.2.85.
