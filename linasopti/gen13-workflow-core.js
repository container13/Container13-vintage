(function(global){
'use strict';
const E=global.LinaGen13Engine,KEY='lina_generation_engine_v0273',DB='lina_gen13_checkpoint_v1';
const DATA_SHA='cb84e436a0527b44262949994306dcb85eaf5f10ad88fc7906d443833cc6589c';
let busy=false;const now=()=>new Date().toISOString();
function load(){const x=JSON.parse(global.localStorage.getItem(KEY)||'null');const g12=x?.gen12;if(g12?.state!=='GEN12_COMPLETE_NO_CANDIDATE'||!g12?.summaryFreeze?.frozen||Object.keys(g12?.checkpoints||{}).length!==8)throw Error('Gen12 måste vara permanent fryst NO_CANDIDATE 8/8');if(x.tradeEnabled===true||x.gen13?.tradeEnabled===true||x.gen13?.forwardOpened===true)throw Error('Handel/Forward måste vara AV');return x}
function initial(){return{schema:'LINA-GEN13-STATE-1',humanApproved:true,planLocked:true,runnerSpecLocked:true,runnerSpecSha256:E.SPEC_SHA256,engineVerified:true,state:'READY_FOR_START_RECEIPT',checkpoints:{},observationAttempts:{},tradeEnabled:false,forwardOpened:false}}
function state(){const x=load();return x.gen13||initial()}
function save(g){const x=load();x.gen13={...g,tradeEnabled:false,forwardOpened:false};x.tradeEnabled=false;x.release=global.LinaVersion.release;x.savedAt=now();global.localStorage.setItem(KEY,JSON.stringify(x));global.LinaGitHubSync?.queueSync?.();return x.gen13}
function assertContract(g){if(!g.humanApproved||!g.planLocked||!g.runnerSpecLocked||!g.engineVerified||g.runnerSpecSha256!==E.SPEC_SHA256)throw Error('Gen13 pre-research-kontrakt ej verifierat');if(!global.LinaReleaseGate?.allowResearch?.())throw Error('Gen13 STOPP: giltigt Release Gate PASS-kvitto saknas')}
function store(){return new Promise((resolve,reject)=>{const q=global.indexedDB.open(DB,1);q.onupgradeneeded=()=>q.result.createObjectStore('records');q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error)})}
async function get(k){const d=await store();return new Promise((resolve,reject)=>{const tx=d.transaction('records'),q=tx.objectStore('records').get(k);q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);tx.oncomplete=()=>d.close()})}
async function put(k,v){const d=await store();return new Promise((resolve,reject)=>{const tx=d.transaction('records','readwrite');tx.objectStore('records').put(v,k);tx.oncomplete=()=>{d.close();resolve()};tx.onerror=()=>reject(tx.error)})}
async function digest(v){const b=await global.crypto.subtle.digest('SHA-256',new TextEncoder().encode(E.canonical(v)));return[...new Uint8Array(b)].map(n=>n.toString(16).padStart(2,'0')).join('')}
async function shaText(t){const b=await global.crypto.subtle.digest('SHA-256',new TextEncoder().encode(t));return[...new Uint8Array(b)].map(n=>n.toString(16).padStart(2,'0')).join('')}
function report(t){global.document.dispatchEvent(new CustomEvent('lina:gen13progress',{detail:{text:t}}))}
async function single(fn){if(busy)throw Error('Gen13-operation pågår redan');if(!global.navigator?.locks?.request)throw Error('Gen13 STOPP: säkert cross-tab-lås saknas');busy=true;try{return await global.navigator.locks.request('lina-gen13-research-v1',{mode:'exclusive',ifAvailable:true},async lock=>{if(!lock)throw Error('Gen13-operation pågår redan i annan vy/flik');return await fn()})}finally{busy=false}}
global.LinaGen13WorkflowCore=Object.freeze({E,DATA_SHA,now,state,save,assertContract,get,put,digest,shaText,report,single});
})(window);
