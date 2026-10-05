(function(global){
'use strict';
const deepFreeze=o=>{if(o&&typeof o==='object'){Object.values(o).forEach(deepFreeze);Object.freeze(o)}return o};
const SPEC=deepFreeze({"schema":"LINA-GEN15-RUNNERSPEC-1","status":"LOCKED_PRE_RESEARCH","sourceGeneration":14,"sourceGen14SpecSha256":"5792360ae36b56390f480a9b846ed2a15b504145a06b8a03a36e676247e03fc5","historyHardStop":"2024-12-31","symbols":["AMD","SHOP","ADBE","MU","FDX","TSLA","LUV","NFLX","C","NOW","QCOM","BAC","GM","DDOG","PYPL","NVDA"],"foldYears":[2021,2022,2023,2024],"variants":["CONTROL","TREND_INVALIDATION_EXIT"],"candidateVariant":"TREND_INVALIDATION_EXIT","params":{"lookback":50,"trend":180,"hold":12,"volDays":20,"volTarget":0.12,"volMin":0.35},"trendInvalidationExit":{"trigger":"for an open candidate position, if close(t) <= SMA180(t) computed only through close(t), mark exit","execution":"execute marked exit at open(t+1) with ordinary exit-side cost","firstEvaluation":"a position entered at open(t) may first be evaluated at close(t)","timeExit":"none for candidate; original 12-session exit remains CONTROL only","foldBoundary":"on final fold session liquidate every still-open position at that close with ordinary exit-side cost; never read next-fold open","reentry":"while open, same-symbol entry prohibited; after executed exit, re-entry requires a new ordinary valid breakout signal","newNumericParameters":0},"capital":100000,"costSide":0.001,"maxPositions":8,"maxPositionPct":0.125,"baseRiskPerTrade":0.005,"sizingDistance":0.05,"gates":{"minOosTrades":100,"minPf":1.2,"maxDd":0.12,"positiveOos":true,"maxConcentration":0.4,"minPositiveFolds":3,"minFoldPf":0.8,"maxFoldGrossProfitShare":0.55},"method":{"selection":"FIXED_PARAMS_NO_TRAIN_SELECTION","entry":"unchanged original one-signal next-open breakout entry for both variants; Gen14 persistence not inherited","exit":"CONTROL: 12th session close inclusive of entry; candidate: next open after close <= SMA180; both liquidate at fold end","equity":"daily cash plus marked positions","control":"CONTROL diagnostic only; TREND_INVALIDATION_EXIT candidate eligible","missingData":"aligned complete symbol bars required","simultaneousEntryOrder":"strength descending, symbol ascending tie-break","noRescue":true,"observedHistory":"2021-2024 development data, never unseen holdout","noParameterGrid":true},"tradeEnabled":false,"forwardOpened":false});
const SPEC_SHA256='726b1631365c5df4880dd926b32461f870eacd1bdf2f610f00b5ad844c61b43c';
const canonical=o=>Array.isArray(o)?'['+o.map(canonical).join(',')+']':o&&typeof o==='object'?'{'+Object.keys(o).sort().map(k=>JSON.stringify(k)+':'+canonical(o[k])).join(',')+'}':JSON.stringify(o);
async function sha256(v){const d=await global.crypto.subtle.digest('SHA-256',new TextEncoder().encode(canonical(v)));return[...new Uint8Array(d)].map(b=>b.toString(16).padStart(2,'0')).join('')}
function smaAt(rows,i){if(i<SPEC.params.trend-1)return null;return rows.slice(i-SPEC.params.trend+1,i+1).reduce((n,r)=>n+r.c,0)/SPEC.params.trend}
function trendInvalidated(rows,i){const sma=smaAt(rows,i);return sma!==null&&rows[i].c<=sma}
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
 for(const s of SPEC.symbols){const a=by[s],bar=a[i],sma=smaAt(a,i);breadth+=bar.c>sma?1:0;
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
 const {by,dates}=normalize(input,end),first=dates.findIndex(d=>d>=start),last=dates.length-1;if(first<181||first>last)throw Error('DATA: otillräcklig uppvärmning eller tom fold');
 let cash=SPEC.capital,previousEquity=SPEC.capital,positions=[];const trades=[],equity=[],events=[];
 for(let i=first;i<=last;i++){
  const day=dates[i];
  if(variant==='TREND_INVALIDATION_EXIT'){
   const keep=[];for(const p of positions){if(p.pendingTrendExit){const price=by[p.s][i].o*(1-SPEC.costSide);cash+=p.qty*price;trades.push({...p,exit:day,exitPrice:price,pnl:p.qty*(price-p.entryPrice),exitReason:'TREND_INVALIDATION',boundaryExit:false});events.push({s:p.s,day,action:'EXIT',reason:'TREND_INVALIDATION'});}else keep.push(p)}positions=keep;
  }
  const signal=signalAt(by,i-1);if(!signal)throw Error('DATA: uppvärmning saknas');const scale=1;
  for(const x of signal.candidates){
   let reason=positions.some(p=>p.s===x.s)?'SYMBOL_OPEN':positions.length>=SPEC.maxPositions?'POSITION_CAP':null;
   if(reason){events.push({...x,day,breadth:signal.breadth,exposureScale:scale,action:'SKIP',reason});continue}
   const price=by[x.s][i].o*(1+SPEC.costSide),budget=Math.min(previousEquity*SPEC.maxPositionPct,cash),risk=previousEquity*SPEC.baseRiskPerTrade*x.volScale,qty=Math.min(budget/price,risk/(price*SPEC.sizingDistance));
   if(!(qty>0)){events.push({...x,day,breadth:signal.breadth,exposureScale:scale,action:'SKIP',reason:'NO_CASH'});continue}
   const spent=qty*price;cash-=spent;positions.push({...x,qty,entry:day,entryPrice:price,notional:spent,entryIndex:i,exitIndex:i+SPEC.params.hold-1,pendingTrendExit:false});events.push({...x,day,breadth:signal.breadth,exposureScale:scale,action:'ENTRY',notional:spent,previousEquity});
  }
  const keep=[];
  for(const p of positions){
   if(i===last){const price=by[p.s][i].c*(1-SPEC.costSide);cash+=p.qty*price;trades.push({...p,exit:day,exitPrice:price,pnl:p.qty*(price-p.entryPrice),exitReason:'FOLD_BOUNDARY',boundaryExit:true});continue}
   if(variant==='CONTROL'&&i>=p.exitIndex){const price=by[p.s][i].c*(1-SPEC.costSide);cash+=p.qty*price;trades.push({...p,exit:day,exitPrice:price,pnl:p.qty*(price-p.entryPrice),exitReason:'TIME_12',boundaryExit:false});continue}
   if(variant==='TREND_INVALIDATION_EXIT'&&trendInvalidated(by[p.s],i)){p.pendingTrendExit=true;events.push({s:p.s,day,action:'MARK_EXIT',reason:'TREND_INVALIDATION'});}
   keep.push(p);
  }
  positions=keep;previousEquity=cash+positions.reduce((n,p)=>n+p.qty*by[p.s][i].c,0);equity.push({d:day,value:previousEquity,cash,positions:positions.length});
 }
 return{schema:'LINA-GEN15-FOLD-1',variant,range:[start,end],specSha256:SPEC_SHA256,oos:summarize(trades,equity),trades,equity,events};
}
function aggregate(folds,variant){
 if(folds.length!==4||folds.some((f,i)=>f.variant!==variant||f.specSha256!==SPEC_SHA256||f.range[0]!==SPEC.foldYears[i]+'-01-01'||f.range[1]!==SPEC.foldYears[i]+'-12-31'))throw Error('CONTRACT: fyra exakta årsfolds krävs');
 const fs=folds.map(f=>f.oos),gp=fs.reduce((n,f)=>n+f.grossProfit,0),gl=fs.reduce((n,f)=>n+f.grossLoss,0),r={n:fs.reduce((n,f)=>n+f.n,0),pl:gp-gl,pf:gl?gp/gl:null,dd:Math.min(...fs.map(f=>f.dd)),concentration:Math.max(...fs.map(f=>f.maxSymbolGrossProfitShare??1)),positiveFolds:fs.filter(f=>f.pl>0).length,minFoldPf:Math.min(...fs.map(f=>f.pfKind==='NO_LOSSES'?Infinity:f.pf??0)),maxFoldGrossProfitShare:gp?Math.max(...fs.map(f=>f.grossProfit))/gp:1};
 const g=SPEC.gates,checks={trades:r.n>=g.minOosTrades,pf:gl===0?gp>0:r.pf>=g.minPf,dd:Math.abs(r.dd)<=g.maxDd,positive:r.pl>0,concentration:r.concentration<=g.maxConcentration,positiveFolds:r.positiveFolds>=g.minPositiveFolds,worstFold:fs.every(f=>f.n>0&&(f.pfKind==='NO_LOSSES'||f.pf>=g.minFoldPf)),foldShare:r.maxFoldGrossProfitShare<=g.maxFoldGrossProfitShare};
 return{variant,metrics:r,checks,status:Object.values(checks).every(Boolean)?'PASS':'FAIL',candidateEligible:variant==='TREND_INVALIDATION_EXIT'&&Object.values(checks).every(Boolean),tradeEnabled:false,forwardOpened:false};
}
async function verify(){
 const tests=[];const add=(id,pass,detail)=>tests.push({id,pass:Boolean(pass),detail});
 add('sha256',await sha256(SPEC)===SPEC_SHA256,'Canonical runnerspec SHA-256 måste matcha låst fil.');
 add('source_gen14',SPEC.sourceGeneration===14&&SPEC.sourceGen14SpecSha256==='5792360ae36b56390f480a9b846ed2a15b504145a06b8a03a36e676247e03fc5','Gen14 är exakt fryst källa.');
 add('candidate_only',SPEC.candidateVariant==='TREND_INVALIDATION_EXIT'&&SPEC.method.control.startsWith('CONTROL diagnostic'),'Endast trend-invalidation är kandidatberättigad.');
 add('zero_new_numeric',SPEC.trendInvalidationExit.newNumericParameters===0&&SPEC.params.trend===180,'Ingen ny numerisk exitparameter; befintlig SMA180 återanvänds.');
 add('trigger_semantics',SPEC.trendInvalidationExit.trigger.includes('close(t) <= SMA180(t)')&&SPEC.trendInvalidationExit.execution.includes('open(t+1)'),'Close-trigger och next-open execution låsta.');
 add('candidate_no_time_exit',SPEC.trendInvalidationExit.timeExit.startsWith('none for candidate'),'Ingen 12-sessioners eller annan max-hold i kandidaten.');
 add('entry_unchanged',SPEC.method.entry.startsWith('unchanged original one-signal next-open'),'Original-entry; Gen14 persistence ej ärvd.');
 add('fold_boundary',SPEC.trendInvalidationExit.foldBoundary.includes('final fold session')&&SPEC.trendInvalidationExit.foldBoundary.includes('never read next-fold open'),'Foldgräns kan inte läsa framtida fold.');
 add('no_grid',SPEC.method.noParameterGrid===true,'Ingen parametergrid.');
 add('costs',SPEC.costSide===.001,'0,1 % per sida.');
 add('history_stop',SPEC.historyHardStop==='2024-12-31','Ingen bar efter 2024-12-31.');
 add('no_rescue',SPEC.method.noRescue===true,'Ingen rescue efter observerat resultat.');
 add('gates',JSON.stringify(SPEC.gates)===JSON.stringify({minOosTrades:100,minPf:1.2,maxDd:.12,positiveOos:true,maxConcentration:.4,minPositiveFolds:3,minFoldPf:.8,maxFoldGrossProfitShare:.55}),'Robusthetsgates oförändrade.');
 add('trade_forward_off',SPEC.tradeEnabled===false&&SPEC.forwardOpened===false,'Handel/Forward AV.');
 const failed=tests.filter(t=>!t.pass);return{schema:'LINA-GEN15-ENGINE-VERIFY-1',specSha256:SPEC_SHA256,status:failed.length?'FAIL':'PASS',tests,failed:failed.map(t=>t.id),researchOpened:false,tradeEnabled:false,forwardOpened:false};
}
global.LinaGen15Engine=Object.freeze({SPEC,SPEC_SHA256,canonical,smaAt,trendInvalidated,signalAt,simulate,aggregate,verify});
})(typeof window==='object'?window:globalThis);
