(function(){
  'use strict';
  const APP_VERSION='0.2.37';
  const cards=[
    ['forward','Forward','Riktig forward-validering · G2 + G3 parallellt.'],
    ['research','Forskning','Jägaren, Swing G1, Swing G2, G3, G4 Universe, G5 Stress, G6 Cost Boundary, G7–G12 Research Battery och Broker/Cost Gate.'],
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
      shell(root,'Forskning','Välj forskningsgeneration. G2 är första modulen som migreras.',`<button class="back" id="home">← Dashboard</button><div class="grid"><button class="card" disabled><b>Jägaren</b><small>Fryst · portas senare</small></button><button class="card" disabled><b>Swing G1</b><small>Fryst · portas senare</small></button><button class="card" id="g2"><b>Swing G2</b><small>KLAR · positiv kandidat</small></button><button class="card" id="g3"><b>Swing G3 Walk-Forward</b><small>PASS · metod fryst · plan 75838ed5</small></button><button class="card" id="g4"><b>Swing G4 Universe Robustness</b><small>PASS · FRYST · plan 95d2e735</small></button><button class="card" id="g5"><b>Swing G5 Stress Test</b><small>FAIL · FRYST · plan 6ec36eb2</small></button><button class="card" id="g6"><b>Swing G6 Execution Cost Boundary</b><small>PASS · FRYST · plan 1567bbbe</small></button><button class="card" id="battery"><b>G7–G12 Research Battery</b><small>6/6 PASS · FRYST</small></button><button class="card" id="brokerGate"><b>Broker/Cost Gate</b><small>Aktiv · kostnader, API och mäklarval</small></button></div>`);
      root.querySelector('#home').onclick=()=>R.navigate('dashboard');
      root.querySelector('#g2').onclick=()=>R.navigate('g2');
      root.querySelector('#g3').onclick=()=>R.navigate('g3');
      root.querySelector('#g4').onclick=()=>R.navigate('g4');
      root.querySelector('#g5').onclick=()=>R.navigate('g5');
      root.querySelector('#g6').onclick=()=>R.navigate('g6');
      root.querySelector('#battery').onclick=()=>R.navigate('battery');
      root.querySelector('#brokerGate').onclick=()=>R.navigate('broker-gate');
    });
    R.register('g2',root=>window.LinaG2.render(root,{back:()=>R.navigate('research'),broker:()=>R.navigate('broker-gate')}));
    R.register('g3',root=>window.LinaG3.render(root,{back:()=>R.navigate('research')}));
    R.register('g4',root=>window.LinaG4.render(root,{back:()=>R.navigate('research')}));
    R.register('g5',root=>window.LinaG5.render(root,{back:()=>R.navigate('research')}));
    R.register('g6',root=>window.LinaG6.render(root,{back:()=>R.navigate('research')}));
    R.register('battery',root=>window.LinaBattery.render(root,{back:()=>R.navigate('research')}));
    R.register('broker-gate',root=>window.LinaBrokerGate.render(root,{back:()=>R.navigate('g2')}));
    R.register('forward',root=>{
      shell(root,'Forward','Ny evidens efter frysta anchors. Historiska G2–G12 är avslutade; fokus ligger nu på riktig forward.',`<button class="back" id="home">← Dashboard</button><div class="grid"><button class="card" id="forwardCenter"><b>Forward Evidence Center</b><small>NY · uppdatera G2 + G3 tillsammans · evidensstatus</small></button><button class="card" id="g2forward"><b>Swing G2 Real Forward</b><small>Aktiv · statisk 15efd75a · Handel AV</small></button><button class="card" id="g3forward"><b>Swing G3 Real Forward</b><small>Aktiv · lär månadsvis · plan 75838ed5 · Handel AV</small></button><button class="card" disabled><b>Swing G1 Forward</b><small>Fryst legacy · portas senare</small></button></div>`);
      root.querySelector('#home').onclick=()=>R.navigate('dashboard');
      root.querySelector('#forwardCenter').onclick=()=>R.navigate('forward-center');
      root.querySelector('#g2forward').onclick=()=>R.navigate('g2-forward');
      root.querySelector('#g3forward').onclick=()=>R.navigate('g3-forward');
    });
    R.register('forward-center',root=>window.LinaForwardCenter.render(root,{back:()=>R.navigate('forward')}));
    R.register('g2-forward',root=>window.LinaG2Forward.render(root,{back:()=>R.navigate('forward')}));
    R.register('g3-forward',root=>window.LinaG3Forward.render(root,{back:()=>R.navigate('forward')}));
    R.register('history',root=>{
      shell(root,'Historik','Frysta resultat, rapporter och permanent utvecklingslogg på ett ställe.',`<button class="back" id="home">← Dashboard</button><div class="grid"><button class="card" id="archive"><b>Lina Arkiv</b><small>Forskning, utvecklingslogg, robotmognad, PASS/FAIL och rapporter</small></button></div>`);
      root.querySelector('#home').onclick=()=>R.navigate('dashboard');
      root.querySelector('#archive').onclick=()=>R.navigate('archive');
    });
    R.register('archive',root=>window.LinaArchive.render(root,{back:()=>R.navigate('dashboard')}));
    for(const [r,t,d] of cards.filter(x=>!['research','forward','history'].includes(x[0])))R.register(r,root=>{
      shell(root,t,d,`<button class="back" id="home">← Dashboard</button><section class="workspace"><div class="statusline">Modulen väntar på kontrollerad migrering.</div></section>`);
      root.querySelector('#home').onclick=()=>R.navigate('dashboard');
    });
  }

  // V0.2.17 – Uppdatera ska ge en verklig ny start, inte bara ladda om en redan upplåst session.
  // Bevarar all persistent Lina-data i localStorage, men rensar endast login-sessionen.
  // Navigerar sedan till en ren, cache-bustad index-URL så login visas och senaste index/scripts hämtas.
  function installGitHubSync(){
    const b=document.getElementById('githubSync');
    if(!b||b.dataset.bound==='1')return;
    b.dataset.bound='1';
    const label=b.querySelector('small');
    const set=(text,bad=false)=>{if(label)label.textContent=text;b.classList.toggle('bad',!!bad)};
    b.addEventListener('click',async()=>{
      b.disabled=true;set('Synkar…');
      try{
        if(!window.LinaGitHubSync)throw new Error('Synkmodulen saknas');
        const r=await window.LinaGitHubSync.syncAll();
        set('Synkad');
        b.title=`GitHub synkad ${new Date().toLocaleTimeString('sv-SE',{hour:'2-digit',minute:'2-digit'})} · ${r.keys} lokala poster`;
        setTimeout(()=>set('Synka'),2500);
      }catch(e){set('Stoppad',true);b.title='GitHub-synk stoppad: '+(e?.message||e);setTimeout(()=>set('Synka',false),5000)}
      finally{b.disabled=false}
    });
  }
  function installBrandHome(){
    const b=document.getElementById('brandHome');
    if(!b||b.dataset.bound==='1')return;
    b.dataset.bound='1';
    b.addEventListener('click',()=>window.LinaRouter.navigate('dashboard'));
  }
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
    installGitHubSync();
    installBrandHome();
    registerRoutes();
    window.LinaRouter.start();
  }
  window.LinaApp={version:APP_VERSION,start:startApp};
  document.addEventListener('lina:unlocked',startApp,{once:true});
  if(sessionStorage.getItem('linasopti_unlocked')==='1') startApp();
})();
