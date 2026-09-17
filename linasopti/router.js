(function(){
  'use strict';
  const routes=new Map();let current='dashboard';let navSeq=0;
  function register(name,render){routes.set(name,render)}
  function resolve(name){return routes.has(name)?name:'dashboard'}
  function renderRoute(name){name=resolve(name);current=name;navSeq++;window.LinaState&&LinaState.set({lastRoute:name});routes.get(name)(document.querySelector('#view'));return name}
  function navigate(name,opts){name=resolve(name);const url=location.pathname+location.search+'#'+name;const replace=Boolean(opts&&opts.replace);if(replace)history.replaceState({route:name},'',url);else history.pushState({route:name},'',url);return renderRoute(name)}
  function start(){const r=resolve((location.hash||'').replace(/^#/,'')||'dashboard');history.replaceState({route:r},'',location.pathname+location.search+'#'+r);renderRoute(r)}
  window.addEventListener('popstate',e=>{const r=resolve(e.state?.route||(location.hash||'').replace(/^#/,'')||'dashboard');renderRoute(r)});
  window.LinaRouter={register,navigate,start,current:()=>current,sequence:()=>navSeq,isActive:name=>current===name};
})();
