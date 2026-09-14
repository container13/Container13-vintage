(function(){
  'use strict';

  const VERSION='0.2.6';
  const BASE_G2_COST_SIDE=0.001;
  const SEC_SELL_VALUE_RATE=0.0000206;
  const FINRA_SELL_SHARE_RATE=0.000195;

  // Research-only execution assumption, not a broker-published fee.
  // Kept separate from published broker charges so the user can see what is factual vs assumed.
  const DEFAULT_SLIPPAGE_SIDE=0.0005; // 0.05%/side

  const PROFILES=[
    {
      id:'g2',
      name:'G2 referens',
      badge:'FRYST REFERENS',
      kind:'percent',
      percentSide:0.001,
      note:'Samma samlade friktion som användes i den frysta G2-körningen: 0,10 % per sida.'
    },
    {
      id:'ibkr',
      name:'IBKR Pro Tiered – USA',
      badge:'MÄKLARPROXY',
      kind:'ibkr',
      slippageSide:DEFAULT_SLIPPAGE_SIDE,
      note:'Publicerad aktiekommission: USD 0,0035/aktie vid lägsta volymnivån, minst USD 0,35/order. Säljavgifter approximeras. FX hålls separat.'
    },
    {
      id:'alpaca',
      name:'Alpaca – US stocks API',
      badge:'MÄKLARPROXY',
      kind:'alpaca',
      slippageSide:DEFAULT_SLIPPAGE_SIDE,
      note:'Publicerad aktiekommission: 0 USD för kvalificerad self-directed US-stockhandel via API; regulatoriska säljavgifter approximeras. FX/funding hålls separat.'
    },
    {
      id:'nordnet_auto',
      name:'Nordnet Mini + automatisk FX',
      badge:'KOSTNADSPROXY',
      kind:'percent',
      percentSide:0.0055,
      note:'Proxy: 0,25 % courtage + 0,25 % automatisk valutaväxling + 0,05 % slippage per sida. Minicourtagets SEK-minimum kan inte modelleras exakt i G2:s nuvarande modellvaluta.'
    },
    {
      id:'nordnet_fx',
      name:'Nordnet Mini + valutakonto',
      badge:'KOSTNADSPROXY',
      kind:'percent',
      percentSide:0.0030,
      note:'Proxy: 0,25 % courtage + 0,05 % slippage per sida. Separat manuell FX på 0,075 % modelleras inte per aktieaffär eftersom USD kan hållas på valutakonto.'
    },
    {
      id:'stress15',
      name:'Stress 0,15 %/sida',
      badge:'STRESS',
      kind:'percent',
      percentSide:0.0015,
      note:'Generiskt robusthetstest. Ingen mäklarprofil.'
    },
    {
      id:'stress30',
      name:'Stress 0,30 %/sida',
      badge:'STRESS',
      kind:'percent',
      percentSide:0.0030,
      note:'Generiskt robusthetstest. Ingen mäklarprofil.'
    },
    {
      id:'stress50',
      name:'Stress 0,50 %/sida',
      badge:'STRESS',
      kind:'percent',
      percentSide:0.0050,
      note:'Generiskt hårt robusthetstest. Ingen mäklarprofil.'
    }
  ];

  function g2(){
    return window.LinaG2Engine?.load?.() || null;
  }

  function rawTrades(){
    const x=g2();
    const closed=x?.pseudoForward?.closed || [];
    return closed.map(t=>{
      const rawExit=Number(t.exit)/(1-BASE_G2_COST_SIDE);
      return {...t,rawExit};
    });
  }

  function stats(rows){
    const n=rows.length;
    const pl=rows.reduce((s,t)=>s+t.pnl,0);
    const gp=rows.filter(t=>t.pnl>0).reduce((s,t)=>s+t.pnl,0);
    const gl=-rows.filter(t=>t.pnl<0).reduce((s,t)=>s+t.pnl,0);
    let eq=100000,peak=100000,dd=0,wins=0;
    rows.slice().sort((a,b)=>String(a.exitDate).localeCompare(String(b.exitDate))).forEach(t=>{
      eq+=t.pnl; peak=Math.max(peak,eq); dd=Math.min(dd,eq/peak-1); if(t.pnl>0)wins++;
    });
    return {n,pl,pf:gl?gp/gl:(gp?Infinity:0),wr:n?wins/n:0,dd,grossProfit:gp,grossLoss:gl};
  }

  function percentTrade(t,side){
    const entry=t.entryRaw*(1+side);
    const exit=t.rawExit*(1-side);
    const pnl=t.shares*exit - t.shares*entry;
    return {...t,entryModel:entry,exitModel:exit,pnl,modeledFees:t.shares*((t.entryRaw*side)+(t.rawExit*side))};
  }

  function ibkrTrade(t){
    const slip=DEFAULT_SLIPPAGE_SIDE;
    const entry=t.entryRaw*(1+slip);
    const exit=t.rawExit*(1-slip);
    const buyCommission=Math.max(0.35,t.shares*0.0035);
    const sellCommission=Math.max(0.35,t.shares*0.0035);
    const regulatory=(t.shares*exit*SEC_SELL_VALUE_RATE)+(t.shares*FINRA_SELL_SHARE_RATE);
    const pnl=(t.shares*exit-sellCommission-regulatory)-(t.shares*entry+buyCommission);
    const modeledFees=t.shares*(t.entryRaw*slip+t.rawExit*slip)+buyCommission+sellCommission+regulatory;
    return {...t,entryModel:entry,exitModel:exit,pnl,modeledFees};
  }

  function alpacaTrade(t){
    const slip=DEFAULT_SLIPPAGE_SIDE;
    const entry=t.entryRaw*(1+slip);
    const exit=t.rawExit*(1-slip);
    const regulatory=(t.shares*exit*SEC_SELL_VALUE_RATE)+(t.shares*FINRA_SELL_SHARE_RATE);
    const pnl=(t.shares*exit-regulatory)-(t.shares*entry);
    const modeledFees=t.shares*(t.entryRaw*slip+t.rawExit*slip)+regulatory;
    return {...t,entryModel:entry,exitModel:exit,pnl,modeledFees};
  }

  function runProfile(profile){
    const source=rawTrades();
    let rows;
    if(profile.kind==='ibkr') rows=source.map(ibkrTrade);
    else if(profile.kind==='alpaca') rows=source.map(alpacaTrade);
    else rows=source.map(t=>percentTrade(t,profile.percentSide));
    const s=stats(rows);
    const modeledFees=rows.reduce((x,t)=>x+(t.modeledFees||0),0);
    return {...profile,...s,modeledFees,rows};
  }

  function allResults(){
    return PROFILES.map(runProfile);
  }

  function breakEvenSide(){
    const source=rawTrades();
    if(!source.length)return null;
    let lo=0,hi=.02;
    for(let i=0;i<60;i++){
      const m=(lo+hi)/2;
      const pl=stats(source.map(t=>percentTrade(t,m))).pl;
      if(pl>0)lo=m; else hi=m;
    }
    return lo;
  }

  function yearSplit(rows){
    const map={};
    for(const t of rows){const y=String(t.exitDate||t.entryDate).slice(0,4);(map[y]??=[]).push(t)}
    return Object.entries(map).sort().map(([year,a])=>({year,...stats(a)}));
  }

  function report(){
    const x=g2(),results=allResults(),be=breakEvenSide();
    if(!x?.stages?.O || !rawTrades().length) return 'Broker/Cost Gate kräver en färdig G2 pseudo-forward.';
    const f=n=>Number(n).toLocaleString('sv-SE',{maximumFractionDigits:2});
    const pct=n=>(100*n).toFixed(2)+'%';
    const L=[
      'LINAS OPTI – BROKER/COST GATE',
      `Clean Core: V${VERSION}`,
      `G2 kandidat: ${x.candidate?.hash||'?'}`,
      'Handel: AVSTÄNGD',
      '',
      'VIKTIG MODELLANMÄRKNING',
      'G2:s kapital och USD-priser har historiskt behandlats i samma modellvaluta. Beloppen nedan är därför jämförbara inom G2 men ska inte tolkas som en exakt SEK-mäklarfaktura.',
      'Mäklarprofilerna är kostnadsproxys. Exakt FX/funding, kontotyp och orderutfall måste verifieras före riktig handel.',
      '',
      `Beräknad break-even samlad procentfriktion: cirka ${pct(be)} per sida.`,
      '',
      'RESULTAT'
    ];
    for(const r of results){
      L.push(`${r.name} | ${r.n} affärer | P/L ${f(r.pl)} | PF ${f(r.pf)} | WR ${pct(r.wr)} | DD ${pct(r.dd)} | modellerad friktion ${f(r.modeledFees)}`);
    }
    L.push('','KÄLLSNAPSHOT 2026-09-14',
      'IBKR: US stocks Pro Tiered USD 0.0035/share vid lägsta volymnivån, min USD 0.35/order; spot FX 0.20 bps vid första nivån, min USD 2/order.',
      'Alpaca: commission-free för kvalificerad self-directed US-listed stockhandel via API; regulatoriska avgifter kan tillkomma.',
      'Nordnet: Mini utanför Norden 0.25%, min 9 SEK. Automatisk FX 0.25%; valutakonto 0.075% vid manuell växling. Nordnet API tar för närvarande inte in nya kunder.',
      '',
      'BESLUTSREGEL',
      'Broker Gate får inte ändra G2-parametrar. Den jämför endast kostnad/teknik. Kandidat 15efd75a förblir fryst.'
    );
    return L.join('\n');
  }

  function download(text,name){
    const b=new Blob([text],{type:'text/plain;charset=utf-8'});
    const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }
  function exportReport(){
    download(report(),`LINAS_OPTI_BROKER_COST_GATE_V0206_${new Date().toISOString().slice(0,10)}.txt`);
  }

  window.LinaBrokerGateEngine={
    VERSION,PROFILES,DEFAULT_SLIPPAGE_SIDE,rawTrades,runProfile,allResults,breakEvenSide,yearSplit,report,exportReport
  };
})();