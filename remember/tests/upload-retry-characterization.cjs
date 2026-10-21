/* Run with Node >=22: node remember/tests/upload-retry-characterization.cjs
 * Executes the actual page functions and archived, live-matched Edge source.
 * Known gaps are asserted as current behavior, NEVER reported as feature PASS.
 * No real HTTP, accounts, database or Storage calls.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { stripTypeScriptTypes } = require('node:module');
const { webcrypto, randomUUID } = require('node:crypto');
const root = path.resolve(__dirname, '..');
let passed = 0, gaps = 0;
const check = (name, fn) => Promise.resolve().then(fn).then(() => { passed++; console.log('PASS:', name); });
const gap = (name) => { gaps++; console.log('KNOWN GAP REPRODUCED:', name); };
function pageFunction(page, start, end) {
  const source = fs.readFileSync(path.join(root, page), 'utf8');
  const from = source.indexOf(start), to = source.indexOf(end, from);
  assert(from >= 0 && to > from, page + ' upload function boundaries');
  return source.slice(from, to);
}
async function retryPage({ page, start, end, queue, busy, extras = '' }) {
  const nodes = new Map();
  const node = id => { if (!nodes.has(id)) nodes.set(id, { textContent:'', hidden:false, disabled:false, value:'' }); return nodes.get(id); };
  const ids = [], blobs = [];
  const context = vm.createContext({
    crypto:{ randomUUID }, FormData, File, Error,
    document:{getElementById:node}, $:node,
    client:{auth:{getSession:async()=>({data:{session:{access_token:'mock-session'}}})}},
    webmasterSession:async()=>'mock-session',
    prepareRememberUpload:async()=>({file:new File(['canonical'], 'prepared.jpg', {type:'image/jpeg'})}),
    fetch:async(_url, options)=>{
      ids.push(options.body.get('requestId')); blobs.push(await options.body.get('file').text());
      if(ids.length===1)throw new TypeError('Connection lost after server success');
      return new Response(JSON.stringify({ok:true}), {status:200});
    },
    inputFile:new File(['original'],'photo.jpg',{type:'image/jpeg'}),
    id:'00000000-0000-4000-8000-000000000001',token:'t'.repeat(43),endpoint:'https://mock.invalid/',
    rememberGallery:{refresh:async()=>{}}, refresh:async()=>{},
    send:node('send'),photo:node('photo'),uploadStatus:node('uploadStatus'),choosePhotos:node('choosePhotos'),
    sendCamera:node('sendCamera'),cameraUploadStatus:node('cameraUploadStatus'),cameraResults:node('cameraResults'),
    ownerFeedback:node('ownerFeedback'),ownerRetry:node('ownerRetry'),ownerAccessBlocked:false,
  });
  const source = pageFunction(page,start,end);
  const name = start.match(/function (\w+)/)[1];
  await vm.runInContext(`let ${queue}=[inputFile],${busy}=false; ${extras}\n${source}\n(async()=>{await ${name}();if(${queue}.length!==1)throw Error('Failed item lost');await ${name}();if(${queue}.length!==0)throw Error('Successful retry retained');})()`, context);
  assert.equal(ids.length,2); assert.notEqual(ids[0],ids[1]); assert.equal(blobs[0],blobs[1]);
  gap(page+' / '+name+': lost response retries with NEW request ID');
}
const edgePath = path.join(root,'development-installed/2026-10-21-controls/remember-photo-upload/index.ts');
function edgeHarness(reservation, { duplicate=false, storageError=false, listError=false, stored=null }={}) {
  let handler; const calls=[];
  const object = new Uint8Array(32);object.set([255,216,255]);
  const storage={
    upload:async()=>{calls.push('storage.upload');return {error:storageError?Error('ambiguous storage error'):null};},
    list:async()=>{calls.push('storage.list');return {data:listError?null:[],error:listError?Error('list unavailable'):null};},
    download:async()=>{calls.push('storage.download');return {data:stored===null?new Blob([object]):stored,error:null};},
  };
  const db={auth:{getUser:async()=>({data:{user:{id:'verified-owner'}},error:null})},
    rpc:async(name)=>{calls.push(name);
      if(name.endsWith('_reserve'))return {data:reservation,error:null};
      if(name==='remember_photo_claim_upload')return {data:duplicate?{accepted:false,reason:'duplicate'}:{accepted:true,objectKey:'album/photo'},error:null};
      return {data:{accepted:true},error:null};
    },storage:{from:()=>storage}};
  let source=fs.readFileSync(edgePath,'utf8').replace(/^import .*?;\n/m,'');
  source=stripTypeScriptTypes(source,{mode:'strip'});
  vm.runInNewContext(source,{Deno:{env:{get:name=>name==='REMEMBER_ALLOWED_ORIGIN'?'https://container13.se':'mock-only'},serve:fn=>{handler=fn;}},createClient:()=>db,
    Response,Request,FormData,File,Blob,TextEncoder,Uint8Array,crypto:webcrypto,Error});
  return {calls,async send(owner=false){const form=new FormData();form.set(owner?'albumId':'token',owner?'00000000-0000-4000-8000-000000000001':'t'.repeat(43));form.set('requestId',randomUUID());form.set('file',new File([object],'test.jpg',{type:'image/jpeg'}));const res=await handler(new Request('https://mock.invalid/upload',{method:'POST',headers:{Origin:'https://container13.se',...(owner?{Authorization:'Bearer mock-user'}:{})},body:form}));return {status:res.status,body:await res.json()};}};
}
(async()=>{
  for(const entry of [
    {page:'album.html',start:'async function uploadSelectedFiles()',end:'\nsend.onclick',queue:'pendingFiles',busy:'fileUploading'},
    {page:'album.html',start:'async function uploadApprovedCameraFiles()',end:'\nsendCamera.onclick',queue:'selectedCameraFiles',busy:'cameraUploading'},
    {page:'owner.html',start:'async function uploadOwnerFiles()',end:"\nconst {mountRememberCamera}",queue:'pendingOwnerFiles',busy:'ownerUploading'},
    {page:'album-admin.html',start:'async function uploadOwnerFiles()',end:'\nownerRetry.onclick',queue:'ownerApprovedFiles',busy:'ownerUploading'},
  ]) await retryPage(entry);
  await check('Edge quota denial never touches Storage',async()=>{const h=edgeHarness({accepted:false,reason:'limit'});const r=await h.send();assert.equal(r.status,409);assert.equal(r.body.reason,'limit');assert(!h.calls.some(x=>x.startsWith('storage.')));});
  await check('Edge duplicate denied with Swedish message and no Storage write',async()=>{const h=edgeHarness({accepted:true,photoId:'mock'},{duplicate:true});const r=await h.send();assert.equal(r.status,409);assert.equal(r.body.error,'Den här bilden finns redan i albumet.');assert(!h.calls.some(x=>x.startsWith('storage.')));});
  for(const owner of [false,true])await check('Edge existing replay denied ('+(owner?'owner':'guest')+')',async()=>{const h=edgeHarness({accepted:!owner,reason:'existing',photoId:'mock'});const r=await h.send(owner);assert.equal(r.status,409);assert(!h.calls.includes('remember_photo_claim_upload'));gap('Edge '+(owner?'owner':'guest')+': existing request cannot recover lost success/in-flight upload');});
  await check('Ambiguous Storage failure + failed listing keeps counted reservation',async()=>{const h=edgeHarness({accepted:true,photoId:'mock'},{storageError:true,listError:true});const r=await h.send();assert.equal(r.status,503);assert(!h.calls.includes('remember_photo_fail_upload'));gap('Ambiguous stored object has no recovery path in current upload endpoint');});
  await check('Proven missing Storage object releases slot',async()=>{const h=edgeHarness({accepted:true,photoId:'mock'},{storageError:true});assert.equal((await h.send()).status,503);assert(h.calls.includes('remember_photo_fail_upload'));});
  await check('Happy guest upload verifies bytes before final completion',async()=>{const h=edgeHarness({accepted:true,photoId:'mock'});assert.equal((await h.send()).status,200);assert(h.calls.indexOf('storage.download')<h.calls.indexOf('remember_photo_complete_upload'));});
  await check('Stored byte mismatch never completes photo',async()=>{const h=edgeHarness({accepted:true,photoId:'mock'},{stored:new Blob(['wrong'])});assert.equal((await h.send()).status,503);assert(!h.calls.includes('remember_photo_complete_upload'));});
  console.log(`Completed ${passed} Edge assertions; ${gaps} known gaps reproduced. These gaps are NOT feature PASS. No network writes.`);
})().catch(error=>{console.error(error);process.exitCode=1;});
