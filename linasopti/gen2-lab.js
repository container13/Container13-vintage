(function(){
'use strict';
const VERSION='V0.2.45';
const PLAN_VERSION='V0.2.44';
const KEY='lina_clean_gen2_plan_v0245';
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
function load(){return read(KEY)||read(LEGACY_KEY)}
function lock(){let old=load();if(old?.locked){if(old.planHash!==EXPECTED_PLAN_HASH)throw new Error('BLOCKERAD: befintligt planlås har fel hash');const migrated={...old,schema:'LINA-GEN2-PLAN-LOCK-2',release:VERSION,planHash:EXPECTED_PLAN_HASH,verified:true,verifiedAt:new Date().toISOString(),holdoutOpened:false};localStorage.setItem(KEY,JSON.stringify(migrated));return migrated}const x={...PLAN,schema:'LINA-GEN2-PLAN-LOCK-2',release:VERSION,planHash:EXPECTED_PLAN_HASH,locked:true,lockedAt:new Date().toISOString(),verified:true,verifiedAt:new Date().toISOString(),holdoutOpened:false,resultOpened:false};localStorage.setItem(KEY,JSON.stringify(x));return x}
function verify(){const x=load();return {ok:Boolean(x?.locked&&x?.planHash===EXPECTED_PLAN_HASH&&PLAN_HASH===EXPECTED_PLAN_HASH&&x?.holdoutOpened!==true),planHash:PLAN_HASH,lockedAt:x?.lockedAt||null,holdoutOpened:Boolean(x?.holdoutOpened)}}
function render(root,ctx){const x=load(),v=verify(),locked=v.ok;let pre=null;try{if(locked)pre=window.LinaGen2Engine?.preflight()}catch(e){pre={ok:false,error:e.message}}root.innerHTML=`<div class="crumb">Dashboard › Forskning › Lina Generation 2</div><section class="hero"><h1>🧪 Lina Generation 2</h1><p>Separat forskningsspår. Planen måste vara kryptografiskt konsekvent låst innan DEV/Validation-motorn får användas.</p></section><button class="back" id="back">← Forskning</button><section class="workspace"><div class="forward-lock"><b>${locked?'🔒 GEN 2 PLAN LÅST & VERIFIERAD':'GEN 2 PLAN · EJ LÅST'}</b><span>Plan ${PLAN_HASH} · Handel AV · robotmognad 48/100</span></div><h2>Datadelning</h2><div class="metrics"><div><small>DEV</small><b>2020–2022</b></div><div><small>Validation</small><b>2023–2024</b></div><div><small>Holdout</small><b>🔒 FÖRSEGLAD</b></div><div><small>Real Forward</small><b>Efter kandidatfrysning</b></div></div><h2>Strategifamiljer</h2>${PLAN.families.map(([a,b])=>`<div class="statusline"><b>${a}</b> · ${b}</div>`).join('')}<h2>Urval före holdout</h2><div class="statusline">Minst 80 affärer · PF ≥ 1,20 · DD ≤ 12 % · positiv validation · koncentrationsskydd. Högsta P/L vinner inte automatiskt.</div><div class="actions">${locked?'<button class="secondary" disabled>✓ Plan 1d5f8bc1 verifierad</button>':'<button id="lock" class="primary">🔒 Lås Generation 2-plan</button>'}${locked?'<button id="preflight" class="primary">🧪 Verifiera Research Engine</button>':''}</div><div id="engineStatus" class="forward-note"><b>Research Engine:</b> ${pre?.ok?'READY · endast DEV + Validation · Holdout SEALED':pre?.error||'väntar på planlås'}</div><div class="forward-note"><b>Holdoutspärr:</b> 2025-01-01 → 2026-09-10 har ingen runner eller resultatyta i V0.2.45. Försök att begära annat intervall blockeras.</div></section>`;root.querySelector('#back').onclick=ctx.back;const b=root.querySelector('#lock');if(b)b.onclick=()=>{lock();render(root,ctx)};const p=root.querySelector('#preflight');if(p)p.onclick=()=>{try{const z=window.LinaGen2Engine.preflight();root.querySelector('#engineStatus').innerHTML=`<b>Research Engine:</b> PASS ✓ · plan ${z.planHash} · DEV/Validation öppna · Holdout SEALED · Handel AV`}catch(e){root.querySelector('#engineStatus').innerHTML=`<b>Research Engine:</b> FAIL · ${e.message}`}}}
window.LinaGen2Lab={VERSION,PLAN_VERSION,EXPECTED_PLAN_HASH,PLAN_HASH,PLAN,load,lock,verify,render};
})();
