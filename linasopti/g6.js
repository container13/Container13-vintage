(()=>{
'use strict';
const PLAN_HASH='1567bbbe';
const GRID=[0,0.0005,0.001,0.0015,0.002,0.0025,0.003,0.004,0.005];
const pct=x=>(100*x).toFixed(2).replace('.',',')+' %';
const fmt=n=>Number(n).toLocaleString('sv-SE',{maximumFractionDigits:2});
function render(root,ctx){
 const E=window.LinaG6Engine,r=E?.load?.();
 const matrix=GRID.map((x,i)=>`<div class="statusline"><b>${i+1}. Extra kostnad ${pct(x)} per sida</b> · total kostnad ${pct(0.001+x)} per sida</div>`).join('');
 let body='';
 if(r?.status==='complete'){
   const b=r.gate.boundaryExtraCostPerSide;
   body=`<div class="forward-lock"><b>G6 RESULTAT · ${r.gate.verdict} · FRYST</b><span>Plan ${PLAN_HASH} · kandidat 15efd75a · boundary ${b==null?'ingen testpunkt':pct(b)+' extra/sida'}</span></div><h2>Kostnadskurva</h2>${r.points.map((s,i)=>`<div class="statusline"><b>${i+1}. Extra ${pct(s.extraCostPerSide)}</b> · total ${pct(s.totalCostPerSide)} · ${s.n} affärer · P/L ${fmt(s.pl)} · PF ${fmt(s.pf)} · WR ${pct(s.wr)} · DD ${pct(s.dd)} · slut ${fmt(s.final)}</div>`).join('')}<div class="statusline"><b>Gate ${r.gate.verdict}:</b> högsta testade gräns med P/L &gt; 0 och PF ≥ 1,00 = ${b==null?'ingen':pct(b)+' extra per sida'}.</div><div class="actions"><button id="g6Report" class="secondary">📥 Exportera G6-rapport</button><button id="g6Raw" class="secondary">Raw JSON</button></div>`;
 } else {
   body=`<div class="forward-lock"><b>🔒 G6 PLAN LÅST · RUNNER REDO</b><span>Plan ${PLAN_HASH} · kandidat 15efd75a · resultat ännu ej öppnat</span></div><h2>Fryst testmatris</h2>${matrix}<div class="statusline"><b>Bas:</b> 0,10 % per sida. Samma 16 symboler, period 2020-01-01 → 2026-09-10 och exakt samma G2-parametrar.</div><h2>Boundary-definition</h2><p>Högsta testade extra kostnad per sida där <b>P/L &gt; 0 och PF ≥ 1,00</b>. Ingen interpolation används för gate.</p><h2>Gate före resultat</h2><p><b>PASS:</b> boundary ≥ 0,20 % extra per sida och DD ≥ −10 % vid varje testpunkt till och med boundary.</p><p><b>HOLD:</b> boundary ≥ 0,10 % men &lt; 0,20 %, och ingen testad DD &lt; −15 %.</p><p><b>FAIL:</b> boundary &lt; 0,10 %, eller någon testad DD &lt; −15 %.</p><div id="g6Live" class="statusline">${r?.status==='error'?'Senaste fel: '+r.lastError?.message:'Runner redo · robust checkpoint i IndexedDB.'}</div><div class="actions"><button id="g6Run" class="primary">▶ Kör G6 Execution Cost Boundary</button></div>`;
 }
 root.innerHTML=`<div class="crumb">Dashboard › Forskning › Swing G6 Execution Cost Boundary</div><section class="hero"><h1>G6 Execution Cost Boundary</h1><p>Mäter var kostnadsgränsen ligger för oförändrade 15efd75a. Ingen optimering. Handel AV.</p></section><button class="back" id="g6Back">← Forskning</button><section class="workspace">${body}<div class="forward-note"><b>Forskningsregel:</b> G6 beskriver kostnadskänslighet. Ingen parameterändring, symbolrensning eller rescue av G5. G6 är inte ny oberoende OOS-evidens.</div></section>`;
 root.querySelector('#g6Back').onclick=ctx.back;
 root.querySelector('#g6Report')?.addEventListener('click',()=>E.exportReport());root.querySelector('#g6Raw')?.addEventListener('click',()=>E.exportRaw());
 const b=root.querySelector('#g6Run');if(b)b.onclick=async()=>{b.disabled=true;b.textContent='Kör G6…';try{await E.run();render(root,ctx)}catch(e){alert('G6 kunde inte slutföras: '+(e.message||e));render(root,ctx)}};
 const live=e=>{const n=root.querySelector('#g6Live');if(n)n.textContent=e.detail.stage+(e.detail.detail?' · '+e.detail.detail:'')};document.addEventListener('lina:g6live',live,{once:false});
}
window.LinaG6={render,PLAN_HASH};
})();
