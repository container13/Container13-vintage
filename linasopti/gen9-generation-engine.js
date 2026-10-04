(function(global){
'use strict';
const deepFreeze=o=>{if(o&&typeof o==='object'){Object.values(o).forEach(deepFreeze);Object.freeze(o)}return o};
const SPEC=deepFreeze({schema:'LINA-GEN9-SPEC-PROPOSAL-1',status:'LOCKED',tradeEnabled:false,forwardOpened:false,historyHardStop:'2024-12-31',symbols:['AMD','SHOP','ADBE','MU','FDX','TSLA','LUV','NFLX','C','NOW','QCOM','BAC','GM','DDOG','PYPL','NVDA'],foldYears:[2021,2022,2023,2024],variants:['A','B'],candidateVariant:'B',params:{lookback:50,trend:180,hold:12,breadthMin:5,volDays:20,volTarget:.12,volMin:.35},capital:100000,costSide:.001,maxPositions:8,maxPositionPct:.125,baseRiskPerTrade:.005,sizingDistance:.05,gates:{trades:100,pf:1.2,dd:.12,concentration:.4,positiveFolds:3,minFoldPf:.8,maxFoldGrossProfitShare:.55},method:{selection:'FIXED_PARAMS_NO_TRAIN_SELECTION',entry:'next open',exit:'12th session close inclusive of entry; liquidate at fold end',equity:'daily cash plus marked positions',cashFold:'undefined PF does not pass',history:'OBSERVED_DEVELOPMENT_DATA',control:'A diagnostic only; B eligible',missingData:'aligned complete symbol bars required'}});
const canonical=o=>Array.isArray(o)?'['+o.map(canonical).join(',')+']':o&&typeof o==='object'?'{'+Object.keys(o).sort().map(k=>JSON.stringify(k)+':'+canonical(o[k])).join(',')+'}':JSON.stringify(o);
function hash(o){let h=2166136261;for(const c of canonical(o)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return(h>>>0).toString(16).padStart(8,'0')}
const SPEC_HASH=hash(SPEC);
function normalize(input,end){
 const by={};let dates;
 for(const symbol of SPEC.symbols){
  if(!Array.isArray(input[symbol]))throw Error('DATA: symbol saknas '+symbol);
  const rows=input[symbol].filter(r=>r.d<=end).map(r=>({...r})).sort((a,b)=>a.d.localeCompare(b.d));
  let last='';for(const r of rows){if(!/^\d{4}-\d{2}-\d{2}$/.test(r.d)||r.d===last||![r.o,r.h,r.l,r.c].every(n=>Number.isFinite(n)&&n>0)||r.l>Math.min(r.o,r.c)||r.h<Math.max(r.o,r.c)||r.l>r.h)throw Error('DATA: ogiltig bar '+symbol+' '+r.d);last=r.d}
  const ds=rows.map(r=>r.d);if(dates&&canonical(ds)!==canonical(dates))throw Error('DATA: symbolernas datum är inte kompletta och identiska');dates=ds;by[symbol]=rows;
 }
 return{by,dates};
}
function signalAt(by,i){
 const p=SPEC.params;if(i<Math.max(p.trend-1,p.lookback,p.volDays))return null;
 let breadth=0;const candidates=[];
 for(const s of SPEC.symbols){const a=by[s],bar=a[i],sma=a.slice(i-p.trend+1,i+1).reduce((n,r)=>n+r.c,0)/p.trend;breadth+=bar.c>sma?1:0;
 const high=Math.max(...a.slice(i-p.lookback,i).map(r=>r.c));if(!(bar.c>sma&&bar.c>high))continue;
 const returns=a.slice(i-p.volDays+1,i+1).map((r,j)=>Math.log(r.c/a[i-p.volDays+j].c));const avg=returns.reduce((a,b)=>a+b,0)/returns.length;const vol=Math.sqrt(returns.reduce((n,r)=>n+(r-avg)**2,0)/(returns.length-1))*Math.sqrt(252);
 candidates.push({s,signalDate:bar.d,strength:bar.c/a[i-p.lookback].c-1,volScale:vol>0?Math.max(p.volMin,Math.min(1,p.volTarget/vol)):1});
 }
 return{breadth,candidates:candidates.sort((a,b)=>b.strength-a.strength||a.s.localeCompare(b.s))};
}
function summarize(trades,equity){
 const gp=trades.reduce((n,t)=>n+Math.max(0,t.pnl),0),gl=trades.reduce((n,t)=>n+Math.max(0,-t.pnl),0),by={};for(const t of trades)by[t.s]=(by[t.s]||0)+Math.max(0,t.pnl);
 let peak=SPEC.capital,dd=0;for(const e of equity){peak=Math.max(peak,e.value);dd=Math.min(dd,e.value/peak-1)}
 return{n:trades.length,pl:gp-gl,grossProfit:gp,grossLoss:gl,pf:gl?gp/gl:gp?null:null,pfKind:gl?'FINITE':gp?'NO_LOSSES':'NO_TRADES_OR_FLAT',dd,maxSymbolGrossProfitShare:gp?Math.max(...Object.values(by))/gp:null};
}
function simulate(input,variant,start,end){
 if(!SPEC.variants.includes(variant)||start>end||end>SPEC.historyHardStop)throw Error('CONTRACT: fel variant eller datagräns');
 const {by,dates}=normalize(input,end),first=dates.findIndex(d=>d>=start),last=dates.length-1;
 if(first<180||first>last)throw Error('DATA: otillräcklig uppvärmning eller tom fold');
 let cash=SPEC.capital,previousEquity=SPEC.capital,positions=[];const trades=[],equity=[],events=[];
 for(let i=first;i<=last;i++){
  const day=dates[i],signal=signalAt(by,i-1);if(!signal)throw Error('DATA: uppvärmning saknas');
  const blocked=variant==='B'&&signal.breadth<SPEC.params.breadthMin;
  for(const x of signal.candidates){
   let reason=blocked?'WEAK_BREADTH':positions.some(p=>p.s===x.s)?'SYMBOL_OPEN':positions.length>=SPEC.maxPositions?'POSITION_CAP':null;
   if(reason){events.push({...x,day,breadth:signal.breadth,action:'SKIP',reason});continue}
   const price=by[x.s][i].o*(1+SPEC.costSide),budget=Math.min(previousEquity*SPEC.maxPositionPct,cash),risk=previousEquity*SPEC.baseRiskPerTrade*x.volScale,qty=Math.min(budget/price,risk/(price*SPEC.sizingDistance));
   if(!(qty>0)){events.push({...x,day,action:'SKIP',reason:'NO_CASH'});continue}
   const spent=qty*price;cash-=spent;positions.push({...x,qty,entry:day,entryPrice:price,notional:spent,entryIndex:i,exitIndex:i+SPEC.params.hold-1});events.push({...x,day,breadth:signal.breadth,action:'ENTRY',notional:spent,previousEquity});
  }
  const keep=[];for(const p of positions){if(i>=p.exitIndex||i===last){const price=by[p.s][i].c*(1-SPEC.costSide);cash+=p.qty*price;trades.push({...p,exit:day,exitPrice:price,pnl:p.qty*(price-p.entryPrice),boundaryExit:i===last&&i<p.exitIndex})}else keep.push(p)}positions=keep;
  previousEquity=cash+positions.reduce((n,p)=>n+p.qty*by[p.s][i].c,0);equity.push({d:day,value:previousEquity,cash,positions:positions.length});
 }
 return{schema:'LINA-GEN9-FOLD-1',variant,range:[start,end],specHash:SPEC_HASH,oos:summarize(trades,equity),trades,equity,events};
}
function aggregate(folds,variant){
 if(folds.length!==4||folds.some((f,i)=>f.variant!==variant||f.specHash!==SPEC_HASH||f.range[0]!==SPEC.foldYears[i]+'-01-01'||f.range[1]!==SPEC.foldYears[i]+'-12-31'))throw Error('CONTRACT: fyra exakta årsfolds krävs');
 const fs=folds.map(f=>f.oos),gp=fs.reduce((n,f)=>n+f.grossProfit,0),gl=fs.reduce((n,f)=>n+f.grossLoss,0),r={n:fs.reduce((n,f)=>n+f.n,0),pl:gp-gl,pf:gl?gp/gl:null,dd:Math.min(...fs.map(f=>f.dd)),concentration:Math.max(...fs.map(f=>f.maxSymbolGrossProfitShare??1)),positiveFolds:fs.filter(f=>f.pl>0).length,minFoldPf:Math.min(...fs.map(f=>f.pfKind==='NO_LOSSES'?Infinity:f.pf??0)),maxFoldGrossProfitShare:gp?Math.max(...fs.map(f=>f.grossProfit))/gp:1};
 const g=SPEC.gates,checks={trades:r.n>=g.trades,pf:gl===0?gp>0:r.pf>=g.pf,dd:Math.abs(r.dd)<=g.dd,positive:r.pl>0,concentration:r.concentration<=g.concentration,positiveFolds:r.positiveFolds>=g.positiveFolds,worstFold:fs.every(f=>f.n>0&&(f.pfKind==='NO_LOSSES'||f.pf>=g.minFoldPf)),foldShare:r.maxFoldGrossProfitShare<=g.maxFoldGrossProfitShare};
 return{variant,metrics:r,checks,status:Object.values(checks).every(Boolean)?'PASS':'FAIL',candidateEligible:variant==='B'&&Object.values(checks).every(Boolean),tradeEnabled:false,forwardOpened:false};
}
const APPROVED_DATA=deepFreeze({schema:'LINA-GEN9-DATASET-GATE-1',path:'SOURCE_gen9-data.json',gatePath:'evidence/GEN9_DATASET_GATE_2026-10-05.json',sha256:'cb84e436a0527b44262949994306dcb85eaf5f10ad88fc7906d443833cc6589c',rowCount:20128,historyHardStop:'2024-12-31'});
async function sha256Text(text){const bytes=new TextEncoder().encode(text),digest=await global.crypto.subtle.digest('SHA-256',bytes);return[...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('')}
async function validateApprovedDataset(rawText,gate){
 if(!gate||gate.schema!==APPROVED_DATA.schema||gate.datasetGate!=='PASSED'||gate.candidateSha256!==APPROVED_DATA.sha256||gate.rowCount!==APPROVED_DATA.rowCount||gate.nextStageStarted!==false)throw Error('DATA: godkänd Gen9-datasetgate saknas eller matchar inte låst kandidat');
 if(await sha256Text(rawText)!==APPROVED_DATA.sha256)throw Error('DATA: SOURCE_gen9-data.json matchar inte godkänd SHA256');
 let input;try{input=JSON.parse(rawText)}catch(_){throw Error('DATA: kandidatfilen är inte giltig JSON')}
 const normalized=normalize(input,APPROVED_DATA.historyHardStop),rows=SPEC.symbols.reduce((n,s)=>n+normalized.by[s].length,0);
 if(rows!==APPROVED_DATA.rowCount||SPEC.symbols.some(s=>normalized.by[s].length!==1258))throw Error('DATA: kandidat måste vara exakt 20 128 rader, 1 258 per symbol');
 return{normalized,manifest:{schema:'LINA-GEN9-APPROVED-DATASET-1',source:APPROVED_DATA.path,gatePath:APPROVED_DATA.gatePath,contentSha256:APPROVED_DATA.sha256,rowCount:rows,historyHardStop:APPROVED_DATA.historyHardStop,datasetGate:'PASSED'}};
}
async function validateDataManifest(m,input){
 if(!m||m.schema!=='LINA-GEN9-APPROVED-DATASET-1'||m.datasetGate!=='PASSED'||m.contentSha256!==APPROVED_DATA.sha256||m.rowCount!==APPROVED_DATA.rowCount||m.historyHardStop!==SPEC.historyHardStop)throw Error('DATA: endast den godkända SHA-låsta Gen9-kandidaten får användas');
 const normalized=normalize(input,SPEC.historyHardStop),rows=SPEC.symbols.reduce((n,s)=>n+normalized.by[s].length,0);
 if(rows!==APPROVED_DATA.rowCount||SPEC.symbols.some(s=>normalized.by[s].length!==1258))throw Error('DATA: lagrat dataset matchar inte godkänd radstruktur');
 return normalized;
}
function proposal(){return{schema:'LINA-GEN9-BUILD-PROPOSAL-1',release:global.LinaVersion?.release||'TEST',spec:SPEC,specHash:SPEC_HASH,planLocked:false,runnerSpecLocked:false,researchOpened:false,tradeEnabled:false,forwardOpened:false}}
// No fetch, storage, plan locking or research orchestration in this pre-lock build.
function mount(root){
 const anchor=root.querySelector('.engine-export-panel');if(!anchor)return;
 const section=document.createElement('section');section.className='workspace';section.setAttribute('data-gen9-build','');
 section.innerHTML='<h2>Gen9 · byggd för metodgranskning</h2><p>Gen9 har separata beslut för planlås, forskningsstart och sammanfattningsfrysning. Handel är AV.</p><p>A: fast trendmodell utan köpstopp. B: samma modell, men inga nya köp när färre än 5 av 16 aktier ligger över SMA180.</p><p>Fast signal: utbrott över 50 dagar + SMA180. Innehav: 12 handelsdagar. Daglig portföljvärdering och strikt periodslut.</p><p>Historiken är observerad utvecklingsdata. B kan kvalificera sig endast om alla gates klaras; A är kontroll.</p><p>Metodtester: 11 syntetiska fall godkända vid bygge. Verklig forskning och browserkontroll återstår.</p><p>Granska och exportera kontraktet före planlås.</p>';
 anchor.after(section);
 const button=document.createElement('button');button.textContent='📥 Exportera Gen9-planförslag';button.onclick=()=>global.LinaStatusExport?.downloadObject?.('LINA_GEN9_PLAN_PROPOSAL',proposal());anchor.querySelector('.engine-export-primary').appendChild(button);
}
const api=Object.freeze({SPEC,SPEC_HASH,APPROVED_DATA,proposal,simulate,aggregate,validateApprovedDataset,validateDataManifest,canonical,mount});
if(typeof module==='object'&&module.exports)module.exports=api;else global.LinaGen9Engine=api;
})(typeof window==='object'?window:globalThis);
