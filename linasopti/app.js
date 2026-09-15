(function(){
  'use strict';
  const APP_VERSION='0.2.15';
  const cards=[
    ['forward','Forward','Riktig forward-validering · G2 + G3 parallellt.'],
    ['research','Forskning','Jägaren, Swing G1, Swing G2, G3, G4 Universe och Broker/Cost Gate.'],
    ['history','Historik','Projektresa, tester och frysta beslut.'],
    ['data','Data','Datakällor och integritetskontroller.'],
    ['tools','Verktyg','Backup, export och diagnostik.'],
    ['about','Om Lina','Metod, mognad och säkerhetsregler.']
  ];
  function shell(root,title,text,body){root.innerHTML=`<div class="crumb">Dashboard${title==='Linas lägesbild'?'':' › '+title}</div><section class="hero"><h1>${title}</h1><p>${text}</p></section>${body||''}`}
  function registerRoutes(){
    const R=window.LinaRouter;
    R.register('dashboard',root=>{
      shell(root,'Linas lägesbild','Clean Core är den nya tekniska basen. Ingen legacy-kod körs här.',`<div class="grid">${cards.map(([r,t,d])=>`<button class="card" data-route="${r}"><b>${t}</b><small>${d}</small></button>`).join('')}</div>`);
      root.querySelectorAll('[data-route]').forEach(b=>b.onclick=()=>R.navigate(b.dataset.route));
    });
    R.register('research',root=>{
      shell(root,'Forskning','Välj forskningsgeneration. G2 är första modulen som migreras.',`<button class="back" id="home">← Dashboard</button><div class="grid"><button class="card" disabled><b>Jägaren</b><small>Fryst · portas senare</small></button><button class="card" disabled><b>Swing G1</b><small>Fryst · portas senare</small></button><button class="card" id="g2"><b>Swing G2</b><small>KLAR · positiv kandidat</small></button><button class="card" id="g3"><b>Swing G3 Walk-Forward</b><small>PASS · metod fryst · plan 75838ed5</small></button><button class="card" id="g4"><b>Swing G4 Universe Robustness</b><small>PLAN LÅST · kör portabilitetstest</small></button><button class="card" id="brokerGate"><b>Broker/Cost Gate</b><small>Aktiv · kostnader, API och mäklarval</small></button></div>`);
      root.querySelector('#home').onclick=()=>R.navigate('dashboard');
      root.querySelector('#g2').onclick=()=>R.navigate('g2');
      root.querySelector('#g3').onclick=()=>R.navigate('g3');
      root.querySelector('#g4').onclick=()=>R.navigate('g4');
      root.querySelector('#brokerGate').onclick=()=>R.navigate('broker-gate');
    });
    R.register('g2',root=>window.LinaG2.render(root,{back:()=>R.navigate('research'),broker:()=>R.navigate('broker-gate')}));
    R.register('g3',root=>window.LinaG3.render(root,{back:()=>R.navigate('research')}));
    R.register('g4',root=>window.LinaG4.render(root,{back:()=>R.navigate('research')}));
    R.register('broker-gate',root=>window.LinaBrokerGate.render(root,{back:()=>R.navigate('g2')}));
    R.register('forward',root=>{
      shell(root,'Forward','Här räknas endast ny data efter respektive fryst anchor.',`<button class="back" id="home">← Dashboard</button><div class="grid"><button class="card" id="g2forward"><b>Swing G2 Real Forward</b><small>Aktiv · statisk 15efd75a · Handel AV</small></button><button class="card" id="g3forward"><b>Swing G3 Real Forward</b><small>Aktiv · lär månadsvis · plan 75838ed5 · Handel AV</small></button><button class="card" disabled><b>Swing G1 Forward</b><small>Fryst legacy · portas senare</small></button></div>`);
      root.querySelector('#home').onclick=()=>R.navigate('dashboard');
      root.querySelector('#g2forward').onclick=()=>R.navigate('g2-forward');
      root.querySelector('#g3forward').onclick=()=>R.navigate('g3-forward');
    });
    R.register('g2-forward',root=>window.LinaG2Forward.render(root,{back:()=>R.navigate('forward')}));
    R.register('g3-forward',root=>window.LinaG3Forward.render(root,{back:()=>R.navigate('forward')}));
    R.register('history',root=>{
      shell(root,'Historik','Alla frysta resultat och rapporter på ett ställe.',`<button class="back" id="home">← Dashboard</button><div class="grid"><button class="card" id="archive"><b>Lina Arkiv</b><small>Robotmognad, simuleringar, PASS/FAIL och rapporter</small></button></div>`);
      root.querySelector('#home').onclick=()=>R.navigate('dashboard');
      root.querySelector('#archive').onclick=()=>R.navigate('archive');
    });
    R.register('archive',root=>window.LinaArchive.render(root,{back:()=>R.navigate('dashboard')}));
    for(const [r,t,d] of cards.filter(x=>!['research','forward','history'].includes(x[0])))R.register(r,root=>{
      shell(root,t,d,`<button class="back" id="home">← Dashboard</button><section class="workspace"><div class="statusline">Modulen väntar på kontrollerad migrering.</div></section>`);
      root.querySelector('#home').onclick=()=>R.navigate('dashboard');
    });
  }

  // V0.2.15 – Uppdatera ska ge en verklig ny start, inte bara ladda om en redan upplåst session.
  // Bevarar all persistent Lina-data i localStorage, men rensar endast login-sessionen.
  // Navigerar sedan till en ren, cache-bustad index-URL så login visas och senaste index/scripts hämtas.
  function installRefresh(){
    const b=document.getElementById('refreshApp');
    if(!b||b.dataset.bound==='1')return;
    b.dataset.bound='1';
    b.addEventListener('click',()=>{
      b.disabled=true;
      const label=b.querySelector('small');
      if(label)label.textContent='Laddar…';
      sessionStorage.removeItem('linasopti_unlocked');
      const base=window.location.origin+window.location.pathname;
      const next=base+'?force_login=1&update='+Date.now();
      window.location.assign(next);
    });
  }
  function startApp(){
    const app=document.querySelector('#app');
    if(!app)return;
    app.hidden=false;
    installRefresh();
    registerRoutes();
    window.LinaRouter.start();
  }
  window.LinaApp={version:APP_VERSION,start:startApp};
  document.addEventListener('lina:unlocked',startApp,{once:true});
  if(sessionStorage.getItem('linasopti_unlocked')==='1') startApp();
})();
