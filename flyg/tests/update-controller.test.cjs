const {test}=require('node:test');const assert=require('node:assert/strict');const vm=require('node:vm');const fs=require('node:fs');
const code=fs.readFileSync('flyg/auto-update.js','utf8');
async function run({dirty=false,online=true,attempted='',worker=false}={}){
 const events={},nodes={},replacements=[],messages=[];let calls=0;
 const doc={hidden:false,readyState:'loading',addEventListener:(n,f)=>events[n]=f,querySelector:()=>null,getElementById:id=>nodes[id],createElement:()=>({style:{},setAttribute(){},addEventListener(n,f){this[n]=f},append(){}}),body:{append(n){nodes[n.id]=n}}};
 const nav={onLine:online};if(worker)nav.serviceWorker={getRegistration:async()=>({update:async()=>{},waiting:{postMessage:m=>{messages.push(m);events.controllerchange()} }}),addEventListener:(n,f)=>events[n]=f};
 const ctx={URL,document:doc,navigator:nav,window:{ProjectVersion:{release:'0.1.8'},addEventListener:(n,f)=>events[n]=f},location:{href:'https://test/flyg/',protocol:'https:',replace:u=>replacements.push(u)},sessionStorage:{getItem:()=>attempted,setItem:(k,v)=>attempted=v},setInterval(){},setTimeout(){},clearTimeout(){},confirm:()=>true,fetch:async()=>{calls++;return{ok:true,json:async()=>({release:'0.1.9'})}}};
 vm.runInNewContext(code,ctx);if(dirty)events.input();events.DOMContentLoaded();for(let i=0;i<10;i++)await new Promise(r=>setImmediate(r));return{nodes,replacements,calls,messages};
}
test('clean form updates once to newer release',async()=>{const r=await run();assert.equal(r.replacements.length,1);assert.match(r.replacements[0],/_flyg_release=0.1.9/)});
test('changed form defers reload and shows update action',async()=>{const r=await run({dirty:true});assert.equal(r.replacements.length,0);assert(r.nodes['flyg-update'])});
test('offline does not request release or reload',async()=>{const r=await run({online:false});assert.equal(r.calls,0);assert.equal(r.replacements.length,0)});
test('repeat attempt does not create reload loop',async()=>{const r=await run({attempted:'0.1.9'});assert.equal(r.replacements.length,0);assert(r.nodes['flyg-update'])});
test('waiting service worker activated before reload',async()=>{const r=await run({worker:true});assert.equal(r.messages[0].type,'ACTIVATE_UPDATE');assert.equal(r.replacements.length,1)});
