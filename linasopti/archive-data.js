(function(){
'use strict';
const VERSION='0.2.15';
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

function records(){ return [...RECORDS,forwardRecord()]; }

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
  a.download=`LINAS_OPTI_ARKIV_${rec.id.toUpperCase()}_V0211.txt`;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),500);
}
window.LinaArchiveData={VERSION,ROBOT_MATURITY,records,counters,reportText,downloadRecord};
})();