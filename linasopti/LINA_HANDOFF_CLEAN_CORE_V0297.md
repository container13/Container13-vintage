# Lina Clean Core V0.2.97

Blockerfix efter V0.2.95–.96.

## Rotorsak verifierad
Generation Engine-state använder nyckeln `lina_generation_engine_v0273`, men GitHub-synkens `eligible()` tog endast med `lina_clean_*`. Därför saknades Generation Engine-state i cross-device/bootstrap-paketet. När nyckeln saknades träffade preboot-recoveryn inte heller, eftersom den bara reparerade ett redan existerande Gen7 `PLAN_PROPOSAL`. Generation Engine skapade då ett färskt Gen7-förslag i minnet, vilket gav Gen7 aktuell och robotmognad 10/100.

## Fix
- Preboot recovery återställer auktoritativt fryst Gen5–Gen7-state även när Generation Engine-nyckeln saknas.
- `lina_generation_engine_v0273` ingår nu i GitHub state sync.
- Generation Engine-konflikter mergas monotont efter forskningsprogression så äldre remote state inte kan backa fryst lokal forskning.
- Gen8 återställs till `PLAN_APPROVED_AWAITING_LOCK`; Gen7 körs aldrig om.
- Handel AV och Forward stängd.
