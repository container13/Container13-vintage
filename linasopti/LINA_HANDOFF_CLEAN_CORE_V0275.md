# LINA HANDOFF CLEAN CORE V0.2.75

Data-preflight hotfix for Generation 5.

- Gen5 plan d501a5e1 unchanged and frozen.
- Gen5 runnerspec db1c4d7f unchanged and locked.
- No research result was stored before the V0.2.74 AMD data stop.
- Historical data is now fetched in year-sized slices using the same Worker endpoints as Gen4, then merged deterministically.
- One-button chain performs a full 16-symbol / 2020–2024 data preflight before RESEARCH_RUNNING.
- Any missing year/symbol stops before research and stores diagnostics; no skip, rerun, rescue or fallback result fabrication.
- Gen4 immutable. Forward closed. Handel AV. Worker unchanged.
