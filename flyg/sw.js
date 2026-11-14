/* Versioned static shell. Flight data and release checks always use the network. */
const CACHE='flyg-shell-0.1.9';
const SHELL=['./','./index.html','./style.css','./app.js','./journey-engine.js','./version.js','./auto-update.js','./pwa.js','./manifest.webmanifest','../project-template/mobile-view-policy.js','./assets/flyg-icon-180.png','./assets/flyg-icon-192.png','./assets/flyg-icon-512.png','./assets/flyg-icon-1024.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL))));
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
