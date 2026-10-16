/* Remember startup/resume update check: network-first, preserve unfinished forms. */
(()=>{'use strict';
 const CHECK_MS=5*60*1000;
 const path=location.pathname;
 const safePage=/\/(?:index|login|register|activate|owner|dashboard|album|album-admin)\.html$/.test(path)||path.endsWith('/remember/');
 let initial='',dirty=false,checking=false,queued=false;
 const fingerprint=doc=>{
  const parts=[doc.title,...Array.from(doc.querySelectorAll('style,script,link[rel="stylesheet"]')).map(n=>n.getAttribute('src')||n.getAttribute('href')||n.textContent||'')];
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
   else {
    // Detect a changed shared stylesheet even when its URL was not bumped.
    const links=[...document.querySelectorAll('link[rel="stylesheet"]')];
    for(const link of links){
     const href=link.getAttribute('href');if(!href||!href.includes('remember-design.css'))continue;
     const live=await fetch(new URL(href,location.href),{cache:'no-store'});
     if(!live.ok)continue;
     const latestCss=await live.text();
     const sheet=[...document.styleSheets].find(x=>x.href===link.href);
     if(!sheet)continue;
     try{
      // Compare stylesheet content via its CSSOM rule count and cssText fingerprint.
      const currentCss=[...sheet.cssRules].map(r=>r.cssText).join('');
      const parsed=new CSSStyleSheet();parsed.replaceSync(latestCss);
      if(currentCss!==[...parsed.cssRules].map(r=>r.cssText).join('')){queued=true;apply();break;}
     }catch(e){/* Cross-origin or unsupported CSSOM: HTML check remains active. */}
    }
   }
  }catch(e){/* Offline: retry on next startup/resume. */}finally{checking=false;}
 }
 document.addEventListener('input',e=>{if(e.target.matches('input:not([type=file]),textarea,select'))dirty=true},{capture:true});
 document.addEventListener('change',e=>{if(e.target.matches('input:not([type=file]),textarea,select'))dirty=true},{capture:true});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){check();apply();}});
 window.addEventListener('pageshow',()=>{check();apply();});
 window.addEventListener('online',check);
 document.addEventListener('close',()=>{queueMicrotask(apply)},{capture:true});
 document.addEventListener('focusout',()=>{queueMicrotask(apply)},{capture:true});
 window.addEventListener('focus',()=>{check();apply();});
 setInterval(check,CHECK_MS);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{baseline();check()},{once:true});
 else{baseline();check();}
})();