# LINA HANDOFF CLEAN CORE V0.2.78

Syfte: evidens/export-hotfix efter observerad och fryst Gen5.

- Gen5 får ALDRIG köras om.
- V0.2.78 läser endast redan sparade familyResults/runs/summaryFreeze.
- Om gen6Basis saknas skapas det deterministiskt från fryst Gen5-summary, utan ny simulering.
- Generation Engine-export innehåller gen5FrozenResearch med fulla familjeresultat, runs, summary, freeze/evidence, candidate och Gen6-basis.
- Robotmognad är fortsatt 48/100. Regelbaserad modell är NOT_LOCKED och får inte ändra score ännu.
- Handel AV. Forward öppnas inte. Gen4 orörd. Worker oförändrad.
