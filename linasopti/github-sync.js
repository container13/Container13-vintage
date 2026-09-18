(function(){
'use strict';
const API='https://linas-opti-api.mangaj73.workers.dev', RELEASE='V0.2.62';
const EXCLUDE=new Set(['lina_clean_core_state_v0011','lina_clean_swing_g4_universe_result_v0213']);
const MAX_ENTRY=400000, MAX_PACKAGE=1500000;
function code(){return sessionStorage.getItem('linasopti_login_code')||''}
function eligible(k){return k.startsWith('lina_clean_')&&!EXCLUDE.has(k)}
function stamp(raw){try{const x=JSON.parse(raw);return String(x?.savedAt||x?.lastRefreshAt||x?.updatedAt||x?.lockedAt||x?.createdAt||'')}catch{return ''}}
function collect(){const entries={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!eligible(k))continue;const v=localStorage.getItem(k);if(v==null||v.length>MAX_ENTRY)continue;entries[k]={value:v,stamp:stamp(v)}}const p={schema:'LINA-APP-SYNC-1',release:RELEASE,tradeEnabled:false,exportedAt:new Date().toISOString(),entries};if(JSON.stringify(p).length>MAX_PACKAGE)throw new Error('Linas kompakta synkpaket är för stort');return p}
function merge(local,remote){const out={...(remote?.entries||{})};for(const [k,l] of Object.entries(local.entries||{})){const r=out[k];if(!r){out[k]=l;continue}if(r.value===l.value)continue;if(l.stamp&&r.stamp){if(l.stamp>r.stamp)out[k]=l;else if(l.stamp===r.stamp)throw new Error('Synkkonflikt: '+k);continue}throw new Error('Synkkonflikt utan tidsstämpel: '+k)}return {schema:'LINA-APP-SYNC-1',release:RELEASE,tradeEnabled:false,exportedAt:new Date().toISOString(),entries:out}}
function apply(p){for(const [k,x] of Object.entries(p?.entries||{})){if(eligible(k)&&typeof x?.value==='string'&&x.value.length<=MAX_ENTRY)localStorage.setItem(k,x.value)}}
function localInventory(){
  const entries={};
  for(let i=0;i<localStorage.length;i++){
    const k=localStorage.key(i); if(!eligible(k))continue;
    const v=localStorage.getItem(k); if(v==null||v.length>MAX_ENTRY)continue;
    entries[k]={value:v,stamp:stamp(v)};
  }
  return entries;
}
function recoveryPlan(localEntries,remoteState){
  const remote=remoteState?.entries||{}, unique=[],same=[],conflicts=[];
  for(const [k,l] of Object.entries(localEntries||{})){
    const r=remote[k];
    if(!r){unique.push(k);continue}
    if(r.value===l.value){same.push(k);continue}
    conflicts.push({key:k,localStamp:l.stamp||'',remoteStamp:r.stamp||''});
  }
  return {scannedAt:new Date().toISOString(),localCount:Object.keys(localEntries||{}).length,remoteCount:Object.keys(remote).length,unique,same,conflicts};
}
function safeRecoveryMerge(local,remote){
  // GitHub wins every conflict. Only keys missing entirely on GitHub may be recovered from this computer.
  const out={...(remote?.entries||{})};
  for(const [k,l] of Object.entries(local.entries||{})) if(!out[k]) out[k]=l;
  return {schema:'LINA-APP-SYNC-1',release:RELEASE,tradeEnabled:false,exportedAt:new Date().toISOString(),entries:out};
}
async function get(){const r=await fetch(API+'/app-state',{cache:'no-store'}),j=await r.json().catch(()=>({}));if(!r.ok||!j.ok)throw new Error(j.error||('HTTP '+r.status));return j}
async function put(p){const c=code();if(!c)throw new Error('Lina-session saknas – logga in igen');const r=await fetch(API+'/app-state',{method:'POST',headers:{'Content-Type':'application/json','X-Lina-Login-Code':c},body:JSON.stringify(p)}),j=await r.json().catch(()=>({}));if(!r.ok||!j.ok)throw new Error(j.error||('HTTP '+r.status));return j}
async function syncAll(){// Forward har egen strikt merge och är en del av helsynken.
  if(window.LinaForwardCenter){await window.LinaForwardCenter.remotePull();await window.LinaForwardCenter.remotePush()}
  const local=collect(), remote=await get(), merged=merge(local,remote.state||null);const wr=await put(merged);apply(wr.state||merged);const evidence=window.LinaEvidence?await window.LinaEvidence.syncApproved():0;return {ok:true,keys:Object.keys((wr.state||merged).entries||{}).length,evidence}}
async function bootstrap(progress){
  const step=(name,detail)=>{try{progress?.(name,detail)}catch{}};
  step('local','Inventerar lokalt Lina-state…');
  const localEntries=localInventory();
  step('github','Hämtar verifierat state från GitHub…');
  const remote=await get();
  const recovery=recoveryPlan(localEntries,remote?.state||null);
  // Canonical rule: GitHub wins conflicts. Local state may only fill keys GitHub does not have.
  step('compare',`Jämför ${recovery.localCount} lokala och ${recovery.remoteCount} GitHub-poster…`);
  const local=collect(), merged=safeRecoveryMerge(local,remote?.state||null);
  if(remote?.state?.entries) apply(remote.state);
  step('recover',recovery.unique.length?`Bevarar ${recovery.unique.length} unika lokala poster…`:'Inga unika lokala poster att rädda.');
  const wr=await put(merged); apply(wr.state||merged);
  step('evidence','Verifierar fryst evidens…');
  const evidence=window.LinaEvidence?await window.LinaEvidence.syncApproved():0;
  const report={...recovery,recovered:recovery.unique,conflictPolicy:'GITHUB_CANONICAL',release:RELEASE};
  sessionStorage.setItem('lina_recovery_report',JSON.stringify(report));
  sessionStorage.setItem('lina_sync_status',JSON.stringify({ok:true,at:new Date().toISOString(),keys:Object.keys((wr.state||merged).entries||{}).length,evidence,recovered:recovery.unique.length,conflicts:recovery.conflicts.length}));
  step('ready','GitHub synkad ✓ · State återställt ✓ · Redo');
  return {ok:true,restored:Boolean(remote?.state),keys:Object.keys((wr.state||merged).entries||{}).length,evidence,recovery};
}
let autoTimer=null,autoBusy=false;
function queueSync(){
  clearTimeout(autoTimer);autoTimer=setTimeout(async()=>{if(autoBusy||!code())return;autoBusy=true;try{await syncAll();document.dispatchEvent(new CustomEvent('lina:autosync-ok'))}catch(e){console.warn('Lina autosync stoppad:',e);document.dispatchEvent(new CustomEvent('lina:autosync-fail',{detail:{message:String(e?.message||e)}}))}finally{autoBusy=false}},700);
}
document.addEventListener('lina:gen2change',queueSync);
document.addEventListener('lina:evidence-changed',queueSync);
window.LinaGitHubSync={syncAll,collect,get,bootstrap,queueSync,localInventory,recoveryPlan};
})();
