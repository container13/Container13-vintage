(function(){
  function render(root,ctx){
    root.innerHTML=`<div class="crumb">Dashboard › Forskning › Swing G2 · Breakout/Momentum · A–O</div>
      <section class="hero"><h1>Swing G2</h1><p>Första forskningsmodulen som migreras till Clean Core. Forskningsplanen är dokumenterad men motorn är ännu inte aktiverad i V0.1.1.</p></section>
      <button class="back" id="g2Back">← Forskning</button>
      <section class="workspace"><div class="statusline"><b>Status:</b> skal + navigation verifieras först.</div>
      <p>DEV 2020-01-01 → 2022-12-31 · låst historisk pseudo-forward 2023-01-01 → 2026-09-10 · 648 varianter · Handel AV.</p>
      <button class="primary" disabled>Kör G2 A–O – kommer i nästa migreringssteg</button></section>`;
    document.querySelector('#g2Back').onclick=ctx.back;
  }
  window.LinaG2={render};
})();
