(function(){
  'use strict';
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  const f=n=>Number(n).toLocaleString('sv-SE',{maximumFractionDigits:0});
  const pf=n=>Number.isFinite(n)?Number(n).toFixed(2):'∞';
  const pct=n=>(100*Number(n)).toFixed(2)+'%';

  function row(r,base){
    const diff=r.pl-base.pl;
    return `<tr>
      <td><b>${esc(r.name)}</b><small>${esc(r.badge)}</small></td>
      <td>${f(r.pl)}</td>
      <td>${pf(r.pf)}</td>
      <td>${pct(r.wr)}</td>
      <td>${pct(r.dd)}</td>
      <td>${diff>=0?'+':''}${f(diff)}</td>
    </tr>`;
  }

  function render(root,ctx){
    const E=window.LinaBrokerGateEngine;
    const g2=window.LinaG2Engine?.load?.();
    if(!g2?.stages?.O){
      root.innerHTML=`<div class="crumb">Dashboard › Forskning › Broker/Cost Gate</div><section class="hero"><h1>Broker/Cost Gate</h1><p>G2 måste först vara färdig.</p></section><button class="back" id="bgBack">← Forskning</button>`;
      root.querySelector('#bgBack').onclick=ctx.back; return;
    }
    const results=E.allResults();
    const base=results.find(x=>x.id==='g2');
    const be=E.breakEvenSide();
    const ibkr=results.find(x=>x.id==='ibkr');
    const alpaca=results.find(x=>x.id==='alpaca');
    const nord=results.find(x=>x.id==='nordnet_auto');

    root.innerHTML=`<div class="crumb">Dashboard › Forskning › Swing G2 › Broker/Cost Gate</div>
      <section class="hero"><h1>Broker/Cost Gate</h1><p>Exakt samma 144 frysta G2-affärer reprissätts med olika kostnadsantaganden. Strategin ändras inte. Handel AV.</p></section>
      <button class="back" id="bgBack">← Swing G2</button>

      <section class="workspace broker-gate">
        <div class="eyebrow">G2 · KANDIDAT ${esc(g2.candidate?.hash||'')}</div>
        <h2>Klarar edgen verkligare kostnader?</h2>
        <div class="broker-summary">
          <div><small>G2 referens</small><b>${f(base.pl)}</b><span>PF ${pf(base.pf)}</span></div>
          <div><small>IBKR-proxy</small><b>${f(ibkr.pl)}</b><span>PF ${pf(ibkr.pf)}</span></div>
          <div><small>Alpaca-proxy</small><b>${f(alpaca.pl)}</b><span>PF ${pf(alpaca.pf)}</span></div>
          <div><small>Nordnet auto-FX proxy</small><b>${f(nord.pl)}</b><span>PF ${pf(nord.pf)}</span></div>
        </div>

        <div class="broker-warning"><b>Viktigt:</b> G2:s 100 000-kapital och amerikanska aktiepriser har hittills behandlats i samma modellvaluta. Resultaten nedan är därför främst en <b>relativ kostnadsjämförelse</b>, inte en exakt SEK-faktura från en mäklare. Detta rättas i den riktiga forward-/brokerintegrationen.</div>

        <div class="broker-break"><b>Break-even</b><span>G2 går ungefär till noll först runt <strong>${pct(be)} per sida</strong> i samlad procentfriktion.</span></div>

        <div class="table-wrap"><table class="broker-table"><thead><tr><th>Profil</th><th>P/L</th><th>PF</th><th>WR</th><th>DD</th><th>vs G2</th></tr></thead>
        <tbody>${results.map(r=>row(r,base)).join('')}</tbody></table></div>

        <h3>Vad profilerna betyder</h3>
        <div class="broker-cards">${results.filter(r=>['ibkr','alpaca','nordnet_auto','nordnet_fx'].includes(r.id)).map(r=>`<article><b>${esc(r.name)}</b><p>${esc(r.note)}</p></article>`).join('')}</div>

        <div class="broker-decision">
          <div class="eyebrow">GATE-BEDÖMNING</div>
          <h3>G2 har fortfarande kostnadsmarginal</h3>
          <p>IBKR- och Alpaca-proxyn ligger tydligt över den frysta G2-gränsen PF 1.0. Nordnet med automatisk valutaväxling blir mycket dyrare men är fortfarande positiv i denna proxy. Det här väljer inte mäklare ännu; API, kontoform, FX och skatt återstår.</p>
        </div>

        <div class="actions"><button id="bgExport" class="primary">📤 Exportera Broker/Cost-rapport</button></div>
      </section>`;
    root.querySelector('#bgBack').onclick=ctx.back;
    root.querySelector('#bgExport').onclick=()=>E.exportReport();
  }
  window.LinaBrokerGate={render};
})();