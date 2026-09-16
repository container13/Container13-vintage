(function(){
'use strict';
const VERSION='V0.2.44';
const KEY='lina_clean_gen2_plan_v0244';
const PLAN={
  schema:'LINA-GEN2-RESEARCH-PLAN-1',version:VERSION,name:'Lina Generation 2',tradeEnabled:false,
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
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}}
function lock(){let x=load();if(x?.locked)return x;x={...PLAN,planHash:PLAN_HASH,locked:true,lockedAt:new Date().toISOString(),resultOpened:false};localStorage.setItem(KEY,JSON.stringify(x));return x}
function render(root,ctx){const x=load();const locked=!!x?.locked;root.innerHTML=`<div class="crumb">Dashboard › Forskning › Lina Generation 2</div><section class="hero"><h1>🧪 Lina Generation 2</h1><p>Nytt separat forskningsspår. Målet är klart bättre resultat, men utan att välja vinnare på facit. Original G2/G3 fortsätter oförändrade i Real Forward.</p></section><button class="back" id="back">← Forskning</button><section class="workspace"><div class="forward-lock"><b>${locked?'🔒 GEN 2 PLAN LÅST':'GEN 2 PLAN · FÖRREGISTRERAD'}</b><span>Plan ${PLAN_HASH} · Handel AV · robotmognad påverkas inte av planlås</span></div><h2>Datadelning</h2><div class="metrics"><div><small>Utveckling</small><b>2020–2022</b></div><div><small>Validation</small><b>2023–2024</b></div><div><small>Förseglad holdout</small><b>2025–2026-09-10</b></div><div><small>Real Forward</small><b>Efter frysning</b></div></div><h2>Strategifamiljer</h2>${PLAN.families.map(([a,b])=>`<div class="statusline"><b>${a}</b> · ${b}</div>`).join('')}<h2>Hårda forskningsregler</h2>${PLAN.rules.map(r=>`<p>• ${r}</p>`).join('')}<div class="statusline"><b>Urval före holdout:</b> minst ${PLAN.selection.minimumTrades} affärer · PF ≥ ${PLAN.selection.profitFactor.toFixed(2)} · DD högst ${(PLAN.selection.maxDrawdown*100).toFixed(0)} % · positiv validation · koncentrationsskydd. Primärt mål är robust riskjusterad prestation, inte högsta historiska P/L.</div><div class="actions">${locked?'<button class="secondary" disabled>✓ Plan låst · runners nästa steg</button>':'<button id="lock" class="primary">🔒 Lås Generation 2-plan</button>'}</div><div class="forward-note"><b>Viktigt:</b> Den förseglade holdouten öppnas inte i V0.2.44. Den här releasen låser endast experimentdesignen. Inga nya resultat produceras ännu.</div></section>`;root.querySelector('#back').onclick=ctx.back;const b=root.querySelector('#lock');if(b)b.onclick=()=>{lock();render(root,ctx)}}
window.LinaGen2Lab={VERSION,PLAN_HASH,PLAN,load,lock,render};
})();
