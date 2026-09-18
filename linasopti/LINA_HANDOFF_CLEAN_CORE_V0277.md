# LINA HANDOFF CLEAN CORE V0.2.77

## Scope
Gen5 Yahoo response-parser hotfix only. No research logic, plan, runnerspec, gates, ranking, Worker, Forward or trade changes.

## Root cause proven by V0.2.76 probe
Yahoo `/yahoo-bars` returns valid market bars in top-level `rows`. The research loader's generic `rowsOf()` inspected generic top-level arrays after `bars`/`data`, so it could select `symbols: ["AMD"]` before `rows`. Normalization then produced zero bars and falsely reported empty data.

## Fix
`rowsOf()` now explicitly prioritizes `rows`, then `bars`, then `data`; generic fallback accepts only arrays whose first item is an object. This matches the parser behavior proven by the V0.2.76 probe.

## Integrity
- Gen5 plan hash unchanged: d501a5e1
- Gen5 runnerspec hash unchanged: db1c4d7f
- No Gen5 research had started before this hotfix.
- Handel AV. Forward closed. Gen4 immutable. Worker unchanged.
- Data preflight still must pass before research can begin.
