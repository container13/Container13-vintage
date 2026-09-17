(function(){
'use strict';
const VERSION='V0.2.52';
const PLAN_VERSION='V0.2.44';
const KEY='lina_clean_gen2_plan_v0246';
const PREV_KEY='lina_clean_gen2_plan_v0245';
const LEGACY_KEY='lina_clean_gen2_plan_v0244';
const EXPECTED_PLAN_HASH='1d5f8bc1';
const PLAN={
  schema:'LINA-GEN2-RESEARCH-PLAN-1',version:PLAN_VERSION,name:'Lina Generation 2',tradeEnabled:false,
  purpose:'Sök efter väsentligt bättre riskjusterad avkastning än originalspåret utan att ändra eller rädda G2/G3.',
  data:{development:['2020-01-01','2022-12-31'],validation:['2023-01-01','2024-12-31'],sealedHoldout:['2025-01-01','2026-09-10'],realForward:'startar först efter kandidatfrysning'},
  rules:[
    'Original G2/G3 och Real Forward är kontrollspår och får inte ändras.',
    'Holdout 2025-01-01 → 2026-09-10 får inte användas för ranking, tuning eller rescue.',
    'Forskningsfamiljer och urvalsregel låses före första sökresultat.',
    'Ingen parameter- eller symboländring efter att holdout öppnats.',
    'FAIL, negativa familjer och testantal bevaras permanent.',
    'En vinnare måste först klara utveckling + validation; därefter öppnas holdout exakt en gång.',
    'God historik höjer inte robotmognad automatiskt; oberoende Real Forward väger högst.'
  ],
  families:[
    ['Trend/momentum','breakout + relativ styrka + trendregim'],
    ['Mean reversion','översåld rekyl i positiv långtrend'],
    ['Volatility breakout','range/ATR-expansion med risknormalisering'],
    ['Regime ensemble','flera enkla strategier, viktning bestämd före holdout']
  ],
  selection:{primary:'riskjusterad robusthet, inte högsta P/L',minimumTrades:80,maxDrawdown:0.12,profitFactor:1.20,positiveValidation:true,concentrationGuard:true},
  next:'Implementera datalås + runners för de fyra familjerna i nästa forskningsrelease.'
};
function hash(obj){const s=JSON.stringify(obj);let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(16).padStart(8,'0')}
const PLAN_HASH=hash(PLAN);
if(PLAN_HASH!==EXPECTED_PLAN_HASH)throw new Error('GEN2 PLAN HASH MISMATCH: '+PLAN_HASH);
function read(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch{return null}}
function load(){return read(KEY)||read(PREV_KEY)||read(LEGACY_KEY)}
function lock(){let old=load();if(old?.locked){if(old.planHash!==EXPECTED_PLAN_HASH)throw new Error('BLOCKERAD: befintligt planlås har fel hash');const migrated={...old,schema:'LINA-GEN2-PLAN-LOCK-2',release:VERSION,planHash:EXPECTED_PLAN_HASH,verified:true,verifiedAt:new Date().toISOString(),holdoutOpened:false};localStorage.setItem(KEY,JSON.stringify(migrated));return migrated}const x={...PLAN,schema:'LINA-GEN2-PLAN-LOCK-2',release:VERSION,planHash:EXPECTED_PLAN_HASH,locked:true,lockedAt:new Date().toISOString(),verified:true,verifiedAt:new Date().toISOString(),holdoutOpened:false,resultOpened:false};localStorage.setItem(KEY,JSON.stringify(x));return x}
function verify(){const x=load();return {ok:Boolean(x?.locked&&x?.planHash===EXPECTED_PLAN_HASH&&PLAN_HASH===EXPECTED_PLAN_HASH&&x?.holdoutOpened!==true),planHash:PLAN_HASH,lockedAt:x?.lockedAt||null,holdoutOpened:Boolean(x?.holdoutOpened)}}

const DECISION_KEY='lina_clean_gen2_preholdout_decision_v0252';
function decisionLoad(){try{return JSON.parse(localStorage.getItem(DECISION_KEY)||'null')}catch{return null}}
function preholdoutPackage(es,decision){
  const families=PLAN.families.map(([family])=>{const z=es?.familyResults?.[family],a=auditFamily(z);return {family,status:z?.status||'MISSING',trials:Number(z?.trials)||0,best:z?.best||null,audit:a?{totalTrades:a.total,failed:a.failed}:null,variantDetailCompleteness:z?.variants?.length===z?.trials?'COMPLETE':'TOP_ONLY'}});
  return {schema:'LINA-GEN2-PREHOLDOUT-EVIDENCE-1',release:VERSION,createdAt:new Date().toISOString(),planHash:EXPECTED_PLAN_HASH,runnerSpecHash:window.LinaGen2Engine?.RUNNER_SPEC_HASH||null,tradeEnabled:false,holdout:'SEALED',windows:{development:PLAN.data.development,validation:PLAN.data.validation,sealedHoldout:PLAN.data.sealedHoldout},registeredTrials:families.reduce((n,x)=>n+x.trials,0),families,historicalGap:{release:'V0.2.49',missingNonTopVariantDetails:11,policy:'PRESERVE_AS_DOCUMENTED_GAP_NO_RERUN_NO_RECONSTRUCTION',reason:'De 11 icke-topprankade variantdetaljerna sparades inte permanent vid originalkörningen. De rekonstrueras eller körs inte om efter att resultat har observerats.'},decision,candidateFreeze:'NOT_PERFORMED',holdoutOpened:false};
}
async function lockGapDecision(es){
  if(decisionLoad())return decisionLoad();
  const decision={schema:'LINA-GEN2-EVIDENCE-GAP-DECISION-1',release:VERSION,locked:true,lockedAt:new Date().toISOString(),decision:'ACCEPT_DOCUMENTED_HISTORICAL_GAP',policy:'NO_RERUN_NO_RECONSTRUCTION',missingVariantDetails:11,holdout:'SEALED'};
  localStorage.setItem(DECISION_KEY,JSON.stringify(decision));
  const pkg=preholdoutPackage(es,decision),E=window.LinaEvidence;
  let sync={status:'LOKALT FRYST · EVIDENCE-MODUL SAKNAS'};
  if(E?.stage&&E?.approveAndSync){
    const name=`LINAS_GEN2_PREHOLDOUT_EVIDENCE_V0252_${pkg.createdAt.slice(0,10)}.json`;
    try{const item=E.stage(name,JSON.stringify(pkg,null,2),'application/json','Lina Gen2');if(item?.id){const r=await E.approveAndSync(item.id);sync={status:r?.status||'FROZEN',name,githubPath:r?.githubPath||null,githubCommit:r?.githubCommit||null}}}catch(e){sync={status:'FROZEN · VÄNTAR PÅ SYNK',syncError:String(e?.message||e)}}
  }
  const stored={...decision,evidence:sync};localStorage.setItem(DECISION_KEY,JSON.stringify(stored));return stored;
}

function auditFamily(z){
  if(!z?.best)return null;
  const d=z.best.dev||{},v=z.best.validation||{};
  const total=(Number(d.n)||0)+(Number(v.n)||0);
  const checks={
    trades:{ok:total>=80,text:`Affärer ${total}/80`},
    pf:{ok:(Number(v.pf)||0)>=1.20,text:`Validation PF ${Number(v.pf||0).toFixed(2)}/1.20`},
    dd:{ok:Math.abs(Number(v.dd)||0)<=0.12,text:`DD ${(100*Math.abs(Number(v.dd)||0)).toFixed(1)}%/12.0%`},
    positive:{ok:(Number(v.pl)||0)>0,text:`Validation P/L ${Number(v.pl||0).toFixed(0)} > 0`},
    concentration:{ok:(Number(v.maxSymbolGrossProfitShare)||1)<=0.40,text:`Koncentration ${(100*(Number(v.maxSymbolGrossProfitShare)||1)).toFixed(1)}%/40.0%`}
  };
  const failed=Object.values(checks).filter(x=>!x.ok).map(x=>x.text);
  return {d,v,total,checks,failed};
}
async function repairFrozenEvidence(){
  const d=decisionLoad(),E=window.LinaEvidence;
  if(!d)throw new Error('Pre-holdout-beslut saknas');
  if(!E)throw new Error('Evidence-modulen är inte laddad');
  const items=E.items?.()||[];
  let item=items.find(x=>x.source==='Lina Gen2'&&String(x.name||'').includes('GEN2_PREHOLDOUT'));
  if(!item){
    const es=window.LinaGen2Engine?.load?.();
    const pkg=preholdoutPackage(es,d);
    const name=`LINAS_OPTI_GEN2_PREHOLDOUT_EVIDENCE_V0252_${new Date().toISOString().slice(0,10)}.json`;
    item=E.stage(name,JSON.stringify(pkg,null,2),'application/json','Lina Gen2');
  }
  let r;
  if(item?.status==='PRELIMINÄR') r=await E.approveAndSync(item.id);
  else if(String(item?.status||'').startsWith('FROZEN')&&!String(item.status).includes('GITHUB')){
    try{await E.syncApproved();r={...item,status:'FROZEN · GITHUB ✓'}}catch(e){r={...item,status:'FROZEN · VÄNTAR PÅ SYNK',syncError:String(e?.message||e)}}
  } else r=item;
  const stored={...d,evidence:{status:r?.status||'FROZEN · VÄNTAR PÅ SYNK',name:r?.name||item?.name||null,githubPath:r?.githubPath||null,githubCommit:r?.githubCommit||null,syncError:r?.syncError||null}};
  localStorage.setItem(DECISION_KEY,JSON.stringify(stored));
  return stored;
}
function auditHtml(es){
  if(!es)return '';
  const done=PLAN.families.every(([f])=>Boolean(es.familyResults?.[f]));
  if(!done)return '';
  const totalTrials=PLAN.families.reduce((n,[f])=>n+(Number(es.familyResults?.[f]?.trials)||0),0);
  const rows=PLAN.families.map(([f])=>{
    const z=es.familyResults[f],a=auditFamily(z), fail=a?.failed||[];
    const reason=z.status==='PASS'?'Alla låsta minimikrav klaras av sparad topprankad variant':(fail.length?fail.join(' · '):'FAIL-orsak kan inte härledas ur sparad topprankad variant');
    return `<div class="statusline"><b>${f}</b> · <strong>${z.status}</strong><br><small>${a?`DEV ${a.d.n||0} affärer · Validation ${a.v.n||0} · totalt ${a.total} · PF ${Number(a.v.pf||0).toFixed(2)} · DD ${(100*Math.abs(Number(a.v.dd)||0)).toFixed(1)}% · konc. ${(100*(Number(a.v.maxSymbolGrossProfitShare)||1)).toFixed(1)}%`:''}</small><br><small><b>${z.status==='PASS'?'Kontroll':'FAIL-orsak'}:</b> ${reason}</small></div>`;
  }).join('');
  return `<h2>DEV/Validation-sammanställning före kandidatfrysning</h2><div class="forward-note"><b>Körjournal:</b> ${totalTrials} parameterförsök registrerade totalt (4 + 4 + 4 + 3). Familjer: 4/4 körda. Holdout: SEALED.</div>${rows}<div class="forward-note"><b>⚠ Evidensintegritet:</b> V0.2.49 sparade försöksantal och den topprankade varianten per familj, men inte de övriga variant-raderna. De 11 icke-topprankade variantdetaljerna bevaras som en dokumenterad historisk datalucka och får inte rekonstrueras eller köras om efter observerade resultat.</div>${decisionLoad()?`<div class="forward-note"><b>Pre-holdout-beslut:</b> 🔒 LÅST · dokumenterad datalucka accepterad · INGEN OMKÖRNING · evidens ${decisionLoad()?.evidence?.status||'LOKALT FRYST'}.</div>${String(decisionLoad()?.evidence?.status||'').includes('GITHUB')?'':`<button id="repairEvidence" class="primary">☁ Synka redan fryst evidens till GitHub</button>`}<div class="forward-note"><b>Kandidatfrysning:</b> ${String(decisionLoad()?.evidence?.status||'').includes('GITHUB')?'REDO FÖR SEPARAT NÄSTA STEG':'BLOCKERAD tills GitHub-evidens är verifierad'}. Ingen kandidat är fryst i V0.2.53 och Holdout öppnas inte.</div>`:`<div class="forward-note"><b>Beslutspunkt:</b> Lås policyn att de 11 saknade variantdetaljerna bevaras som historisk datalucka utan omkörning eller rekonstruktion. Detta skapar och fryser pre-holdout-evidenspaketet.</div><button id="lockGapDecision" class="primary">🔒 Lås datalucka + frys pre-holdout-evidens</button><div class="forward-note"><b>Kandidatfrysning:</b> BLOCKERAD tills beslutspunkten ovan är låst. Holdout öppnas inte.</div>`}`;
}
function render(root,ctx){const x=load(),v=verify(),locked=v.ok,E=window.LinaGen2Engine,es=E?.load?.(),spec=Boolean(es?.runnerSpecLocked);root.innerHTML=`<div class="crumb">Dashboard › Forskning › Lina Generation 2</div><section class="hero"><h1>🧪 Lina Generation 2</h1><p>DEV/Validation-forskning. Plan och runnerspec måste vara låsta innan första resultatet produceras.</p></section><button class="back" id="back">← Forskning</button><section class="workspace"><div class="forward-lock"><b>${locked?'🔒 GEN 2 PLAN LÅST & VERIFIERAD':'GEN 2 PLAN · EJ LÅST'}</b><span>Plan ${PLAN_HASH} · Handel AV · robotmognad 48/100</span></div><div class="statusline"><b>Runner spec:</b> ${spec?'🔒 '+E.RUNNER_SPEC_HASH:'EJ LÅST'} · rå marknadsdata → IndexedDB · kompakt resultat → localStorage</div><h2>Datadelning</h2><div class="metrics"><div><small>DEV</small><b>2020–2022</b></div><div><small>Validation</small><b>2023–2024</b></div><div><small>Holdout</small><b>🔒 SEALED</b></div><div><small>Real Forward</small><b>Efter kandidatfrysning</b></div></div><h2>Research runners</h2><div id="families">${PLAN.families.map(([a,b])=>{const z=es?.familyResults?.[a];return `<div class="statusline"><b>${a}</b> · ${b}<br><small>${z?z.status+' · '+z.trials+' varianter · Validation PF '+Number(z.best?.validation?.pf||0).toFixed(2)+' · DD '+(100*Math.abs(z.best?.validation?.dd||0)).toFixed(1)+'%':'EJ KÖRD'}</small>${spec&&!z?`<br><button class="secondary runfam" data-family="${a}">Kör ${a}</button>`:z?'<br><small>Resultat låst i denna vy · ingen omkörning</small>':''}</div>`}).join('')}</div><div class="actions">${!locked?'<button id="lock" class="primary">🔒 Lås Generation 2-plan</button>':!spec?'<button id="lockSpec" class="primary">🔒 Lås runnerspec före första körning</button>':'<button class="secondary" disabled>✓ Plan + runnerspec låsta</button>'}<button id="preflight" class="secondary">🧪 Verifiera Research Engine</button></div><div id="progress" class="forward-note"><b>Status:</b> ${spec?'READY · DEV/Validation · Holdout SEALED':'Lås runnerspec innan körning'}</div><div class="forward-note"><b>Urvalsregel:</b> ≥80 affärer totalt · Validation PF ≥1,20 · DD ≤12 % · positiv Validation · max 40 % av gross profit från en symbol. Högsta P/L vinner inte automatiskt.</div>${auditHtml(es)}<div class="forward-note"><b>Holdoutspärr:</b> 2025-01-01 → 2026-09-10 är fortfarande SEALED. Ingen holdout-runner eller resultatyta finns i V0.2.53.</div></section>`;root.querySelector('#back').onclick=ctx.back;root.querySelector('#lock')?.addEventListener('click',()=>{lock();render(root,ctx)});root.querySelector('#lockSpec')?.addEventListener('click',()=>{E.lockRunnerSpec();render(root,ctx)});root.querySelector('#preflight').onclick=()=>{try{const z=E.preflight();root.querySelector('#progress').innerHTML=`<b>Status:</b> PASS ✓ · plan ${z.planHash} · runner ${z.runnerSpecHash} · Holdout ${z.holdout} · Handel AV`}catch(e){root.querySelector('#progress').innerHTML='<b>FAIL:</b> '+e.message}};root.querySelectorAll('.runfam').forEach(b=>b.onclick=async()=>{const p=root.querySelector('#progress');b.disabled=true;try{p.innerHTML='<b>Kör:</b> startar '+b.dataset.family+'…';const h=e=>p.innerHTML='<b>Kör:</b> '+e.detail.text;document.addEventListener('lina:gen2progress',h);await E.runFamily(b.dataset.family);document.removeEventListener('lina:gen2progress',h);render(root,ctx)}catch(e){p.innerHTML='<b>KÖRFEL:</b> '+e.message;b.disabled=false}});root.querySelector('#lockGapDecision')?.addEventListener('click',async()=>{const b=root.querySelector('#lockGapDecision');b.disabled=true;b.textContent='Fryser evidens…';try{await lockGapDecision(es);render(root,ctx)}catch(e){b.disabled=false;b.textContent='Fel: '+String(e?.message||e)}});root.querySelector('#repairEvidence')?.addEventListener('click',async()=>{const b=root.querySelector('#repairEvidence');b.disabled=true;b.textContent='Synkar fryst evidens…';try{await repairFrozenEvidence();render(root,ctx)}catch(e){b.disabled=false;b.textContent='Synkfel: '+String(e?.message||e)}})}
window.LinaGen2Lab={VERSION,PLAN_VERSION,EXPECTED_PLAN_HASH,PLAN_HASH,PLAN,load,lock,verify,render};
})();
