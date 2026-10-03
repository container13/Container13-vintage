# Lina Clean Core V0.2.96

Blockerfix för Generation Engine state/bootstrap.

- Preboot-recovery körs före Generation Engine och endast vid det specifika felstate där Gen7 återställts till PLAN_PROPOSAL.
- Återställer auktoritativt fryst Gen5–Gen7-state och Gen8 HUMAN_APPROVED_AWAITING_LOCK från V0.2.92-seed.
- Kör aldrig om Gen7-research och öppnar inte Forward/Handel.
- Recovery är monoton: den gör ingenting när Gen7 redan är fryst eller ett nyare Gen8-state finns.
