(function(){
'use strict';
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function metricCards(c){
 return `<div class="archive-kpis">
  <div><small>Robotmognad</small><b>${c.maturity}/100</b><span>Oförändrad</span></div>
  <div><small>Kända Swing-affärer</small><b>${c.knownSwingHistoricalTrades}</b><span>G1 + G2 historiskt</span></div>
  <div><small>Jägaren teststeg</small><b>${c.documentedStages}</b><span>historiska A–K</span></div>
  <div><small>Jägaren tidsmaskin</small><b>${c.jagarenPseudoTrades}</b><span>historiska affärer</span></div>
  <div><small>G2 Real Forward</small><b>${c.forwardTrades}</b><span>nya stängda affärer</span></div>
  <div><small>Arkivposter</small><b>${c.reports}</b><span>inkl. live forward-status</span></div>
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
 <section class="hero"><h1>Lina Arkiv & Robotmognad</h1><p>Samlad forskningshistorik, frysta kandidater, PASS/FAIL och forward-status. Gamla resultat skrivs inte över.</p></section>
 <button class="back" id="arBack">← Dashboard</button>
 <section class="workspace archive">
  ${metricCards(c)}
  <div class="maturity-box"><div><b>Robotmognad ${c.maturity}/100</b><span>Nästa mognadspoäng ska komma från ny forward-data, inte fler varv på samma historik.</span></div><div class="maturity-bar"><i style="width:${c.maturity}%"></i></div></div>
  <div class="archive-note"><b>Räknar vi simuleringar?</b> Ja, men utan att blanda äpplen och päron. G1 + G2 ger <b>${c.knownSwingHistoricalTrades} kända historiska Swing-affärer</b>. Jägaren har dessutom 109 dokumenterade teststeg och 442 affärer i Tidsmaskinen, men dessa hålls separata eftersom de kan överlappa andra Jägaren-tester.</div>
  <div class="archive-filter"><button class="secondary active" data-filter="all">Alla</button><button class="secondary" data-filter="Swing G2">Swing G2</button><button class="secondary" data-filter="Swing G1">Swing G1</button><button class="secondary" data-filter="Jägaren">Jägaren</button></div>
  <div id="archiveRecords">${recs.slice().reverse().map(recordCard).join('')}</div>
 </section>`;
 root.querySelector('#arBack').onclick=ctx.back;
 root.querySelectorAll('.archive-export').forEach(b=>b.onclick=()=>{const r=D.records().find(x=>x.id===b.dataset.id);if(r)D.downloadRecord(r)});
 root.querySelectorAll('.archive-filter button').forEach(b=>b.onclick=()=>{
   root.querySelectorAll('.archive-filter button').forEach(x=>x.classList.remove('active'));b.classList.add('active');
   const f=b.dataset.filter;root.querySelectorAll('.archive-record').forEach(card=>card.style.display=(f==='all'||card.dataset.family===f)?'':'none');
 });
}
window.LinaArchive={render};
})();