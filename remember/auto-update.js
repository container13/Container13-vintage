/* Remember startup/resume update check: network-first, preserve unfinished forms. */
(()=>{'use strict';
 const CHECK_MS=5*60*1000;
 const path=location.pathname;
 const safePage=/\/(?:index|login|activate|owner|dashboard)\.html$/.test(path)||path.endsWith('/remember/');
 let initial='',dirty=false,checking=false,queued=false;
 const fingerprint=doc=>{
  const parts=[doc.title,...Array.from(doc.querySelectorAll('style,script:not([src]),link[rel="stylesheet"]')).map(n=>n.textContent||n.getAttribute('href')||'')];
  return parts.join('\n');
 };
 const baseline=()=>{initial=fingerprint(document)};
 const blocked=()=>!safePage||dirty||document.visibilityState!=='visible'||!!document.querySelector('dialog[open]')||!!document.querySelector('[aria-busy="true"]')||!!document.querySelector('input:focus,textarea:focus,select:focus');
 function apply(){
  if(!queued||blocked())return;
  queued=false;
  // A fresh navigation URL avoids reloading the same cached PWA document.
  const url=new URL(location.href);
  url.searchParams.set('_remember_update',String(Date.now()));
  location.replace(url.href);
 }
 async function check(){
  if(checking||!navigator.onLine)return;checking=true;
  try{
   const url=new URL(location.href);url.searchParams.set('_remember_update',String(Date.now()));
   const response=await fetch(url,{cache:'no-store',credentials:'same-origin',redirect:'follow'});
   if(!response.ok||!response.headers.get('content-type')?.includes('text/html'))return;
   const latest=new DOMParser().parseFromString(await response.text(),'text/html');
   if(fingerprint(latest)!==initial){queued=true;apply();}
  }catch(e){/* Offline: retry on next startup/resume. */}finally{checking=false;}
 }
 document.addEventListener('input',e=>{if(e.target.matches('input:not([type=file]),textarea,select'))dirty=true},{capture:true});
 document.addEventListener('change',e=>{if(e.target.matches('input:not([type=file]),textarea,select'))dirty=true},{capture:true});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){check();apply();}});
 window.addEventListener('pageshow',()=>{check();apply();});
 window.addEventListener('online',check);
 window.addEventListener('focus',()=>{check();apply();});
 setInterval(check,CHECK_MS);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{baseline();check()},{once:true});
 else{baseline();check();}
})();