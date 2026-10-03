# LINA HANDOFF — CLEAN CORE V0.2.88

## Syfte
V0.2.88 visar ett nytt Gen7-planförslag efter att Gen6 är fryst och GitHub-verifierad. Releasen är plan-only: ingen planlåsning, runnerspec, research eller Forward.

## Fryst källa
- Gen6 planhash `206c11d7` och runnerspechash `768e8d3e` lämnas oförändrade.
- Gen6 kandidat/evidens är read-only.
- Gen7-förslaget bygger på `gen6.gen7Basis`, dvs fryst Gen6-sammanställning/metodnoter, inte på ny marknadsdata.

## Gen7 proposal
- Planhash `6876470e`.
- Hypotes: pröva robustheten i Gen6:s riskregim-idé som ett nytt preregistrerat experiment, med explicit stabilitetskrav och utan efterhandsjustering av Gen6.
- Historisk forskningsgräns kvar `2024-12-31`; observerad 2025–2026-data får inte bli ny unseen holdout.
- Gates kvar: >=100 OOS-affärer, PF >=1.20, DD <=12%, positiv OOS, koncentration <=40%, positiva folds >=3/4.
- Samma expanderande TRAIN→OOS-folds 2020→2024.
- Exakt stabilitetskontroll, ranking och tie-break ska definieras/hashas i framtida runnerspec före research; de är medvetet inte uppfunna i planförslagsreleasen.

## Säkerhetsbarriärer
- Gen7 state initieras som `PLAN_PROPOSAL`, `planLocked=false`, `researchOpened=false`, `forwardOpened=false`.
- UI har endast export av Gen7-planförslaget och visar `Gen7-plan EJ LÅST`.
- Ingen Gen7 runner/engine finns i releasen.
- Handel AV. Robotmognadsmodell `6e8908ca` oförändrad.

## Releasekontroll
- `LINA_MASTER_RULES.md`, V0.2.87 handoff och faktisk `generation-engine.js`/Gen6-kod lästa före ändring.
- `LINA_RELEASE_CHECKLIST.md` tillämpad.
- JS syntaxkontrollerad.
- Single-version-source/cache gate verifierad för V0.2.88.
- CHANGED FILES ONLY och FLAT COMPLETE ZIP integritetskontrollerade.
