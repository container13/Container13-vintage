# LINA HANDOFF – CLEAN CORE V0.2.52
Datum: 2026-09-17

## Ofrånkomliga regler
- Frångå aldrig fastställda projektregler. Vid regelkrock: stoppa och påtala den.
- Handel AV. Robotmognad 48/100.
- Bygg alltid från senaste COMPLETE.
- Original G2/G3 + Real Forward är orörda kontrollspår.
- Holdout 2025-01-01–2026-09-10 är SEALED tills en kandidat uttryckligen frysts enligt den förregistrerade processen.

## Gen2 fryst metod
- Planhash: 1d5f8bc1.
- Runnerspec: c7f6a2d9.
- DEV: 2020-01-01–2022-12-31.
- Validation: 2023-01-01–2024-12-31.
- 15 försök registrerade: 4 Trend/momentum, 4 Mean reversion, 4 Volatility breakout, 3 Regime ensemble.
- Sparade toppresultat: Trend PASS; Mean reversion FAIL (79/80 affärer); Volatility breakout PASS; Regime ensemble PASS.

## V0.2.52
- Inför formell beslutspunkt för V0.2.49:s historiska evidenslucka: 11 icke-topprankade variantdetaljer saknas.
- Tillåten policy är endast att dokumentera luckan och INTE köra om, rekonstruera eller fabricera de saknade raderna.
- När användaren låser beslutet skapas/fryses ett pre-holdout JSON-evidenspaket och GitHub-synk försöks via befintlig evidence-pipeline.
- Kandidat fryses INTE i denna release. Holdout öppnas INTE.

## Nästa steg efter live PASS
- Verifiera att beslutet låses och att pre-holdout-evidensen visar FROZEN/SYNCED eller FROZEN/VÄNTAR PÅ SYNK.
- Därefter separat kandidatfrysningsrelease utifrån redan förregistrerad urvalsregel och befintlig evidens. Ingen metodändring.

## Cloudflare Worker
INGEN ÄNDRING. Använd verifierad V0.2.43 Worker och befintlig /evidence-endpoint.
