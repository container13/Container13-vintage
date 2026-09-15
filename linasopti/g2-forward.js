(function(){
'use strict';
const f=n=>Number(n||0).toLocaleString('sv-SE',{maximumFractionDigits:2}),pct=n=>(100*Number(n||0)).toFixed(2)+'%';
function render(root,ctx){
 const E=window.LinaG2ForwardEngine,x=E.load()||E.fresh(),s=x.stats||{n:0,pl:0,pf:0,wr:0,dd:0,open:0,unrealized:0,equity:100000};
 root.innerHTML=`<div class="crumb">Dashboard › Forward › Swing G2 Real Forward</div>
 <section class="hero"><h1>G2 Real Forward / Paper</h1><p>Endast nya marknadsdagar efter frysningen. Kandidat <b>${E.HASH}</b> är låst. Handel AV.</p></section>
 <button class="back" id="gfBack">← Forward</button>
 <section class="workspace forward-g2">
  <div class="forward-lock"><b>🔒 FRYST</b><span>Anchor ${E.ANCHOR} · breakout 55 · SMA200 · volym 1,5× · SPY200 · stop 7 % · target 15 % · hold 10</span></div>
  <div class="forward-summary">
   <div><small>Senaste marknadsdag</small><b>${x.lastMarketDate||'—'}</b></div>
   <div><small>Stängda affärer</small><b>${s.n}</b></div>
   <div><small>P/L</small><b>${s.pl>=0?'+':''}${f(s.pl)}</b></div>
   <div><small>PF</small><b>${Number.isFinite(s.pf)?f(s.pf):'∞'}</b></div>
   <div><small>WR</small><b>${pct(s.wr)}</b></div>
   <div><small>DD</small><b>${pct(s.dd)}</b></div>
  </div>
  <div class="milestones"><b>Forward-milstolpar</b>${[60,120,250].map(m=>`<span class="${x.milestones[m]?'done':''}">${x.milestones[m]?'✓':'○'} ${m}</span>`).join('')}</div>
  <div class="forward-open"><b>Öppna paper-positioner: ${s.open||0}</b><span>Orealiserat ${s.unrealized>=0?'+':''}${f(s.unrealized)} · modell-equity ${f(s.equity)}</span></div>
  <div id="gfStatus" class="statusline">${x.lastRefreshAt?'Lokal runtime: senast kontrollerad '+new Date(x.lastRefreshAt).toLocaleString('sv-SE'):'Historik: G2 Real Forward är dokumenterat aktivt från anchor 2026-09-11. Ingen lokal runtime-data finns på just denna enhet.'}</div>
  <div class="actions"><button id="gfRefresh" class="primary">↻ Hämta nya marknadsdagar</button><button id="gfReport" class="secondary">📤 Exportera forward-rapport</button><button id="gfRaw" class="secondary">Raw JSON</button></div>
  <div class="forward-note"><b>Ingen look-ahead:</b> data före 2026-09-11 används endast som warmup för SMA, breakout och volym. Affärer får öppnas först från anchor-datumet. Öppna positioner tvångsstängs inte vid varje uppdatering.</div>
 </section>`;
 root.querySelector('#gfBack').onclick=ctx.back;
 root.querySelector('#gfReport').onclick=()=>E.exportReport();
 root.querySelector('#gfRaw').onclick=()=>E.exportRaw();
 root.querySelector('#gfRefresh').onclick=async()=>{
  const b=root.querySelector('#gfRefresh'),st=root.querySelector('#gfStatus');b.disabled=true;
  try{await E.refresh(msg=>st.textContent=msg);render(root,ctx)}
  catch(err){st.textContent='FEL: '+(err?.message||err);st.classList.add('bad');b.disabled=false}
 };
}
window.LinaG2Forward={render};
})();