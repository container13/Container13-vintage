(function(global){
'use strict';
const KEY='lina_release_gate_v0378';
const REQUIRED_RELEASE='V0.3.78';
const REQUIRED_CACHE='0.3.78';
function item(id,pass,detail){return{id,pass:Boolean(pass),detail};}
function directChildren(root){return root?[...root.children]:[];}
async function run(){
 const tests=[],root=document.querySelector('#view'),current=root?.querySelector('[data-gen13-preflight]'),children=directChildren(root);
 tests.push(item('release_source',global.LinaVersion?.release===REQUIRED_RELEASE&&global.LinaVersion?.cache===REQUIRED_CACHE,'Central version/cache must be V0.3.78/0.3.78.'));
 tests.push(item('final_view_exists',Boolean(root),'Final #view must exist after bootstrap.'));
 tests.push(item('current_action_visible',Boolean(current&&current.textContent.includes('ENGINE VERIFIED')&&current.textContent.includes('research EJ startad')),'Gen13 verified/current action must be visible.'));
 tests.push(item('current_action_first',Boolean(current&&children[0]===current),'Gen13 current action must be first direct child.'));
 tests.push(item('gen13_engine_receipt',(()=>{try{const x=JSON.parse(sessionStorage.getItem(global.LinaGen13Preflight?.KEY)||'null');return x?.status==='PASS'&&x?.specSha256==='e8cd7a717f3240f3650c326e610457d122a3b144a2c5494036f0618db4afbb42'}catch{return false}})(),'Gen13 engine receipt must match locked runnerspec.'));
 tests.push(item('gen13_pre_research',global.LinaGen13Engine?.SPEC?.status==='LOCKED_PRE_RESEARCH','Gen13 remains pre-research.'));
 tests.push(item('gen13_zero_new_numeric_params',global.LinaGen13Engine?.SPEC?.crossSectionalSelection?.newNumericParameters===0,'RANK_TO_CAPACITY adds no numeric tuning parameter.'));
 tests.push(item('gen12_frozen',(()=>{try{const g=global.LinaGen12Workflow?.state?.();return g?.state==='GEN12_COMPLETE_NO_CANDIDATE'&&Boolean(g?.summaryFreeze?.frozen)&&Object.keys(g?.checkpoints||{}).length===8}catch{return false}})(),'Gen12 must remain frozen 8/8.'));
 tests.push(item('trade_off',!document.body.textContent.match(/Handel PÅ/i)&&document.querySelector('.header-status strong')?.textContent.trim()==='Handel AV','Visible trade status must remain OFF.'));
 tests.push(item('forward_closed',global.LinaGen13Engine?.SPEC?.forwardOpened===false,'Gen13 locked spec keeps Forward closed.'));
 const failed=tests.filter(t=>!t.pass),result={schema:'LINA-RELEASE-GATE-1',release:REQUIRED_RELEASE,status:failed.length?'FAIL':'PASS',allowResearch:false,tests,failed:failed.map(t=>t.id),checkedAt:new Date().toISOString()};
 try{sessionStorage.setItem(KEY,JSON.stringify(result))}catch{}return result;
}
function render(result){
 const root=document.querySelector('#view');if(!root)return;let box=root.querySelector('[data-release-gate]');
 if(!box){box=document.createElement('div');box.className='statusline';box.setAttribute('data-release-gate','');}
 const current=root.querySelector('[data-gen13-preflight]');if(current)current.insertAdjacentElement('afterend',box);else root.prepend(box);
 box.classList.toggle('bad',result.status!=='PASS');
 box.textContent=result.status==='PASS'?'Release Gate ✓ · MASTER RULES maskinkontrollerade · Gen13 engine verifierad · research BLOCKERAD till separat uttryckligt startbeslut':'RELEASE GATE STOPPAD · '+result.failed.join(', ')+' · research BLOCKERAD';
}
async function verifyFinal(){const r=await run();render(r);if(r.status!=='PASS')throw Error('Release Gate FAIL: '+r.failed.join(', '));return r}
function allowResearch(){return false}
global.LinaReleaseGate=Object.freeze({run,verifyFinal,allowResearch,KEY,REQUIRED_RELEASE});
})(typeof window==='object'?window:globalThis);
