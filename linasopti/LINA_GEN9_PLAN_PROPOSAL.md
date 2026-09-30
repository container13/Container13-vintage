# LINA Gen9 — planförslag för granskning

Status: PROPOSAL / NOT_LOCKED. Implementation och syntetiska tester godkända som arbetsuppgift 2026-09-30; slutligt planlås återstår. Datum 2026-09-30. Ingen planhash, runnerspec, kandidat, forskning eller Forward skapas av detta dokument.

## Fråga och hypotes
Kan ett förutbestämt köpstopp vid svag marknadsbredd förbättra robustheten hos en lång trendmodell jämfört med samma modell utan köpstopp?
Det är inte bevisat att det föreslagna filtret fungerar. 2021–2024 är redan observerad utvecklingshistorik; ingen del kallas ny holdout.

## Belagt underlag
Gen8:s samtliga fyra familjer fick samma valda parametrar inför 2022 som Gen7. Alla TRAIN-alternativ fick +20 stabilitetsbonus och inget avdrag; rangordningen ändrades inte. PF 2022: 0.02858, 0.04530, 0.02572, 0.25082. Ensemblens fyra årsresultat är identiska mellan Gen7 och Gen8.
Gen8-koden begränsar signaldatum men inte avslut vid TRAIN-slut, trots att simulatorn får data till OOS-slut. Omfattningen av påverkan är inte fastställd. Drawdown bygger på avslutade affärer, inte daglig portföljvärdering. Koncentration i sammanfattningen är största symbolandel i en enskild fold, inte hela periodens poolade andel.

## Två förutbestämda varianter
A: fast lång trendmodell utan marknadsbreddsfilter.
B: exakt samma modell, men inga nya köp om färre än 5 av de 16 aktierna ligger över SMA180 vid föregående stängning.
Inga parametergrids eller TRAIN-rankningar. A och B är nya Gen9-resultat i egen identitet; inga gamla resultat kopieras. B väljs inte automatiskt som kandidat.

## Exakt gemensam modell — föreslagen
Universum: AMD, SHOP, ADBE, MU, FDX, TSLA, LUV, NFLX, C, NOW, QCOM, BAC, GM, DDOG, PYPL, NVDA. Universum är historiskt valt och ger begränsad generaliserbarhet.
Signal efter stängning dag t: close(t) > SMA180(t) och close(t) > max(close för föregående 50 handelsdagar, exklusive t).
Entry vid nästa handelsdags open. Endast långa positioner. Exit vid close på den tolfte handelsdagen räknat inklusive entrydagen. Inget stopp-loss påstås finnas. Köpstoppsfiltret ändrar inte redan öppna positioners exit.
Startkapital 100000 per fold; max 8 positioner, max en per symbol och max 12.5% portföljvärde per position. Riskbudget 0.5% av föregående stängnings portföljvärde, dividerad med 5% av beräknat entrypris för antal aktier; detta är en storleksregel, inte garanterad maxförlust.
Volatilitet: standardavvikelse för senaste 20 logavkastningar med n−1, annualiserad med sqrt(252). Skala clamp(0.12/vol, 0.35, 1); ingen annan regimskalning. Kostnad 0.1% per sida. Fraktionella aktier tillåts, ingen hävstång.
Vid samtidig entry: fallande close(t)/close(t−50)−1, sedan symbol alfabetiskt. Befintliga innehav räknas även på exitdagen fram till close. Kontantbegränsning och positionstak kontrolleras för varje faktisk entry; tilldelning får inte använda framtida exit eller P/L.

## Datagränser och värdering
Historisk gräns 2024-12-31 bevaras. Årsfolds 2021, 2022, 2023, 2024; historik från 2020 används för indikatoruppvärmning. Ingen TRAIN-selektion görs. Otillräcklig uppvärmning eller saknad symbolbar stoppar berörd beräkning, inte tyst skip.
Signaler som skulle ge entry efter foldslut avvisas. Öppna positioner stängs vid sista tillgängliga close inom fold med ordinarie exitkostnad. Inga priser efter foldslut får läsas. Alla avslut och gränsstängningar loggas.
Daglig equity = kassa + innehav värderade till dagens close. Redovisa max mark-to-market-DD per fold samt största fold-DD, separat från avslutsbaserat DD. Folds återställer kapital, därför påstås ingen sammanhängande fyraårig equitykurva.
Rådata ska ha dokumenterad källa, justeringsstatus och hash före experiment. Kontrollera datumdubletter, OHLC-konsistens, luckor och corporate-action-justering. Oklart underlag blockerar research.

## Gates och kandidatval — ingen lättnad
Minst 100 avslutade OOS-affärer totalt; PF >=1.20; positiv total P/L; största fold mark-to-market-DD <=12%; största single-symbol gross-profit share inom varje fold <=40%; minst 3 positiva folds; varje fold PF >=0.80; största folds andel av summerad bruttovinst <=55%. Svagregimexponering <=0.65 gäller filtervarianten (0); kontrollens avsaknad av regimfilter redovisas uttryckligen som kontroll, den är inte kandidatberättigad under detta kontrakt.
PF vid noll bruttovinst/noll bruttoförlust = ej definierad. Positiv bruttovinst med noll bruttoförlust redovisas som NO_LOSSES och klarar PF-gränsen utan numeriskt ersättningsvärde; inga affärer i en fold innebär att robusthetsgate inte klaras. En helt kontant period kan alltså inte rädda en kandidat. Ingen efterhandsändring av denna regel.
B är kandidatberättigad endast om alla gates klaras. A är diagnostisk kontroll. Rapportera bådas resultat och skillnader även om B är sämre; kandidatfrysning kräver separat mänskligt beslut. Rankingformeln behöver inte ändras eftersom endast en variant är kandidatberättigad.
Detta upplägg byter mätmetod för DD jämfört med Gen8, vilket måste framgå; tidigare evidens rättas aldrig retroaktivt.

## Verifiering före planlås och forskning
Syntetiska tester: framtida data efter foldslut påverkar inga beräkningar; signal/entry/exit kring årsskifte; noll affärer får inte PASS; svag bredd stoppar B men inte A; ingen framtida observation används i positionstilldelning; kassakrav och 8/12.5%-tak; öppet värdefall syns i dagligt DD; deterministisk samtidighet; avbruten kedja återupptas utan rerun.
Granska och godkänn detta fullständiga kontrakt. Bygg sedan motor och verifiera före forskningsstart. Slutlig maskinläsbar plan och runnerspec måste överensstämma och låsas/hashas före observerade Gen9-resultat. Alla negativa resultat och affärsloggar sparas före continuation.

## Begränsning och nästa mänskliga beslut
Detta är ett avgränsat metodexperiment, inte bevis om framtida lönsamhet. Val av regler efter kännedom om 2022 ger risk för anpassning till känd historik. Verklig Forward startar först efter relevant kandidatfrysning och får aldrig backdateras.
Godkänn eller justera planförslaget före implementation/lås. Gen7/8, tidigare kandidater och separata Forward-flöden ändras inte. Handel förblir AV.

## Byggstatus V0.3.11
Ren beräkningsmodul och Gen9-förslagsvy implementerade; inga nätverksanrop, state-skrivningar, lås eller körknappar införda. Elva syntetiska metodfall godkända. Dataförkontroll kräver verifierad justeringsstatus/kalender/källa och matchande SHA256 över kanoniska normaliserade OHLC-data till historisk gräns.
Persist/resume/evidence-orkestrering och planlås är ännu inte införda och måste verifieras före verklig forskning. Automatisk corporate-action-verifiering är inte implementerad; ett intygat metadatafält ensamt bevisar inte datakvalitet. Verklig browserkontroll återstår.

## V0.3.12 — separata beslut och säker körkedja
Planlås kräver explicit knapphandling och bevarar exakt SPEC med SHA256 i egen Gen9-evidens. Ingen plan har låsts av byggarbetet. Godkännandet i chatten avsåg implementationen.
Verifierat datapaket importeras i egen IndexedDB. Schema: {manifest:{source,adjustmentStatus:"VERIFIED_ADJUSTED_OHLC",contentSha256,corporateActionsVerified:true,calendarVerified:true,historyHardStop:"2024-12-31"},data:{SYMBOL:[{d,o,h,l,c},...]}}. SHA256 av kanoniska normaliserade data måste matcha; intyg om justering/kalender kräver separat saklig verifiering, inte bara ett ifyllt fält. Inga äldre cachedata godkänns automatiskt.
Körkedjan lagrar varje av åtta variant/årsfolds i lokal checkpoint före evidenssynk. Full affärs/equity/event-logg ligger i IndexedDB och GitHub-evidens; app-state har endast hash och referenser. Saknad lokal checkpoint stoppar recovery utan omkörning. Exakt recovery från GitHub förlorade lokala checkpoints är ännu inte implementerad.
Efter åtta verifierade folds stoppar kedjan för granskning. Separat mänskligt beslut fryser sammanfattningen. Ingen kandidatfrysning eller Forward sker automatiskt.
Ny gen9-workflow.js kräver inga nya Worker-nycklar; Gen9 ligger inom befintlig generation-engine-post. Autosynk och manuell fullsynk pausas under Gen9-operation. Gen9-checkpoints mergeas monotont; olika resultathashar blockerar synk. Evidence-409 ger bara existensbevis och blockerar därför Gen9 tills innehåll verifierats.
Syntetiska workflowtester simulerar nätverksfel, återupptagning, fryst summary, saknad checkpoint och synkkonflikt. De bevisar inte verklig browser/Worker-integrering. Verkligt datapaket och browserkontroll återstår innan körning.
