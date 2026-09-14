(function(){
  const routes=new Map();let current='dashboard';
  function register(name,render){routes.set(name,render)}
  function navigate(name){if(!routes.has(name))name='dashboard';current=name;history.replaceState({route:name},'',location.pathname+location.search+'#'+name);window.LinaState&&LinaState.set({lastRoute:name});routes.get(name)(document.querySelector('#view'))}
  function start(){const r=(location.hash||'').replace(/^#/,'')||'dashboard';navigate(r)}
  window.LinaRouter={register,navigate,start,current:()=>current};
})();
