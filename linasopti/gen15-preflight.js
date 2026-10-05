(function(global){
'use strict';
const KEY='lina_gen15_engine_verify_v0389';
async function run(){const E=global.LinaGen15Engine;if(!E?.verify)throw Error('Gen15 Engine saknas');const r=await E.verify();if(r.status!=='PASS')throw Error('Gen15 Engine verify FAIL: '+r.failed.join(', '));const synthetic=await E.verifySynthetic();if(synthetic.status!=='PASS')throw Error('Gen15 synthetic verify FAIL: '+synthetic.failed.join(', '));try{sessionStorage.setItem(KEY,JSON.stringify({...r,synthetic,verifiedAt:new Date().toISOString()}))}catch{}return r}
function show(text,bad=false){const root=document.querySelector('#view');if(!root)return;let box=root.querySelector('[data-gen15-preflight]');if(!box){box=document.createElement('div');box.className='statusline';box.setAttribute('data-gen15-preflight','');root.prepend(box)}box.textContent=text;box.classList.toggle('bad',bad);global.LinaStatusOrder?.apply?.()}
async function visibleVerify(){show('Gen15 · verifierar låst Engine…');try{const r=await run();show('Gen15 · ENGINE VERIFIED ✓ · runnerspec 726b1631…c61b43c · syntetiska tester ✓ · researchstart GODKÄND · inväntar Release Gate · Handel/Forward AV');return r}catch(e){show('Gen15 STOPPAD · '+String(e?.message||e),true);throw e}}
global.LinaGen15Preflight=Object.freeze({run,visibleVerify,KEY});
})(typeof window==='object'?window:globalThis);
