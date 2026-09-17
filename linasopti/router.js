(function(){
  'use strict';
  const routes=new Map();let current='dashboard';let navSeq=0;
  function register(name,render){routes.set(name,render)}
  function resolve(name){return routes.has(name)?name:'dashboard'}
  function renderRoute(name){name=resolve(name);current=name;navSeq++;window.LinaState&&LinaState.set({lastRoute:name});const root=document.querySelector('#view');try{routes.get(name)(root)}catch(e){console.error('Route render failed:',name,e);if(root)root.innerHTML='<section class="workspace"><h2>Vyn kunde inte öppnas</h2><div class="statusline bad">'+String(e&&e.message||e)+'</div><button class="back" id="routeFailBack">← Dashboard</button></section>';root?.querySelector('#routeFailBack')?.addEventListener('click',()=>navigate('dashboard'))}return name}
  function navigate(name,opts){name=resolve(name);const url=location.pathname+location.search+'#'+name;const replace=Boolean(opts&&opts.replace);if(replace)history.replaceState({route:name},'',url);else history.pushState({route:name},'',url);return renderRoute(name)}
  function start(){const r=resolve((location.hash||'').replace(/^#/,'')||'dashboard');history.replaceState({route:r},'',location.pathname+location.search+'#'+r);renderRoute(r)}
  window.addEventListener('popstate',e=>{const r=resolve(e.state?.route||(location.hash||'').replace(/^#/,'')||'dashboard');renderRoute(r)});
  window.LinaRouter={register,navigate,start,current:()=>current,sequence:()=>navSeq,isActive:name=>current===name};
})();
