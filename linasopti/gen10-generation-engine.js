(function(global){
'use strict';
const deepFreeze=o=>{if(o&&typeof o==='object'){Object.values(o).forEach(deepFreeze);Object.freeze(o)}return o};
const SPEC=deepFreeze({"schema":"LINA-GEN10-RUNNERSPEC-1","status":"LOCK_CANDIDATE_PRE_RESEARCH","sourceGeneration":9,"sourceGen9SpecHash":"083bcb30","historyHardStop":"2024-12-31","symbols":["AMD","SHOP","ADBE","MU","FDX","TSLA","LUV","NFLX","C","NOW","QCOM","BAC","GM","DDOG","PYPL","NVDA"],"foldYears":[2021,2022,2023,2024],"variants":["CONTROL","GRADED"],"candidateVariant":"GRADED","params":{"lookback":50,"trend":180,"hold":12,"volDays":20,"volTarget":0.12,"volMin":0.35},"gradedExposure":{"breadthSource":"previous-close count of 16 symbols with close > SMA180","tiers":[{"minBreadth":8,"maxBreadth":16,"exposure":1},{"minBreadth":5,"maxBreadth":7,"exposure":0.5},{"minBreadth":0,"maxBreadth":4,"exposure":0.25}],"application":"multiply new-position risk sizing and max-position budget only; never change signal ranking, symbol eligibility, existing positions or exits"},"capital":100000,"costSide":0.001,"maxPositions":8,"maxPositionPct":0.125,"baseRiskPerTrade":0.005,"sizingDistance":0.05,"gates":{"minOosTrades":100,"minPf":1.2,"maxDd":0.12,"positiveOos":true,"maxConcentration":0.4,"minPositiveFolds":3,"minFoldPf":0.8,"maxFoldGrossProfitShare":0.55},"method":{"selection":"FIXED_PARAMS_NO_TRAIN_SELECTION","entry":"next open using previous-close signal only","exit":"12th session close inclusive of entry; liquidate at fold end","equity":"daily cash plus marked positions","control":"CONTROL diagnostic only; GRADED candidate eligible","missingData":"aligned complete symbol bars required","simultaneousEntryOrder":"strength descending, symbol ascending tie-break","noRescue":true,"observedHistory":"2021-2024 development data, never unseen holdout"},"tradeEnabled":false,"forwardOpened":false});
const SPEC_SHA256='29e3034d221d675f15d08e704fffe551ebc1b49aee83d083e9ca4595336d5e0b';
const canonical=o=>Array.isArray(o)?'['+o.map(canonical).join(',')+']':o&&typeof o==='object'?'{'+Object.keys(o).sort().map(k=>JSON.stringify(k)+':'+canonical(o[k])).join(',')+'}':JSON.stringify(o);
async function sha256(v){const d=await global.crypto.subtle.digest('SHA-256',new TextEncoder().encode(canonical(v)));return[...new Uint8Array(d)].map(b=>b.toString(16).padStart(2,'0')).join('')}
function exposureScale(breadth,variant='GRADED'){
 if(variant==='CONTROL')return 1;
 if(variant!=='GRADED'||!Number.isInteger(breadth)||breadth<0||breadth>16)throw Error('GEN10 CONTRACT: ogiltig breadth/variant');
 return breadth>=8?1:breadth>=5?.5:.25;
}
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
 const {by,dates}=normalize(input,end),first=dates.findIndex(d=>d>=start),last=dates.length-1;if(first<180||first>last)throw Error('DATA: otillräcklig uppvärmning eller tom fold');
 let cash=SPEC.capital,previousEquity=SPEC.capital,positions=[];const trades=[],equity=[],events=[];
 for(let i=first;i<=last;i++){
  const day=dates[i],signal=signalAt(by,i-1);if(!signal)throw Error('DATA: uppvärmning saknas');const scale=exposureScale(signal.breadth,variant);
  for(const x of signal.candidates){
   let reason=positions.some(p=>p.s===x.s)?'SYMBOL_OPEN':positions.length>=SPEC.maxPositions?'POSITION_CAP':null;if(reason){events.push({...x,day,breadth:signal.breadth,exposureScale:scale,action:'SKIP',reason});continue}
   const price=by[x.s][i].o*(1+SPEC.costSide),budget=Math.min(previousEquity*SPEC.maxPositionPct*scale,cash),risk=previousEquity*SPEC.baseRiskPerTrade*x.volScale*scale,qty=Math.min(budget/price,risk/(price*SPEC.sizingDistance));
   if(!(qty>0)){events.push({...x,day,breadth:signal.breadth,exposureScale:scale,action:'SKIP',reason:'NO_CASH'});continue}
   const spent=qty*price;cash-=spent;positions.push({...x,qty,entry:day,entryPrice:price,notional:spent,entryIndex:i,exitIndex:i+SPEC.params.hold-1});events.push({...x,day,breadth:signal.breadth,exposureScale:scale,action:'ENTRY',notional:spent,previousEquity});
  }
  const keep=[];for(const p of positions){if(i>=p.exitIndex||i===last){const price=by[p.s][i].c*(1-SPEC.costSide);cash+=p.qty*price;trades.push({...p,exit:day,exitPrice:price,pnl:p.qty*(price-p.entryPrice),boundaryExit:i===last&&i<p.exitIndex})}else keep.push(p)}positions=keep;
  previousEquity=cash+positions.reduce((n,p)=>n+p.qty*by[p.s][i].c,0);equity.push({d:day,value:previousEquity,cash,positions:positions.length});
 }
 return{schema:'LINA-GEN10-FOLD-1',variant,range:[start,end],specSha256:SPEC_SHA256,oos:summarize(trades,equity),trades,equity,events};
}
function aggregate(folds,variant){
 if(folds.length!==4||folds.some((f,i)=>f.variant!==variant||f.specSha256!==SPEC_SHA256||f.range[0]!==SPEC.foldYears[i]+'-01-01'||f.range[1]!==SPEC.foldYears[i]+'-12-31'))throw Error('CONTRACT: fyra exakta årsfolds krävs');
 const fs=folds.map(f=>f.oos),gp=fs.reduce((n,f)=>n+f.grossProfit,0),gl=fs.reduce((n,f)=>n+f.grossLoss,0),r={n:fs.reduce((n,f)=>n+f.n,0),pl:gp-gl,pf:gl?gp/gl:null,dd:Math.min(...fs.map(f=>f.dd)),concentration:Math.max(...fs.map(f=>f.maxSymbolGrossProfitShare??1)),positiveFolds:fs.filter(f=>f.pl>0).length,minFoldPf:Math.min(...fs.map(f=>f.pfKind==='NO_LOSSES'?Infinity:f.pf??0)),maxFoldGrossProfitShare:gp?Math.max(...fs.map(f=>f.grossProfit))/gp:1};
 const g=SPEC.gates,checks={trades:r.n>=g.minOosTrades,pf:gl===0?gp>0:r.pf>=g.minPf,dd:Math.abs(r.dd)<=g.maxDd,positive:r.pl>0,concentration:r.concentration<=g.maxConcentration,positiveFolds:r.positiveFolds>=g.minPositiveFolds,worstFold:fs.every(f=>f.n>0&&(f.pfKind==='NO_LOSSES'||f.pf>=g.minFoldPf)),foldShare:r.maxFoldGrossProfitShare<=g.maxFoldGrossProfitShare};
 return{variant,metrics:r,checks,status:Object.values(checks).every(Boolean)?'PASS':'FAIL',candidateEligible:variant==='GRADED'&&Object.values(checks).every(Boolean),tradeEnabled:false,forwardOpened:false};
}
async function verify(){
 const tests=[];
 const add=(id,pass,detail)=>tests.push({id,pass:Boolean(pass),detail});
 add('sha256',await sha256(SPEC)===SPEC_SHA256,'Exakt kanonisk runnerspec SHA-256.');
 add('breadth_8',exposureScale(8)===1,'8–16 => 100 %.');
 add('breadth_7',exposureScale(7)===.5,'5–7 => 50 %.');
 add('breadth_5',exposureScale(5)===.5,'Gen9:s tidigare gräns 5 ligger i mellansteget.');
 add('breadth_4',exposureScale(4)===.25,'0–4 => 25 %, inget binärt köpstopp.');
 add('control',exposureScale(0,'CONTROL')===1&&exposureScale(16,'CONTROL')===1,'Kontrollens sizing är ofiltrerad.');
 add('candidate_only',SPEC.candidateVariant==='GRADED'&&SPEC.method.control.startsWith('CONTROL diagnostic'),'Endast GRADED kandidatberättigad.');
 add('lookahead',SPEC.method.entry.startsWith('next open')&&SPEC.gradedExposure.breadthSource.startsWith('previous-close'),'Bredd och signal kommer endast från föregående close.');
 add('sizing_only',SPEC.gradedExposure.application.includes('new-position risk sizing')&&SPEC.gradedExposure.application.includes('never change signal ranking'),'Regeln påverkar sizing, inte urval/exit.');
 add('costs',SPEC.costSide===.001,'0,1 % per sida.');
 add('fold_end',SPEC.method.exit.includes('liquidate at fold end'),'Fold-end liquidation låst.');
 add('mark_to_market',SPEC.method.equity==='daily cash plus marked positions','Daglig mark-to-market låst.');
 add('ordering',SPEC.method.simultaneousEntryOrder==='strength descending, symbol ascending tie-break','Deterministisk samtidighetsordning.');
 add('history_stop',SPEC.historyHardStop==='2024-12-31','Ingen bar efter 2024-12-31.');
 add('aligned_data',SPEC.method.missingData==='aligned complete symbol bars required','Kompletta alignade bars krävs.');
 add('no_rescue',SPEC.method.noRescue===true,'Ingen rescue efter observerat resultat.');
 add('trade_forward_off',SPEC.tradeEnabled===false&&SPEC.forwardOpened===false,'Handel/Forward AV.');
 const failed=tests.filter(t=>!t.pass);return{schema:'LINA-GEN10-ENGINE-VERIFY-1',specSha256:SPEC_SHA256,status:failed.length?'FAIL':'PASS',tests,failed:failed.map(t=>t.id),researchOpened:false,tradeEnabled:false,forwardOpened:false};
}
global.LinaGen10Engine=Object.freeze({SPEC,SPEC_SHA256,canonical,exposureScale,signalAt,simulate,aggregate,verify});
})(typeof window==='object'?window:globalThis);
