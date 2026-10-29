# Gen17 – avgränsad väg till planlås (2026-10-29)
Status: DRAFT_ONLY; ingen simulering eller handel.

## Beslut och återbruk
Användaren accepterade uttryckligen osäkerheten kring tidigare Gen7/8 och bad att vi fortsätter. Detta ersätter punkt 1 som STOP i LINA_GEN17_VOL_CONTRACTION_PRELOCK_2026-10-29.md. Tidigare kontroller återanvänds: råfilens SHA256 cb84e436a0527b44262949994306dcb85eaf5f10ad88fc7906d443833cc6589c PASS (8 446 807 byte), kalender 16 symboler/1258 sessioner PASS, SPY:s 20 utdelningar avstämda. Detta bevisar INTE point-in-time giltighet.

## Matematisk konsekvens för föreslagen Gen17-gate
För R=(H-L)/C gäller att om H,L,C för en bar multipliceras med samma positiva faktor a, blir R'=(aH-aL)/(aC)=R exakt. Därmed är Gen17:s 20+20-kontraktionsmått invariant mot en konsekvent multiplikativ justering per bar, även om faktorn varierar mellan dagar. Det innebär att framtida split-/utdelningsbackadjustment i sig inte ändrar just denna range-kvot om OHLC justeras enhetligt per bar. OBS: kontrollens SMA180, 50-dagars breakout, next-open exekvering, qty, kostnader och P/L kan fortfarande påverkas av faktorer som varierar över tid. Datagrinden för hela jämförelsen kvarstår. Testa inte förrän denna skillnad hanterats.

## Endast återstående blockerare
1. Fastställ för redan arkiverad OHLC om H/L/C har en gemensam positiv justeringsfaktor per bar och om något fält är blandat raw/adjusted. Kontrollera endast berörda eventdatum och signalfönster, inte hela historiken igen.
2. Fastställ om Gen16-baslinjens signaler, affärspriser och redovisning är tidskorrekta vid split/utdelning. Dokumentera observerad påverkan eller BLOCKED_DATA om as-of vintage inte kan styrkas; gissa inte.
3. Kontrollera faktisk signalklocka i Gen16 så t-1..t-40 avser avslutade barer utan att av misstag flytta signal en extra dag.
4. Upprätta exakt hashad RUNNERSPEC och explicit användargodkännande före låsning eller backtest. Kända 2021–24 är ingen osedd holdout.

Gen16 fryst NO_CANDIDATE; Gen17 DRAFT_ONLY/BLOCKED_DATA; handel och Forward OFF. Ingen ändring av produktionsgren, Worker eller resultat.
