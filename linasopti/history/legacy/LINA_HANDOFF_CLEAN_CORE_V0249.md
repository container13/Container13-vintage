# Lina Clean Core V0.2.49 – handoff

V0.2.49 är en blocker-fix för Gen2-modulladdning. Rotorsak verifierad: V0.2.46–V0.2.48 ändrade det hashade PLAN-fältet `next`; FNV-1a blev 1b97692d i stället för den förregistrerade 1d5f8bc1. `gen2-lab.js` kastade därför GEN2 PLAN HASH MISMATCH innan LinaGen2Lab registrerades.

Fix: exakt fryst V0.2.45 PLAN-payload återställd. Runnerimplementationen är fortsatt separat. Planhash 1d5f8bc1. Holdout 2025-01-01–2026-09-10 SEALED. Handel AV. Robotmognad 48/100. Original G2/G3 Real Forward orört. Cloudflare Worker oförändrad (V0.2.43).
