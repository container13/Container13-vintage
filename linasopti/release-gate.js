(function(global){
'use strict';
const KEY='lina_release_gate_v0376';
const REQUIRED_RELEASE='V0.3.76';
const REQUIRED_CACHE='0.3.76';
function item(id,pass,detail){return{id,pass:Boolean(pass),detail};}
function directChildren(root){return root?[...root.children]:[];}
async function run(){
 const tests=[];
 const root=document.querySelector('#view');
 const current=root?.querySelector('[data-gen12-preflight]');
 const oldDiag=root?.querySelector('[data-gen10-global-resume]');
 const children=directChildren(root);
 tests.push(item('release_source',global.LinaVersion?.release===REQUIRED_RELEASE&&global.LinaVersion?.cache===REQUIRED_CACHE,'Central version/cache must be V0.3.76/0.3.76.'));
 tests.push(item('final_view_exists',Boolean(root),'Final #view must exist after bootstrap.'));
 tests.push(item('current_action_visible',Boolean(current&&current.textContent.includes('ENGINE VERIFIED')&&current.textContent.includes('research EJ startad')),'Gen12 verified/current action must be visible.'));
 tests.push(item('current_action_first',Boolean(current&&children[0]===current),'Gen12 current action must be the first direct child in final view.'));
 tests.push(item('frozen_diag_not_above',Boolean(!oldDiag||children.indexOf(oldDiag)>children.indexOf(current)),'Frozen Gen10 diagnostic may not appear above current action.'));
 tests.push(item('gen12_engine_receipt',(()=>{try{const x=JSON.parse(sessionStorage.getItem(global.LinaGen12Preflight?.KEY)||'null');return x?.status==='PASS'&&x?.specSha256==='7e02f720254ee8bf3139a405aa33cd66d7e88d71493c74d7c035f8305c0c4557'}catch{return false}})(),'Gen12 engine verification receipt must match locked runnerspec.'));
 tests.push(item('gen10_frozen',(()=>{try{const g=global.LinaGen11Workflow?.state?.();return g?.state==='GEN11_COMPLETE_NO_CANDIDATE'&&Boolean(g?.summaryFreeze?.frozen)}catch{return false}})(),'Gen11 must remain complete and frozen.'));
 tests.push(item('trade_off',!document.body.textContent.match(/Handel PÅ/i)&&document.querySelector('.header-status strong')?.textContent.trim()==='Handel AV','Visible trade status must remain OFF.'));
 tests.push(item('forward_closed',global.LinaGen12Engine?.SPEC?.forwardOpened===false,'Gen12 locked spec keeps Forward closed.'));
 tests.push(item('research_not_opened',global.LinaGen12Engine?.SPEC?.status==='LOCKED_PRE_RESEARCH','Gen12 spec remains pre-research.'));
 const failed=tests.filter(t=>!t.pass);
 const result={schema:'LINA-RELEASE-GATE-1',release:REQUIRED_RELEASE,status:failed.length?'FAIL':'PASS',allowResearch:failed.length===0,tests,failed:failed.map(t=>t.id),checkedAt:new Date().toISOString()};
 try{sessionStorage.setItem(KEY,JSON.stringify(result))}catch{}
 return result;
}
function render(result){
 const root=document.querySelector('#view');if(!root)return;
 let box=root.querySelector('[data-release-gate]');
 if(!box){box=document.createElement('div');box.className='statusline';box.setAttribute('data-release-gate','');}
 const current=root.querySelector('[data-gen12-preflight]');
 if(current)current.insertAdjacentElement('afterend',box);else root.prepend(box);
 box.classList.toggle('bad',result.status!=='PASS');
 box.textContent=result.status==='PASS'
  ?'Release Gate ✓ · MASTER RULES maskinkontrollerade · Gen12 engine verifierad · startbeslut GODKÄNT · research tillåten endast via låst workflow'
  :'RELEASE GATE STOPPAD · '+result.failed.join(', ')+' · research BLOCKERAD';
}
async function verifyFinal(){
 const r=await run();render(r);
 if(r.status!=='PASS')throw Error('Release Gate FAIL: '+r.failed.join(', '));
 return r;
}
function allowResearch(){
 try{const r=JSON.parse(sessionStorage.getItem(KEY)||'null');return Boolean(r?.release===REQUIRED_RELEASE&&r?.status==='PASS'&&r?.allowResearch===true)}catch{return false}
}
global.LinaReleaseGate=Object.freeze({run,verifyFinal,allowResearch,KEY,REQUIRED_RELEASE});
})(typeof window==='object'?window:globalThis);
