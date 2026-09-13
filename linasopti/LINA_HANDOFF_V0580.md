# LINA HANDOFF – V0.58.0

## G2 primary workflow
Lås plan → Kör G2 A–O → Resultat → Exportera till ChatGPT.

Do not require the user to manually visit generic Data for G2. The existing v0560Run engine fetches DEV 2020–2022 itself, then after M opens locked pseudo-forward 2023–2026 at N.

## User-facing states
1. Not locked: one primary button `Lås G2-planen`.
2. Locked/incomplete: one primary button `Kör G2 A–O` / `Fortsätt G2 A–O`.
3. Complete: `Exportera G2-rapport till ChatGPT`, plus explicit instruction to send the file to ChatGPT.

Advanced/raw/report/backup/reset controls remain available under `Avancerade G2-kontroller`.

## Permanent UX/research rule
If a frozen experiment already knows its required inputs, hide infrastructure from the primary path. Let the engine fetch/run. Always expose the next action. Finished research should end in a clear export handoff to ChatGPT.

## Unchanged research
No strategy/signal/risk/forward changes.
Jägaren forward anchor 2026-09-11.
Swing G1 forward anchor 2026-09-14.
Swing G1 hash 8f09f32a.
Swing G2 grid/DEV/pseudo-forward unchanged.
Handel AV.
Robotmognad 48/100.

## Release rules
Two ZIPs per release: COMPLETE and CHANGED FILES ONLY.
Old handoff files are immutable.
Never generate images unless the user explicitly requests image generation.
