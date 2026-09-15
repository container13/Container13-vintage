# LINA HANDOFF – CLEAN CORE V0.2.11
Datum: 2026-09-15

## Vad V0.2.11 gör
G3 Research Gate är satt till **PASS** och G3-metoden är fryst efter den låsta körningen med planhash `75838ed5`.

Verifierat G3-metodresultat: 181 affärer · +18 446,11 · PF 1,4851 · WR 51,38 % · DD -3,38 %. Detta är metodtest, inte ny oberoende OOS.

Ny modul: **Swing G3 Real Forward / Paper**. Den visas bredvid G2 Real Forward under Forward. Båda har anchor 2026-09-11 och Handel AV.

G2: statisk kandidat `15efd75a`.
G3: fryst topp-12-kandidatpool från 2020–2022 och månadsvis val utan look-ahead. September 2026 startar med fryst modell `69147890`, tränad t.o.m. 2026-08-31. Vid framtida månadsskiften får G3 endast använda data som då redan finns.

## Forskningsregler
- Ingen G3-rescue eller parametertrimning på observerade 2023–2026-resultat.
- G3 får inte beskrivas som vinnare över G2 på historiken.
- Real Forward hålls separat för G2 och G3.
- Milstolpar: 60 / 120 / 250 stängda affärer.
- Robotmognad kvar 48/100.
- Handel AV.

## Nästa steg
Deploy V0.2.11. Öppna Forward och kör `Hämta nya marknadsdagar` separat för G2 och G3. Kontrollera senaste marknadsdag, aktuell G3-månadsmodell, öppna/stängda paper-positioner och export. Ingen forskningsregel ändras medan forward-testet pågår.
