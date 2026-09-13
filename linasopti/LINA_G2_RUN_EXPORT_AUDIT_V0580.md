# G2 RUN/EXPORT AUDIT – V0.58.0

Verified against existing engine:
- v0560Run fetches DEV data internally via v0560FetchChunked.
- A–M execute on DEV.
- M freezes candidate/hash.
- N then fetches locked pseudo-forward.
- O writes final verdict.
- v0560Report already contains plan, stages A–O, frozen candidate, pseudo-forward and final verdict.

Therefore generic Data is not technically required for the primary G2 run.

V0.58.0 changes UI orchestration only:
Lås → Kör → Exportera.
No research engine changes.
