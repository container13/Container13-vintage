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
function showExportStatus(message,text,name,type='text/plain;charset=utf-8'){
 let box=document.getElementById('lina-export-receipt');if(!box){box=document.createElement('div');box.id='lina-export-receipt';box.setAttribute('role','status');box.style.cssText='position:fixed;bottom:max(16px,env(safe-area-inset-bottom));left:16px;right:16px;z-index:10000;background:#fff;border:1px solid #8795a9;padding:14px;border-radius:12px;box-shadow:0 4px 20px #0002;max-height:55vh;overflow:auto';document.body.appendChild(box)}
 box.replaceChildren();const msg=document.createElement('div');msg.textContent=message;box.appendChild(msg);
 if(text!==undefined){
  const actions=document.createElement('div');actions.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin-top:10px';box.appendChild(actions);
  const copy=document.createElement('button');copy.textContent='📋 Kopiera';actions.appendChild(copy);
  copy.onclick=async()=>{try{await copyText(text);msg.textContent='✓ Hela filinnehållet kopierat · öppna chatten, håll i skrivfältet och välj Klistra in'}catch{const area=document.createElement('textarea');area.value=text;area.readOnly=true;area.style.cssText='width:100%;min-height:120px;margin-top:10px';box.appendChild(area);area.focus();area.select();msg.textContent='Urklipp nekades · texten är markerad. Välj Kopiera och klistra sedan in i chatten.'}};
  if(name){const save=document.createElement('button');save.textContent='⬇ Hämta fil';actions.appendChild(save);save.onclick=()=>saveText(name,text,type)}
 }
 const close=document.createElement('button');close.textContent='Stäng';close.style.marginTop='10px';close.onclick=()=>box.remove();box.appendChild(close);
}
function saveText(name,text,type){const blob=new Blob([text],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function copyText(text){try{return navigator.clipboard?.writeText?Promise.resolve(navigator.clipboard.writeText(text)):Promise.reject(Error('Urklipp saknas'))}catch(e){return Promise.reject(e)}}
function downloadText(name,text,type='text/plain;charset=utf-8'){
 text=String(text);
 copyText(text).then(()=>showExportStatus('✓ Hela filinnehållet kopierat · öppna chatten, håll i skrivfältet och välj Klistra in',text,name,type),()=>showExportStatus('Urklipp nekades · tryck 📋 Kopiera.',text,name,type));
 return name;
}
function trigger(name,obj){return downloadText(name,JSON.stringify(obj,null,2),'application/json;charset=utf-8')}
function downloadObjectAsync(prefix,makeObject){
 const name=`${prefix}_${safeDate()}.json`,text=Promise.resolve().then(makeObject).then(obj=>JSON.stringify(obj,null,2));
 let copying;
 try{if(navigator.clipboard?.write&&window.ClipboardItem)copying=navigator.clipboard.write([new window.ClipboardItem({'text/plain':text.then(t=>new Blob([t],{type:'text/plain'}))})]);else copying=Promise.reject(Error('Asynkront urklipp saknas'))}catch(e){copying=Promise.reject(e)}
 const outcome=Promise.resolve(copying).then(()=>true,()=>false);
 return text.then(async t=>{if(await outcome)showExportStatus('✓ Hela filinnehållet kopierat · öppna chatten, håll i skrivfältet och välj Klistra in',t,name,'application/json;charset=utf-8');else showExportStatus('Filen är klar · tryck 📋 Kopiera för att lägga hela innehållet i urklipp.',t,name,'application/json;charset=utf-8');return name},e=>{showExportStatus('Rapportexport misslyckades: '+String(e.message||e));throw e});
}
async function saveRuntimeReport(name,report){
 const code=sessionStorage.getItem('linasopti_login_code')||'';
 if(!code)throw new Error('Lina-session saknas');
 const r=await fetch('https://linas-opti-api.mangaj73.workers.dev/runtime-report',{method:'POST',headers:{'Content-Type':'application/json','X-Lina-Login-Code':code},body:JSON.stringify({schema:'LINA-RUNTIME-REPORT-1',name,report})});
 const j=await r.json().catch(()=>({}));
 if(!r.ok||!j.ok||j.verified!==true||j.receipt?.schema!=='LINA-GITHUB-COMMIT-RECEIPT-1')throw new Error(j.error||'Runtime-report saknar verifierat GitHub-kvitto');
 return j;
}
async function saveVerified(prefix,makeObject){
 const report=makeObject(),name=String(prefix||'LINA_SUPPORT').toUpperCase().replace(/[^A-Z0-9_-]/g,'_').slice(0,80);
 try{
  showExportStatus('Sparar verifierad rapport till GitHub…');
  const j=await saveRuntimeReport(name,report);
  const summary='✓ Verifierad rapport sparad i GitHub\\n'+j.path+'\\nSHA-256 '+j.receipt.contentSha256+'\\nCommit '+(j.commit||'—');
  showExportStatus(summary,JSON.stringify(report,null,2),null,'application/json;charset=utf-8');
  return j;
 }catch(e){
  const text=JSON.stringify(report,null,2),file=`${name}_${safeDate()}.json`;
  showExportStatus('Automatisk GitHub-rapport stoppades: '+String(e.message||e)+' · reservväg: kopiera eller hämta filen.',text,file,'application/json;charset=utf-8');
  throw e;
 }
}
function download(){return saveVerified('LINA_STATUS',collect)}
function downloadDiagnostics(){return saveVerified('LINA_FULL_DIAGNOSTICS',fullDiagnostics)}
function downloadObject(prefix,obj){return trigger(`${prefix}_${safeDate()}.json`,obj)}
function labelCopyButtons(root=document){
 root.querySelectorAll?.('button').forEach(b=>{if(/^📥?\s*Exportera\b/.test(b.textContent.trim()))b.textContent=b.textContent.replace(/^📥?\s*Exportera/,'📋 Kopiera')});
}
const observer=new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1){labelCopyButtons(n);if(n.matches?.('button'))labelCopyButtons(n.parentElement||document)}})));
window.addEventListener('DOMContentLoaded',()=>{labelCopyButtons();observer.observe(document.body,{childList:true,subtree:true})});
window.LinaStatusExport={get VERSION(){return release()},collect,fullDiagnostics,saveRuntimeReport,saveVerified,download,downloadDiagnostics,downloadObject,downloadText,downloadObjectAsync,labelCopyButtons};
})();
