(function(){
'use strict';
const VERSION='V0.2.45';
const EXPECTED_PLAN_HASH='1d5f8bc1';
const KEY='lina_clean_gen2_engine_v0245';
const WINDOWS=Object.freeze({development:Object.freeze(['2020-01-01','2022-12-31']),validation:Object.freeze(['2023-01-01','2024-12-31'])});
const SEALED_HOLDOUT=Object.freeze(['2025-01-01','2026-09-10']);
const FAMILIES=Object.freeze(['Trend/momentum','Mean reversion','Volatility breakout','Regime ensemble']);
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}}
function save(x){localStorage.setItem(KEY,JSON.stringify(x));return x}
function fresh(){return {schema:'LINA-GEN2-ENGINE-1',version:VERSION,planHash:EXPECTED_PLAN_HASH,tradeEnabled:false,holdoutOpened:false,holdoutResults:null,status:'READY_FOR_DEV_VALIDATION',createdAt:new Date().toISOString(),runs:[],negativeResults:[]}}
function assertPlan(){const L=window.LinaGen2Lab;if(!L)throw new Error('Gen2-planmodulen saknas');if(L.PLAN_HASH!==EXPECTED_PLAN_HASH)throw new Error('BLOCKERAD: Gen2-planhash avviker');const x=L.load();if(!x?.locked||x.planHash!==EXPECTED_PLAN_HASH)throw new Error('Lås och verifiera Generation 2-planen först');return x}
function assertWindow(name,start,end){if(!WINDOWS[name])throw new Error('BLOCKERAD: endast DEV och Validation är tillåtna i V0.2.45');const [a,b]=WINDOWS[name];if(start!==a||end!==b)throw new Error('BLOCKERAD: dataintervall avviker från förregistreringen');if(start>=SEALED_HOLDOUT[0]||end>=SEALED_HOLDOUT[0])throw new Error('BLOCKERAD: holdout är förseglad');return true}
function initialize(){assertPlan();let x=load();if(!x){x=fresh();save(x)}if(x.planHash!==EXPECTED_PLAN_HASH||x.tradeEnabled!==false||x.holdoutOpened!==false||x.holdoutResults!=null)throw new Error('BLOCKERAD: Gen2 engine-state bryter mot låset');return x}
function preflight(){const plan=assertPlan();const x=initialize();assertWindow('development',...WINDOWS.development);assertWindow('validation',...WINDOWS.validation);return {ok:true,version:VERSION,planHash:plan.planHash,lockedAt:plan.lockedAt,allowedWindows:WINDOWS,families:FAMILIES.slice(),holdout:'SEALED · INGEN ÅTKOMST I V0.2.45',tradeEnabled:false,status:x.status}}
function recordRun(meta){assertPlan();if(!meta||!FAMILIES.includes(meta.family))throw new Error('Okänd eller olåst strategifamilj');assertWindow(meta.window,meta.start,meta.end);const x=initialize();const row={at:new Date().toISOString(),family:meta.family,window:meta.window,start:meta.start,end:meta.end,status:meta.status||'RECORDED',summary:String(meta.summary||'')};x.runs.push(row);if(row.status==='FAIL'||row.status==='NEGATIVE')x.negativeResults.push(row);save(x);return row}
function resetRuntime(){localStorage.removeItem(KEY)}
window.LinaGen2Engine={VERSION,EXPECTED_PLAN_HASH,WINDOWS,SEALED_HOLDOUT,FAMILIES,load,initialize,preflight,recordRun,assertWindow,resetRuntime};
})();
