(function(){
  'use strict';
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function stageCards(x){return window.LinaG2Engine.STAGES.map(([l,n,d])=>{const z=x?.stages?.[l],cl=z?'done':'';return `<div class="g2-stage ${cl}"><b>${l} · ${esc(n)}</b><small>${esc(z?.summary||d)}</small></div>`}).join('')}
  function render(root,ctx){
    const E=window.LinaG2Engine,x=E.load(),done=Object.keys(x?.stages||{}).length,locked=!!x?.planLocked,complete=!!x?.stages?.O;
    let title='Steg 1 · Lås forskningsplanen',text='Planen är förregistrerad. Du behöver inte välja marknad, period eller testinställningar.',action='<button id="g2Primary" class="primary">🔒 Lås G2-planen</button>',hint='Efter låsning får du en enda Kör-knapp.';
    if(locked&&!complete){title='Steg 2 · Kör Swing G2 A–O';text=`${done}/15 steg klara. Lina hämtar rätt data, kör testerna i rätt ordning, fryser kandidaten vid M och öppnar pseudo-forward först vid N.`;action=`<button id="g2Primary" class="primary">${done?'▶ Fortsätt G2 A–O':'▶ Kör G2 A–O'}</button>`;hint='Du behöver inte gå via det generella Data-verktyget.'}
    if(complete){title='✓ Swing G2 A–O är klar';text=`${esc(x.final?.verdict||'Slutrapport klar')}. Körningen är färdig.`;action='<button id="g2Export" class="primary">📤 Exportera G2-rapport till ChatGPT</button>';hint='Nästa: exportera rapporten och dra filen till ChatGPT.'}
    root.innerHTML=`<div class="crumb">Dashboard › Forskning › Swing G2 · Breakout/Momentum · A–O</div>
      <section class="hero"><h1>Swing G2</h1><p>Breakout/Momentum · auktoritativ G2-motor portad från gamla Lina. Handel AV.</p></section>
      <button class="back" id="g2Back">← Forskning</button>
      <section class="workspace g2-flow"><div class="eyebrow">SWING G2 · GUIDAT FORSKNINGSFLÖDE</div><h2>${title}</h2><p>${text}</p>
      <div class="g2-fixed"><b>Fast plan</b><span>DEV 2020-01-01 → 2022-12-31</span><span>Pseudo-forward 2023-01-01 → 2026-09-10</span><span>648 varianter · 16 aktier + SPY · 0,10 % kostnad/sida</span></div>
      <div class="actions">${action}${x?'<button id="g2Raw" class="secondary">🧾 Raw JSON</button>':''}${x?'<button id="g2Reset" class="secondary">↺ Återställ endast G2</button>':''}</div><div id="g2Hint" class="g2-hint">${hint}</div>
      <div id="g2Live" class="statusline"><b>${complete?'A–O KLART':locked?'Redo':'Inte låst'}</b><span>${complete?esc(x.final?.verdict||''):' '}</span></div>
      <div class="g2-progress"><div><b>Alphabet A–O</b><span>${done} / 15</span></div><progress value="${done}" max="15"></progress></div>
      <div class="g2-stages">${stageCards(x)}</div></section>`;
    root.querySelector('#g2Back').onclick=ctx.back;
    const p=root.querySelector('#g2Primary');if(p)p.onclick=async()=>{if(!locked){E.lock();render(root,ctx);return}p.disabled=true;p.textContent='⏳ G2 kör…';try{await E.run()}catch(e){}render(root,ctx)};
    root.querySelector('#g2Export')?.addEventListener('click',()=>E.exportReport());
    root.querySelector('#g2Raw')?.addEventListener('click',()=>E.exportRaw());
    root.querySelector('#g2Reset')?.addEventListener('click',()=>{if(confirm('Återställa endast Swing G2? Övriga Lina-data påverkas inte.')){E.reset();render(root,ctx)}});
  }
  if(!window.__linaG2LiveBound){
    window.__linaG2LiveBound=true;
    document.addEventListener('lina:g2live',e=>{const box=document.querySelector('#g2Live');if(box)box.innerHTML=`<b>${esc(e.detail.stage)}</b><span>${esc(e.detail.detail)}</span>`});
  }
  window.LinaG2={render};
})();
