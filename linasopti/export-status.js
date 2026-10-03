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
function showExportStatus(message,text){
 let box=document.getElementById('lina-export-receipt');if(!box){box=document.createElement('div');box.id='lina-export-receipt';box.setAttribute('role','status');box.style.cssText='position:fixed;bottom:16px;left:16px;right:16px;z-index:10000;background:#fff;border:1px solid #8795a9;padding:14px;border-radius:12px;box-shadow:0 4px 20px #0002;max-height:50vh;overflow:auto';document.body.appendChild(box)}
 box.replaceChildren();const msg=document.createElement('span');msg.textContent=message;box.appendChild(msg);
 if(text!==undefined){const button=document.createElement('button');button.textContent='Kopiera rapporttext';box.appendChild(button);button.onclick=async()=>{try{await navigator.clipboard.writeText(text);showExportStatus('Rapporttext kopierad · klistra in med Ctrl+V / ⌘V')}catch{const area=document.createElement('textarea');area.value=text;area.readOnly=true;area.style.width='100%';box.appendChild(area);area.focus();area.select();msg.textContent='Tryck Ctrl+C / ⌘C, sedan Ctrl+V / ⌘V här i chatten';button.remove()}}}
 const close=document.createElement('button');close.textContent='Stäng';close.onclick=()=>box.remove();box.appendChild(close);
}
function saveText(name,text,type){const blob=new Blob([text],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function copyText(text){try{return navigator.clipboard?.writeText?Promise.resolve(navigator.clipboard.writeText(text)):Promise.reject(Error('Urklipp saknas'))}catch(e){return Promise.reject(e)}}
function downloadText(name,text,type='text/plain;charset=utf-8'){
 text=String(text);const copying=copyText(text);saveText(name,text,type);
 copying.then(()=>showExportStatus('Rapport sparad och text kopierad · Ctrl+V / ⌘V för att klistra in'),()=>showExportStatus('Rapport sparad · automatisk kopiering nekades',text));return name;
}
function trigger(name,obj){return downloadText(name,JSON.stringify(obj,null,2),'application/json;charset=utf-8')}
function downloadObjectAsync(prefix,makeObject){
 const name=`${prefix}_${safeDate()}.json`,text=Promise.resolve().then(makeObject).then(obj=>JSON.stringify(obj,null,2));
 let copying;
 try{if(navigator.clipboard?.write&&window.ClipboardItem)copying=navigator.clipboard.write([new window.ClipboardItem({'text/plain':text.then(t=>new Blob([t],{type:'text/plain'}))})]);else copying=Promise.reject(Error('Asynkront urklipp saknas'))}catch(e){copying=Promise.reject(e)}
 const outcome=Promise.resolve(copying).then(()=>true,()=>false);
 return text.then(async t=>{saveText(name,t,'application/json;charset=utf-8');if(await outcome)showExportStatus('Rapport sparad och text kopierad · Ctrl+V / ⌘V för att klistra in');else showExportStatus('Rapport sparad · tryck Kopiera rapporttext',t);return name},e=>{showExportStatus('Rapportexport misslyckades: '+String(e.message||e));throw e});
}
function download(){return trigger(`LINA_STATUS_${release().replace(/\./g,'')}_${safeDate()}.json`,collect())}
function downloadDiagnostics(){return trigger(`LINA_FULL_DIAGNOSTICS_${release().replace(/\./g,'')}_${safeDate()}.json`,fullDiagnostics())}
function downloadObject(prefix,obj){return trigger(`${prefix}_${safeDate()}.json`,obj)}
window.LinaStatusExport={get VERSION(){return release()},collect,fullDiagnostics,download,downloadDiagnostics,downloadObject,downloadText,downloadObjectAsync};
})();
