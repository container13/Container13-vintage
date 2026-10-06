(function(global){
'use strict';
const KEY='lina_gen16_engine_verify_v0402';
async function run(){
 const E=global.LinaGen16Engine;if(!E?.verify)throw Error('Gen16 Engine saknas');
 const r=await E.verify();if(r.status!=='PASS')throw Error('Gen16 Engine verify FAIL: '+r.failed.join(', '));
 const synthetic=await E.verifySynthetic();if(synthetic.status!=='PASS')throw Error('Gen16 synthetic verify FAIL: '+synthetic.failed.join(', '));
 const receipt={...r,synthetic,verifiedAt:new Date().toISOString()};try{sessionStorage.setItem(KEY,JSON.stringify(receipt))}catch{}return receipt;
}
function show(text,bad=false){const root=document.querySelector('#view');if(!root)return;let box=root.querySelector('[data-gen16-preflight]');if(!box){box=document.createElement('div');box.className='statusline';box.setAttribute('data-gen16-preflight','');root.prepend(box)}box.textContent=text;box.classList.toggle('bad',bad);global.LinaStatusOrder?.apply?.()}
async function visibleVerify(){show('Gen16 · verifierar preregistrerad Engine…');try{const r=await run();show('Gen16 · ENGINE VERIFIED ✓ · PRICE_CHANNEL_BREAKOUT · runnerspec a065ce8a…dbdeafa · research EJ STARTAD · Handel/Forward AV');return r}catch(e){show('Gen16 STOPPAD · '+String(e?.message||e),true);throw e}}
global.LinaGen16Preflight=Object.freeze({run,visibleVerify,KEY});
})(typeof window==='object'?window:globalThis);
