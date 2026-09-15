(function(){
'use strict';
const API='https://linas-opti-api.mangaj73.workers.dev', KEY='lina_clean_evidence_queue_v1', RELEASE='V0.2.35';
function now(){return new Date().toISOString()}
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{"items":[]}')}catch{return {items:[]}}}
function save(x){x.updatedAt=now();localStorage.setItem(KEY,JSON.stringify(x));return x}
function idFor(name){return name.replace(/[^A-Za-z0-9._-]+/g,'_')}
function stage(name,content,mime='text/plain',source='Lina'){if(typeof content!=='string'||!name)return;let q=load(),id=idFor(name),old=q.items.find(x=>x.id===id);if(old?.status==='FROZEN')return;const item={id,name,mime,source,status:'PRELIMINÄR',createdAt:old?.createdAt||now(),updatedAt:now(),content};q.items=q.items.filter(x=>x.id!==id);q.items.push(item);save(q);document.dispatchEvent(new CustomEvent('lina:evidence-changed'));}
async function sha256(s){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
async function approve(id){let q=load(),x=q.items.find(v=>v.id===id);if(!x||x.status!=='PRELIMINÄR')throw new Error('Rapporten är inte preliminär');x.sha256=await sha256(x.content);x.status='FROZEN';x.approvedAt=now();x.updatedAt=x.approvedAt;save(q);document.dispatchEvent(new CustomEvent('lina:evidence-changed'));return x}
async function syncApproved(){let q=load(),code=sessionStorage.getItem('linasopti_login_code')||'',n=0;if(!code)throw new Error('Lina-session saknas – logga in igen');for(const x of q.items.filter(v=>v.status==='FROZEN'&&v.content)){const r=await fetch(API+'/evidence',{method:'POST',headers:{'Content-Type':'application/json','X-Lina-Login-Code':code},body:JSON.stringify({schema:'LINA-EVIDENCE-1',release:RELEASE,status:'FROZEN',name:x.name,mime:x.mime,source:x.source,approvedAt:x.approvedAt,sha256:x.sha256,content:x.content})}),j=await r.json().catch(()=>({}));if(!r.ok||!j.ok)throw new Error(j.error||('Evidence HTTP '+r.status));x.status='FROZEN · GITHUB ✓';x.githubPath=j.path;x.githubCommit=j.commit||null;x.syncedAt=now();delete x.content;n++;save(q)}return n}
function items(){return load().items.slice().sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt)))}
function wrap(E,label){if(!E||E.__evidenceWrapped)return;E.__evidenceWrapped=true;if(typeof E.exportReport==='function'&&typeof E.report==='function'){const old=E.exportReport.bind(E);E.exportReport=function(){const text=E.report(),d=new Date().toISOString().slice(0,10),name=`LINAS_OPTI_${label}_REPORT_${d}.txt`;stage(name,text,'text/plain',label);return old()}}if(typeof E.exportRaw==='function'&&typeof E.load==='function'){const old=E.exportRaw.bind(E);E.exportRaw=function(){const x=E.load();if(x)stage(`LINAS_OPTI_${label}_RAW_${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(x,null,2),'application/json',label);return old()}}}
function install(){wrap(window.LinaG2Engine,'G2');wrap(window.LinaG3Engine,'G3');wrap(window.LinaG4Engine,'G4');wrap(window.LinaG5Engine,'G5');wrap(window.LinaG6Engine,'G6');wrap(window.LinaBatteryEngine,'G7_G12');wrap(window.LinaG2ForwardEngine,'G2_FORWARD');wrap(window.LinaG3ForwardEngine,'G3_FORWARD')}
install();document.addEventListener('lina:unlocked',install);
window.LinaEvidence={stage,approve,syncApproved,items,install};
})();
