(function(global){
'use strict';
const E=global.LinaGen9Engine,KEY='lina_generation_engine_v0273',DB='lina_gen9_checkpoint_v1';
let busy=false;
const copy=x=>JSON.parse(JSON.stringify(x)),now=()=>new Date().toISOString();
function load(){const x=JSON.parse(global.localStorage.getItem(KEY)||'null');if(!x?.gen8?.summaryFreeze?.frozen||x.tradeEnabled!==false)throw Error('Gen8 ska vara fryst och Handel AV');if(x.gen9?.forwardOpened)throw Error('Gen9 Forward måste vara AV');return x}
function state(){return load().gen9||{state:'PLAN_PROPOSAL',planLocked:false,checkpoints:{},tradeEnabled:false,forwardOpened:false}}
function save(g){const x=load();x.gen9=g;x.release=global.LinaVersion.release;x.savedAt=now();global.localStorage.setItem(KEY,JSON.stringify(x));global.LinaGitHubSync?.queueSync?.();return g}
function assertContract(g){if(g.specHash!==E.SPEC_HASH||!g.planLocked||!g.runnerSpecLocked)throw Error('Gen9 plan/runnerspec inte låsta för denna specifikation')}
function store(){return new Promise((resolve,reject)=>{const q=global.indexedDB.open(DB,1);q.onupgradeneeded=()=>q.result.createObjectStore('records');q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error)})}
async function get(k){const d=await store();return new Promise((resolve,reject)=>{const tx=d.transaction('records'),q=tx.objectStore('records').get(k);q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);tx.oncomplete=()=>d.close()})}
async function put(k,v){const d=await store();return new Promise((resolve,reject)=>{const tx=d.transaction('records','readwrite');tx.objectStore('records').put(v,k);tx.oncomplete=()=>{d.close();resolve()};tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('Checkpoint abort'))})}
async function digest(v){const b=await global.crypto.subtle.digest('SHA-256',new TextEncoder().encode(E.canonical(v)));return [...new Uint8Array(b)].map(n=>n.toString(16).padStart(2,'0')).join('')}
function report(message){global.document.dispatchEvent(new CustomEvent('lina:gen9progress',{detail:{text:message}}))}
async function single(f){if(busy)throw Error('Gen9-operation pågår redan');busy=true;global.LinaGen9Busy=true;try{return await f()}finally{busy=false;global.LinaGen9Busy=false}}
async function secure(name,content){
 const ev=global.LinaEvidence;if(!ev?.stage||!ev?.approveAndSync)throw Error('Evidence-modul saknas');
 let item=ev.items().find(i=>i.name===name);
 if(!item)item=ev.stage(name,JSON.stringify(content,null,2),'application/json','Lina Gen9');
 if(!item)throw Error('Evidence staging misslyckades');
 if(item.status==='PRELIMINÄR')await ev.approveAndSync(item.id);else if(item.status!=='FROZEN · GITHUB ✓')await ev.syncApproved();
 item=ev.items().find(i=>i.name===name);
 if(item?.status!=='FROZEN · GITHUB ✓'||!item.githubPath)throw Error('Evidens ej GitHub-verifierad: '+name);
 // Existing-file 409 proves existence only, never equality; block rather than adopt unverified content.
 if(item.existingImmutable)throw Error('Befintlig immutable evidens behöver innehållsverifiering: '+name);
 return{status:item.status,name,githubPath:item.githubPath,githubCommit:item.githubCommit||null,sha256:item.sha256||null};
}
async function lockPlan(){return single(async()=>{
 let g=state();if(g.planLocked){assertContract(g);if(g.planEvidence)return g;throw Error('Planlås finns med ofullständig evidens; använd evidensåterupptagning')}
 const stamp=now();g={...g,state:'PLAN_LOCKED_AWAITING_EVIDENCE',planLocked:true,runnerSpecLocked:true,specHash:E.SPEC_HASH,lockedAt:stamp,specSha256:await digest(E.SPEC),spec:copy(E.SPEC),tradeEnabled:false,forwardOpened:false,checkpoints:{}};save(g);
 const content={schema:'LINA-GEN9-PLAN-LOCK-1',approvedAt:stamp,spec:g.spec,specHash:g.specHash,specSha256:g.specSha256,tradeEnabled:false,forwardOpened:false};await put('plan:'+g.specSha256,content);
 g.planEvidence=await secure('LINAS_GEN9_PLAN_'+g.specSha256+'.json',content);g.state='PLAN_LOCKED_DATA_REQUIRED';save(g);return g;
 })}
async function resumePlan(){return single(async()=>{const g=state();assertContract(g);const p=await get('plan:'+g.specSha256);if(!p)throw Error('Exakt plancheckpoint saknas; ingen rekonstruktion');g.planEvidence=await secure('LINAS_GEN9_PLAN_'+g.specSha256+'.json',p);g.state='PLAN_LOCKED_DATA_REQUIRED';return save(g)})}
async function importData(pkg){return single(async()=>{
 const g=state();assertContract(g);if(g.researchOpened||Object.keys(g.checkpoints||{}).length)throw Error('Observerad forskning: data får inte ersättas');if(!g.planEvidence)throw Error('Planens evidens inte verifierad');
 const normalized=await E.validateDataManifest(pkg.manifest,pkg.data);const data=normalized.by;
 if(g.dataManifest&&E.canonical(g.dataManifest)!==E.canonical(pkg.manifest))throw Error('Annan dataset är redan registrerad');
 await put('data:'+pkg.manifest.contentSha256,{manifest:pkg.manifest,data});g.dataManifest=copy(pkg.manifest);g.state='DATA_STAGED_AWAITING_EVIDENCE';save(g);
 g.dataEvidence=await secure('LINAS_GEN9_DATA_'+pkg.manifest.contentSha256+'.json',{schema:'LINA-GEN9-DATA-MANIFEST-1',specHash:E.SPEC_HASH,manifest:pkg.manifest});g.state='READY_FOR_RESEARCH';save(g);return g;
 })}
async function validateCheckpoint(cp,ref){
 if(!cp||cp.key!==ref.key||cp.variant!==ref.variant||cp.year!==ref.year||cp.specHash!==E.SPEC_HASH||!Array.isArray(cp.result?.trades)||!Array.isArray(cp.result?.equity)||!Array.isArray(cp.result?.events)||!cp.result?.oos||await digest(cp.result)!==ref.resultSha256)throw Error('Checkpoint saknas/är trasigt: recovery krävs, ingen rerun');
 return cp;
}
async function run(){return single(async()=>{
 let g=state();assertContract(g);if(g.summaryFreeze?.frozen)throw Error('Gen9 redan fryst');if(!g.planEvidence||!g.dataEvidence)throw Error('Plan och data måste vara verifierade');
 const pkg=await get('data:'+g.dataManifest?.contentSha256);if(!pkg)throw Error('Exakt dataset saknas lokalt');await E.validateDataManifest(pkg.manifest,pkg.data);
 g.researchOpened=true;g.state='RESEARCH_RUNNING';g.automation={status:'RUNNING',lastStep:'UI_CLICK_RECEIVED',attemptAt:now()};save(g);
 try{
 for(const variant of E.SPEC.variants)for(const year of E.SPEC.foldYears){
  g=state();const key=variant+'_'+year,storageKey='fold:'+g.specSha256+':'+g.dataManifest.contentSha256+':'+key;
  report('Gen9 '+key+' · checkpoint/evidens');g.automation.lastStep=key;save(g);
  let ref=g.checkpoints[key],cp=await get(storageKey);
  if(ref){cp=await validateCheckpoint(cp,ref)}else if(cp){
   if(cp.key!==key||cp.specHash!==E.SPEC_HASH||cp.variant!==variant||cp.year!==year||!cp.resultSha256||await digest(cp.result)!==cp.resultSha256)throw Error('Okänt checkpoint: recovery krävs');
   ref={key,variant,year,resultSha256:await digest(cp.result),storageKey,observedAt:cp.observedAt};
  }else{
   if(g.observationAttempts?.[key])throw Error('Observerat/påbörjat steg saknar checkpoint: recovery krävs, ingen rerun');
   g.observationAttempts={...g.observationAttempts,[key]:now()};save(g);
   // The synchronous result is persisted in one committed IndexedDB transaction before continuation.
   const result=E.simulate(pkg.data,variant,year+'-01-01',year+'-12-31');cp={key,variant,year,specHash:E.SPEC_HASH,observedAt:now(),result};cp.resultSha256=await digest(result);await put(storageKey,cp);
   ref={key,variant,year,resultSha256:await digest(result),storageKey,observedAt:cp.observedAt};
  }
  g=state();g.checkpoints[key]=ref;save(g);await validateCheckpoint(cp,ref);
  if(!ref.evidence){const evidence=await secure('LINAS_GEN9_'+g.specSha256+'_'+key+'.json',cp);g=state();g.checkpoints[key]={...ref,evidence};save(g)}
 }
 g=state();const results={};for(const variant of E.SPEC.variants){const folds=[];for(const year of E.SPEC.foldYears){const ref=g.checkpoints[variant+'_'+year];folds.push((await validateCheckpoint(await get(ref.storageKey),ref)).result)}results[variant]=E.aggregate(folds,variant)}
 const summary={schema:'LINA-GEN9-RESEARCH-SUMMARY-1',specHash:g.specHash,specSha256:g.specSha256,dataManifest:g.dataManifest,results,decision:results.B.candidateEligible?'CANDIDATE_REVIEW_REQUIRED':'NO_CANDIDATE',tradeEnabled:false,forwardOpened:false};
 await put('summary:'+g.specSha256,summary);g.summary=summary;g.state='RESEARCH_COMPLETE_REVIEW_REQUIRED';g.automation.status='COMPLETE';save(g);report('Gen9 klar · granska sammanfattning före frysbeslut');return summary;
 }catch(e){g=state();g.automation={...g.automation,status:'STOPPED',lastError:String(e.message||e)};save(g);throw e}
 })}
async function freezeSummary(){return single(async()=>{const g=state();assertContract(g);if(g.state!=='RESEARCH_COMPLETE_REVIEW_REQUIRED'&&!g.summaryFreeze?.frozen)throw Error('Research ej komplett');const sm=await get('summary:'+g.specSha256);if(!sm||E.canonical(sm)!==E.canonical(g.summary))throw Error('Exakt summarycheckpoint saknas');const ev=await secure('LINAS_GEN9_SUMMARY_'+g.specSha256+'.json',sm);g.summaryFreeze={frozen:true,frozenAt:g.summaryFreeze?.frozenAt||now(),evidence:ev};g.state=sm.results.B.candidateEligible?'SUMMARY_FROZEN_CANDIDATE_REVIEW_REQUIRED':'GEN9_COMPLETE_NO_CANDIDATE';return save(g)})}
async function exportResults(){const g=state(),folds={};for(const [key,ref] of Object.entries(g.checkpoints||{}))folds[key]=(await validateCheckpoint(await get(ref.storageKey),ref)).result;return{schema:'LINA-GEN9-RESULTS-EXPORT-1',state:g,folds,tradeEnabled:false,forwardOpened:false}}
function mount(root){
 const section=root.querySelector('[data-gen9-build]');if(!section)return;let g;try{g=state()}catch(e){section.append(' · '+e.message);return}
 const info=document.createElement('p');info.textContent='Status: '+g.state;section.append(info);const controls=document.createElement('div');controls.className='actions';section.append(controls);
 const act=(label,fn)=>{const b=document.createElement('button');b.textContent=label;controls.append(b);b.onclick=async()=>{b.disabled=true;const on=e=>info.textContent=e.detail.text;global.document.addEventListener('lina:gen9progress',on);try{await fn();info.textContent='Klart: '+state().state}catch(e){info.textContent='STOPPAD: '+e.message}finally{b.disabled=false;global.document.removeEventListener('lina:gen9progress',on)}};return b};
 if(!g.planLocked)act('🔒 Godkänn och lås Gen9-plan',()=>{if(!global.confirm('Lås det exporterade Gen9-kontraktet? Detta är permanent och startar inte forskning.'))return;return lockPlan()});
 else if(!g.planEvidence)act('☁ Fortsätt planens evidenssynk',resumePlan);
 if(g.planLocked&&g.planEvidence&&!g.researchOpened){const label=document.createElement('label');label.textContent='Läs verifierat Gen9-datapaket (JSON)';const input=document.createElement('input');input.type='file';input.accept='.json,application/json';label.append(input);section.append(label);input.onchange=async()=>{try{await importData(JSON.parse(await input.files[0].text()));info.textContent='Data verifierad. Öppna Engine igen för körknapp.'}catch(e){info.textContent='DATA STOPPAD: '+e.message}}}
 if(g.dataManifest&&!g.dataEvidence&&!g.researchOpened)act('☁ Fortsätt dataevidens',async()=>{const pkg=await get('data:'+g.dataManifest.contentSha256);if(!pkg)throw Error('Exakt datapaket saknas');return importData(pkg)});
 if(g.dataEvidence&&!g.summaryFreeze?.frozen&&g.state!=='RESEARCH_COMPLETE_REVIEW_REQUIRED')act('▶ Starta / fortsätt Gen9',()=>{if(!global.confirm('Starta det låsta Gen9-experimentet på verifierad observerad historik? Handel och Forward är AV.'))return;return run()});
 if(g.summary&&!g.summaryFreeze?.frozen)act('❄ Godkänn och frys Gen9-sammanfattning',()=>{if(!global.confirm('Har du granskat resultatsexporten och vill frysa sammanfattningen? Ingen kandidat eller Forward startas.'))return;return freezeSummary()});
 const exp=document.createElement('button');exp.textContent='📥 Exportera Gen9-state och resultat';exp.onclick=async()=>{try{global.LinaStatusExport.downloadObject('LINA_GEN9_RESULTS',await exportResults())}catch(e){info.textContent='EXPORT STOPPAD: '+e.message}};root.querySelector('.engine-export-primary')?.append(exp);
 const explanation=document.createElement('p');explanation.textContent='Datapaket kräver dokumenterad källa, justerad OHLC, verifierad kalender/corporate actions och SHA256. Äldre cache är inte automatiskt verifierad data. Ingen kandidat fryses automatiskt.';section.append(explanation);
}
global.LinaGen9Workflow=Object.freeze({state,lockPlan,resumePlan,importData,run,freezeSummary,exportResults,mount,validateCheckpoint});
})(window);
