/* Remember startup/resume update check: network-first, preserve unfinished forms. */
(()=>{'use strict';
 const CHECK_MS=5*60*1000;
 const runningRelease=document.querySelector('meta[name="remember-release"]')?.content||'';
 const path=location.pathname;
 const safePage=/\/(?:index|login|register|activate|owner|dashboard|album|album-admin|webmaster)\.html$/.test(path)||path.endsWith('/remember/');
 let initial='',dirty=false,checking=false,queued=false;
 const fingerprint=doc=>{
  const parts=[doc.title,...Array.from(doc.querySelectorAll('style,script,link[rel="stylesheet"]')).map(n=>n.getAttribute('src')||n.getAttribute('href')||n.textContent||'')];
  return parts.join('\n');
 };
 const baseline=()=>{initial=fingerprint(document)};
 const blocked=()=>!safePage||dirty||document.visibilityState!=='visible'||!!document.querySelector('dialog[open]')||!!document.querySelector('[aria-busy="true"]')||!!document.querySelector('input:focus,textarea:focus,select:focus');
 const retryKey='remember-update-attempt-v2';
 let targetRelease='';
 function apply(){
  if(!queued||blocked()||!targetRelease)return;
  // A single automatic attempt for each target release, persisted across reloads.
  // If iOS serves the old document again, never navigate repeatedly.
  let attempted='';
  try{attempted=sessionStorage.getItem(retryKey)||''}catch{}
  if(attempted===targetRelease){
   showManualUpdate();
   return;
  }
  try{sessionStorage.setItem(retryKey,targetRelease)}catch{
   // Without persistent loop protection, do not attempt automatic navigation.
   showManualUpdate();return;
  }
  const url=new URL(location.href);
  url.searchParams.set('_remember_update',targetRelease.replace(/[^a-z0-9.-]/gi,''));
  location.replace(url.href);
 }
 function showManualUpdate(){
  if(document.getElementById('remember-update-banner'))return;
  const banner=document.createElement('div');banner.id='remember-update-banner';
  banner.setAttribute('role','status');
  banner.style.cssText='position:fixed;z-index:9998;left:12px;right:12px;bottom:calc(env(safe-area-inset-bottom,0px) + 42px);margin:auto;max-width:480px;background:#173b31;color:#fff8eb;border:1px solid #e4c899;border-radius:14px;padding:12px 14px;box-shadow:0 8px 30px #0007;font:14px system-ui;display:flex;align-items:center;justify-content:space-between;gap:12px';
  const label=document.createElement('span');label.textContent='Ny version finns. Automatisk uppdatering kunde inte slutföras.';
  const button=document.createElement('button');button.type='button';button.textContent='Försök igen';
  button.style.cssText='border:0;border-radius:10px;background:#e9d4aa;color:#1c3028;font:700 14px system-ui;padding:10px 12px;min-height:42px';
  button.addEventListener('click',()=>{const url=new URL(location.href);url.searchParams.set('_remember_update',String(Date.now()));location.replace(url.href)});
  banner.append(label,button);document.body.append(banner);
 }
 async function check(){
  if(checking||!navigator.onLine)return;checking=true;
  try{
   const url=new URL(location.href);url.searchParams.set('_remember_update',String(Date.now()));
   const response=await fetch(url,{cache:'no-store',credentials:'same-origin',redirect:'follow'});
   if(!response.ok||!response.headers.get('content-type')?.includes('text/html'))return;
   const latest=new DOMParser().parseFromString(await response.text(),'text/html');
   if(fingerprint(latest)!==initial){targetRelease=latest.querySelector('meta[name="remember-release"]')?.content||'changed-'+String(latest.documentElement.outerHTML.length);if(targetRelease!==runningRelease){queued=true;apply();}}
   else if(runningRelease){
    const releaseResponse=await fetch('./release.json?check='+Date.now(),{cache:'no-store',credentials:'same-origin'});
    if(releaseResponse.ok){const manifest=await releaseResponse.json();if(manifest.release&&manifest.release!==runningRelease){targetRelease=manifest.release;queued=true;apply();}}
   }
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
      if(currentCss!==[...parsed.cssRules].map(r=>r.cssText).join('')){targetRelease='css-change';queued=true;apply();break;}
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