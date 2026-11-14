/* Versioned static shell. Flight data and release checks always use the network. */
const CACHE='flyg-shell-0.1.36';
const SHELL=['./','./index.html','./style.css','./app.js','./live-search.js','./selection-feedback.js','./journey-engine.js','./version.js','./auto-update.js','./pwa.js','./manifest.webmanifest','../project-template/mobile-view-policy.js','./assets/flyg-icon-180.png','./assets/flyg-icon-192.png','./assets/flyg-icon-512.png','./assets/flyg-icon-1024.png'];
// Fetch each release asset independently of the browser HTTP cache. Validate the
// entire set before writing so a partial deployment cannot become active.
const INTEGRITY={"./":"27a2ce146871b8d6af1d9b8c07333300f5517f4bf5b73dcb7487bd478270dfc9","./index.html":"27a2ce146871b8d6af1d9b8c07333300f5517f4bf5b73dcb7487bd478270dfc9","./style.css":"fcdbff8abf4e27169ab391af68e13ffc3916fa773e23d876c1643eebcb790120","./app.js":"48a10fa52a5462ffd7536682d008440a1751cc8fd80fc22ffdb90d4a9382772f","./live-search.js":"62e5cd90e7dcaaf7729c4f3a8a9a035205e6a11eebbd2f184c842630b35de972","./selection-feedback.js":"8049c2db2e22a84475c2cdda2d2c904ffd5cd8cb204f3b03faf4da2282aac239","./journey-engine.js":"1ac19a9f48ddee8a52d9d1ba62b80cea1bff908bd2fd863c6f823558ac679fdd","./version.js":"41a7dd65c46c66ce234a0bc95dee3f3afabcf1c7f40e0579cd6872d64a8968a8","./auto-update.js":"baa8c3803c6c7b81fb72ec86498fcd61e46930cadf887f65a9e2b85c550efc90","./pwa.js":"e5b8dbb3a280a034b5022a76406b6b162fdf52720cf8eb7c040cdee3442b32b6","./manifest.webmanifest":"f0d6d96a3c40909cb5858aff1d7e37158812457069c663d701151c6329428365","../project-template/mobile-view-policy.js":"7b437997de039e660c4d536da36eeebab1c0d0879aeb992506a37bd0541c99ee","./assets/flyg-icon-180.png":"510e87b5726e40f267b703d23002accc840d351e14213d066c560180549e8dd6","./assets/flyg-icon-192.png":"a21a4c08acd67b03685150bb7d78a4ded6316adef201560bb9c8d0e8e36a8001","./assets/flyg-icon-512.png":"8d69a664f188a02f0d5ddd455eec54cb260aaf38adf67bb099e16055b489faf1","./assets/flyg-icon-1024.png":"5ffa574e8d8eceb3ce3cbf15d8eaeca061b58ea1cc60e70805de8886b29e5bc1"};
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
 // Rescue older cache-first installations after the entire new shell is validated.
 // Only the known 0.1.24 legacy cache triggers automatic takeover.
 const existing=await caches.keys();
 if(existing.includes('flyg-shell-0.1.24'))await self.skipWaiting();
})()));
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting()});
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('flyg-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
// App shell is network-first. Only flight search responses are cached by SearchGate.
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin)return;
 if(url.pathname.endsWith('/release.json')||url.pathname.includes('/api/'))return;
 const inScope=url.pathname.startsWith(new URL(self.registration.scope).pathname);
 const isShell=SHELL.some(path=>new URL(path,self.registration.scope).pathname===url.pathname);
 if(!inScope&&!isShell)return;
 event.respondWith((async()=>{
  try{
   const fresh=await fetch(req,{cache:'no-store'});
   if(fresh.ok)return fresh;
   throw new Error('HTTP '+fresh.status);
  }catch(error){
   const cache=await caches.open(CACHE);
   const fallback=await cache.match(req,{ignoreSearch:true})||(req.mode==='navigate'?await cache.match('./index.html'):null);
   return fallback||Response.error();
  }
 })());
});

