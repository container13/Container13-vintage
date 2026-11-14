/* Versioned static shell. Flight data and release checks always use the network. */
const CACHE='flyg-shell-0.1.18';
const SHELL=['./','./index.html','./style.css','./app.js','./live-search.js','./journey-engine.js','./version.js','./auto-update.js','./pwa.js','./manifest.webmanifest','../project-template/mobile-view-policy.js','./assets/flyg-icon-180.png','./assets/flyg-icon-192.png','./assets/flyg-icon-512.png','./assets/flyg-icon-1024.png'];
// Fetch each release asset independently of the browser HTTP cache. Validate the
// entire set before writing so a partial deployment cannot become active.
const INTEGRITY={"./":"dda4e4d13a1b3549b3e8182d9cf0be3e9942192b8f887d1017eb3e5218564f9e","./index.html":"dda4e4d13a1b3549b3e8182d9cf0be3e9942192b8f887d1017eb3e5218564f9e","./style.css":"6a1492ef4f020d7b79f68064683ece3ca03af2db88863072d03a2c34fdb84638","./app.js":"4b8f1e7e6955fdfe67c56a119ba00d389856fb246d4ab6020fb8b09d5ae619e9","./live-search.js":"f90ab6786962c7bcb691a1bee5afd20a1b84342000c0bb0be7e6f29beeca991a","./journey-engine.js":"21ff9d51eeaa8235380ca74937515811fc2c4e217ba6dca732c6d088d250e3ed","./version.js":"e0eb30874ae00c017085950f8c4d1f43bb75947253344ecd01609cca10706a4d","./auto-update.js":"554e1243616240139093f211a246d2248f8e9872a308b5db14295781ef088259","./pwa.js":"b2057e243b072832df09bb35fa973fd2598eb3ab279e8dc9e09b13c9d6ddd13a","./manifest.webmanifest":"f0d6d96a3c40909cb5858aff1d7e37158812457069c663d701151c6329428365","../project-template/mobile-view-policy.js":"7b437997de039e660c4d536da36eeebab1c0d0879aeb992506a37bd0541c99ee","./assets/flyg-icon-180.png":"510e87b5726e40f267b703d23002accc840d351e14213d066c560180549e8dd6","./assets/flyg-icon-192.png":"a21a4c08acd67b03685150bb7d78a4ded6316adef201560bb9c8d0e8e36a8001","./assets/flyg-icon-512.png":"8d69a664f188a02f0d5ddd455eec54cb260aaf38adf67bb099e16055b489faf1","./assets/flyg-icon-1024.png":"5ffa574e8d8eceb3ce3cbf15d8eaeca061b58ea1cc60e70805de8886b29e5bc1"};
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const entries=await Promise.all(SHELL.map(async path=>{
  const canonical=new URL(path,self.registration.scope);
  const source=new URL(canonical);source.searchParams.set('_flyg_build',CACHE);
  const response=await fetch(new Request(source.href,{cache:'no-store',credentials:'same-origin'}));
  if(!response.ok)throw new Error('Flyg asset unavailable: '+path);
  const digest=await crypto.subtle.digest('SHA-256',await response.clone().arrayBuffer());
  const hash=Array.from(new Uint8Array(digest),byte=>byte.toString(16).padStart(2,'0')).join('');
  if(hash!==INTEGRITY[path])throw new Error('Flyg asset integrity mismatch: '+path);
  return [canonical.href,response];
 }));
 const cache=await caches.open(CACHE);
 await Promise.all(entries.map(([url,response])=>cache.put(url,response)));
})()));
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting()});
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('flyg-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin)return;
 if(url.pathname.endsWith('/release.json')||url.pathname.includes('/api/'))return;
 if(req.mode==='navigate'&&url.pathname.startsWith(new URL(self.registration.scope).pathname)){
  event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match('./index.html'))||fetch(req)));return;
 }
 if(!SHELL.some(path=>new URL(path,self.registration.scope).pathname===url.pathname))return;
 event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(url.pathname))||fetch(req)));
});
