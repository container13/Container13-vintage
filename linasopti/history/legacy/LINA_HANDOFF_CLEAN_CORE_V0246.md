# Lina Clean Core V0.2.46 – Handoff

## Fast läge
- REGEL 1 gäller. Handel AV. Robotmognad 48/100.
- Byggd från V0.2.45 COMPLETE efter live PASS.
- Gen2-plan `1d5f8bc1` oförändrad och verifierat låst.

## V0.2.46
- Gen2 Research Runners för fyra förregistrerade familjer.
- Separat runnerspec måste låsas före första körning; därefter ändras inte grids/universum.
- DEV 2020–2022 och Validation 2023–2024 är enda tillåtna datafönster.
- Holdout 2025-01-01–2026-09-10 är SEALED och saknar runner/resultatyta.
- Rådata → IndexedDB; kompakt state/resultat → localStorage. FAIL/negativa resultat bevaras.
- Original G2/G3 + Real Forward är orörda kontrollspår.

## Nästa steg
Live-verifiera plan+runnerspec, kör familjerna en i taget och granska DEV/Validation-resultaten. Ingen kandidatfrysning eller holdoutöppning förrän den låsta urvalsmetoden är uppfylld och resultaten granskats.

Cloudflare Worker: INGEN ÄNDRING. Använd verifierad V0.2.43 Worker.
