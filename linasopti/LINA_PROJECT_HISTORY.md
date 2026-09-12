# LINA – PROJECT HISTORY

## Målbild
Lina utvecklas som en forsknings- och valideringsmiljö för flera oberoende investeringsstrategier. Fokus är att göra det svårt att lura sig själv med backtest, inte att maximera historisk avkastning.

## Grundmetod
1. Formulera en separat strategiidé.
2. Förregistrera period, regler, kostnader, risk och parameterfamilj.
3. Utveckla på DEV.
4. Kör robusthetstester.
5. Frys kandidat + hash.
6. Öppna låst historisk pseudo-forward en gång.
7. Ingen rescue efter öppnad holdout.
8. Om kandidaten överlever får den samla riktig forwarddata.
9. Historisk pseudo-forward får aldrig kallas färsk OOS.
10. Riktiga pengar är avstängda tills lång faktisk forwardevidens finns.

## Jägaren
- Exit Lab, Entry Lab, Regim Lab, Day Selection, Kapital Lab och Signal Lab genomfördes.
- Close-location 83 % frystes som forskningskandidat.
- Validation A visade 4 PASS / 2 FAIL; PBO/DSR och friktion var svagheter.
- Validation B–K gav totalt 109 historiska tester/steg.
- Tidsmaskin 2024–2026-09-10: 442 affärer, +2 523,51 kr, PF 1,081.
- Riktig forward från 2026-09-11.
- Regler frysta.

## Swing G1
- Research Gate och Alphabet A–O.
- DEV 2021–2023.
- Fryst kandidat: trend 50, pullback 2 %, recovery prevhigh, SPY100, stop 7 %, target 12 %, hold 5.
- Hash 8f09f32a.
- DEV: 249 affärer, +15 658 kr, PF 1,434, DD -5,20 %.
- Låst historisk pseudo-forward 2024–2026-09-10: 323 affärer, +2 417 kr, PF 1,042, DD -5,66 %.
- Bedömning: POSITIV MEN TUNN.
- Riktig forward från 2026-09-14.

## Swing G2
- Ny oberoende breakout/momentum-familj.
- DEV 2020–2022.
- Låst historisk pseudo-forward 2023–2026-09-10.
- 648 förregistrerade varianter.
- A–O omfattar integritet, baseline, breakoutfamilj, trend, volym, SPY-regim, exit, friktion, kapital, årsstabilitet, leave-one-symbol-out, bootstrap, kandidatfrysning, pseudo-forward och slutrapport.
- Ingen rescue efter N.

## Dashboard-princip
Från V0.56.1 är Lina dashboard-first:
- vad är aktivt?
- vad är klart?
- vad är nytt?
- vad är nästa steg?
- varför tog vi besluten?
- kan hela projektläget återställas från backup?

Handel: AVSTÄNGD.
Robotmognad: 48/100 tills ny faktisk forwardevidens motiverar ändring.
