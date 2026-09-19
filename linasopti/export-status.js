(function(){
'use strict';
const PREFIX='lina_clean_';
const EXCLUDE=new Set(['linasopti_unlocked','linasopti_login_code']);
const release=()=>window.LinaVersion?.release||'VERSION_UNAVAILABLE';
function parse(v){try{return JSON.parse(v)}catch{return v}}
function safeDate(d=new Date()){const z=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate())+'_'+z(d.getHours())+z(d.getMinutes())+z(d.getSeconds())}
function compactEvidence(){const xs=window.LinaEvidence?.items?.()||[];return xs.map(x=>({name:x.name,source:x.source,status:x.status,sha256:x.sha256||null,githubPath:x.githubPath||null,githubCommit:x.githubCommit||null,verification:x.verification||null,updatedAt:x.updatedAt||null}))}
function collect(){
 const local={};
 for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!k||!k.startsWith(PREFIX)||EXCLUDE.has(k))continue;const raw=localStorage.getItem(k);if(raw!==null)local[k]=parse(raw)}
 const session={};for(const k of ['lina_sync_status','lina_recovery_report']){const raw=sessionStorage.getItem(k);if(raw!==null)session[k]=parse(raw)}
 let generationEngine=null,robotMaturity=null,integrity=null;
 try{generationEngine=window.LinaGenerationEngine?.fullSnapshot?.()||window.LinaGenerationEngine?.registry?.()||null}catch(e){generationEngine={error:String(e?.message||e)}}
 try{robotMaturity=window.LinaGenerationEngine?.maturity?.()||null}catch(e){robotMaturity={error:String(e?.message||e)}}
 try{integrity=window.LinaGenerationEngine?.integrity?.()||null}catch(e){integrity={ok:false,error:String(e?.message||e)}}
 return {schema:'LINA-STATUS-EXPORT-2',app:'Linas Opti Clean Core',release:release(),generatedAt:new Date().toISOString(),route:window.LinaRouter?.current?.()||location.hash.replace(/^#/,'')||'dashboard',tradeEnabled:false,robotMaturity,integrity,sync:session,evidenceStatus:window.LinaEvidence?.syncStatus?.()||null,evidence:compactEvidence(),generationEngine,localState:local,notes:['Status Export 2.0 använder aktuell runtime-release och aktuell Robotmognadsmodell.','Generation Engine och evidensintegritet ligger först; localState finns kvar för recovery/felsökning.','Inga lösenkoder eller inloggningssessioner exporteras.']};
}
function fullDiagnostics(){const x=collect();x.schema='LINA-FULL-DIAGNOSTICS-2';x.syncDiagnostics=window.LinaEvidence?.diagnostics?.()||null;return x}
function trigger(name,obj){const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),0);return name}
function download(){return trigger(`LINA_STATUS_${release().replace(/\./g,'')}_${safeDate()}.json`,collect())}
function downloadDiagnostics(){return trigger(`LINA_FULL_DIAGNOSTICS_${release().replace(/\./g,'')}_${safeDate()}.json`,fullDiagnostics())}
function downloadObject(prefix,obj){return trigger(`${prefix}_${safeDate()}.json`,obj)}
window.LinaStatusExport={get VERSION(){return release()},collect,fullDiagnostics,download,downloadDiagnostics,downloadObject};
})();
