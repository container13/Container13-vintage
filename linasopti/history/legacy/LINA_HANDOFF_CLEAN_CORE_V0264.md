# Lina Clean Core V0.2.64 – handoff

MASTER RULES införd som auktoritativ permanent projektregelbok: `LINA_MASTER_RULES.md`. `LINA_RELEASE_CHECKLIST.md` är permanent release-gate. Inför V0.2.64 har MASTER RULES, V0.2.63-handoff och faktisk Gen4-kod kontrollerats.

V0.2.64 ersätter fyra manuella Gen4-run-knappar med en enda `▶ Kör hela Gen4`. Automatkedjan kör de fyra förregistrerade familjerna i ordning. Efter varje familj sparas full variantdata/state och evidenssync försöks innan nästa familj startar. Vid återupptagning hoppas redan sparade familjer över; de körs inte om. Progress visas i Gen4-vyn. Efter 4/4 stoppas Lina vid sammanställningen för mänsklig granskning/frysning. Ingen kandidatfrysning eller Forward sker automatiskt.

Gen4 plan `8d51311d` och runnerspec `d1daab90` är oförändrade. Research hard-stop 2024-12-31, Handel AV och Forward-spärr är oförändrade. Gen4 rankingformeln dokumenteras nu uttryckligen före första observerade Gen4-run i MASTER RULES; den får därefter inte ändras.

Cloudflare Worker: NO CHANGE. Robotmognad 48/100.
