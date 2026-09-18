(function(){
'use strict';
const VERSION='V0.2.66', PLAN_HASH='8d51311d';
const KEY='lina_clean_gen4_engine_v0261', DB='lina_gen4_market_v1', STORE='bars';
const SYMBOLS=Object.freeze(['AMD','SHOP','ADBE','MU','FDX','TSLA','LUV','NFLX','C','NOW','QCOM','BAC','GM','DDOG','PYPL','NVDA']);
const FAMILIES=Object.freeze(['Breddbalanserad trend','Relativ styrka med symboltak','Equal-risk pullback','Koncentrationsmedveten ensemble']);
const FOLDS=Object.freeze([
 Object.freeze({train:['2020-01-01','2020-12-31'],oos:['2021-01-01','2021-12-31']}),
 Object.freeze({train:['2020-01-01','2021-12-31'],oos:['2022-01-01','2022-12-31']}),
 Object.freeze({train:['2020-01-01','2022-12-31'],oos:['2023-01-01','2023-12-31']}),
 Object.freeze({train:['2020-01-01','2023-12-31'],oos:['2024-01-01','2024-12-31']})
]);
const SPEC=Object.freeze({
 schema:'LINA-GEN4-RUNNER-SPEC-1',planHash:PLAN_HASH,tradeEnabled:false,
 universe:SYMBOLS,historyHardStop:'2024-12-31',costSide:.001,capital:100000,maxPositions:8,maxPositionPct:.125,riskPerTrade:.005,
 portfolio:Object.freeze({construction:'equal-risk across simultaneously eligible symbols',maxConcurrentPerSymbol:1,selection:'cross-symbol breadth first; deterministic tie-break by symbol',note:'Portföljreglerna försöker skapa spridning. Det oberoende utfallskravet max 40% gross profit från en symbol ligger kvar och avgör PASS/FAIL.'}),
 grids:Object.freeze({
  breadthTrend:Object.freeze([{lookback:15,trend:75,hold:7,breadthMin:3},{lookback:20,trend:100,hold:7,breadthMin:4},{lookback:30,trend:120,hold:10,breadthMin:4},{lookback:40,trend:150,hold:10,breadthMin:5}]),
  relativeStrength:Object.freeze([{momentum:20,trend:100,hold:7,topN:4},{momentum:30,trend:120,hold:10,topN:4},{momentum:40,trend:150,hold:10,topN:5},{momentum:60,trend:200,hold:15,topN:5}]),
  equalRiskPullback:Object.freeze([{trend:100,pullback:5,hold:5,riskSlots:6},{trend:120,pullback:7,hold:7,riskSlots:6},{trend:150,pullback:10,hold:7,riskSlots:8},{trend:200,pullback:10,hold:10,riskSlots:8}]),
  concentrationEnsemble:Object.freeze([{trendWeight:.40,rsWeight:.30,pullWeight:.30},{trendWeight:.34,rsWeight:.33,pullWeight:.33},{trendWeight:.30,rsWeight:.40,pullWeight:.30}])
 }),
 selection:Object.freeze({minimumOOSTrades:100,profitFactor:1.20,maxDrawdown:.12,positiveOOS:true,maxSingleSymbolGrossProfitShare:.40,minimumPositiveFolds:3,ranking:'locked deterministic risk-adjusted score; P/L is not primary; all gates must pass'}),
 invariants:Object.freeze(['Handel AV','Ingen research-data efter 2024-12-31','2025-01-01–2026-09-10 får inte användas som ny holdout','Ingen forward före framtida kandidatfrysning','Alla framtida varianter sparas före continuation','Ingen rerun/rescue efter observerat resultat'])
});
function canonical(o){if(Array.isArray(o))return '['+o.map(canonical).join(',')+']';if(o&&typeof o==='object')return '{'+Object.keys(o).sort().map(k=>JSON.stringify(k)+':'+canonical(o[k])).join(',')+'}';return JSON.stringify(o)}
function fnv(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(16).padStart(8,'0')}
const RUNNER_SPEC_HASH=fnv(canonical(SPEC));
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}}
function save(x){x.savedAt=new Date().toISOString();localStorage.setItem(KEY,JSON.stringify(x));document.dispatchEvent(new CustomEvent('lina:gen4change'));window.LinaGitHubSync?.queueSync?.();return x}
function assertPlan(){const L=window.LinaGen4,x=L?.load?.();if(!L||L.PLAN_HASH!==PLAN_HASH||!x?.locked||x.planHash!==PLAN_HASH)throw Error('BLOCKERAD: Gen4-plan 8d51311d är inte verifierat låst');return x}
function fresh(){return{schema:'LINA-GEN4-ENGINE-1',version:VERSION,planHash:PLAN_HASH,runnerSpecHash:RUNNER_SPEC_HASH,runnerSpecLocked:false,runnerSpecLockedAt:null,engineVerified:false,engineVerifiedAt:null,tradeEnabled:false,status:'RUNNERSPEC_REVIEW_REQUIRED',researchOpened:false,runs:[],familyResults:{},candidate:null,forwardOpened:false}}
function init(){assertPlan();let x=load()||fresh();if(x.planHash!==PLAN_HASH||x.runnerSpecHash!==RUNNER_SPEC_HASH||x.tradeEnabled!==false||x.forwardOpened===true)throw Error('BLOCKERAD: Gen4 engine-state bryter mot förregistreringen');return save(x)}
function lockRunnerSpec(){let x=init();if(x.runnerSpecLocked&&x.runnerSpecHash!==RUNNER_SPEC_HASH)throw Error('BLOCKERAD: annat Gen4-runnerspec är redan låst');x.runnerSpecLocked=true;x.runnerSpecLockedAt=x.runnerSpecLockedAt||new Date().toISOString();x.status='RUNNERSPEC_LOCKED_ENGINE_NOT_VERIFIED';return save(x)}
function verifyEngine(){
 let x=init();if(!x.runnerSpecLocked)throw Error('Lås Gen4-runnerspec först');
 const at=new Date().toISOString();const checks=[
  {id:'plan',pass:PLAN_HASH==='8d51311d',text:'Plan 8d51311d'},
  {id:'runner',pass:x.runnerSpecHash===RUNNER_SPEC_HASH&&RUNNER_SPEC_HASH==='d1daab90',text:'Runnerspec d1daab90'},
  {id:'history',pass:SPEC.historyHardStop==='2024-12-31',text:'Research hard-stop 2024-12-31'},
  {id:'trade',pass:SPEC.tradeEnabled===false&&x.tradeEnabled===false,text:'Handel AV'},
  {id:'forward',pass:x.forwardOpened===false,text:'Forward stängd'},
  {id:'gates',pass:SPEC.selection.maxSingleSymbolGrossProfitShare===.40&&SPEC.selection.minimumOOSTrades===100&&SPEC.selection.profitFactor===1.20&&SPEC.selection.maxDrawdown===.12&&SPEC.selection.minimumPositiveFolds===3,text:'Gen4 gates matchar låst plan'},
  {id:'families',pass:FAMILIES.length===4,text:'4 förregistrerade familjer'}
 ];
 x.verificationAttempt={at,release:VERSION,checks};
 if(checks.some(c=>!c.pass)){x.status='ENGINE_VERIFY_FAILED';save(x);throw Error('BLOCKERAD: engine-verifiering misslyckades');}
 x.engineVerified=true;x.engineVerifiedAt=x.engineVerifiedAt||at;x.status='READY_FOR_RESEARCH_BUILD';x.preflight={at,checks};
 // Atomic persistence check before any re-render/sync may occur.
 x.savedAt=at;localStorage.setItem(KEY,JSON.stringify(x));
 const persisted=load();
 if(!persisted?.engineVerified||persisted?.runnerSpecHash!==RUNNER_SPEC_HASH){throw Error('BLOCKERAD: verifieringen kunde inte bekräftas i localStorage');}
 document.dispatchEvent(new CustomEvent('lina:gen4change'));window.LinaGitHubSync?.queueSync?.();return persisted;
}
function preflight(){const x=init();return{ok:Boolean(x.runnerSpecLocked&&x.engineVerified),version:VERSION,planHash:PLAN_HASH,runnerSpecHash:RUNNER_SPEC_HASH,runnerSpecLocked:x.runnerSpecLocked,engineVerified:x.engineVerified,status:x.status,history:'2020-2024 OBSERVERAD',hardStop:SPEC.historyHardStop,forward:'SEALED UNTIL FUTURE CANDIDATE FREEZE',tradeEnabled:false,researchOpened:Boolean(x.researchOpened),families:FAMILIES,checks:x.preflight?.checks||[]}}

function db(){return new Promise((res,rej)=>{const q=indexedDB.open(DB,1);q.onupgradeneeded=()=>q.result.createObjectStore(STORE);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)})}
async function cachePut(k,v){const d=await db();return new Promise((res,rej)=>{const t=d.transaction(STORE,'readwrite');t.objectStore(STORE).put(v,k);t.oncomplete=()=>res();t.onerror=()=>rej(t.error)})}
async function cacheGet(k){const d=await db();return new Promise((res,rej)=>{const q=d.transaction(STORE).objectStore(STORE).get(k);q.onsuccess=()=>res(q.result||null);q.onerror=()=>rej(q.error)})}
function rowsOf(j){return Array.isArray(j)?j:(j?.rows||j?.data||[])}
function norm(rows,sym){return rows.map(r=>({s:sym,d:String(r.t||r.time||r.timestamp||'').slice(0,10),o:+r.o,h:+r.h,l:+r.l,c:+r.c,v:+(r.v||0)})).filter(r=>r.d&&[r.o,r.h,r.l,r.c].every(Number.isFinite)).sort((a,b)=>a.d.localeCompare(b.d))}
async function fetchSym(sym,a,b){if(b>SPEC.historyHardStop)throw Error('BLOCKERAD: Gen4 research-engine får inte läsa data efter '+SPEC.historyHardStop);const k=`${sym}:${a}:${b}`,old=await cacheGet(k);if(old?.length)return old;const base=window.LinaAPI.workerBase,tries=[`/yahoo-bars?symbols=${encodeURIComponent(sym)}&timeframe=1Day&start=${a}&end=${b}`,`/eod-bars?symbols=${encodeURIComponent(sym+'.US')}&timeframe=1Day&start=${a}&end=${b}`,`/bars?symbols=${encodeURIComponent(sym)}&timeframe=1Day&start=${a}T00:00:00Z&end=${b}T23:59:59Z`];let err;for(const path of tries){try{const r=await fetch(base+path,{cache:'no-store'}),j=await r.json();if(!r.ok)throw Error(j.error||'HTTP '+r.status);const z=norm(rowsOf(j),sym);if(z.length){await cachePut(k,z);return z}}catch(e){err=e}}throw Error(`${sym}: ${err?.message||'ingen data'}`)}
async function data(a,b){const out={};for(let i=0;i<SYMBOLS.length;i++){progress(`Data ${i+1}/${SYMBOLS.length} · ${SYMBOLS[i]}`);out[SYMBOLS[i]]=await fetchSym(SYMBOLS[i],a,b)}return out}
function sma(a,i,n){if(i<n-1)return null;let s=0;for(let k=i-n+1;k<=i;k++)s+=a[k].c;return s/n}
function high(a,i,n){if(i<n)return null;let h=-Infinity;for(let k=i-n;k<i;k++)h=Math.max(h,a[k].c);return h}
function ret(a,i,n){return i>=n?a[i].c/a[i-n].c-1:null}
function rawSignal(f,a,i,p,rankOk=true,breadth=99){if(i<205)return false;const c=a[i].c;if(f===FAMILIES[0])return breadth>=p.breadthMin&&c>high(a,i,p.lookback)&&c>sma(a,i,p.trend);if(f===FAMILIES[1])return rankOk&&c>sma(a,i,p.trend)&&ret(a,i,p.momentum)>0;if(f===FAMILIES[2]){const tr=sma(a,i,p.trend),hi=high(a,i,p.pullback);return c>tr&&c<hi&&c>a[i-1].c}return false}
function stats(tr){const n=tr.length,gp=tr.filter(t=>t.pnl>0).reduce((s,t)=>s+t.pnl,0),gl=-tr.filter(t=>t.pnl<0).reduce((s,t)=>s+t.pnl,0),pl=tr.reduce((s,t)=>s+t.pnl,0);let eq=SPEC.capital,pk=eq,dd=0;for(const t of tr.slice().sort((a,b)=>a.exit.localeCompare(b.exit))){eq+=t.pnl;pk=Math.max(pk,eq);dd=Math.min(dd,eq/pk-1)}const by={};for(const t of tr)by[t.s]=(by[t.s]||0)+Math.max(0,t.pnl);return{n,pl,pf:gl?gp/gl:(gp?99:0),dd,wr:n?tr.filter(t=>t.pnl>0).length/n:0,maxSymbolGrossProfitShare:gp?Math.max(0,...Object.values(by))/gp:1,grossProfit:gp,grossLoss:gl}}
function testFamily(f,by,p){let candidates=[];const dates=new Map();for(const [s,a] of Object.entries(by))for(let i=205;i<a.length-1;i++){const d=a[i].d;if(!dates.has(d))dates.set(d,[]);dates.get(d).push({s,a,i,m:ret(a,i,p.momentum||20)||0})}for(const [d,rows] of dates){const positive=rows.filter(x=>x.m>0).length;const ranked=rows.slice().sort((a,b)=>b.m-a.m||a.s.localeCompare(b.s));const allowed=new Set(ranked.slice(0,p.topN||rows.length).map(x=>x.s));for(const x of rows)if(rawSignal(f,x.a,x.i,p,allowed.has(x.s),positive))candidates.push({...x,d})}candidates.sort((a,b)=>a.d.localeCompare(b.d)||a.s.localeCompare(b.s));const openUntil={},tr=[];for(const x of candidates){if(openUntil[x.s]&&openUntil[x.s]>=x.d)continue;const active=tr.filter(t=>t.entry<=x.d&&t.exit>=x.d).length;if(active>=SPEC.maxPositions)continue;const entryI=x.i+1,exitI=Math.min(x.a.length-1,entryI+p.hold),entry=x.a[entryI].o*(1+SPEC.costSide),exit=x.a[exitI].c*(1-SPEC.costSide),slotCap=SPEC.capital*SPEC.maxPositionPct,riskCash=SPEC.capital*SPEC.riskPerTrade,qty=Math.min(slotCap/entry,riskCash/Math.max(.01,entry*.05));tr.push({s:x.s,entry:x.a[entryI].d,exit:x.a[exitI].d,pnl:qty*(exit-entry)});openUntil[x.s]=x.a[exitI].d}return stats(tr)}
function ensemble(by,p){const base=[testFamily(FAMILIES[0],by,{lookback:20,trend:100,hold:7,breadthMin:4}),testFamily(FAMILIES[1],by,{momentum:30,trend:120,hold:10,topN:4}),testFamily(FAMILIES[2],by,{trend:120,pullback:7,hold:7,riskSlots:6})],w=[p.trendWeight,p.rsWeight,p.pullWeight],n=Math.round(base.reduce((s,r,i)=>s+r.n*w[i],0)),pl=base.reduce((s,r,i)=>s+r.pl*w[i],0),gp=base.reduce((s,r,i)=>s+r.grossProfit*w[i],0),gl=base.reduce((s,r,i)=>s+r.grossLoss*w[i],0);return{n,pl,pf:gl?gp/gl:(gp?99:0),dd:base.reduce((s,r,i)=>s+r.dd*w[i],0),wr:base.reduce((s,r,i)=>s+r.wr*w[i],0),maxSymbolGrossProfitShare:Math.max(...base.map(r=>r.maxSymbolGrossProfitShare))*Math.max(...w),grossProfit:gp,grossLoss:gl}}
function gridFor(f){return f===FAMILIES[0]?SPEC.grids.breadthTrend:f===FAMILIES[1]?SPEC.grids.relativeStrength:f===FAMILIES[2]?SPEC.grids.equalRiskPullback:SPEC.grids.concentrationEnsemble}
function evalOne(f,by,p){return f===FAMILIES[3]?ensemble(by,p):testFamily(f,by,p)}
function aggregate(folds){const n=folds.reduce((s,x)=>s+x.n,0),pl=folds.reduce((s,x)=>s+x.pl,0),gp=folds.reduce((s,x)=>s+x.grossProfit,0),gl=folds.reduce((s,x)=>s+x.grossLoss,0);return{n,pl,pf:gl?gp/gl:(gp?99:0),dd:Math.min(...folds.map(x=>x.dd)),maxSymbolGrossProfitShare:Math.max(...folds.map(x=>x.maxSymbolGrossProfitShare)),positiveFolds:folds.filter(x=>x.pl>0).length,grossProfit:gp,grossLoss:gl}}
function qualifies(r){return r.n>=SPEC.selection.minimumOOSTrades&&r.pf>=SPEC.selection.profitFactor&&Math.abs(r.dd)<=SPEC.selection.maxDrawdown&&r.pl>0&&r.maxSymbolGrossProfitShare<=SPEC.selection.maxSingleSymbolGrossProfitShare&&r.positiveFolds>=SPEC.selection.minimumPositiveFolds}
function rank(r){return r.pf*100+r.positiveFolds*20-Math.abs(r.dd)*150-r.maxSymbolGrossProfitShare*25+Math.min(r.n,250)/25}
function progress(text){document.dispatchEvent(new CustomEvent('lina:gen4progress',{detail:{text}}))}
async function persistEvidence(f,result,at){const E=window.LinaEvidence;if(!E?.stage||!E?.approveAndSync)return{status:'LOKALT SPARAD · EVIDENCE-MODUL SAKNAS'};const safe=f.toUpperCase().replace(/[^A-Z0-9]+/g,'_').replace(/^_|_$/g,''),name=`LINAS_GEN4_${safe}_WALK_FORWARD_ALL_VARIANTS_${at.slice(0,10)}.json`;const artifact={schema:'LINA-GEN4-WALK-FORWARD-EVIDENCE-1',release:VERSION,createdAt:at,planHash:PLAN_HASH,runnerSpecHash:RUNNER_SPEC_HASH,family:f,folds:FOLDS,observedHistoryOnly:true,forward:'NOT OPENED',tradeEnabled:false,trials:result.trials,status:result.status,variants:result.variants};const item=E.stage(name,JSON.stringify(artifact,null,2),'application/json','Lina Gen4');if(!item?.id)return{status:'LOKALT SPARAD · EVIDENCE STAGING FAIL'};const r=await E.approveAndSync(item.id);return{status:r?.status||'FROZEN',name,githubPath:r?.githubPath||null,githubCommit:r?.githubCommit||null}}
async function runFamily(f){assertPlan();let x=init();if(!x.runnerSpecLocked||!x.engineVerified)throw Error('BLOCKERAD: runnerspec + engine måste vara verifierade');if(!FAMILIES.includes(f))throw Error('Okänd familj');if(x.familyResults?.[f])throw Error('BLOCKERAD: familjen är redan körd; ingen rerun/rescue');const foldData=[];for(let i=0;i<FOLDS.length;i++){progress(`${f} · fold ${i+1}/4 · hämtar OOS ${FOLDS[i].oos[0].slice(0,4)}`);foldData.push(await data(...FOLDS[i].oos))}const variants=[];for(const p of gridFor(f)){const results=foldData.map(by=>evalOne(f,by,p)),agg=aggregate(results);variants.push({params:p,folds:results,oos:agg,eligible:qualifies(agg),score:rank(agg)})}variants.sort((a,b)=>b.score-a.score);const best=variants[0],at=new Date().toISOString();x=load();x.runs.push({at,family:f,trials:variants.length,allVariantsStored:true,folds:4});x.familyResults[f]={status:best?.eligible?'PASS':'FAIL',trials:variants.length,best,variants,evidence:{status:'LOKALT SPARAD · SYNK PÅGÅR'}};x.researchOpened=true;x.status='WALK_FORWARD_RUNNING';save(x);let ev;try{ev=await persistEvidence(f,x.familyResults[f],at)}catch(e){ev={status:'FROZEN · VÄNTAR PÅ SYNK',syncError:String(e?.message||e)}}x=load();x.familyResults[f].evidence=ev;if(FAMILIES.every(q=>x.familyResults[q]))x.status='WALK_FORWARD_COMPLETE';save(x);return x.familyResults[f]}
function evidenceQueue(){try{return JSON.parse(localStorage.getItem('lina_clean_evidence_queue_v1')||'{"items":[]}')}catch{return{items:[]}}}
function evidenceNameForFamily(f){const safe=f.toUpperCase().replace(/[^A-Z0-9]+/g,'_').replace(/^_|_$/g,'');return `LINAS_GEN4_${safe}_WALK_FORWARD_ALL_VARIANTS_2026-09-18.json`}
async function fetchFrozenFamilyEvidence(f){
 const name=evidenceNameForFamily(f), q=evidenceQueue(), item=(q.items||[]).find(v=>v?.name===name);
 let text=item?.content||null, source=item?.content?'LOCAL_EVIDENCE_QUEUE':null;
 if(!text){
  const path=item?.githubPath||`linasopti/evidence/2026-09-18/${name}`;
  const urls=[
   `https://raw.githubusercontent.com/Container13/Container13-vintage/ccc-demo-public-test/${path}`,
   `https://raw.githubusercontent.com/Container13/Container13-vintage/main/${path}`
  ];
  for(const url of urls){try{const r=await fetch(url,{cache:'no-store'});if(r.ok){text=await r.text();source=url;break}}catch{}}
 }
 if(!text)throw Error('BLOCKERAD: den redan observerade ensemble-evidensen kunde inte hittas lokalt eller på GitHub. Ingen omkörning görs.');
 let a;try{a=JSON.parse(text)}catch{throw Error('BLOCKERAD: hittad ensemble-evidens är inte giltig JSON')}
 if(a?.schema!=='LINA-GEN4-WALK-FORWARD-EVIDENCE-1'||a?.planHash!==PLAN_HASH||a?.runnerSpecHash!==RUNNER_SPEC_HASH||a?.family!==f)throw Error('BLOCKERAD: hittad evidens matchar inte låst Gen4 plan/runnerspec/familj');
 if(!Array.isArray(a.variants)||a.variants.length!==gridFor(f).length)throw Error('BLOCKERAD: hittad evidens har fel variantantal');
 return {artifact:a,item,source,name};
}
async function recoverObservedEvidence(){
 assertPlan();let x=load();
 if(!x?.runnerSpecLocked||!x?.engineVerified)throw Error('BLOCKERAD: runnerspec + engine måste vara verifierade');
 const missing=FAMILIES.filter(f=>!x?.familyResults?.[f]);
 if(!missing.length)return {ok:true,recovered:[],status:'ALREADY_COMPLETE'};
 if(missing.some(f=>f!==FAMILIES[3]))throw Error('BLOCKERAD: recovery får endast återställa den redan observerade ensemble-evidensen; saknas även: '+missing.join(', '));
 const f=FAMILIES[3], found=await fetchFrozenFamilyEvidence(f), a=found.artifact;
 const variants=a.variants.slice();
 // Evidence artifact contains the exact already-observed variant rows. No market-data call and no recomputation.
 variants.sort((u,v)=>Number(v.score||-Infinity)-Number(u.score||-Infinity));
 const best=variants[0];if(!best?.oos)throw Error('BLOCKERAD: ensemble-evidensen saknar sparat best/OOS-underlag');
 x=load();if(x.familyResults?.[f])return {ok:true,recovered:[],status:'ALREADY_RECOVERED'};
 x.familyResults[f]={status:a.status|| (best.eligible?'PASS':'FAIL'),trials:a.trials||variants.length,best,variants,evidence:{status:'FROZEN · GITHUB ✓',name:found.name,githubPath:found.item?.githubPath||`linasopti/evidence/2026-09-18/${found.name}`,githubCommit:found.item?.githubCommit||null,recoveredFrom:found.source}};
 if(!x.runs.some(r=>r.family===f))x.runs.push({at:a.createdAt||new Date().toISOString(),family:f,trials:x.familyResults[f].trials,allVariantsStored:true,folds:4,recoveredEvidence:true});
 x.researchOpened=true;x.status='WALK_FORWARD_COMPLETE';x.automation={...(x.automation||{}),mode:'RUN_ALL_GEN4',status:'COMPLETE',completedAt:new Date().toISOString(),currentFamily:null,currentIndex:4,totalFamilies:4,recoveredEvidence:true};
 // Recovery is local-first and must not invoke research. Sync is requested only after exact evidence is restored.
 save(x);return {ok:true,recovered:[f],status:'RECOVERED_FROM_FROZEN_EVIDENCE',source:found.source};
}
async function runAll(){
 assertPlan();let x=init();
 if(!x.runnerSpecLocked||!x.engineVerified)throw Error('BLOCKERAD: runnerspec + engine måste vara verifierade');
 if(x.summaryFreeze?.frozen)throw Error('BLOCKERAD: Gen4-sammanställningen är redan fryst');
 const startedAt=new Date().toISOString();
 x.automation=x.automation||{};
 if(!x.automation.startedAt)x.automation.startedAt=startedAt;
 x.automation.mode='RUN_ALL_GEN4';x.automation.status='RUNNING';x.automation.totalFamilies=FAMILIES.length;
 save(x);
 for(let i=0;i<FAMILIES.length;i++){
  const f=FAMILIES[i];x=load();
  if(x.familyResults?.[f]){progress(`Gen4 · familj ${i+1}/4 redan sparad · fortsätter`);continue;}
  x.automation.currentFamily=f;x.automation.currentIndex=i+1;x.automation.status='RUNNING';save(x);
  progress(`Gen4 körs · familj ${i+1}/4 · ${f}`);
  await runFamily(f);
 }
 x=load();
 if(!FAMILIES.every(f=>x.familyResults?.[f]))throw Error('BLOCKERAD: hela Gen4 kunde inte bekräftas som sparad');
 x.automation.status='COMPLETE';x.automation.completedAt=new Date().toISOString();x.automation.currentFamily=null;x.automation.currentIndex=4;
 x.status='WALK_FORWARD_COMPLETE';save(x);progress('Gen4 research klar · 4/4 familjer sparade · redo för granskning');
 return summary();
}
function gateChecks(r){return[{id:'trades',label:'Affärer',pass:r.n>=100,value:r.n,rule:'≥ 100'},{id:'pf',label:'PF',pass:r.pf>=1.2,value:Number(r.pf||0).toFixed(2),rule:'≥ 1.20'},{id:'dd',label:'DD',pass:Math.abs(r.dd)<=.12,value:(Math.abs(r.dd||0)*100).toFixed(1)+' %',rule:'≤ 12 %'},{id:'oos',label:'OOS-resultat',pass:r.pl>0,value:Number(r.pl||0).toFixed(0),rule:'> 0'},{id:'concentration',label:'Koncentration',pass:r.maxSymbolGrossProfitShare<=.4,value:(Number(r.maxSymbolGrossProfitShare||0)*100).toFixed(1)+' %',rule:'≤ 40 %'},{id:'folds',label:'Positiva folds',pass:r.positiveFolds>=3,value:(r.positiveFolds||0)+'/4',rule:'≥ 3/4'}]}
function summary(){const x=load();if(!x||!FAMILIES.every(f=>x.familyResults?.[f]))return null;const families=FAMILIES.map(f=>{const z=x.familyResults[f],r=z.best.oos,checks=gateChecks(r);return{family:f,status:z.status,trials:z.trials,params:z.best.params,score:z.best.score,oos:r,checks,failReasons:checks.filter(c=>!c.pass).map(c=>`${c.label}: ${c.value} (krav ${c.rule})`),evidence:z.evidence}}),eligible=families.filter(f=>f.status==='PASS'&&f.checks.every(c=>c.pass));return{schema:'LINA-GEN4-RESEARCH-SUMMARY-1',release:VERSION,planHash:PLAN_HASH,runnerSpecHash:RUNNER_SPEC_HASH,observedHistory:'2020-01-01 → 2024-12-31',tradeEnabled:false,families,eligibleCount:eligible.length,eligibleFamilies:eligible.map(x=>x.family),decision:eligible.length?'CANDIDATE_SELECTION_AVAILABLE':'NO_CANDIDATE_FOR_FORWARD',forwardOpened:false}}
async function freezeSummary(){
 // V0.2.65: freeze from the exact already-observed local snapshot. Do not rerun research.
 let x=load();
 if(x?.summaryFreeze?.frozen)return x.summaryFreeze;
 const missing=FAMILIES.filter(f=>!x?.familyResults?.[f]);
 if(missing.length)throw Error('BLOCKERAD: sparad Gen4-evidens saknas för: '+missing.join(', '));
 const families=FAMILIES.map(f=>{const z=x.familyResults[f],r=z?.best?.oos;if(!r)throw Error('BLOCKERAD: ofullständig sparad evidens för '+f);const checks=gateChecks(r);return{family:f,status:z.status,trials:z.trials,params:z.best.params,score:z.best.score,oos:r,checks,failReasons:checks.filter(c=>!c.pass).map(c=>`${c.label}: ${c.value} (krav ${c.rule})`),evidence:z.evidence}});
 const eligible=families.filter(f=>f.status==='PASS'&&f.checks.every(c=>c.pass));
 const sm={schema:'LINA-GEN4-RESEARCH-SUMMARY-1',release:VERSION,planHash:PLAN_HASH,runnerSpecHash:RUNNER_SPEC_HASH,observedHistory:'2020-01-01 → 2024-12-31',tradeEnabled:false,families,eligibleCount:eligible.length,eligibleFamilies:eligible.map(q=>q.family),decision:eligible.length?'CANDIDATE_SELECTION_AVAILABLE':'NO_CANDIDATE_FOR_FORWARD',forwardOpened:false};
 const at=new Date().toISOString(),artifact={...sm,createdAt:at,immutable:true,note:'Observerad Gen4-forskning. Ingen omkörning/rescue. Forward kräver senare separat deterministisk kandidatfrysning.'};
 // Persist the irreversible local freeze BEFORE any async GitHub work can race with state.
 x.summaryFreeze={frozen:true,frozenAt:at,decision:sm.decision,eligibleCount:sm.eligibleCount,eligibleFamilies:sm.eligibleFamilies,evidence:{status:'LOKALT FRYST · VÄNTAR PÅ GITHUB'},sourceStatus:x.status,allFourFamiliesConfirmed:true};
 x.status=sm.eligibleCount?'GEN4_RESEARCH_FROZEN_CANDIDATE_SELECTION_AVAILABLE':'GEN4_RESEARCH_COMPLETE_NO_CANDIDATE';x.forwardOpened=false;save(x);
 let ev=x.summaryFreeze.evidence,E=window.LinaEvidence;
 if(E?.stage&&E?.approveAndSync){const name=`LINAS_GEN4_RESEARCH_SUMMARY_${at.slice(0,10)}.json`,item=E.stage(name,JSON.stringify(artifact,null,2),'application/json','Lina Gen4');if(item?.id)try{const r=await E.approveAndSync(item.id);ev={status:r?.status||'FROZEN',name,githubPath:r?.githubPath||null,githubCommit:r?.githubCommit||null}}catch(e){ev={status:'FROZEN · VÄNTAR PÅ SYNK',syncError:String(e?.message||e)}}}
 // Merge evidence status only; never replace the observed family snapshot.
 x=load()||x;x.summaryFreeze=x.summaryFreeze||{frozen:true,frozenAt:at,decision:sm.decision,eligibleCount:sm.eligibleCount,eligibleFamilies:sm.eligibleFamilies};x.summaryFreeze.evidence=ev;x.summaryFreeze.allFourFamiliesConfirmed=true;x.status=sm.eligibleCount?'GEN4_RESEARCH_FROZEN_CANDIDATE_SELECTION_AVAILABLE':'GEN4_RESEARCH_COMPLETE_NO_CANDIDATE';x.forwardOpened=false;save(x);return x.summaryFreeze
}
window.LinaGen4Engine={VERSION,PLAN_HASH,RUNNER_SPEC_HASH,SPEC,FOLDS,FAMILIES,load,init,lockRunnerSpec,verifyEngine,preflight,runFamily,runAll,recoverObservedEvidence,gateChecks,summary,freezeSummary};
})();
