const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {webcrypto}=require('node:crypto');
const scope='https://example.test/flyg/';
async function scenario({corrupt=false}={}){
 const handlers={},items=new Map();let offline=false,claimed=false,skipped=false;
 async function network(input){if(offline)throw Error('offline');const req=input instanceof Request?input:new Request(new URL(input,scope));const path=new URL(req.url).pathname.slice(1).replace(/\/$/,'/index.html');assert(fs.existsSync(path),path);let bytes=fs.readFileSync(path);
 // Reproduce a fresh worker populated from a browser HTTP cache containing old bytes.
 if(path==='flyg/version.js'&&(req.cache!=='no-store'||!new URL(req.url).searchParams.has('_flyg_build')||corrupt))bytes=Buffer.from("window.ProjectVersion={release:'0.1.8'}");return new Response(bytes,{status:200});}
 const cache={put:async(key,response)=>items.set(new URL(typeof key==='string'?key:key.url,scope).href,response.clone()),addAll:async paths=>{for(const p of paths)await cache.put(p,await network(p))},match:async key=>items.get(new URL(key,scope).href)?.clone()};
 const context={URL,Request,Response,Promise,crypto:webcrypto,caches:{open:async()=>cache,keys:async()=>['flyg-shell-0.1.8','other-project'],delete:async k=>{assert.equal(k,'flyg-shell-0.1.8')}},fetch:network,self:{location:{origin:'https://example.test'},registration:{scope},clients:{claim:async()=>{claimed=true}},skipWaiting:()=>{skipped=true},addEventListener:(name,fn)=>handlers[name]=fn}};
 vm.runInNewContext(fs.readFileSync('flyg/sw.js','utf8'),context);let pending;handlers.install({waitUntil:p=>pending=p});
 if(corrupt){await assert.rejects(pending,/integrity|version|asset/i);return}
 await pending;assert.equal(await (await cache.match('./version.js')).text(),fs.readFileSync('flyg/version.js','utf8'),'new shell must not contain HTTP-cached old version');assert.equal(items.size,15);
 handlers.activate({waitUntil:p=>pending=p});await pending;assert(claimed);offline=true;
 for(const path of ['index.html','live-search.js','pwa.js','assets/flyg-icon-180.png','../project-template/mobile-view-policy.js']){let result;handlers.fetch({request:{url:new URL(path,scope).href,method:'GET',mode:path==='index.html'?'navigate':'cors'},respondWith:p=>result=p});assert(await result,path)}
 for(const path of ['release.json','api/search']){let intercepted=false;handlers.fetch({request:{url:new URL(path,scope).href,method:'GET',mode:'cors'},respondWith:()=>intercepted=true});assert(!intercepted,path)}
 handlers.message({data:{type:'ACTIVATE_UPDATE'}});assert(skipped);
}
(async()=>{await scenario();await scenario({corrupt:true});console.log('SW PASS: stale HTTP cache bypassed, corrupt rollout rejected, offline shell, release/API bypass, scoped cleanup, explicit activation')})().catch(e=>{console.error(e);process.exit(1)});
