(function(global){
'use strict';
const KEY='lina_gen11_engine_verify_v0373';
async function run(){
 const E=global.LinaGen11Engine;
 if(!E?.verify)throw Error('Gen11 Engine saknas');
 const r=await E.verify();
 try{sessionStorage.setItem(KEY,JSON.stringify({...r,verifiedAt:new Date().toISOString(),release:global.LinaVersion?.release||''}))}catch{}
 if(r.status!=='PASS')throw Error('Gen11 Engine verify FAIL: '+r.failed.join(', '));
 return r;
}
function show(text,bad=false){
 const root=document.querySelector('#view');if(!root)return;
 let box=root.querySelector('[data-gen11-preflight]');if(!box){box=document.createElement('div');box.className='statusline';box.setAttribute('data-gen11-preflight','');root.prepend(box)}
 box.textContent=text;box.classList.toggle('bad',bad);
}
async function visibleVerify(){
 show('Gen11 · verifierar låst Engine…');
 try{const r=await run();show('Gen11 · ENGINE VERIFIED ✓ · runnerspec 56cb0d0d…f10c52b · research EJ startad · Handel/Forward AV');return r}
 catch(e){show('Gen11 STOPPAD · '+String(e?.message||e),true);throw e}
}
global.LinaGen11Preflight=Object.freeze({run,visibleVerify,KEY});
})(typeof window==='object'?window:globalThis);
