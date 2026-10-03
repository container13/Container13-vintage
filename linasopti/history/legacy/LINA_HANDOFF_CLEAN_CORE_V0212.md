# LINA HANDOFF – CLEAN CORE V0.2.12
Datum: 2026-09-15

## Vad V0.2.12 gör
G2 och G3 är fortsatt frysta och deras Real Forward från anchor 2026-09-11 får inte påverkas av G4.

Ny forskningsgeneration: **Swing G4 Universe Robustness**. Syftet är att testa portabilitet: exakt fryst G2-kandidat `15efd75a` körs senare på ett annat förregistrerat universum utan parameterändring.

Plan-ID/hash: `95d2e735`.
Testuniversum: AAPL, MSFT, AMZN, GOOGL, META, JPM, XOM, UNH, JNJ, PG, KO, CAT, HD, DIS, NKE, WMT.
Period: 2020-01-01 → 2026-09-10.

## Gate – fryst före resultat
PASS kräver ≥100 affärer, P/L >0, PF ≥1,15, DD inte sämre än -8 %, minst 4 positiva kalendersegment samt max 50 % av summerad positiv P/L från ett enskilt bolag.
HOLD kräver ≥60 affärer, P/L >0, PF ≥1,00 och DD inte sämre än -12 %. Annars FAIL.

## Viktig evidensbegränsning
G4 är inte ny oberoende OOS. Alternativuniversumet definieras 2026 och är inte ett historiskt point-in-time-index; survivorship/urvalsbias måste redovisas. G2/G3 Real Forward är högre evidens.

## V0.2.12 avsiktliga stoppunkt
Denna release innehåller plan + UI för att låsa planen. **Ingen G4-resultatmotor finns ännu.** Användaren ska deploya V0.2.12, gå till Forskning → Swing G4 Universe Robustness, kontrollera planen och trycka `Lås G4-planen`. Först därefter byggs nästa release som får hämta data och öppna G4-resultatet.

## Oförändrat
- G2 kandidat `15efd75a` fryst.
- G3 Research Gate PASS, plan `75838ed5`, metod fryst.
- G2/G3 Real Forward anchor 2026-09-11.
- Robotmognad 48/100.
- Handel AV.
