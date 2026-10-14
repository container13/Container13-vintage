/* Remember automatic update check: network-first, no persistent cache. */
(()=>{'use strict';
 const CHECK_MS=5*60*1000;
 const path=location.pathname;
 const safePage=/\/(?:index|login|activate)\.html$/.test(path)||path.endsWith('/remember/');
 let initial='',dirty=false,checking=false,queued=false;
 const fingerprint=doc=>{
  // Compare original static markup, not live input values or DOM mutations.
  const parts=[doc.title,...Array.from(doc.querySelectorAll('style,script:not([src]),link[rel="stylesheet"]')).map(n=>n.textContent||n.getAttribute('href')||'')];
  return parts.join('\n');
 };
 const baseline=()=>{initial=fingerprint(document)};
 const blocked=()=>!safePage||dirty||document.visibilityState!=='visible'||!!document.querySelector('input[type=file]')||!!document.querySelector('[aria-busy="true"]')||!!document.querySelector('button:disabled:not([hidden])')||!!document.querySelector('input:focus,textarea:focus,select:focus');
 function apply(){if(!queued||blocked())return;queued=false;location.reload();}
 async function check(){
  if(checking||!navigator.onLine)return;checking=true;
  try{
   const url=new URL(location.href);url.searchParams.set('_remember_update',String(Date.now()));
   const response=await fetch(url,{cache:'no-store',credentials:'same-origin',redirect:'follow'});
   if(!response.ok||!response.headers.get('content-type')?.includes('text/html'))return;
   const latest=new DOMParser().parseFromString(await response.text(),'text/html');
   if(fingerprint(latest)!==initial){queued=true;apply();}
  }catch(e){/* Offline: try on next return. */}finally{checking=false;}
 }
 document.addEventListener('input',()=>{dirty=true},{capture:true});
 document.addEventListener('change',()=>{dirty=true},{capture:true});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){check();apply();}});
 window.addEventListener('pageshow',()=>{check();apply();});
 window.addEventListener('online',check);
 window.addEventListener('focus',()=>{check();apply();});
 setInterval(check,CHECK_MS);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{baseline();setTimeout(check,1500)},{once:true});
 else{baseline();setTimeout(check,1500);}
})();