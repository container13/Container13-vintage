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


## Permanent release rule – two ZIP packages

From V0.56.1 onward, every Lina release delivered to the user MUST include two ZIP packages:

1. **COMPLETE** – the complete deployable Lina package containing all files required for the version.
2. **CHANGED_FILES_ONLY** – only files that were created or modified since the immediately preceding release.

Additional rules:
- Both ZIP packages must use the same Lina version number.
- The complete package is the authoritative deployable release.
- The changed-files package is a convenience package for reviewing/updating only changed files.
- Every delivery must state which files are included in CHANGED_FILES_ONLY.
- Release inspection and ZIP integrity checks must be performed before delivery.
- Historical `LINA_HANDOFF_Vxxxx.md` files are immutable snapshots and must not be rewritten retroactively.
- Each new version gets a new handoff file.
- `LINA_PROJECT_HISTORY.md` is the rolling project/build history and may be updated in new releases.
- This rule must be preserved in future README/handoff files so it survives chat handoffs.


## Permanent assistant/build rule – no generated images unless explicitly requested

For the Lina project, the assistant must **never generate, create, redesign or mock up an image merely because the user attaches a screenshot or says "kör"**.

- A screenshot is normally evidence to inspect/analyse the actual Lina UI or bug.
- `kör` means continue the requested Lina code/build work unless the user explicitly asks for an image.
- Image generation may only be used when the user explicitly asks to create/generate/design/render an image or visual.
- This rule must be preserved in future README and handoff files so it survives chat handoffs.

## V0.56.2
Dashboard scroll/höjd korrigerad efter verkligt test på desktop och mobil. Felet berodde på att dashboarden låg inne i den äldre fasta `.sticky-top`-containern och därför inte bidrog till dokumentets totala höjd.

## V0.56.3
Dashboarden förenklades till en verklig översikt: tre kompakta spår, uppdateringsknapp i headern och historik/verktyg bakom en utfällbar ingång. All historik behölls.

## V0.56.4
Den gamla jättesidan under `Historik, forskning & verktyg` togs bort från dashboardflödet. I stället öppnas separata fokuserade arbetsvyer/overlays för historik, Jägaren, Swing G1, Tidsmaskin, metod, data och anteckningar. Alla äldre testmoduler finns kvar via en kompakt väljare.
