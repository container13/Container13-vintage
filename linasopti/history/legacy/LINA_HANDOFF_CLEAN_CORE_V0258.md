# LINA HANDOFF – CLEAN CORE V0.2.58

## Status
- Handel AV. Robotmognad 48/100.
- Gen2 avslutad: Holdout FAIL, 45 affärer, PF 1.65, DD 7.5%, P/L +14891. Evidens FROZEN · GITHUB ✓. Ingen omkörning/rescue.
- Gen3 plan låst: fa55540a.

## V0.2.58
- Gen3 runnerspec + research engine tillagd som separat modul.
- Fyra familjer: Kortare trend/momentum, Trend-pullback, Multi-timeframe momentum, Diversifierad regime ensemble.
- Fyra walk-forward OOS-folds: 2021, 2022, 2023, 2024.
- Låsta gates: >=100 OOS-affärer, PF >=1.20, DD <=12%, positiv OOS, max 40% gross profit från en symbol, positiv i minst 3/4 folds.
- Engine blockerar data efter 2024-12-31. Ingen historisk Gen3-holdout skapas. Forward-only slutprov startar tidigast 2026-09-18 efter framtida kandidatfrysning.
- Alla varianter lagras före nästa steg; negativa resultat bevaras; evidens GitHub-first.
- Pedagogiska ?-rutor finns vid varje centralt Gen3-begrepp.
- Cloudflare Worker: INGEN ÄNDRING.

## Nästa säkra kedja
1. Lås runnerspec.
2. Verifiera engine.
3. Kör de fyra familjerna en gång vardera.
4. Sammanställ först därefter kandidatbeslut. Ingen forward-data får läsas av research-engine.
