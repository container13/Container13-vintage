(function(global){
'use strict';
const KEY='lina_release_gate_v0384',REQUIRED_RELEASE='V0.3.84',REQUIRED_CACHE='0.3.84',HUMAN_GEN14_RESEARCH_APPROVED=true;
const item=(id,pass,detail)=>({id,pass:Boolean(pass),detail});
async function run(){
 const tests=[],root=document.querySelector('#view'),current=root?.querySelector('[data-gen14-preflight]'),children=root?[...root.children]:[];
 tests.push(item('release_source',global.LinaVersion?.release===REQUIRED_RELEASE&&global.LinaVersion?.cache===REQUIRED_CACHE,'Central version/cache must match.'));
 tests.push(item('final_view_exists',Boolean(root),'Final #view must exist.'));
 tests.push(item('current_action_visible',Boolean(current&&current.textContent.includes('ENGINE VERIFIED')),'Gen14 verified/current action visible.'));
 tests.push(item('current_action_first',Boolean(current&&children[0]===current),'Gen14 current action first.'));
 tests.push(item('gen14_engine_receipt',(()=>{try{const x=JSON.parse(sessionStorage.getItem(global.LinaGen14Preflight?.KEY)||'null');return x?.status==='PASS'&&x?.specSha256==='5792360ae36b56390f480a9b846ed2a15b504145a06b8a03a36e676247e03fc5'}catch{return false}})(),'Gen14 engine receipt exact.'));
 tests.push(item('gen14_locked_spec',global.LinaGen14Engine?.SPEC?.status==='LOCKED_PRE_RESEARCH','Locked Gen14 spec unchanged.'));
 tests.push(item('gen14_persistence_exact',global.LinaGen14Engine?.SPEC?.persistenceConfirmation?.requiredConsecutiveSignalCloses===2&&global.LinaGen14Engine?.SPEC?.persistenceConfirmation?.newNumericParameters===0,'Persistence contract exact.'));
 tests.push(item('gen14_human_research_approval',HUMAN_GEN14_RESEARCH_APPROVED,'Separate explicit Gen14 research-start approval encoded.'));
 tests.push(item('gen13_frozen',(()=>{try{const g=global.LinaGen13Workflow?.state?.();return g?.state==='GEN13_COMPLETE_NO_CANDIDATE'&&Boolean(g?.summaryFreeze?.frozen)&&Object.keys(g?.checkpoints||{}).length===8}catch{return false}})(),'Gen13 frozen NO_CANDIDATE 8/8.'));
 tests.push(item('trade_off',document.querySelector('.header-status strong')?.textContent.trim()==='Handel AV','Trade OFF.'));
 tests.push(item('forward_closed',global.LinaGen14Engine?.SPEC?.forwardOpened===false,'Forward closed.'));
 const failed=tests.filter(t=>!t.pass),pass=!failed.length,result={schema:'LINA-RELEASE-GATE-1',release:REQUIRED_RELEASE,status:pass?'PASS':'FAIL',allowResearch:pass&&HUMAN_GEN14_RESEARCH_APPROVED,tests,failed:failed.map(t=>t.id),checkedAt:new Date().toISOString()};
 try{sessionStorage.setItem(KEY,JSON.stringify(result))}catch{}return result;
}
function render(r){const root=document.querySelector('#view');if(!root)return;let box=root.querySelector('[data-release-gate]');if(!box){box=document.createElement('div');box.className='statusline';box.setAttribute('data-release-gate','')}const current=root.querySelector('[data-gen14-preflight]');if(current)current.insertAdjacentElement('afterend',box);else root.prepend(box);box.classList.toggle('bad',r.status!=='PASS');box.textContent=r.status==='PASS'?'Release Gate ✓ · Gen14 research-start GODKÄND · låst PERSISTENCE_CONFIRMATION · Handel/Forward AV':'RELEASE GATE STOPPAD · '+r.failed.join(', ')+' · research BLOCKERAD'}
async function verifyFinal(){const r=await run();render(r);if(r.status!=='PASS')throw Error('Release Gate FAIL: '+r.failed.join(', '));return r}
function allowResearch(){try{const x=JSON.parse(sessionStorage.getItem(KEY)||'null');return Boolean(x?.status==='PASS'&&x?.allowResearch===true&&x?.release===REQUIRED_RELEASE)}catch{return false}}
global.LinaReleaseGate=Object.freeze({run,verifyFinal,allowResearch,KEY,REQUIRED_RELEASE});
})(typeof window==='object'?window:globalThis);
