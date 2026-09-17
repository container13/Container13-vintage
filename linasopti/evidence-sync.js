(function(){
'use strict';
const API='https://linas-opti-api.mangaj73.workers.dev', KEY='lina_clean_evidence_queue_v1', RELEASE='V0.2.53';
function now(){return new Date().toISOString()}
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{"items":[]}')}catch{return {items:[]}}}
function save(x){x.updatedAt=now();localStorage.setItem(KEY,JSON.stringify(x));return x}
function idFor(name){return name.replace(/[^A-Za-z0-9._-]+/g,'_')}
function stage(name,content,mime='text/plain',source='Lina'){if(typeof content!=='string'||!name)return null;let q=load(),id=idFor(name),old=q.items.find(x=>x.id===id);if(old?.status&&String(old.status).startsWith('FROZEN'))return old;const item={id,name,mime,source,status:'PRELIMINÄR',createdAt:old?.createdAt||now(),updatedAt:now(),content};q.items=q.items.filter(x=>x.id!==id);q.items.push(item);save(q);document.dispatchEvent(new CustomEvent('lina:evidence-changed'));return item;}
async function sha256(s){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
async function approve(id){let q=load(),x=q.items.find(v=>v.id===id);if(!x||x.status!=='PRELIMINÄR')throw new Error('Rapporten är inte preliminär');x.sha256=await sha256(x.content);x.status='FROZEN';x.approvedAt=now();x.updatedAt=x.approvedAt;save(q);document.dispatchEvent(new CustomEvent('lina:evidence-changed'));return x}
async function syncApproved(){let q=load(),code=sessionStorage.getItem('linasopti_login_code')||'',n=0;if(!code)throw new Error('Lina-session saknas – logga in igen');for(const x of q.items.filter(v=>v.status==='FROZEN'&&v.content)){const r=await fetch(API+'/evidence',{method:'POST',headers:{'Content-Type':'application/json','X-Lina-Login-Code':code},body:JSON.stringify({schema:'LINA-EVIDENCE-1',release:RELEASE,status:'FROZEN',name:x.name,mime:x.mime,source:x.source,approvedAt:x.approvedAt,sha256:x.sha256,content:x.content})}),j=await r.json().catch(()=>({}));if(!r.ok||!j.ok)throw new Error(j.error||('Evidence HTTP '+r.status));x.status='FROZEN · GITHUB ✓';x.githubPath=j.path;x.githubCommit=j.commit||null;x.syncedAt=now();delete x.content;n++;save(q)}return n}

async function approveAndSync(id){
  const x=await approve(id);
  try{await syncApproved();return {...x,status:'FROZEN · GITHUB ✓'}}
  catch(e){document.dispatchEvent(new CustomEvent('lina:evidence-changed'));return {...x,status:'FROZEN · VÄNTAR PÅ SYNK',syncError:String(e?.message||e)}}
}
function sourceStatus(label){const xs=items().filter(x=>x.source===label);if(xs.some(x=>x.status==='FROZEN · GITHUB ✓'))return 'FROZEN · GITHUB ✓';if(xs.some(x=>String(x.status||'').startsWith('FROZEN')))return 'FROZEN · VÄNTAR PÅ SYNK';if(xs.some(x=>x.status==='PRELIMINÄR'))return 'PRELIMINÄR';return null}

async function fetchTextFile(path){
  const r=await fetch(path,{cache:'no-store'});
  if(!r.ok)throw new Error('Permanent evidensfil saknas: '+path+' (HTTP '+r.status+')');
  return await r.text();
}
async function freezeFiles(spec,label){
  if(!spec?.report)throw new Error('Permanent rapportfil saknas i evidensmanifestet');
  const existing=sourceStatus(label);
  if(existing==='FROZEN · GITHUB ✓')return {ok:true,status:existing,already:true};
  if(existing==='FROZEN · VÄNTAR PÅ SYNK'){
    try{await syncApproved();return {ok:true,status:'FROZEN · GITHUB ✓'}}
    catch(e){return {ok:true,status:'FROZEN · VÄNTAR PÅ SYNK',syncError:String(e?.message||e)}}
  }
  const report=await fetchTextFile(spec.report);
  stage(spec.report,report,'text/plain',label);
  const ids=[idFor(spec.report)];
  if(spec.raw){const raw=await fetchTextFile(spec.raw);JSON.parse(raw);stage(spec.raw,raw,'application/json',label);ids.push(idFor(spec.raw))}
  for(const id of ids)await approve(id);
  try{await syncApproved();return {ok:true,status:'FROZEN · GITHUB ✓'}}
  catch(e){return {ok:true,status:'FROZEN · VÄNTAR PÅ SYNK',syncError:String(e?.message||e)}}
}
async function freezeEngine(E,label){
  if(!E||typeof E.report!=='function'||typeof E.load!=='function')throw new Error('Resultatunderlag saknas');
  const data=E.load();if(!data)throw new Error('Inget färdigt resultat finns att frysa');
  const existing=sourceStatus(label);
  if(existing==='FROZEN · GITHUB ✓')return {ok:true,status:existing,already:true};
  if(existing==='FROZEN · VÄNTAR PÅ SYNK'){
    try{await syncApproved();return {ok:true,status:'FROZEN · GITHUB ✓'}}
    catch(e){return {ok:true,status:'FROZEN · VÄNTAR PÅ SYNK',syncError:String(e?.message||e)}}
  }
  const d=new Date().toISOString().slice(0,10);
  const reportName=`LINAS_OPTI_${label}_REPORT_${d}.txt`;
  const rawName=`LINAS_OPTI_${label}_RAW_${d}.json`;
  stage(reportName,E.report(),'text/plain',label);
  stage(rawName,JSON.stringify(data,null,2),'application/json',label);
  await approve(reportName.replace(/[^A-Za-z0-9._-]+/g,'_'));
  await approve(rawName.replace(/[^A-Za-z0-9._-]+/g,'_'));
  try{await syncApproved();return {ok:true,status:'FROZEN · GITHUB ✓'}}
  catch(e){return {ok:true,status:'FROZEN · VÄNTAR PÅ SYNK',syncError:String(e?.message||e)}}
}
function items(){return load().items.slice().sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt)))}
function wrap(E,label){if(!E||E.__evidenceWrapped)return;E.__evidenceWrapped=true;if(typeof E.exportReport==='function'&&typeof E.report==='function'){const old=E.exportReport.bind(E);E.exportReport=function(){const text=E.report(),d=new Date().toISOString().slice(0,10),name=`LINAS_OPTI_${label}_REPORT_${d}.txt`;stage(name,text,'text/plain',label);return old()}}if(typeof E.exportRaw==='function'&&typeof E.load==='function'){const old=E.exportRaw.bind(E);E.exportRaw=function(){const x=E.load();if(x)stage(`LINAS_OPTI_${label}_RAW_${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(x,null,2),'application/json',label);return old()}}}
function install(){wrap(window.LinaG2Engine,'G2');wrap(window.LinaG3Engine,'G3');wrap(window.LinaG4Engine,'G4');wrap(window.LinaG5Engine,'G5');wrap(window.LinaG6Engine,'G6');wrap(window.LinaBatteryEngine,'G7_G12');wrap(window.LinaG2ForwardEngine,'G2_FORWARD');wrap(window.LinaG3ForwardEngine,'G3_FORWARD')}
install();document.addEventListener('lina:unlocked',install);
window.LinaEvidence={stage,approve,approveAndSync,freezeFiles,freezeEngine,syncApproved,items,sourceStatus,install};
})();
