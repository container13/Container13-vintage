# Gen17 – planförslag (EJ LÅST, EJ GODKÄNT)

Status: DRAFT_ONLY. Ingen runnerspec, ingen engine-verifiering, ingen research-start, ingen handel eller Forward.

## Grundad inventering
- Gen13: RANK_TO_CAPACITY, fast breakout-/exitmodell.
- Gen14: PERSISTENCE_CONFIRMATION, två bekräftande stängningar före inträde.
- Gen15: TREND_INVALIDATION_EXIT, trendbaserad exit.
- Gen16: PRICE_CHANNEL_BREAKOUT, tidigare högsta high i 50 sessioner som signalreferens.
- Gen13–Gen16: frysta NO_CANDIDATE enligt LINA_SYSTEM_MANUAL.md. Gen16 föll på koncentrations- och fold-PF-gates; exakt fold-/symbolfördelning och resultatvärden är inte verifierade i denna inventering.
- Gen16 runnerspec SHA-256 a065ce8ad2285010493f8491c86116f01025ed3554be18744471de394dbdeafa. Historisk datagräns 2024-12-31, OOS-folds 2021–2024, 16 symboler, redan observerade utvecklingsdata.

## Föreslagen forskningsfråga
Kan en på förhand bestämd, koncentrationsmedveten fördelning av risk mellan samtidiga giltiga signaler minska beroendet av enskilda symboler och förbättra fold-robusthet jämfört med oförändrad kontroll, utan att signal-/exitregler samtidigt ändras?

## En enda experimentell förändring
Kandidatvariant: fördelning av positionsrisk vid inträde; kontrollvariant: exakt fryst referensbeteende. Köp- och säljsignaler, kostnader, foldgränser, instrumentuniversum och exekvering ska hållas lika. Exakt fördelningsalgoritm och referensgeneration måste väljas och hash-låsas *före* observerbar Gen17-körning. Ingen parametergrid eller efterhandsjustering.

## Obligatoriska grindar före planlås
1. Läs och verifiera permanent Gen16-summary och fold-evidens från auktoritativ evidenstjänst, inklusive receipt/SHA. Samma kontroll för tidigare generationer där jämförelse krävs.
2. Kontrollera att ingen befintlig Gen17-plan, runnerspec, state eller evidence finns. STOPP vid konflikt.
3. Bestäm exakt kontrollmodell och enda ny fördelningsregel utan resultatstyrd optimering; dokumentera risk för selektion utifrån observerad historik.
4. Lås mått, gates och kandidaturval i förväg. Gen16:s kända gates: minOosTrades 100; minPf 1.20; maxDd 0.12; positiveOos; maxConcentration 0.40; minPositiveFolds 3; minFoldPf 0.80; maxFoldGrossProfitShare 0.55. Dessa är referens, inte automatiskt Gen17-beslut.
5. Bestäm oberoende framtida verifieringsunderlag. 2021–2024 får inte presenteras som osedd holdout.
6. Mänskligt godkännande av exakt plan före PLAN_LOCKED. Därefter runnerspec/hash, engine-verifiering, preflight och separat säker start enligt aktuellt Generation Engine-kontrakt.

## Skydd
Gen8–Gen16 är permanent frysta och får inte köras om eller modifieras. Ingen research får startas av detta dokument. Handel och Forward är AV. Ingen ny kandidat eller forward-behörighet följer av en positiv backtest.

## Öppen blockerare
Gen16:s immutable summary gick inte att läsa via tillgänglig anslutning i denna session. Inga exakta historiska resultat har därför antagits.

## Gen17 ny riktning - diagnos 2026-10-27 (DRAFT_ONLY)
- Användarens mål: Lina ska kunna stå utanför marknadslägen där hennes long-only breakoutmodell saknar gynnsamma förutsättningar; inte nödvändigtvis tjäna pengar i varje regim.
- Read-only 2022 Gen16 fold trade-listor: CONTROL 18 affärer, 2 vinnare, 16 förlorare, P/L -5229.75; PRICE_CHANNEL_BREAKOUT 13 affärer, 1 vinnare, 12 förlorare, P/L -4133.07. Samtliga affärer i båda fold-filerna har exitReason TIME_12. Det visar inte kausal orsak till förlusterna.
- Föreslagen ny forskningsfråga: kan en ENDA, på förhand definierad och endast historiskt tillgänglig marknadsregimgrind blockera nya long-inträden när marknadsmiljön inte stöder breakout? Ingen förändring av exit, sizing, instrument, kostnader eller andra signaler samtidigt.
- Exakt regimvariabel, tröskel, datatillgänglighet, referenskontroll, gates och framtida oberoende verifieringsfönster är INTE valda eller godkända. 2021-2024 är observerade data; ingen retroaktiv holdout. Undvik 2022-specifik överanpassning. Behåll koncentrationsgrinden separat, en regimgrind garanterar inte koncentrationslösning.
- Ingen planlåsning, runnerspec, körning, Forward eller handel. Mänskligt godkännande av exakt plan krävs först.

## Read-only inventering 2026-10-27: regimgrindens databehov
- Gen16 låst motor har redan per-symbol SMA180 för inträde, 50-sessioners prior-high breakout, next-open entry, 12-sessioners time exit, volatilitetsstyrd storlek, 16 aktier och foldår 2021-2024.
- Gen16 dataset är 16 symbolers synkroniserade OHLC-bars; inget separat marknadsindex/benchmark är dokumenterat i låst runnerspec eller i motorens normaliseringskontrakt. SOURCE_gen9-data.json gav ingen läsbar rådata via GitHub fetch. Indexbaserad regimgrind kan därför inte förutsättas tillgänglig.
- Rekommenderad isolerad forskningsfråga (ännu ej exakt låst): tillåt nya long-inträden endast när en förregistrerad, marknadsbred trendregim är gynnsam. Ett möjligt dataoberoende mått är andel av de befintliga 16 symbolerna vars föregående dags close överstiger deras SMA180; använd föregående handelsdags information före next-open, inte framtida värden. Exakt tröskel och om universums överlevnadsbias är acceptabelt återstår att besluta; ingen tröskelgrid eller efterhandsval.
- Viktig begränsning: ett breddfilter kan minska antal affärer och förvärra minOosTrades, och löser inte automatiskt symbolkoncentration eller TIME_12. Gen16-resultat 2021-2024 är observerad utvecklingsdata, inte ny holdout. Framtida oberoende verifiering måste planeras innan research.
- Nästa: verifiera befintlig datasetstruktur/om tidigare regimfilter återanvänds i systemet, specificera en enda kausal regel och fullständiga gates, presentera exakt plan för mänskligt godkännande. Ingen låsning/körning.

## 2026-10-27: prior-art STOP - breadth idea is NOT novel
- Verified Gen10 locked runnerspec: GRADED exposure uses prior-close count of 16 symbols above SMA180, with tiers 0-4 at 0.25, 5-7 at 0.5 and 8-16 at 1.0 exposure.
- Verified Gen12 locked runnerspec: BREADTH_50_GATE skips ALL new entries when fewer than 8 of 16 symbols closed above SMA180. This is the same core rule as the previously proposed Gen17 breadth gate.
- Therefore DO NOT lock, run, retune or present the Gen17 breadth gate as novel. Prior Gen10 and Gen12 are frozen NO_CANDIDATE; changing the threshold based on observed 2021-2024 results would be a prohibited rescue.
- Gen16 raw input contract is 16 aligned OHLC symbol histories (1258 bars each, 20128 total); no separate market benchmark in locked runnerspec. The immutable DATA evidence is a manifest, not the full OHLC dataset. Data sufficiency for a genuinely new independent regime signal is UNVERIFIED.
- Previous draft sections suggesting breadth and risk allocation remain historical proposals, now explicitly SUPERSEDED by this finding. User's higher-level goal of avoiding unsuitable market conditions remains valid, but no defensible novel Gen17 rule has been selected.
- Next: inventory existing Gen9-16 mechanisms and any independently available market-state input; propose a genuinely distinct single change with economic rationale and out-of-sample validation. If none exists, stop rather than recycle prior experiments. DRAFT_ONLY, no research.


## 2026-10-29 – PIT signal design review (READ-ONLY; NOT PLAN LOCK)
- Current verified independent issuer-to-Alpaca adjustment-factor comparison: 20/20 SPY dividends 2020–2024 PASS, run 40937080764. This validates provider adjustment arithmetic, not historical as-of availability.
- For any proposed SPY-based Gen17 market regime input, use **raw SPY SIP closes** as a price-only market-state indicator until point-in-time adjusted snapshots can be established. Never use today's dividend-adjusted backfill to calculate historical signals. Ex-dividend gaps remain in raw close-to-close returns, so raw volatility/return definitions need explicit treatment and may not be described as total return.
- Causality contract to preregister: signal for session T must depend only on fully completed sessions available before its execution decision; conservative two-completed-session lag until publication times are verified. Explicitly prevent using T close for an order executed at T close; freeze calendar alignment and missing-session behavior before running.
- Prior-art gate: Gen10 graded breadth exposure and Gen12 BREADTH_50_GATE already tested market breadth; do not relabel either as new Gen17. SPY index-trend signal would be a distinct input, but its exact indicator, threshold, comparator, and research validity remain UNSELECTED; do not treat this note as a proposal approval.
- SPY price series is not part of the frozen Gen16 16-symbol OHLC input contract. Adding it would change the data contract, and requires explicit provenance, calendar joining, handling of absent sessions, snapshot reproducibility, and entitlement. Never silently inject SPY into Gen16.
- No Gen17 backtest, runner lock, engine change, trading or Forward. Gen17 DRAFT_ONLY/BLOCKED_DATA. Next read-only review: check Gen9/11/13-16 for prior SPY/regime approaches and map candidate causal inputs, then seek explicit plan approval.
