(function(){
'use strict';
const VERSION='0.2.44';
const ROBOT_MATURITY=48;

const RECORDS=[
  {
    id:'jagaren-suite',
    date:'2026-09',
    family:'Jägaren',
    title:'Jägaren robusthetssviter A–K',
    type:'Historisk forskning',
    status:'FAIL / EJ MOGEN',
    candidate:'83 % fryst forskningskandidat',
    summary:'109 historiska tester/steg. Integrity PASS, Time-block PASS, Concentration PASS och Monte Carlo PASS. PBO/DSR FAIL och Friction FAIL. Basresultat +4 069,33 och PF 1,0809 vid 1× friktion; strategin är tunn och känslig för kostnader.',
    metrics:[
      ['Tester/steg','109'],
      ['PBO','85,7 % · FAIL'],
      ['DSR','98,7 % · FAIL'],
      ['1× friktion','+4 069 · PF 1,081'],
      ['1,5× friktion','−6 211 · PF 0,889'],
      ['2× friktion','−16 491 · PF 0,735']
    ],
    decision:'Ingen livehandel. 83 %-regeln förblir fryst forskningskandidat. Ny data är mer värdefull än mer fintrimning på samma historik.'
  },
  {
    id:'jagaren-tidsmaskin',
    date:'2026-09-10',
    family:'Jägaren',
    title:'Historisk Tidsmaskin',
    type:'Historisk pseudo-forward',
    status:'REFERENS',
    candidate:'Fryst Jägaren',
    summary:'Historisk pseudo-forward 2024-01-01 → 2026-09-10.',
    metrics:[
      ['Marknadsdagar','704 / 704'],
      ['Affärer','442'],
      ['P/L','+2 523,51'],
      ['PF','1,081'],
      ['WR','44,6 %']
    ],
    decision:'Historisk referens, inte färsk forward-data.'
  },
  {
    id:'swing-g1',
    date:'2026-09-14',
    family:'Swing G1',
    title:'Swing G1 – DEV + pseudo-forward',
    type:'Historisk forskning',
    status:'POSITIV MEN TUNN',
    candidate:'8f09f32a',
    summary:'Fryst G1-kandidat. DEV 2021–2023 följt av historisk pseudo-forward 2024–2026-09-10.',
    metrics:[
      ['DEV affärer','249'],
      ['DEV P/L','+15 658,28'],
      ['DEV PF','1,434'],
      ['Pseudo affärer','323'],
      ['Pseudo P/L','+2 417,04'],
      ['Pseudo PF','1,042']
    ],
    decision:'Fryst men tunn kandidat. Ingen rescue.'
  },
  {
    id:'swing-g2',
    date:'2026-09-14',
    family:'Swing G2',
    title:'Swing G2 A–O',
    type:'Historisk forskning',
    status:'POSITIV KANDIDAT',
    candidate:'15efd75a',
    summary:'Fryst G2-kandidat. DEV 2020–2022 följt av låst historisk pseudo-forward 2023-01-01 → 2026-09-10.',
    metrics:[
      ['DEV affärer','78'],
      ['DEV P/L','+13 165,73'],
      ['DEV PF','2,012'],
      ['Pseudo affärer','144'],
      ['Pseudo P/L','+13 708,85'],
      ['Pseudo PF','1,467']
    ],
    decision:'POSITIV KANDIDAT. Ingen rescue eller efteroptimering.'
  },
  {
    id:'g2-robust',
    date:'2026-09-14',
    family:'Swing G2',
    title:'G2 robusthetsanalys',
    type:'Robusthet',
    status:'PASS MED FLAGGA',
    candidate:'15efd75a',
    summary:'Alla pseudo-forward-år positiva. Koncentrationsflagga: MU stod för cirka 55,7 % av nettovinsten. Kandidaten ändrades inte.',
    metrics:[
      ['Pseudo affärer','144'],
      ['P/L','+13 708,85'],
      ['PF','1,467'],
      ['WR','50,0 %'],
      ['DD','−2,34 %'],
      ['MU andel nettovinst','≈55,7 %']
    ],
    decision:'Behåll kandidaten fryst och följ koncentrationen i riktig forward.'
  },
  {
    id:'g2-broker',
    date:'2026-09-14',
    family:'Swing G2',
    title:'Broker/Cost Gate',
    type:'Kostnadsrobusthet',
    status:'PASS',
    candidate:'15efd75a',
    summary:'Exakt samma 144 pseudo-forward-affärer reprissattes. Positiv även vid 0,50 % friktion per sida.',
    metrics:[
      ['Break-even','≈0,73 % / sida'],
      ['IBKR proxy','+14 662,58 · PF 1,51'],
      ['Alpaca proxy','+14 776,72 · PF 1,51'],
      ['Nordnet auto-FX','+3 875,13 · PF 1,11'],
      ['Stress 0,50 %','+4 967,76 · PF 1,15']
    ],
    decision:'PASS. Broker väljs inte ännu. G2-parametrarna förblir frysta.'
  },
  {
    id:'g4-universe',
    date:'2026-09-15',
    family:'Swing G4',
    title:'G4 Universe Robustness',
    type:'Portabilitet / robusthet',
    status:'PASS · FROZEN',
    candidate:'15efd75a',
    summary:'Förregistrerad plan 95d2e735. Exakt fryst G2 testad på 16 andra aktier utan rescue eller parameterändring. G4 är robusthetsevidens, inte ny oberoende OOS.',
    metrics:[
      ['Affärer','185'],['P/L','+6 522,15'],['PF','1,29'],['WR','51,35 %'],['DD','−3,70 %'],['Positiva kalendersegment','6'],['Största positiva symbolandel','23,03 % · CAT']
    ],
    decision:'PASS och permanent fryst. Ingen symbol får tas bort och inga G2-parametrar ändras på grund av G4-resultatet.'
  },
  {
    id:'g5-stress',
    date:'2026-09-15',
    family:'Swing G5',
    title:'G5 Stress Test',
    type:'Exekveringsstress / robusthet',
    status:'FAIL · FROZEN',
    candidate:'15efd75a',
    summary:'Förregistrerad plan 6ec36eb2. Fryst G2/G4-kandidat stressad med högre kostnader och 1 handelsdags entryfördröjning. Ingen rescue eller parameterändring efter resultat.',
    metrics:[
      ['PASS-scenarier','2/5'],['COST_10','+3 737,78 · PF 1,16'],['COST_25','−305,70 · PF 0,99'],['COST_50','−6 704,64 · PF 0,76'],['DELAY_1','+4 205,97 · PF 1,18'],['COMBINED','−2 367,93 · PF 0,91']
    ],
    decision:'FAIL och permanent fryst. Resultatet accepteras utan rescue, parameterändring eller symbolrensning. G2/G3 Real Forward har fortsatt högre evidens.'
  }
,
  {
    id:'dev-v0232-forward-sync',
    date:'2026-09-15',
    family:'Utveckling',
    title:'V0.2.32 – Gemensam Forward-synk',
    type:'Infrastruktur / synk',
    status:'PASS · STABIL GRUND',
    candidate:'Ej forskningskandidat',
    summary:'G2/G3 Real Forward fick gemensam GitHub-master via Cloudflare Worker. Den vanliga Lina-inloggningen används för skrivbehörighet; ingen separat synknyckel behövs i UI. GitHub-token ligger endast server-side.',
    metrics:[
      ['Release','V0.2.32'],
      ['Forward-master','GitHub'],
      ['Separat synknyckel','Nej'],
      ['Handel','AV']
    ],
    decision:'Godkänd infrastrukturgrund. Ingen forskningsregel ändrades och robotmognad kvarstår 48/100.'
  },
  {
    id:'dev-v0233-full-sync',
    date:'2026-09-15',
    family:'Utveckling',
    title:'V0.2.33 – GitHub Full Sync i headern',
    type:'Infrastruktur / synk',
    status:'PASS · VERIFIERAD',
    candidate:'Ej forskningskandidat',
    summary:'Övergripande GitHub-synk lades i headern för beständigt kompakt Lina-arbetsläge mellan datorer. Första live-testet stoppades av schema-mismatch mellan frontend och Worker. Workern korrigerades till releaseformatet entries och nytt live-test gick Synkar… → Synkad.',
    metrics:[
      ['Header','☁ Synka'],
      ['Första live-test','FAIL · Stoppad'],
      ['Orsak','app-state schema'],
      ['Korrigering','Worker → entries'],
      ['Sluttest','PASS · Synkad'],
      ['Robotmognad','48/100']
    ],
    decision:'V0.2.33 GitHub-synk verifierad på jobbdator. Stora rådata/IndexedDB-cache synkas inte. Permanent projekthistorik får inte skrivas över av browser-state.'
  },
  {
    id:'dev-v0234-archive-ledger',
    date:'2026-09-15',
    family:'Utveckling',
    title:'V0.2.34 – Utvecklingslogg i Lina Arkiv',
    type:'Historik / dokumentation',
    status:'AKTIV · PERMANENT',
    candidate:'Ej forskningskandidat',
    summary:'Lina Arkiv utökades så större utvecklingssteg visas tillsammans med forskningshistoriken. Dagens V0.2.32–V0.2.34 dokumenteras som läsbara arkivposter utan att ändra eller skriva över frysta forskningsresultat.',
    metrics:[
      ['Arkivkategori','Utveckling'],
      ['Dagens releaser','V0.2.32–V0.2.34'],
      ['Frysta resultat','Orörda'],
      ['Handel','AV']
    ],
    decision:'Från V0.2.34 ska varje större release få en permanent utvecklingspost i Lina Arkiv som del av releasearbetet.'
  },
  {
    id:'dev-v0235-evidence-freeze-sync',
    date:'2026-09-15',
    family:'Utveckling',
    title:'V0.2.35 – Godkänn, frys och synka evidence',
    type:'Evidence / GitHub-arkiv',
    status:'AKTIV · SÄKERHETSGRIND',
    candidate:'Ej forskningskandidat',
    summary:'Nya TXT-rapporter och RAW JSON blir först PRELIMINÄRA. De måste uttryckligen Godkännas & frysas i Lina Arkiv innan headerns GitHub-synk får arkivera dem permanent.',
    metrics:[['Flöde','PRELIMINÄR → FROZEN → GITHUB ✓'],['Hash','SHA256 före uppladdning'],['Överskrivning','Förbjuden'],['Rå marknadsdata','Ej synkad'],['Handel','AV']],
    decision:'Endast verifierad FROZEN evidence får bli permanent GitHub-evidence. FAIL-resultat får och ska frysas när resultatet är verifierat.'
  },
  {
    id:'dev-v0236-archive-hotfix',
    date:'2026-09-15',
    family:'Utveckling',
    title:'V0.2.36 – Lina Arkiv hotfix',
    type:'Frontend / arkiv',
    status:'PASS · HOTFIX',
    candidate:'Ej forskningskandidat',
    summary:'Arkivnavigationen reparerades efter att en tom post i RECORDS-arrayen fick renderingen att stanna. Release-testet utökades till att validera samtliga arkivposter.',
    metrics:[['Arkivposter','15/15 PASS vid release-test'],['Forskningsresultat','Orörda'],['Worker','Oförändrad'],['Handel','AV']],
    decision:'Frontend-hotfix. Ingen vetenskaplig evidens eller robotmognad ändrades.'
  },
  {
    id:'dev-v0237-header-home',
    date:'2026-09-15',
    family:'Utveckling',
    title:'V0.2.37 – Linas Opti = Hem',
    type:'Navigation / UX',
    status:'PASS · FAST UI-REGEL',
    candidate:'Ej forskningskandidat',
    summary:'Produktnamnet Linas Opti i headern gjordes till en global Hem-knapp. Ett tryck navigerar till Dashboard oavsett vilken Lina-vy som är öppen.',
    metrics:[['Header','Linas Opti → Dashboard'],['Omfattning','Alla vyer'],['Worker','Oförändrad'],['Handel','AV']],
    decision:'Permanent UI-regel: Linas Opti i headern fungerar som Hem/Dashboard.'
  }
,
  {
    id:'dev-v0238-evidence-e2e',
    date:'2026-09-15',
    family:'Utveckling',
    title:'V0.2.38 – Evidence end-to-end + App-state hotfix',
    type:'Evidence / GitHub / infrastruktur',
    status:'TESTKLAR · APP-STATE PASS',
    candidate:'Ej forskningskandidat',
    summary:'Arkivexporter kopplas in i Evidence-kön så befintliga verifierade rapporter kan gå genom PRELIMINÄR → FROZEN → GitHub utan omkörning av forskning. App-state JSON-newline-felet i Workern är rättat och cross-device Mac-synk verifierad PASS.',
    metrics:[['App-state cross-device','PASS'],['Evidencekö','Arkivexport → PRELIMINÄR'],['Forskningsomkörning','Ingen'],['Robotmognad','48/100'],['Handel','AV']],
    decision:'Verifiera nu Evidence-flödet end-to-end med en befintlig fryst arkivrapport. Ingen ny forskning skapas och inga forskningsresultat ändras.'
  }

,
  {
    id:'dev-v0239-one-click-freeze',
    date:'2026-09-16',
    family:'Utveckling',
    title:'V0.2.39 – Ett tryck: Godkänn & frys',
    type:'Evidence / UX',
    status:'TESTKLAR',
    candidate:'Ej forskningskandidat',
    summary:'Det normala evidence-flödet förenklades: ett färdigt resultat godkänns och fryses med en knapp. Lina skapar rapport + resultat-RAW, SHA256-verifierar, fryser och försöker synka direkt till GitHub.',
    metrics:[['Normal väg','Godkänn & frys → GitHub'],['Offline/fel','FROZEN · VÄNTAR PÅ SYNK'],['Evidencekö','Kontroll / recovery'],['Robotmognad','48/100'],['Handel','AV']],
    decision:'Minska användarens handgrepp utan att sänka evidenskraven. Live E2E måste verifieras innan funktionen markeras PASS.'
  }

]

function forwardRecord(){
  const x=window.LinaG2ForwardEngine?.load?.();
  const s=x?.stats;
  return {
    id:'g2-forward',
    date:x?.lastMarketDate||'2026-09-11 →',
    family:'Swing G2',
    title:'G2 Real Forward / Paper',
    type:'Riktig forward',
    status:(s?.n||0)>=250?'250-MILSTOLPE':(s?.n||0)>=120?'120-MILSTOLPE':(s?.n||0)>=60?'60-MILSTOLPE':'PÅGÅR',
    candidate:'15efd75a',
    summary:'Endast nya entries från och med 2026-09-11. Ingen historisk affär före anchor får räknas.',
    metrics:[
      ['Nya stängda affärer',String(s?.n||0)],
      ['P/L',s?Number(s.pl).toLocaleString('sv-SE',{maximumFractionDigits:2}):'0'],
      ['PF',s?Number(s.pf||0).toFixed(2):'0,00'],
      ['WR',s?(100*Number(s.wr||0)).toFixed(1)+' %':'0,0 %'],
      ['DD',s?(100*Number(s.dd||0)).toFixed(2)+' %':'0,00 %'],
      ['Senaste marknadsdag',x?.lastMarketDate||'—']
    ],
    decision:'Ingen parameterändring före eller under forward. Milstolpar 60 / 120 / 250.'
  };
}

function records(){ return [...RECORDS,{
    id:'dev-v0240-archive-evidence-direct',family:'Utveckling',date:'2026-09-16',title:'V0.2.40 – Direkt evidenssäkring från Arkiv',type:'Evidence UX / idempotens',status:'PASS · RELEASE',candidate:'15efd75a',summary:'Redan frysta historiska resultat kan nu säkras direkt från Arkivet med ett tryck. Lina skapar rapport + RAW, SHA256-fryser och synkar till GitHub. Redan GitHub-säkrad evidens återanvänds och dupliceras inte.',metrics:[['Normal ny evidens','Godkänn & frys'],['Historisk backfill','Säkra evidens'],['Dublettskydd','Idempotent'],['Handel','AV']],decision:'Förenklar evidensflödet utan att ändra forskningsresultat, regler eller robotmognad.'
  },{
    id:'dev-v0241-cross-device-evidence',family:'Utveckling',date:'2026-09-16',title:'V0.2.41 – Datoroberoende historisk evidens',type:'Cross-device evidence / livefix',status:'PASS · RELEASE',candidate:'15efd75a',summary:'Live-test av V0.2.40 på ny dator gav FAIL: Säkra evidens letade efter lokalt engine-resultat och visade “Inget färdigt resultat finns att frysa”. V0.2.41 hämtar i stället permanenta TXT/RAW-filer som redan ingår i Lina-releasen för G4/G5/G6/G7–G12.',metrics:[['V0.2.40 live-test','FAIL'],['Orsak','lokal runtime-data saknades'],['V0.2.41 källa','permanent release-evidens'],['Handel','AV']],decision:'Historisk evidens får inte bero på localStorage/IndexedDB på den dator där säkringen utförs. Frysta forskningsresultat är oförändrade.'
  },{
    id:'dev-v0242-evidence-e2e-checkpoint',family:'Utveckling',date:'2026-09-16',title:'V0.2.42 – Evidence E2E checkpoint',type:'Verifierad live-checkpoint',status:'PASS · VERIFIED',candidate:'15efd75a',summary:'V0.2.41 verifierades live på en ny dator. Ett tryck på G6 Säkra evidens gav FROZEN · GITHUB ✓ och GitHub kontrollerades därefter manuellt: både G6 TXT/RAW JSON och G7–G12 TXT/RAW JSON finns permanent under linasopti/evidence/2026-09-16/.',metrics:[['Ny dator','PASS'],['G6 ett-trycksflöde','PASS'],['GitHub TXT + RAW','VERIFIERAT'],['Evidence E2E','PASS'],['Robotmognad','48/100'],['Handel','AV']],decision:'Evidence-infrastrukturen betraktas som verifierad för detta flöde. Ingen mer historisk evidence-utbyggnad prioriteras nu; nästa fokus är Real Forward. Inga forskningsresultat eller regler ändras.'
  },{
    id:'dev-v0243-auto-forward-safe-close',family:'Utveckling',date:'2026-09-16',title:'V0.2.43 – Automatisk Forward + stängd-marknadsdagsspärr',type:'Forward-integritet / automation',status:'PASS · LIVE VERIFIED',candidate:'15efd75a',summary:'Efter V0.2.42-liveprovet upptäcktes att manuell Forward-uppdatering kunde ta med pågående USA-marknadsdag. V0.2.43 automatiserar catch-up och begränsar G2/G3 till säkert avslutade USA-marknadsdagar. Live verifierat 2026-09-16: permanent GitHub-master korrigerades till completedThrough 2026-09-15 och både G2/G3 lastMarketDate 2026-09-15.',metrics:[['Auto catch-up','VID LINA-START'],['Marknadsdag','ENDAST AVSLUTAD'],['Intraday 2026-09-16','REPARERAD TILL 2026-09-15 · LIVE PASS'],['Robotmognad','48/100'],['Handel','AV']],decision:'LIVE PASS. Ingen strategi-, kandidat- eller parameterändring. Safe-close och permanent GitHub-master verifierades efter F5 och direkt filkontroll.'
  },{
    id:'dev-v0244-gen2-plan',family:'Utveckling',date:'2026-09-16',title:'V0.2.44 – Lina Generation 2 Research Plan',type:'Förregistrerad forskningsdesign',status:'PLAN · INGA RESULTAT',candidate:'Ingen kandidat ännu',summary:'Separat Generation 2-labb startas utan att röra original G2/G3. DEV 2020–2022, validation 2023–2024 och förseglad holdout 2025-01-01–2026-09-10. Fyra strategifamiljer låses före första resultat.',metrics:[['DEV','2020–2022'],['Validation','2023–2024'],['Sealed holdout','2025–2026-09-10'],['Familjer','4'],['Robotmognad','48/100'],['Handel','AV']],decision:'Nästa steg är att implementera runners. Holdout får inte öppnas eller påverka tuning/ranking före kandidatfrysning.'
  },forwardRecord(),
  {
    id:'swing-g6-cost-boundary',
    family:'Swing G6',
    date:'2026-09-15',
    title:'G6 Execution Cost Boundary',
    type:'Kostnadsgräns / robusthet',
    status:'PASS · FROZEN',
    plan:'1567bbbe',
    candidate:'15efd75a',
    summary:'Förregistrerad kostnadsgräns för oförändrad kandidat. Boundary +0,20 % extra kostnad/sida (0,30 % total modellerad kostnad/sida). G6 är diagnostisk robusthetsforskning, inte ny oberoende OOS.',
    metrics:[['Planhash','1567bbbe'],['Boundary extra/sida','+0,20 %'],['Total modellerad kostnad/sida','0,30 %'],['Status','PASS · FROZEN']],
    decision:'PASS och permanent fryst. Ingen rescue, parameterändring eller symbolrensning. G2/G3 Real Forward har högre evidens.'
  },
  {
    id:'g7-g12-battery',
    date:'2026-09-15',
    family:'Swing G7–G12',
    title:'G7–G12 Research Battery',
    type:'Historisk robusthetsdiagnostik',
    status:'6/6 PASS · FROZEN',
    candidate:'15efd75a',
    summary:'Sex förregistrerade planer låstes före resultat. Ingen rescue mellan tester. Historisk diagnostik; inte ny oberoende OOS.',
    metrics:[['G7','PASS · 6 positiva år'],['G8','PASS · 23,03 % maxandel · 11/16 icke-negativa'],['G9','PASS · p95 max-DD 4,69 %'],['G10','PASS · 86,67 % positiva proxy-grannar'],['G11','PASS · BOTH_20 +1 133,08 · PF 1,045'],['G12','PASS · 1,5× DD −5,50 %']],
    decision:'6/6 PASS och permanent fryst. G5 FAIL bevaras. G2/G3 Real Forward har högre evidens.'
  }
]; }

function counters(){
  const f=window.LinaG2ForwardEngine?.load?.();
  const fN=f?.stats?.n||0;
  return {
    maturity:ROBOT_MATURITY,
    documentedStages:109,
    g1Trades:249+323,
    g2HistoricalTrades:78+144,
    knownSwingHistoricalTrades:(249+323)+(78+144),
    jagarenPseudoTrades:442,
    forwardTrades:fN,
    reports:RECORDS.length+1,
    historicalSimulationFloor:21400,
    g3Simulations:window.LinaG3Engine?.load?.()?.simulationCount||0
  };
}

function reportText(rec){
  return [
    'LINAS OPTI – ARKIVRAPPORT',
    `Clean Core: V${VERSION}`,
    `Datum/period: ${rec.date}`,
    `Familj: ${rec.family}`,
    `Rapport: ${rec.title}`,
    `Typ: ${rec.type}`,
    `Status: ${rec.status}`,
    `Kandidat: ${rec.candidate}`,
    '',
    rec.summary,
    '',
    'NYCKELTAL',
    ...rec.metrics.map(([k,v])=>`${k}: ${v}`),
    '',
    'BESLUT',
    rec.decision,
    '',
    'Robotmognad: 48/100',
    'Handel: AV'
  ].join('\n');
}
function downloadRecord(rec){
  const text=reportText(rec);
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
  a.download=`LINAS_OPTI_ARKIV_${rec.id.toUpperCase()}_V0243.txt`;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),500);
}
window.LinaArchiveData={VERSION,ROBOT_MATURITY,records,counters,reportText,downloadRecord};
})();