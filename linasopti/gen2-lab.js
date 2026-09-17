(function(){
'use strict';
const VERSION='V0.2.46';
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
  next:'Kör förregistrerade Gen2-runners på DEV och Validation. Holdout förblir förseglad.'
};
function hash(obj){const s=JSON.stringify(obj);let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(16).padStart(8,'0')}
const PLAN_HASH=hash(PLAN);
if(PLAN_HASH!==EXPECTED_PLAN_HASH)throw new Error('GEN2 PLAN HASH MISMATCH: '+PLAN_HASH);
function read(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch{return null}}
function load(){return read(KEY)||read(PREV_KEY)||read(LEGACY_KEY)}
function lock(){let old=load();if(old?.locked){if(old.planHash!==EXPECTED_PLAN_HASH)throw new Error('BLOCKERAD: befintligt planlås har fel hash');const migrated={...old,schema:'LINA-GEN2-PLAN-LOCK-2',release:VERSION,planHash:EXPECTED_PLAN_HASH,verified:true,verifiedAt:new Date().toISOString(),holdoutOpened:false};localStorage.setItem(KEY,JSON.stringify(migrated));return migrated}const x={...PLAN,schema:'LINA-GEN2-PLAN-LOCK-2',release:VERSION,planHash:EXPECTED_PLAN_HASH,locked:true,lockedAt:new Date().toISOString(),verified:true,verifiedAt:new Date().toISOString(),holdoutOpened:false,resultOpened:false};localStorage.setItem(KEY,JSON.stringify(x));return x}
function verify(){const x=load();return {ok:Boolean(x?.locked&&x?.planHash===EXPECTED_PLAN_HASH&&PLAN_HASH===EXPECTED_PLAN_HASH&&x?.holdoutOpened!==true),planHash:PLAN_HASH,lockedAt:x?.lockedAt||null,holdoutOpened:Boolean(x?.holdoutOpened)}}
function render(root,ctx){const x=load(),v=verify(),locked=v.ok,E=window.LinaGen2Engine,es=E?.load?.(),spec=Boolean(es?.runnerSpecLocked);root.innerHTML=`<div class="crumb">Dashboard › Forskning › Lina Generation 2</div><section class="hero"><h1>🧪 Lina Generation 2</h1><p>DEV/Validation-forskning. Plan och runnerspec måste vara låsta innan första resultatet produceras.</p></section><button class="back" id="back">← Forskning</button><section class="workspace"><div class="forward-lock"><b>${locked?'🔒 GEN 2 PLAN LÅST & VERIFIERAD':'GEN 2 PLAN · EJ LÅST'}</b><span>Plan ${PLAN_HASH} · Handel AV · robotmognad 48/100</span></div><div class="statusline"><b>Runner spec:</b> ${spec?'🔒 '+E.RUNNER_SPEC_HASH:'EJ LÅST'} · rå marknadsdata → IndexedDB · kompakt resultat → localStorage</div><h2>Datadelning</h2><div class="metrics"><div><small>DEV</small><b>2020–2022</b></div><div><small>Validation</small><b>2023–2024</b></div><div><small>Holdout</small><b>🔒 SEALED</b></div><div><small>Real Forward</small><b>Efter kandidatfrysning</b></div></div><h2>Research runners</h2><div id="families">${PLAN.families.map(([a,b])=>{const z=es?.familyResults?.[a];return `<div class="statusline"><b>${a}</b> · ${b}<br><small>${z?z.status+' · '+z.trials+' varianter · Validation PF '+Number(z.best?.validation?.pf||0).toFixed(2)+' · DD '+(100*Math.abs(z.best?.validation?.dd||0)).toFixed(1)+'%':'EJ KÖRD'}</small>${spec?`<br><button class="secondary runfam" data-family="${a}">Kör ${a}</button>`:''}</div>`}).join('')}</div><div class="actions">${!locked?'<button id="lock" class="primary">🔒 Lås Generation 2-plan</button>':!spec?'<button id="lockSpec" class="primary">🔒 Lås runnerspec före första körning</button>':'<button class="secondary" disabled>✓ Plan + runnerspec låsta</button>'}<button id="preflight" class="secondary">🧪 Verifiera Research Engine</button></div><div id="progress" class="forward-note"><b>Status:</b> ${spec?'READY · DEV/Validation · Holdout SEALED':'Lås runnerspec innan körning'}</div><div class="forward-note"><b>Urvalsregel:</b> ≥80 affärer totalt · Validation PF ≥1,20 · DD ≤12 % · positiv Validation · max 40 % av gross profit från en symbol. Högsta P/L vinner inte automatiskt.</div><div class="forward-note"><b>Holdoutspärr:</b> 2025-01-01 → 2026-09-10 är fortfarande SEALED. Ingen holdout-runner eller resultatyta finns i V0.2.46.</div></section>`;root.querySelector('#back').onclick=ctx.back;root.querySelector('#lock')?.addEventListener('click',()=>{lock();render(root,ctx)});root.querySelector('#lockSpec')?.addEventListener('click',()=>{E.lockRunnerSpec();render(root,ctx)});root.querySelector('#preflight').onclick=()=>{try{const z=E.preflight();root.querySelector('#progress').innerHTML=`<b>Status:</b> PASS ✓ · plan ${z.planHash} · runner ${z.runnerSpecHash} · Holdout ${z.holdout} · Handel AV`}catch(e){root.querySelector('#progress').innerHTML='<b>FAIL:</b> '+e.message}};root.querySelectorAll('.runfam').forEach(b=>b.onclick=async()=>{const p=root.querySelector('#progress');b.disabled=true;try{p.innerHTML='<b>Kör:</b> startar '+b.dataset.family+'…';const h=e=>p.innerHTML='<b>Kör:</b> '+e.detail.text;document.addEventListener('lina:gen2progress',h);await E.runFamily(b.dataset.family);document.removeEventListener('lina:gen2progress',h);render(root,ctx)}catch(e){p.innerHTML='<b>KÖRFEL:</b> '+e.message;b.disabled=false}})}
window.LinaGen2Lab={VERSION,PLAN_VERSION,EXPECTED_PLAN_HASH,PLAN_HASH,PLAN,load,lock,verify,render};
})();
