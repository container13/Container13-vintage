(()=>{
'use strict';
const PLAN_HASH='1567bbbe';
const GRID=[0,0.0005,0.001,0.0015,0.002,0.0025,0.003,0.004,0.005];
const pct=x=>(100*x).toFixed(x===0?2:2).replace('.',',')+' %';
function render(root,ctx){
 const rows=GRID.map((x,i)=>`<div class="statusline"><b>${i+1}. Extra kostnad ${pct(x)} per sida</b> · total kostnad ${pct(0.001+x)} per sida</div>`).join('');
 root.innerHTML=`<div class="crumb">Dashboard › Forskning › Swing G6 Execution Cost Boundary</div><section class="hero"><h1>G6 Execution Cost Boundary</h1><p>Mäter var kostnadsgränsen ligger för oförändrade 15efd75a. Ingen optimering. Handel AV.</p></section><button class="back" id="g6Back">← Forskning</button><section class="workspace"><div class="forward-lock"><b>🔒 G6 PLAN LÅST</b><span>Plan 1567bbbe · kandidat 15efd75a · runner ännu ej byggd</span></div><h2>Fryst testmatris</h2>${rows}<div class="statusline"><b>Bas:</b> 0,10 % per sida. Samma 16 symboler, period 2020-01-01 → 2026-09-10 och exakt samma G2-parametrar.</div><h2>Boundary-definition</h2><p>Högsta testade extra kostnad per sida där <b>P/L &gt; 0 och PF ≥ 1,00</b>. Ingen interpolation används för gate.</p><h2>Gate före resultat</h2><p><b>PASS:</b> boundary ≥ 0,20 % extra per sida och DD ≥ −10 % vid varje testpunkt till och med boundary.</p><p><b>HOLD:</b> boundary ≥ 0,10 % men &lt; 0,20 %, och ingen testad DD &lt; −15 %.</p><p><b>FAIL:</b> boundary &lt; 0,10 %, eller någon testad DD &lt; −15 %.</p><div class="forward-note"><b>Forskningsregel:</b> G6 beskriver kostnadskänslighet. Ingen parameterändring, symbolrensning eller rescue av G5. G6 är inte ny oberoende OOS-evidens.</div></section>`;
 root.querySelector('#g6Back').onclick=ctx.back;
}
window.LinaG6={render,PLAN_HASH};
})();
