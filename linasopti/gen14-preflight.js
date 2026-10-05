(function(global){
'use strict';
const KEY='lina_gen14_engine_verify_v0384';
async function run(){
 const E=global.LinaGen14Engine;if(!E?.verify)throw Error('Gen14 Engine saknas');
 const r=await E.verify();if(r.status!=='PASS')throw Error('Gen14 Engine verify FAIL: '+r.failed.join(', '));
 try{sessionStorage.setItem(KEY,JSON.stringify({...r,verifiedAt:new Date().toISOString()}))}catch{}
 return r;
}
function show(text,bad=false){const root=document.querySelector('#view');if(!root)return;let box=root.querySelector('[data-gen14-preflight]');if(!box){box=document.createElement('div');box.className='statusline';box.setAttribute('data-gen14-preflight','');root.prepend(box)}box.textContent=text;box.classList.toggle('bad',bad);global.LinaStatusOrder?.apply?.()}
async function visibleVerify(){show('Gen14 · verifierar låst Engine…');try{const r=await run();show('Gen14 · ENGINE VERIFIED ✓ · runnerspec 5792360a…47e03fc5 · research-start GODKÄND · Handel/Forward AV');return r}catch(e){show('Gen14 STOPPAD · '+String(e?.message||e),true);throw e}}
global.LinaGen14Preflight=Object.freeze({run,visibleVerify,KEY});
})(typeof window==='object'?window:globalThis);
