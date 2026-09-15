(function(){
'use strict';
const f=n=>Number(n||0).toLocaleString('sv-SE',{maximumFractionDigits:2}),pct=n=>(100*Number(n||0)).toFixed(2)+'%';
function render(root,ctx){
 const E=window.LinaG3Engine,x=E.load()||E.fresh(),r=x.result;
 root.innerHTML=`<div class="crumb">Dashboard › Forskning › Swing G3 Walk-Forward</div>
 <section class="hero"><h1>G3 Walk-Forward Learner</h1><p>Övar på 2020–2022. Från 2023 går den dag för dag och får bara lära av det som redan hänt. G2 lämnas orörd.</p></section>
 <button class="back" id="g3Back">← Forskning</button>
 <section class="workspace g3">
  <div class="g3-lock"><b>${x.planLocked?'🔒 PLAN LÅST':'○ PLAN EJ LÅST'}</b><span>${x.planHash||'Lås metoden innan 2023 öppnas.'}</span></div>
  <div class="g3-method">
   <div><small>Träning</small><b>2020–2022</b><span>648 varianter → topp 12</span></div>
   <div><small>Lärfrekvens</small><b>Månadsvis</b><span>endast historik t.o.m. gårdagen</span></div>
   <div><small>Beslut</small><b>Dagligen</b><span>2023 → 2026-09-10</span></div>
   <div><small>G3-simuleringar</small><b>${(x.simulationCount||0).toLocaleString('sv-SE')}</b><span>separat från äldre räknare</span></div>
  </div>
  <div class="g3-warning"><b>Forskningsstatus:</b> 2023–2026 är inte längre helt orörd data för oss. Därför är G3 ett metod-/walk-forward-test. Vi får inte trimma G3 efter att resultatet visas och sedan kalla samma period ny OOS.</div>
  ${r?`<div class="g3-result"><div class="eyebrow">G3 RESEARCH GATE · PASS · FRYST</div><h2>${r.n} affärer · ${r.pl>=0?'+':''}${f(r.pl)} · PF ${f(r.pf)}</h2><p>WR ${pct(r.wr)} · DD ${pct(r.dd)} · ${(x.retrains||[]).length} månadsvisa omträningar.</p><p><b>G2 facit:</b> 144 affärer · +13 708,85 · PF 1,467 · DD −2,34 %. G3 ersätter inte G2 historiskt. Metoden är nu fryst och går parallellt med G2 i Real Forward.</p></div>`:''}
  <div id="g3Status" class="statusline">${x.status==='complete'?'✓ G3 färdig':x.lastError?'FEL: '+x.lastError.message:x.planLocked?'Plan låst · redo att köra':'Lås planen först'}</div>
  <div class="actions">
   ${!x.planLocked?'<button id="g3Lock" class="primary">🔒 Lås G3-plan</button>':''}
   ${x.planLocked&&x.status!=='complete'?'<button id="g3Run" class="primary">▶ Kör / fortsätt G3</button>':''}
   ${x.status==='complete'?'<button id="g3Report" class="primary">📤 Exportera G3-rapport</button><button id="g3Raw" class="secondary">Raw JSON</button>':''}
  </div>
  <div class="g3-note"><b>Checkpoint:</b> topp-12-poolen och varje färdig månadsomträning sparas. Vid avbrott hämtas prisdata på nytt men redan färdiga månadsval körs inte om. Rå prisdata lagras inte permanent i localStorage.</div>
 </section>`;
 root.querySelector('#g3Back').onclick=ctx.back;
 root.querySelector('#g3Lock')?.addEventListener('click',()=>{E.lock();render(root,ctx)});
 root.querySelector('#g3Report')?.addEventListener('click',()=>E.exportReport());
 root.querySelector('#g3Raw')?.addEventListener('click',()=>E.exportRaw());
 root.querySelector('#g3Run')?.addEventListener('click',async()=>{const b=root.querySelector('#g3Run'),st=root.querySelector('#g3Status');b.disabled=true;try{await E.run(msg=>st.textContent=msg);render(root,ctx)}catch(e){st.textContent='FEL: '+(e?.message||e);st.classList.add('bad');b.disabled=false}});
}
window.LinaG3={render};
})();