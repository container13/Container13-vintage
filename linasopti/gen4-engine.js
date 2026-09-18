(function(){
'use strict';
const VERSION='V0.2.61', PLAN_HASH='8d51311d';
const KEY='lina_clean_gen4_engine_v0261';
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
function init(){assertPlan();let x=load()||fresh();if(x.planHash!==PLAN_HASH||x.runnerSpecHash!==RUNNER_SPEC_HASH||x.tradeEnabled!==false||x.forwardOpened===true||x.researchOpened===true)throw Error('BLOCKERAD: Gen4 engine-state bryter mot förregistreringen');return save(x)}
function lockRunnerSpec(){let x=init();if(x.runnerSpecLocked&&x.runnerSpecHash!==RUNNER_SPEC_HASH)throw Error('BLOCKERAD: annat Gen4-runnerspec är redan låst');x.runnerSpecLocked=true;x.runnerSpecLockedAt=x.runnerSpecLockedAt||new Date().toISOString();x.status='RUNNERSPEC_LOCKED_ENGINE_NOT_VERIFIED';return save(x)}
function verifyEngine(){let x=init();if(!x.runnerSpecLocked)throw Error('Lås Gen4-runnerspec först');const checks=[
 {id:'plan',pass:PLAN_HASH==='8d51311d',text:'Plan 8d51311d'},
 {id:'history',pass:SPEC.historyHardStop==='2024-12-31',text:'Research hard-stop 2024-12-31'},
 {id:'trade',pass:SPEC.tradeEnabled===false&&x.tradeEnabled===false,text:'Handel AV'},
 {id:'forward',pass:x.forwardOpened===false,text:'Forward stängd'},
 {id:'gates',pass:SPEC.selection.maxSingleSymbolGrossProfitShare===.40&&SPEC.selection.minimumOOSTrades===100&&SPEC.selection.profitFactor===1.20&&SPEC.selection.maxDrawdown===.12&&SPEC.selection.minimumPositiveFolds===3,text:'Gen4 gates matchar låst plan'},
 {id:'families',pass:FAMILIES.length===4,text:'4 förregistrerade familjer'}
 ];
 if(checks.some(c=>!c.pass))throw Error('BLOCKERAD: engine-verifiering misslyckades');x.engineVerified=true;x.engineVerifiedAt=x.engineVerifiedAt||new Date().toISOString();x.status='READY_FOR_RESEARCH_BUILD';x.preflight={at:new Date().toISOString(),checks};return save(x)}
function preflight(){const x=init();return{ok:Boolean(x.runnerSpecLocked&&x.engineVerified),version:VERSION,planHash:PLAN_HASH,runnerSpecHash:RUNNER_SPEC_HASH,runnerSpecLocked:x.runnerSpecLocked,engineVerified:x.engineVerified,status:x.status,history:'2020-2024 OBSERVERAD',hardStop:SPEC.historyHardStop,forward:'SEALED UNTIL FUTURE CANDIDATE FREEZE',tradeEnabled:false,researchOpened:false,families:FAMILIES,checks:x.preflight?.checks||[]}}
window.LinaGen4Engine={VERSION,PLAN_HASH,RUNNER_SPEC_HASH,SPEC,FOLDS,FAMILIES,load,init,lockRunnerSpec,verifyEngine,preflight};
})();
