# Lina Clean Core V0.2.66 – handoff

MASTER RULES, V0.2.65-handoff, release-checklist, diagnostik 2026-09-18 09:24 och faktisk Gen4/GitHub/evidence-kod granskade före ändring.

V0.2.66 är recovery/synk-hotfix efter att app-state-synk backade Gen4 från observerade 4/4 till 3/4. Ingen Gen4-research får köras om. Ny knapp `🛟 Återställ observerad Gen4-evidens` söker exakt redan fryst ensemble-evidens lokalt/GitHub, verifierar schema + planhash 8d51311d + runnerspec d1daab90 + familj + variantantal och återställer den utan marknadsdataanrop. Om exakt evidens saknas stoppas recovery.

GitHub app-state merge är nu monoton specifikt för irreversibelt Gen4-state: familyResults/runs unioneras och fryst summary får inte backas. Autosynk pausas medan RUN_ALL_GEN4 faktiskt är RUNNING. Evidence-sync är separat. MASTER RULES/checklist uppdaterade permanent med detta.

Ingen forskningslogik, grid, gate, ranking, plan eller runnerspec ändrad. Handel AV. Forward stängd. Cloudflare Worker: INGEN ÄNDRING. Robotmognad 48/100.
