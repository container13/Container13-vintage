/* Versioned static shell. Flight data and release checks always use the network. */
const CACHE='flyg-shell-0.1.31';
const SHELL=['./','./index.html','./style.css','./app.js','./live-search.js','./selection-feedback.js','./journey-engine.js','./version.js','./auto-update.js','./pwa.js','./manifest.webmanifest','../project-template/mobile-view-policy.js','./assets/flyg-icon-180.png','./assets/flyg-icon-192.png','./assets/flyg-icon-512.png','./assets/flyg-icon-1024.png'];
// Fetch each release asset independently of the browser HTTP cache. Validate the
// entire set before writing so a partial deployment cannot become active.
const INTEGRITY={"./":"9b600a8577e6387b0c98e99933a1dc1db46df4e961c95b3b96032262a525c9c5","./index.html":"9b600a8577e6387b0c98e99933a1dc1db46df4e961c95b3b96032262a525c9c5","./style.css":"fcdbff8abf4e27169ab391af68e13ffc3916fa773e23d876c1643eebcb790120","./app.js":"119f1efb8965545a47751c4ae16d87220498e370431c44f8b06502570fe00921","./live-search.js":"bb44c6572006ac9b21f3117987b8f4a94adfff3c2e83a3015c1684506e965ad9","./selection-feedback.js":"8049c2db2e22a84475c2cdda2d2c904ffd5cd8cb204f3b03faf4da2282aac239","./journey-engine.js":"cdfa30cbdf23a8586bc3f725680135e3d5ab412019446cb0fabd8796c30a66f9","./version.js":"62432c7673c4ab54908e38dd35f92d27506fcba2e5a3d51fe15d68899970415e","./auto-update.js":"baa8c3803c6c7b81fb72ec86498fcd61e46930cadf887f65a9e2b85c550efc90","./pwa.js":"e5b8dbb3a280a034b5022a76406b6b162fdf52720cf8eb7c040cdee3442b32b6","./manifest.webmanifest":"f0d6d96a3c40909cb5858aff1d7e37158812457069c663d701151c6329428365","../project-template/mobile-view-policy.js":"7b437997de039e660c4d536da36eeebab1c0d0879aeb992506a37bd0541c99ee","./assets/flyg-icon-180.png":"510e87b5726e40f267b703d23002accc840d351e14213d066c560180549e8dd6","./assets/flyg-icon-192.png":"a21a4c08acd67b03685150bb7d78a4ded6316adef201560bb9c8d0e8e36a8001","./assets/flyg-icon-512.png":"8d69a664f188a02f0d5ddd455eec54cb260aaf38adf67bb099e16055b489faf1","./assets/flyg-icon-1024.png":"5ffa574e8d8eceb3ce3cbf15d8eaeca061b58ea1cc60e70805de8886b29e5bc1"};
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

