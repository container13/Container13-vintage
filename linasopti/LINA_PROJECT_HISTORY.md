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


## Permanent UI architecture rule – dashboard is navigation, not content

From V0.57.0 onward Lina uses a strict three-level application hierarchy:

1. **Dashboard** – only status, next step and top-level categories.
2. **Category page** – only relevant subcategories/actions.
3. **Workspace/detail view** – the actual detailed test, data tool, history or report.

Permanent rules:
- New functionality must **not automatically add more detail to the dashboard**.
- Detailed legacy/test/data content must never expand underneath the dashboard.
- Each workspace must provide a clear back path to its parent category.
- The same information architecture must adapt automatically to mobile and larger screens.
- Existing research engines/history may remain under the hood; navigation controls what is visible.

## V0.57.0 – arkitekturbrytpunkt

Lina gick från en växande testsida till en riktig kontrollcentral/applikation.

Ny informationsarkitektur:
Dashboard → kategori → underkategori/arbetsvy.

Huvudkategorier:
Forward, Forskning, Historik, Data, Verktyg och Om Lina.

Detta gjordes efter att V0.56.x visade att även en kompakt dashboard blev rörig när äldre LABB/data-information fortfarande kunde vecklas ut under den. Från V0.57.0 får detaljinnehåll aldrig läcka in under dashboarden.

## V0.57.1 – flödesrevision

Hela paketet granskades för statusfraser som riskerar att lämna användaren utan nästa väg. Det verkliga dödläget `Redo att testa` i Data fick en direkt knapp till testvyn. Data/Test/Resultat fick ett sammanhängande arbetsflöde med tydlig `← Data`-väg. Headerns `↻ Uppdatera` återställdes oberoende av äldre V0.56-navigation.

Permanent UX-regel: när Lina säger `redo`, `klar`, `väntar på användaren` eller hänvisar till ett nästa steg på annan plats ska samma vy ge en konkret knapp eller tydlig väg dit.

## V0.57.2 – tydligare arbetsvyer

Efter praktiskt test på både stor skärm och mobil gjordes en ny layout-/flödesrevision. Detaljarbetsvyer får nu en tydlig kategori + modulidentitet och använder en primär vertikal spalt. Dataflödet ändrades från två konkurrerande desktopkolumner till en stegvis spalt. Swing G2:s steg och huvudkontroller följer samma princip.

`Kör test med denna data` var semantiskt fel eftersom knappen bara navigerade till en ny vy där användaren behövde trycka `Kör Linas Opti` igen. V0.57.2 ersätter detta med `Kör test nu`, som startar testet direkt med ett enda användartryck.

Ny permanent regel: kör-/startknappar utför handlingen; rena navigationsknappar ska heta Öppna/Visa.

## V0.57.3 – full responsivitetsrevision

Hela paketet granskades för äldre fasta/minsta bredder och horisontell overflow. Den generella gamla tabellregeln `min-width:760px` gjorde bland annat Affärsloggen bredare än arbetsytan på 13-tumsskärm.

V0.57.3:
- arbetsvyer får använda mer av tillgänglig 13-tumsbredd
- normala tabeller anpassas till arbetsytan
- Affärsloggen får proportionella kolumner och radbrytning
- mobil omvandlar användartabeller till etiketterade kort/rader
- endast uttryckligen tekniska råtabeller får behålla horisontell scroll

Permanent regel: normal användarinformation ska rymmas utan horisontell scroll på 13-tum; mobil ska reflowa breda tabeller.

## V0.57.4 – orientering och navigation

Efter test på riktig 13-tumsskärm visade det sig att användaren kunde hamna i exempelvis Marknadsdata utan att tydligt se varifrån vyn kom eller hur den hörde ihop med dashboarden.

V0.57.4 inför en gemensam kontextrad för detaljvyer:
Dashboard → kategori → modul/arbetssteg.
Den visar alltid aktuell plats, syfte och tydlig tillbaka-väg.

Samtidigt kontrolleras Marknadsgrupp mot den verkliga symbollistan. En gammal markerad preset får inte längre visas om symbolfältet representerar en annan grupp eller en egen lista.

## V0.57.5 – nästa steg behåller sammanhanget

Efter verkligt test syntes fortfarande `Dagsdata klar` utan tydlig fortsättning. Grundfelet var att Data-vyn inte säkert behöll information om vilket arbetsflöde användaren kom ifrån.

V0.57.5 sparar arbetsflödets ursprung. Efter Data:
- från Swing G2 visas `Till Swing G2 →`
- från generell Data visas `Kör test nu`

G2-knappen återgår till den befintliga kanoniska G2-modulen och markerar nästa aktiva kontroll; den startar inte automatiskt ett forskningssteg vars status kan kräva granskning/låsning.

Permanent regel: Klar/Redo/Väntar får aldrig vara en återvändsgränd.

## V0.57.6 – synlig vy är sanningen

V0.57.5 syntes inte i praktiken eftersom Data kunde visas via äldre kodvägar utan de body-klasser som de nya CSS-/orienteringsreglerna förutsatte.

V0.57.6 gör därför synlig vy auktoritativ:
- synlig Data → en spalt + Data-kontext
- synlig Test → Test-kontext
- synligt Resultat → Resultat-kontext
- synligt Testlab → den faktiskt synliga modulens kontext

Marknadsgrupp jämförs åter mot den faktiska symbollistan efter varje relevant UI-förändring.

## V0.57.7 – en gemensam boot för hela appen

En full init-granskning hittade rotorsaken bakom att Data kunde visas trots att den nya dashboardarkitekturen fanns i koden: flera V0.57.x-initfunktioner var låsta till exakt versionsnummer. När versionen ökades slutade äldre permanenta funktioner att initieras, medan den ursprungliga legacy-starten fortfarande körde `show('data', false)`.

V0.57.7 inför därför en enda auktoritativ current-app boot. Efter att äldre DOMContentLoaded-hanterare körts återställer den alltid en ny sidladdning till Dashboard och startar alla permanenta moderna system som behövs.

## V0.57.8 – arbetsflödet äger delade verktyg

Data/Test/Resultat visade tidigare bara generisk Data-kontext även när användaren kom från Swing G2. V0.57.8 sparar därför vilken strategi/modul som äger arbetsflödet och använder den identiteten i den gemensamma arbetsheadern.

Exempel: Dashboard → Forskning → Swing G2 → Data visar Swing G2 tydligt, steg Data/Marknadsdata och `← Swing G2`.

## V0.57.9 – G2 får ett riktigt guidat arbetsflöde

Efter V0.57.8 stod det klart att ägarkontext inte räckte: G2 skickade fortfarande användaren till den generella Data-arbetsbänken. V0.57.9 gör därför G2:s första arbetssteg till en egen guidad vy.

G2 visar vad som är förinställt, vad användaren ska göra nu och vad som kommer därefter. Avancerade dataval finns kvar men är sekundära. Ett klick på Hämta G2-data startar befintlig datahämtning med G2:s förbestämda val.

## V0.58.0 – tillbaka till Kör → Exportera

Vi återställde den fungerande forskningsmodellen från tidigare Lina: användaren ska inte manuellt bygga upp dataflödet för en förregistrerad studie. G2-motorn hämtar själv sina exakta perioder när A–O körs.

G2:s huvudsakliga UI är nu:
1. Lås G2-planen.
2. Kör/Fortsätt G2 A–O.
3. När O är klart: Exportera G2-rapport till ChatGPT.
4. Skicka rapportfilen till ChatGPT för analys och beslut om nästa steg.

Avancerade gamla G2-kontroller finns kvar bakom en utfällning. Forskningslogiken är oförändrad.

## V0.58.1 – G2 får ensamrätt på sin arbetsyta

V0.58.0 var korrekt tänkt men legacy `show('data')` kunde fortfarande vinna efter klick på G2. V0.58.1 inför en hård, auktoritativ G2-route.

När G2 är aktiv:
- bara Swing G2-modulen visas
- Data/Test/Resultat är dolda
- äldre show()-anrop ignoreras
- G2-kontext och guidat Kör → Exportera-flöde visas

## V0.58.2 – workspace isolation

Leak-auditen hittade 35 äldre labb-ID:n och 36 `vlab-*`-moduler. Flera äldre labb använder inte `.v0413-lab-section`, vilket gjorde att de kunde synas under G2 och andra moderna arbetsvyer.

V0.58.2 isolerar därför arbetsytan generiskt på root-nivå: endast den aktiva modulens `vlab-*`-token får visas. Gamla Forward/Forskning/Tester-rader döljs i modulvyn och en runtime-guard stoppar äldre kod från att visa syskon igen.

Samtidigt rättades G2-panelens permanenta versionsguard som gjorde att `Lås G2-planen` var död i V0.58.1.
