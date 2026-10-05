(function(global){
'use strict';
const KEY='lina_release_gate_v0385',REQUIRED_RELEASE='V0.3.85',REQUIRED_CACHE='0.3.85';
const item=(id,pass,detail)=>({id,pass:Boolean(pass),detail});
async function run(){
 const tests=[],root=document.querySelector('#view'),current=root?.querySelector('[data-gen15-preflight]'),children=root?[...root.children]:[];
 tests.push(item('release_source',global.LinaVersion?.release===REQUIRED_RELEASE&&global.LinaVersion?.cache===REQUIRED_CACHE,'Central version/cache exact.'));
 tests.push(item('final_view_exists',Boolean(root),'Final #view exists.'));
 tests.push(item('current_action_visible',Boolean(current&&current.textContent.includes('ENGINE VERIFIED')),'Gen15 verified visible.'));
 tests.push(item('current_action_first',Boolean(current&&children[0]===current),'Gen15 current action first.'));
 tests.push(item('gen15_engine_receipt',(()=>{try{const x=JSON.parse(sessionStorage.getItem(global.LinaGen15Preflight?.KEY)||'null');return x?.status==='PASS'&&x?.specSha256==='726b1631365c5df4880dd926b32461f870eacd1bdf2f610f00b5ad844c61b43c'}catch{return false}})(),'Gen15 engine receipt exact.'));
 tests.push(item('gen15_locked_spec',global.LinaGen15Engine?.SPEC?.status==='LOCKED_PRE_RESEARCH','Gen15 spec locked.'));
 tests.push(item('gen15_exit_exact',global.LinaGen15Engine?.SPEC?.candidateVariant==='TREND_INVALIDATION_EXIT'&&global.LinaGen15Engine?.SPEC?.trendInvalidationExit?.newNumericParameters===0,'Trend invalidation exact; zero new numeric params.'));
 tests.push(item('gen14_frozen',(()=>{try{const g=global.LinaGen14Workflow?.state?.();return g?.state==='GEN14_COMPLETE_NO_CANDIDATE'&&Boolean(g?.summaryFreeze?.frozen)&&Object.keys(g?.checkpoints||{}).length===8}catch{return false}})(),'Gen14 frozen NO_CANDIDATE 8/8.'));
 tests.push(item('trade_off',document.querySelector('.header-status strong')?.textContent.trim()==='Handel AV','Trade OFF.'));
 tests.push(item('forward_closed',global.LinaGen15Engine?.SPEC?.forwardOpened===false,'Forward closed.'));
 const failed=tests.filter(t=>!t.pass),result={schema:'LINA-RELEASE-GATE-1',release:REQUIRED_RELEASE,status:failed.length?'FAIL':'PASS',allowResearch:false,tests,failed:failed.map(t=>t.id),checkedAt:new Date().toISOString()};
 try{sessionStorage.setItem(KEY,JSON.stringify(result))}catch{}return result;
}
function render(r){const root=document.querySelector('#view');if(!root)return;let box=root.querySelector('[data-release-gate]');if(!box){box=document.createElement('div');box.className='statusline';box.setAttribute('data-release-gate','')}const current=root.querySelector('[data-gen15-preflight]');if(current)current.insertAdjacentElement('afterend',box);else root.prepend(box);box.classList.toggle('bad',r.status!=='PASS');box.textContent=r.status==='PASS'?'Release Gate ✓ · Gen15 TREND_INVALIDATION_EXIT preregistrerad · research BLOCKERAD · Handel/Forward AV':'RELEASE GATE STOPPAD · '+r.failed.join(', ')+' · research BLOCKERAD'}
async function verifyFinal(){const r=await run();render(r);if(r.status!=='PASS')throw Error('Release Gate FAIL: '+r.failed.join(', '));return r}
function allowResearch(){return false}
global.LinaReleaseGate=Object.freeze({run,verifyFinal,allowResearch,KEY,REQUIRED_RELEASE});
})(typeof window==='object'?window:globalThis);
