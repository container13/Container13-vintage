/* One release badge for all Remember user-facing views. */
(()=>{'use strict';
 const fallback='0.1.167';
 const running=document.querySelector('meta[name="remember-release"]')?.content?.replace(/^remember-/,'')||fallback;
 function mount(version){
  if(!document.getElementById('remember-global-version-style')){
   const style=document.createElement('style');style.id='remember-global-version-style';
   style.textContent='#remember-global-version{position:relative!important;z-index:2;display:table;margin:16px auto calc(18px + env(safe-area-inset-bottom,0px));padding:3px 9px;border-radius:999px;font:500 10px/1.4 system-ui,-apple-system,sans-serif;letter-spacing:.025em;color:#fff8ed;background:rgba(28,24,20,.72);pointer-events:none;white-space:nowrap}body:has(dialog[open]) #remember-global-version{display:none}body:has(.book) #remember-global-version{position:static!important;left:auto!important;right:auto!important;bottom:auto!important;margin:2px 0 0 auto!important;align-self:flex-end!important;z-index:2!important;background:transparent!important}.version[hidden]{display:none!important}';document.head.append(style);
  }
  if(!document.body)return;
  document.querySelectorAll('.version').forEach(n=>{n.hidden=true});
  let el=document.getElementById('remember-global-version');
  if(!el){el=document.createElement('div');el.id='remember-global-version';el.setAttribute('aria-label','Remember versionsnummer');(document.body.querySelector('main .book')&&document.body.querySelector('footer')?document.body.querySelector('footer'):document.body).append(el)}
  el.textContent='Remember · v'+version;
 }
 function start(){
  mount(running);
  fetch('./release.json?check='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.json():null).then(data=>{if(data&&/^\d+\.\d+\.\d+$/.test(data.version)&&data.version!==running){const el=document.getElementById('remember-global-version');if(el)el.textContent='Remember · v'+running+' · uppdatering finns'}}).catch(()=>{});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
