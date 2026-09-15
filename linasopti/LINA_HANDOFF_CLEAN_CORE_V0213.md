# LINA HANDOFF – CLEAN CORE V0.2.13
Datum: 2026-09-15

## V0.2.13
G4-planen `95d2e735` låstes av användaren i deployad V0.2.12 innan denna runner byggdes. V0.2.13 får därför öppna G4-resultatet.

G4 kör exakt fryst G2-kandidat `15efd75a` (breakout 55, SMA200 trend, volym 1.5, SPY200-regim, stop 7 %, target 15 %, hold 10) med oförändrade kostnads-/riskregler på det frysta testuniversumet AAPL, MSFT, AMZN, GOOGL, META, JPM, XOM, UNH, JNJ, PG, KO, CAT, HD, DIS, NKE, WMT under 2020-01-01–2026-09-10. SPY används endast som regimfilter.

## Gate – redan fryst före resultat
PASS: ≥100 affärer, P/L >0, PF ≥1,15, DD ≥−8 %, minst 4 positiva kalendersegment och max 50 % av summerad positiv P/L från ett bolag.
HOLD: ≥60 affärer, P/L >0, PF ≥1,00, DD ≥−12 %. Annars FAIL.

## Evidens
G4 är portabilitets-/robusthetstest, inte ny oberoende OOS. Universumet definierades 2026 och är inte historiskt point-in-time. G2/G3 Real Forward från anchor 2026-09-11 har högre evidens. Ingen rescue efter G4-resultat.

## Oförändrat
G2 `15efd75a` fryst. G3 Research Gate PASS/metod fryst. G2/G3 Real Forward anchor 2026-09-11. Robotmognad 48/100. Handel AV.
