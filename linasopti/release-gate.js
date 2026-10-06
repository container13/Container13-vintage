(function(global){
'use strict';
const KEY='lina_release_gate_v0399',REQUIRED_RELEASE='V0.3.99',REQUIRED_CACHE='0.3.99',SPEC_SHA='a065ce8ad2285010493f8491c86116f01025ed3554be18744471de394dbdeafa';
const item=(id,pass,detail)=>({id,pass:Boolean(pass),detail});
async function run(){
 const tests=[],root=document.querySelector('#view'),current=root?.querySelector('[data-gen16-preflight]'),children=root?[...root.children]:[];
 tests.push(item('release_source',global.LinaVersion?.release===REQUIRED_RELEASE&&global.LinaVersion?.cache===REQUIRED_CACHE,'loaded='+String(global.LinaVersion?.release)+'/'+String(global.LinaVersion?.cache)));
 tests.push(item('final_view_exists',Boolean(root),'Final #view exists.'));
 tests.push(item('current_action_visible',Boolean(current&&current.textContent.includes('ENGINE VERIFIED')),'Gen16 verified visible.'));
 tests.push(item('current_action_first',Boolean(current&&children[0]===current),'Gen16 current action first.'));
 tests.push(item('gen16_engine_receipt',(()=>{try{const x=JSON.parse(sessionStorage.getItem(global.LinaGen16Preflight?.KEY)||'null');return x?.status==='PASS'&&x?.synthetic?.status==='PASS'&&x?.synthetic?.usesObservedDataset===false&&x?.specSha256===SPEC_SHA}catch{return false}})(),'Gen16 engine/synthetic receipt exact.'));
 tests.push(item('gen16_human_start_auth',global.LinaGen16Workflow?.AUTH?.approved===true&&global.LinaGen16Workflow?.AUTH?.approvedRelease==='V0.3.95'&&global.LinaGen16Workflow?.AUTH?.specSha256===SPEC_SHA,'Explicit human start authorization exact.'));
 tests.push(item('gen16_locked_spec',global.LinaGen16Engine?.SPEC?.status==='LOCKED_PRE_RESEARCH'&&global.LinaGen16Engine?.SPEC_SHA256===SPEC_SHA,'Gen16 exact locked spec.'));
 tests.push(item('gen16_signal_exact',global.LinaGen16Engine?.SPEC?.candidateVariant==='PRICE_CHANNEL_BREAKOUT'&&global.LinaGen16Engine?.SPEC?.priceChannelBreakout?.newNumericParameters===0&&global.LinaGen16Engine?.SPEC?.priceChannelBreakout?.currentBarExcluded===true,'Price channel exact; zero new numeric params.'));
 tests.push(item('gen15_frozen',(()=>{try{const g=global.LinaGen15Workflow?.state?.();return g?.state==='GEN15_COMPLETE_NO_CANDIDATE'&&Boolean(g?.summaryFreeze?.frozen)&&Object.keys(g?.checkpoints||{}).length===8}catch{return false}})(),'Gen15 frozen NO_CANDIDATE 8/8.'));
 tests.push(item('gen16_unobserved',(()=>{try{const g=global.LinaGen16Workflow?.state?.();return g?.researchOpened!==true&&Object.keys(g?.checkpoints||{}).length===0}catch{return false}})(),'No Gen16 observation before gate.'));
 tests.push(item('trade_off',document.querySelector('.header-status strong')?.textContent.trim()==='Handel AV','Trade OFF.'));
 tests.push(item('forward_closed',global.LinaGen16Engine?.SPEC?.forwardOpened===false,'Forward closed.'));
 const failed=tests.filter(t=>!t.pass),result={schema:'LINA-RELEASE-GATE-1',generation:16,release:REQUIRED_RELEASE,specSha256:SPEC_SHA,status:failed.length?'FAIL':'PASS',allowResearch:failed.length===0,tests,failed:failed.map(t=>t.id),checkedAt:new Date().toISOString()};
 try{sessionStorage.setItem(KEY,JSON.stringify(result))}catch{}return result;
}
function render(r){const root=document.querySelector('#view');if(!root)return;let box=root.querySelector('[data-release-gate]');if(!box){box=document.createElement('div');box.className='statusline';box.setAttribute('data-release-gate','')}const current=root.querySelector('[data-gen16-preflight]');if(current)current.insertAdjacentElement('afterend',box);else root.prepend(box);box.classList.toggle('bad',r.status!=='PASS');box.textContent=r.status==='PASS'?'Release Gate ✓ · Gen16 researchstart GODKÄND · PRICE_CHANNEL_BREAKOUT · Handel/Forward AV':'RELEASE GATE STOPPAD · '+r.failed.join(', ')+' · research BLOCKERAD';global.LinaStatusOrder?.apply?.()}
async function verifyFinal(){const r=await run();render(r);if(r.status!=='PASS')throw Error('Release Gate FAIL: '+r.failed.join(', '));return r}
function allowResearch(){try{const r=JSON.parse(sessionStorage.getItem(KEY)||'null');return r?.status==='PASS'&&r?.allowResearch===true&&r?.generation===16&&r?.release===REQUIRED_RELEASE&&r?.specSha256===SPEC_SHA}catch{return false}}
global.LinaReleaseGate=Object.freeze({run,verifyFinal,allowResearch,KEY,REQUIRED_RELEASE,SPEC_SHA});
})(typeof window==='object'?window:globalThis);
