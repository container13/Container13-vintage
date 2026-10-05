(function(global){
'use strict';
const KEY='lina_release_gate_v0381';
const REQUIRED_RELEASE='V0.3.81';
const REQUIRED_CACHE='0.3.81';
const HUMAN_GEN13_RESEARCH_APPROVED=true;
function item(id,pass,detail){return{id,pass:Boolean(pass),detail};}
function directChildren(root){return root?[...root.children]:[];}
async function run(){
 const tests=[],root=document.querySelector('#view'),current=root?.querySelector('[data-gen13-preflight]'),children=directChildren(root);
 tests.push(item('release_source',global.LinaVersion?.release===REQUIRED_RELEASE&&global.LinaVersion?.cache===REQUIRED_CACHE,'Central version/cache must be V0.3.81/0.3.81.'));
 tests.push(item('final_view_exists',Boolean(root),'Final #view must exist after bootstrap.'));
 tests.push(item('current_action_visible',Boolean(current&&current.textContent.includes('ENGINE VERIFIED')),'Gen13 verified/current action must be visible.'));
 tests.push(item('current_action_first',Boolean(current&&children[0]===current),'Gen13 current action must be first direct child.'));
 tests.push(item('gen13_engine_receipt',(()=>{try{const x=JSON.parse(sessionStorage.getItem(global.LinaGen13Preflight?.KEY)||'null');return x?.status==='PASS'&&x?.specSha256==='e8cd7a717f3240f3650c326e610457d122a3b144a2c5494036f0618db4afbb42'}catch{return false}})(),'Gen13 engine receipt must match locked runnerspec.'));
 tests.push(item('gen13_locked_spec',global.LinaGen13Engine?.SPEC?.status==='LOCKED_PRE_RESEARCH','Locked Gen13 runnerspec must be unchanged.'));
 tests.push(item('gen13_zero_new_numeric_params',global.LinaGen13Engine?.SPEC?.crossSectionalSelection?.newNumericParameters===0,'RANK_TO_CAPACITY adds no numeric tuning parameter.'));
 tests.push(item('gen13_human_research_approval',HUMAN_GEN13_RESEARCH_APPROVED,'Explicit human research-start decision must be encoded in this release.'));
 tests.push(item('gen12_frozen',(()=>{try{const g=global.LinaGen12Workflow?.state?.();return g?.state==='GEN12_COMPLETE_NO_CANDIDATE'&&Boolean(g?.summaryFreeze?.frozen)&&Object.keys(g?.checkpoints||{}).length===8}catch{return false}})(),'Gen12 must remain frozen NO_CANDIDATE 8/8.'));
 tests.push(item('trade_off',!document.body.textContent.match(/Handel PÅ/i)&&document.querySelector('.header-status strong')?.textContent.trim()==='Handel AV','Visible trade status must remain OFF.'));
 tests.push(item('forward_closed',global.LinaGen13Engine?.SPEC?.forwardOpened===false,'Gen13 locked spec keeps Forward closed.'));
 const failed=tests.filter(t=>!t.pass),pass=!failed.length,result={schema:'LINA-RELEASE-GATE-1',release:REQUIRED_RELEASE,status:pass?'PASS':'FAIL',allowResearch:pass&&HUMAN_GEN13_RESEARCH_APPROVED,tests,failed:failed.map(t=>t.id),checkedAt:new Date().toISOString()};
 try{sessionStorage.setItem(KEY,JSON.stringify(result))}catch{}return result;
}
function render(result){
 const root=document.querySelector('#view');if(!root)return;let box=root.querySelector('[data-release-gate]');
 if(!box){box=document.createElement('div');box.className='statusline';box.setAttribute('data-release-gate','');}
 const current=root.querySelector('[data-gen13-preflight]');if(current)current.insertAdjacentElement('afterend',box);else root.prepend(box);
 box.classList.toggle('bad',result.status!=='PASS');
 box.textContent=result.status==='PASS'?'Release Gate ✓ · Gen13 research-start GODKÄND · låst RANK_TO_CAPACITY · Handel/Forward AV':'RELEASE GATE STOPPAD · '+result.failed.join(', ')+' · research BLOCKERAD';
}
async function verifyFinal(){const r=await run();render(r);if(r.status!=='PASS')throw Error('Release Gate FAIL: '+r.failed.join(', '));return r}
function allowResearch(){try{const x=JSON.parse(sessionStorage.getItem(KEY)||'null');return Boolean(x?.status==='PASS'&&x?.allowResearch===true&&x?.release===REQUIRED_RELEASE)}catch{return false}}
global.LinaReleaseGate=Object.freeze({run,verifyFinal,allowResearch,KEY,REQUIRED_RELEASE});
})(typeof window==='object'?window:globalThis);
