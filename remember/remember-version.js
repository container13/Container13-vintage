/* One release badge for all Remember user-facing views. */
(()=>{'use strict';
 const fallback='0.1.52';
 function mount(version){
  if(!document.body)return;
  document.querySelectorAll('.version').forEach(n=>{n.hidden=true});
  let el=document.getElementById('remember-global-version');
  if(!el){el=document.createElement('div');el.id='remember-global-version';el.setAttribute('aria-label','Remember versionsnummer');document.body.append(el)}
  el.textContent='Remember · v'+version;
 }
 function start(){
  mount(fallback);
  fetch('./release.json?check='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.json():null).then(data=>{if(data&&/^\d+\.\d+\.\d+$/.test(data.version))mount(data.version)}).catch(()=>{});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
