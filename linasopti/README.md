# Linas Opti V0.26

V0.26 testar ett treläges-omvärldslager ovanpå den verifierade Swing-motorn. Baslinjen är oförändrad.

Omvärldslagret använder endast SPY-information som fanns vid föregående stängning:
- GRÖN: SPY över/vid SMA20 och mindre än 3 % under 20-dagarshögsta. Upp till 5 positioner.
- GUL: SPY under SMA20 eller minst 3 % under 20-dagarshögsta, men inte rött. Upp till 3 positioner.
- RÖD: minst 5 % under 20-dagarshögsta, eller både under SMA20 och minst 3 % under högsta. Inga nya köp.

Befintliga positioner tvångssäljs aldrig av omvärldslagret. Stop -7 %, target +12 %, 20 handelsdagar, scoring och kronologi är oförändrade.

Resultat/export visar antal gröna/gula/röda dagar samt blockerade signaler. Detta är ett experimentellt backtest, inte investeringsrådgivning.
