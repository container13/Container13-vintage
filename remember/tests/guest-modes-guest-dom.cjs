const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {JSDOM}=require('jsdom');
const tick=async()=>{for(let i=0;i<5;i++)await new Promise(r=>setImmediate(r));};
async function check({reviewed=false,inactive=false}={}){
 const html=fs.readFileSync(path.join(__dirname,'../album.html'),'utf8');
 const dom=new JSDOM(html,{url:'https://container13.se/remember/album.html#token='+'a'.repeat(43),runScripts:'outside-only'}),context=dom.getInternalVMContext();
 let uploads=0,galleries=0,camera;
 context.fetch=async()=>Response.json({found:true,title:'Party',uploadsOpen:!inactive,active:!inactive,photoApproval:reviewed});
 const modules={};
 async function module(key,exports){const m=new vm.SyntheticModule(Object.keys(exports),function(){for(const [k,v]of Object.entries(exports))this.setExport(k,v);},{context});await m.link(()=>{});await m.evaluate();modules[key]=m;}
 await module('role-switcher',{mountRememberRoleSwitcher:()=>{},rememberRoleSwitcherCSS:''});
 await module('upload-session',{createRememberUploader:()=>async()=>{uploads++;}});
 await module('photo-gallery',{mountRememberGallery:()=>{galleries++;return{refresh:()=>{}};}});
 await module('camera-controller',{mountRememberCamera:options=>{camera=options;}});
 const resolve=specifier=>{const entry=Object.entries(modules).find(([key])=>specifier.includes(key));if(!entry)throw Error(specifier);return entry[1];};
 const m=new vm.SourceTextModule(html.match(/<script type="module">([\s\S]*?)<\/script>/)[1],{context,importModuleDynamically:resolve});await m.link(resolve);await m.evaluate();
 const d=dom.window.document;
 assert.equal(galleries,inactive?0:1);
 assert.equal(d.getElementById('upload').hidden,inactive);
 if(!inactive){
  assert.equal(d.getElementById('status').textContent.includes('godkänt'),reviewed);
  const input=d.getElementById('photo');Object.defineProperty(input,'files',{value:[{type:'image/jpeg'}]});input.onchange();await tick();
  assert.equal(d.getElementById('uploadStatus').textContent.includes('väntar på albumägarens godkännande'),reviewed);
  camera.onApproved([{type:'image/jpeg'}]);await tick();
  assert.equal(d.getElementById('cameraUploadStatus').textContent.includes('väntar på albumägarens godkännande'),reviewed);assert.equal(uploads,2);
 }
 dom.window.close();console.log('PASS guest UI',JSON.stringify({reviewed,inactive}));
}
(async()=>{await check();await check({reviewed:true});await check({reviewed:true,inactive:true});console.log('3 guest DOM cases PASS.');})().catch(e=>{console.error(e);process.exitCode=1;});
