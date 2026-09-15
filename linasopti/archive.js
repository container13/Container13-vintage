(function(){
'use strict';
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function metricCards(c){
 return `<div class="archive-kpis">
  <div><small>Robotmognad</small><b>${c.maturity}/100</b><span>Oförändrad</span></div>
  <div><small>Kända Swing-affärer</small><b>${c.knownSwingHistoricalTrades}</b><span>G1 + G2 historiskt</span></div>
  <div><small>Historiska simuleringar</small><b>≥ 21 400</b><span>senast observerat före Clean Core</span></div>
  <div><small>Jägaren tidsmaskin</small><b>${c.jagarenPseudoTrades}</b><span>historiska affärer</span></div>
  <div><small>G2 Real Forward</small><b>${c.forwardTrades}</b><span>nya stängda affärer</span></div>
  <div><small>G3 simuleringar</small><b>+${c.g3Simulations.toLocaleString('sv-SE')}</b><span>nya i Walk-Forward</span></div>
 </div>`;
}
function recordCard(r){
 return `<article class="archive-record" data-family="${esc(r.family)}">
   <div class="archive-record-top"><div><span class="archive-family">${esc(r.family)}</span><h3>${esc(r.title)}</h3></div><span class="archive-status">${esc(r.status)}</span></div>
   <div class="archive-meta">${esc(r.date)} · ${esc(r.type)} · kandidat ${esc(r.candidate)}</div>
   <p>${esc(r.summary)}</p>
   <div class="archive-metrics">${r.metrics.map(([k,v])=>`<div><small>${esc(k)}</small><b>${esc(v)}</b></div>`).join('')}</div>
   <div class="archive-decision"><b>Beslut:</b> ${esc(r.decision)}</div>
   <button class="secondary archive-export" data-id="${esc(r.id)}">📤 Exportera denna rapport</button>
  </article>`;
}
function render(root,ctx){
 const D=window.LinaArchiveData,c=D.counters(),recs=D.records();
 root.innerHTML=`<div class="crumb">Dashboard › Historik › Lina Arkiv</div>
 <section class="hero"><h1>Lina Arkiv & Robotmognad</h1><p>Samlad forsknings- och utvecklingshistorik, frysta kandidater, PASS/FAIL, forward-status och större releaser. Gamla resultat skrivs inte över.</p></section>
 <button class="back" id="arBack">← Dashboard</button>
 <section class="workspace archive">
  ${metricCards(c)}
  <div class="maturity-box"><div><b>Robotmognad ${c.maturity}/100</b><span>Nästa mognadspoäng ska komma från ny forward-data, inte fler varv på samma historik.</span></div><div class="maturity-bar"><i style="width:${c.maturity}%"></i></div></div>
  <div class="archive-note"><b>Simuleringsräknaren är återställd som historik:</b> du hade redan observerat <b>över 21 400 simuleringar</b> före Clean Core. Vi visar därför konservativt <b>≥ 21 400</b> som historiskt golv och räknar G3 separat ovanpå det, i stället för att felaktigt ersätta siffran med antal affärer. G1/G2-affärer och Jägaren-teststeg visas fortfarande som egna mått för att undvika dubbelräkning.</div>
  <div class="archive-filter"><button class="secondary active" data-filter="all">Alla</button><button class="secondary" data-filter="Utveckling">Utveckling</button><button class="secondary" data-filter="Swing G2">Swing G2</button><button class="secondary" data-filter="Swing G1">Swing G1</button><button class="secondary" data-filter="Jägaren">Jägaren</button></div>
  <div class="archive-note"><b>Evidencekö:</b> Rapporter/RAW som exporteras i Lina blir först PRELIMINÄRA. Godkänn & frys dem här. Först därefter får ☁ Synka skicka dem till GitHub.</div>
  <div id="evidenceQueue">${window.LinaEvidence?window.LinaEvidence.items().map(x=>`<div class="statusline"><b>${esc(x.name)}</b> · ${esc(x.status)} ${x.status==='PRELIMINÄR'?`<button class="secondary evidence-approve" data-id="${esc(x.id)}">✓ Godkänn & frys</button>`:''}${x.githubPath?`<br><small>${esc(x.githubPath)} · SHA256 ${esc(x.sha256||'')}</small>`:''}</div>`).join('')||'<div class="statusline">Ingen preliminär evidence väntar.</div>':'Evidencehanteraren laddas…'}</div>
  <div id="archiveRecords">${recs.slice().reverse().map(recordCard).join('')}</div>
 </section>`;
 root.querySelector('#arBack').onclick=ctx.back;
 root.querySelectorAll('.evidence-approve').forEach(b=>b.onclick=async()=>{b.disabled=true;try{await window.LinaEvidence.approve(b.dataset.id);render(root,ctx)}catch(e){alert(e.message||e)}});
 root.querySelectorAll('.archive-export').forEach(b=>b.onclick=()=>{const r=D.records().find(x=>x.id===b.dataset.id);if(r)D.downloadRecord(r)});
 root.querySelectorAll('.archive-filter button').forEach(b=>b.onclick=()=>{
   root.querySelectorAll('.archive-filter button').forEach(x=>x.classList.remove('active'));b.classList.add('active');
   const f=b.dataset.filter;root.querySelectorAll('.archive-record').forEach(card=>card.style.display=(f==='all'||card.dataset.family===f)?'':'none');
 });
}
window.LinaArchive={render};
})();