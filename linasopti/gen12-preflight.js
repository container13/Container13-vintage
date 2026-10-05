(function(global){
'use strict';
const KEY='lina_gen12_engine_verify_v0376';
async function run(){
 const E=global.LinaGen12Engine;if(!E?.verify)throw Error('Gen12 Engine saknas');
 const r=await E.verify();
 try{sessionStorage.setItem(KEY,JSON.stringify({...r,verifiedAt:new Date().toISOString(),release:global.LinaVersion?.release||''}))}catch{}
 if(r.status!=='PASS')throw Error('Gen12 Engine verify FAIL: '+r.failed.join(', '));
 return r;
}
function show(text,bad=false){
 const root=document.querySelector('#view');if(!root)return;
 let box=root.querySelector('[data-gen12-preflight]');if(!box){box=document.createElement('div');box.className='statusline';box.setAttribute('data-gen12-preflight','');root.prepend(box)}
 box.textContent=text;box.classList.toggle('bad',bad);
}
async function visibleVerify(){
 show('Gen12 · verifierar låst Engine…');
 try{const r=await run();show('Gen12 · ENGINE VERIFIED ✓ · runnerspec 7e02f720…5c0c4557 · research EJ startad · Handel/Forward AV');return r}
 catch(e){show('Gen12 STOPPAD · '+String(e?.message||e),true);throw e}
}
global.LinaGen12Preflight=Object.freeze({run,visibleVerify,KEY});
})(typeof window==='object'?window:globalThis);
