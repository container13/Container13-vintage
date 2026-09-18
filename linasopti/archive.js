(function(){
'use strict';
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
const EVIDENCE_TARGETS={
 'swing-g2':['G2',()=>window.LinaG2Engine],
 'g4-universe':['G4',()=>window.LinaG4Engine,{report:'LINAS_OPTI_G4_UNIVERSE_V0214_2026-09-15.txt',raw:'LINAS_OPTI_G4_UNIVERSE_RAW_V0214_2026-09-15.json'}],
 'g5-stress':['G5',()=>window.LinaG5Engine,{report:'LINAS_OPTI_G5_STRESS_V0217_2026-09-15.txt',raw:'LINAS_OPTI_G5_STRESS_RAW_V0217_2026-09-15.json'}],
 'swing-g6-cost-boundary':['G6',()=>window.LinaG6Engine,{report:'LINAS_OPTI_G6_COST_BOUNDARY_V0224_2026-09-15.txt',raw:'LINAS_OPTI_G6_COST_BOUNDARY_RAW_V0224_2026-09-15.json'}],
 'g7-g12-battery':['G7_G12',()=>window.LinaBatteryEngine,{report:'LINAS_OPTI_G7_G12_BATTERY_V0226_2026-09-15.txt',raw:'LINAS_OPTI_G7_G12_BATTERY_RAW_V0226_2026-09-15.json'}]
};
function evidenceAction(r){
 const t=EVIDENCE_TARGETS[r.id];if(!t||!window.LinaEvidence)return '';
 const status=window.LinaEvidence.sourceStatus?.(t[0]);
 if(status==='FROZEN · GITHUB ✓')return `<button class="secondary archive-freeze" data-id="${esc(r.id)}" disabled>✓ FROZEN · GITHUB ✓</button>`;
 if(status==='FROZEN · VÄNTAR PÅ SYNK')return `<button class="secondary archive-freeze" data-id="${esc(r.id)}">☁ Synka fryst evidens</button>`;
 return `<button class="primary archive-freeze" data-id="${esc(r.id)}">✓ Säkra evidens</button>`;
}
function metricCards(c){
 return `<div class="archive-kpis">
  <div><small>Robotmognad</small><b>${c.maturity}/100</b><span>Regelbaserad modell</span></div>
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
   <div class="actions">${evidenceAction(r)}<button class="secondary archive-export" data-id="${esc(r.id)}">📤 Exportera rapport</button></div>
  </article>`;
}
function render(root,ctx){
 const D=window.LinaArchiveData,c=D.counters(),recs=D.records();
 root.innerHTML=`<div class="crumb">Dashboard › Historik › Lina Arkiv</div>
 <section class="hero"><h1>Lina Arkiv & Robotmognad</h1><p>Samlad forsknings- och utvecklingshistorik, frysta kandidater, PASS/FAIL, forward-status och större releaser. Gamla resultat skrivs inte över.</p></section>
 <button class="back" id="arBack">← Dashboard</button>
 <section class="workspace archive">
  ${metricCards(c)}
  <div class="maturity-box"><div><b>Robotmognad ${c.maturity}/100</b><span>Poängen räknas från låsta verifierbara milstolpar; nästa stora poängblock kräver riktig framtida Forward, broker och paper-validering.</span></div><div class="maturity-bar"><i style="width:${c.maturity}%"></i></div></div>
  <div class="archive-note"><b>Simuleringsräknaren är återställd som historik:</b> du hade redan observerat <b>över 21 400 simuleringar</b> före Clean Core. Vi visar därför konservativt <b>≥ 21 400</b> som historiskt golv och räknar G3 separat ovanpå det, i stället för att felaktigt ersätta siffran med antal affärer. G1/G2-affärer och Jägaren-teststeg visas fortfarande som egna mått för att undvika dubbelräkning.</div>
  <div class="archive-filter"><button class="secondary active" data-filter="all">Alla</button><button class="secondary" data-filter="Utveckling">Utveckling</button><button class="secondary" data-filter="Swing G2">Swing G2</button><button class="secondary" data-filter="Swing G1">Swing G1</button><button class="secondary" data-filter="Jägaren">Jägaren</button></div>
  <div class="archive-note"><b>Evidencekö:</b> Evidence-kön är bara kontroll/recovery. Nya resultat använder “Godkänn & frys”. Redan frysta historiska resultat kan säkras till GitHub direkt här med “Säkra evidens”. Lina skapar rapport + RAW, hash-verifierar och synkar automatiskt. Om GitHub är tillfälligt otillgängligt ligger resultatet säkert som FROZEN i väntan på nästa synk.</div>
  <div id="evidenceQueue">${window.LinaEvidence?window.LinaEvidence.items().map(x=>`<div class="statusline"><b>${esc(x.name)}</b> · ${esc(x.status)} ${x.status==='PRELIMINÄR'?`<button class="secondary evidence-approve" data-id="${esc(x.id)}">✓ Godkänn & frys</button>`:''}${x.githubPath?`<br><small>${esc(x.githubPath)} · SHA256 ${esc(x.sha256||'')}</small>`:''}</div>`).join('')||'<div class="statusline">Ingen preliminär evidence väntar.</div>':'Evidencehanteraren laddas…'}</div>
  <div id="archiveRecords">${recs.slice().reverse().map(recordCard).join('')}</div>
 </section>`;
 root.querySelector('#arBack').onclick=ctx.back;
 root.querySelectorAll('.evidence-approve').forEach(b=>b.onclick=async()=>{b.disabled=true;try{await window.LinaEvidence.approveAndSync(b.dataset.id);render(root,ctx)}catch(e){alert(e.message||e)}});
 root.querySelectorAll('.archive-freeze').forEach(b=>b.onclick=async()=>{const t=EVIDENCE_TARGETS[b.dataset.id];if(!t)return;const E=t[1]();b.disabled=true;b.textContent='Säkrar…';try{const q=t[2]?await window.LinaEvidence.freezeFiles(t[2],t[0]):await window.LinaEvidence.freezeEngine(E,t[0]);b.textContent=q.status==='FROZEN · GITHUB ✓'?'✓ FROZEN · GITHUB ✓':'✓ FROZEN · VÄNTAR PÅ SYNK';if(q.status!=='FROZEN · GITHUB ✓')b.disabled=false}catch(e){b.disabled=false;b.textContent='✓ Säkra evidens';alert(e.message||e)}});
 root.querySelectorAll('.archive-export').forEach(b=>b.onclick=()=>{const r=D.records().find(x=>x.id===b.dataset.id);if(!r)return;const text=D.reportText(r),name=`LINAS_OPTI_ARKIV_${r.id.toUpperCase()}_V0239.txt`;if(window.LinaEvidence)window.LinaEvidence.stage(name,text,'text/plain','ARKIV_VERIFIERAD');D.downloadRecord(r);render(root,ctx)});
 root.querySelectorAll('.archive-filter button').forEach(b=>b.onclick=()=>{
   root.querySelectorAll('.archive-filter button').forEach(x=>x.classList.remove('active'));b.classList.add('active');
   const f=b.dataset.filter;root.querySelectorAll('.archive-record').forEach(card=>card.style.display=(f==='all'||card.dataset.family===f)?'':'none');
 });
}
window.LinaArchive={render};
})();