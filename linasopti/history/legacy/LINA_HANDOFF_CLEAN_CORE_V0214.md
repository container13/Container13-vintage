# LINA HANDOFF – CLEAN CORE V0.2.14
Datum: 2026-09-15

## V0.2.14 – teknisk G4 storage hotfix
V0.2.13 stoppades under G4-hämtningen av `localStorage` quota. Detta var ett tekniskt lagringsfel och inget G4-utfall. G4-planen `95d2e735` och kandidaten `15efd75a` förblir låsta och oförändrade.

V0.2.14 flyttar G4:s tunga råa marknadsdata/checkpoint till IndexedDB. localStorage får endast kompakt state/resultat. En befintlig V0.2.13-checkpoint migreras automatiskt till IndexedDB och kan fortsätta från sparad year/symbol-position; därefter tas den gamla tunga V0.2.13-posten bort. Efter färdig beräkning rensas rådata från IndexedDB.

## G4 oförändrat
Universum: AAPL, MSFT, AMZN, GOOGL, META, JPM, XOM, UNH, JNJ, PG, KO, CAT, HD, DIS, NKE, WMT. Period 2020-01-01–2026-09-10. SPY endast regimfilter. Exakt fryst G2 `15efd75a`: breakout 55, SMA200, volume 1.5, SPY200, stop 7 %, target 15 %, hold 10. Gate från V0.2.12 är oförändrad. Ingen rescue.

## UI
Lina-vattenmärket förstorat globalt: desktop max 620 px och mobil 96vw. Ingen bildfil ändrad.

## Oförändrat
G2/G3 Real Forward anchor 2026-09-11. G3 Research Gate PASS/fryst. Robotmognad 48/100. Handel AV.
