(function(global){
'use strict';
const KEY='lina_gen13_engine_verify_v0379';
async function run(){
 const E=global.LinaGen13Engine;if(!E?.verify)throw Error('Gen13 Engine saknas');
 const r=await E.verify();
 try{sessionStorage.setItem(KEY,JSON.stringify({...r,verifiedAt:new Date().toISOString(),release:global.LinaVersion?.release||''}))}catch{}
 if(r.status!=='PASS')throw Error('Gen13 Engine verify FAIL: '+r.failed.join(', '));
 return r;
}
function show(text,bad=false){
 const root=document.querySelector('#view');if(!root)return;
 let box=root.querySelector('[data-gen13-preflight]');if(!box){box=document.createElement('div');box.className='statusline';box.setAttribute('data-gen13-preflight','');root.prepend(box)}
 box.textContent=text;box.classList.toggle('bad',bad);
}
async function visibleVerify(){
 show('Gen13 · verifierar låst Engine…');
 try{const r=await run();show('Gen13 · ENGINE VERIFIED ✓ · runnerspec e8cd7a71…4afbb42 · research EJ startad · Handel/Forward AV');return r}
 catch(e){show('Gen13 STOPPAD · '+String(e?.message||e),true);throw e}
}
global.LinaGen13Preflight=Object.freeze({run,visibleVerify,KEY});
})(typeof window==='object'?window:globalThis);
