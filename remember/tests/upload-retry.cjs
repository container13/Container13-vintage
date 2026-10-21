// Node >=22. Actual uploader/page functions/Edge source, with mocked network/Storage.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {stripTypeScriptTypes}=require('node:module'),{webcrypto,randomUUID}=require('node:crypto');
const root=path.resolve(__dirname,'..');let passed=0;
async function test(name,fn){await fn();console.log('PASS:',name);passed++;}
const bytes=()=>{const b=new Uint8Array(32);b.set([255,216,255]);return b;};
const photo=()=>new File([bytes()],'test.jpg',{type:'image/jpeg'});
const success=()=>Response.json({ok:true,photoId:'one'});
const auth=g=>g?{token:'t'.repeat(43)}:{albumId:'00000000-0000-4000-8000-000000000001',accessToken:'mock'};
function edge({breakAt,denied,mismatch=false,invalidUser=false}={}){
 let serve,broken=false;const rows=new Map(),objects=new Map(),calls=[];
 const db={auth:{getUser:async()=>invalidUser?{data:{user:null},error:Error('invalid')}:{data:{user:{id:'verified-owner'}},error:null}},
  async rpc(name,args){assert.equal(name,'remember_photo_upload_request');calls.push(args.p_action);
   if(denied)return {data:{accepted:false,reason:denied},error:null};
   const key=(args.p_album_id||args.p_token_hash)+':'+args.p_request_id;let row=rows.get(key);
   if(row&&row.digest!==args.p_content_sha256)return {data:{accepted:false,reason:'content_conflict'},error:null};
   if(!row){row={id:randomUUID(),key:randomUUID(),digest:args.p_content_sha256,state:'uploading'};rows.set(key,row);}
   if(args.p_action==='complete'){
    if(breakAt==='before-complete'&&!broken){broken=true;return {error:Error('lost'),data:null};}
    row.state='ready';if(breakAt==='complete-response'&&!broken){broken=true;return {error:Error('lost'),data:null};}
   }
   return {data:{accepted:true,state:row.state,photoId:row.id,objectKey:row.key},error:null};
  },storage:{from:()=>({
   async upload(key,data,opts){calls.push('upload');assert.equal(opts.upsert,false);
    if(breakAt==='before-storage'&&!broken){broken=true;return {error:Error('lost')};}
    if(objects.has(key))return {error:Error('AlreadyExists')};objects.set(key,new Uint8Array(data));
    if(breakAt==='storage-response'&&!broken){broken=true;throw new TypeError('lost');}return {error:null};
   },
   async download(key){calls.push('download');if(breakAt==='readback'&&!broken){broken=true;return {data:null,error:Error('lost')};}
    return objects.has(key)?{data:new Blob([mismatch?new Uint8Array([1]):objects.get(key)]),error:null}:{data:null,error:Error('missing')};}
  })}};
 let source=fs.readFileSync(path.join(root,'deploy/remember-photo-upload.ts'),'utf8').replace(/^import .*?;\n/m,'');
 source=stripTypeScriptTypes(source,{mode:'strip'});
 vm.runInNewContext(source,{Deno:{env:{get:n=>n==='REMEMBER_ALLOWED_ORIGIN'?'https://container13.se':'mock-only'},serve:f=>{serve=f;}},createClient:()=>db,Response,Request,FormData,File,Blob,Uint8Array,TextEncoder,crypto:webcrypto,Error,TypeError});
 return {rows,objects,calls,async fetch(url,opts){const r=await serve(new Request('https://mock.invalid/upload',{...opts,headers:{...opts.headers,Origin:'https://container13.se'}}));if(breakAt==='client-response'&&!broken){broken=true;throw new TypeError('lost');}return r;}};
}
(async()=>{
 const s=fs.readFileSync(path.join(root,'upload-session.js'),'utf8').replace(/^import .*?;\n/m,'const prepareRememberUpload=()=>{throw Error("Inject prepare")};\n');
 const {createRememberUploader}=await import('data:text/javascript;base64,'+Buffer.from(s).toString('base64'));
 for(const guest of [true,false])for(const breakAt of ['before-storage','storage-response','readback','before-complete','complete-response','client-response'])await test((guest?'guest':'owner')+' recovers '+breakAt,async()=>{
  const h=edge({breakAt}),ids=[];let prepared=0;
  const upload=createRememberUploader({prepare:async f=>{prepared++;return {file:f};},wait:async()=>{},fetchUpload:(u,o)=>{ids.push(o.body.get('requestId'));return h.fetch(u,o);}});
  assert.equal((await upload(photo(),auth(guest))).ok,true);assert.equal(prepared,1);assert.equal(new Set(ids).size,1);assert.equal(h.rows.size,1);assert.equal(h.objects.size,1);assert.equal([...h.rows.values()][0].state,'ready');
 });
 await test('manual retry keeps ID and exact prepared bytes after 3 failed attempts',async()=>{
  let offline=true,prepared=0;const ids=[],blobs=[];const upload=createRememberUploader({prepare:async()=>{prepared++;return {file:photo()};},wait:async()=>{},fetchUpload:async(u,o)=>{ids.push(o.body.get('requestId'));blobs.push(Buffer.from(await o.body.get('file').arrayBuffer()).toString('hex'));if(offline)throw new TypeError('offline');return success();}});const f=photo();
  await assert.rejects(upload(f,auth(true)));assert.equal(ids.length,3);offline=false;await upload(f,auth(true));assert.equal(new Set(ids).size,1);assert.equal(new Set(blobs).size,1);assert.equal(prepared,1);
 });
 await test('simultaneous calls from the same queue coalesce',async()=>{let calls=0;const upload=createRememberUploader({prepare:async f=>({file:f}),wait:async()=>{},fetchUpload:async()=>{calls++;return success();}});const f=photo();await Promise.all([upload(f,auth(true)),upload(f,auth(true))]);assert.equal(calls,1);});
 await test('independent concurrent Edge retries converge on same immutable key',async()=>{const h=edge(),form=new FormData();form.set('token','t'.repeat(43));form.set('requestId',randomUUID());form.set('file',photo());const rs=await Promise.all([h.fetch('',{method:'POST',body:form}),h.fetch('',{method:'POST',body:form})]);assert(rs.every(r=>r.status===200));assert.equal(h.rows.size,1);assert.equal(h.objects.size,1);});
 for(const reason of ['limit','duplicate','closed','album_inactive','content_conflict','forbidden'])await test(reason+' never retries or writes Storage',async()=>{const h=edge({denied:reason});let n=0;const upload=createRememberUploader({prepare:async f=>({file:f}),wait:async()=>{},fetchUpload:(u,o)=>{n++;return h.fetch(u,o);}});await assert.rejects(upload(photo(),auth(true)));assert.equal(n,1);assert.equal(h.objects.size,0);});
 await test('mismatched stored bytes never complete/overwrite/delete',async()=>{const h=edge({mismatch:true}),upload=createRememberUploader({prepare:async f=>({file:f}),wait:async()=>{},fetchUpload:h.fetch});await assert.rejects(upload(photo(),auth(true)));assert(!h.calls.includes('complete'));assert.equal(h.objects.size,1);assert.equal([...h.rows.values()][0].state,'uploading');});
 await test('invalid identity never reaches reservation',async()=>{const h=edge({invalidUser:true}),upload=createRememberUploader({prepare:async f=>({file:f}),wait:async()=>{},fetchUpload:h.fetch});await assert.rejects(upload(photo(),auth(false)));assert.equal(h.rows.size,0);});
 await test('same file in another album has distinct request identity',async()=>{const ids=[],upload=createRememberUploader({prepare:async f=>({file:f}),wait:async()=>{},fetchUpload:async(u,o)=>{ids.push(o.body.get('requestId'));return success();}});const f=photo();await upload(f,auth(false));await upload(f,{...auth(false),albumId:'00000000-0000-4000-8000-000000000002'});assert.notEqual(ids[0],ids[1]);});
 await test('timeout retries same ID',async()=>{const ids=[],upload=createRememberUploader({timeoutMs:5,prepare:async f=>({file:f}),wait:async()=>{},fetchUpload:async(u,o)=>{ids.push(o.body.get('requestId'));if(ids.length===1)return new Promise((resolve,reject)=>o.signal.addEventListener('abort',()=>reject(new DOMException('timeout','AbortError')),{once:true}));return success();}});await upload(photo(),auth(true));assert.equal(ids.length,2);assert.equal(new Set(ids).size,1);});
 for(const [page,start,end,queue,busy] of [
  ['album.html','async function uploadSelectedFiles()','\nsend.onclick','pendingFiles','fileUploading'],
  ['album.html','async function uploadApprovedCameraFiles()','\nsendCamera.onclick','selectedCameraFiles','cameraUploading'],
  ['owner.html','async function uploadOwnerFiles()',"\nconst {mountRememberCamera}",'pendingOwnerFiles','ownerUploading'],
  ['album-admin.html','async function uploadOwnerFiles()','\nownerRetry.onclick','ownerApprovedFiles','ownerUploading']
 ])await test(page+' '+start+' retains unfinished files only',async()=>{
  const html=fs.readFileSync(path.join(root,page),'utf8');assert(html.includes("createRememberUploader } from './upload-session.js?v=0.1.159'"));const from=html.indexOf(start),to=html.indexOf(end,from);assert(from>0&&to>from);const source=html.slice(from,to);assert(!source.includes('crypto.randomUUID'));assert(!source.includes('prepareRememberUpload'));
  const nodes=new Map(),node=id=>{if(!nodes.has(id))nodes.set(id,{hidden:false,disabled:false,value:'',textContent:''});return nodes.get(id);};
  const files=[photo(),photo()],sent=[];let failed=false;const context=vm.createContext({document:{getElementById:node},$:node,files,Error,uploadRememberFile:async f=>{sent.push(f);if(f===files[1]&&!failed){failed=true;throw Error('offline');}return {ok:true};},client:{auth:{getSession:async()=>({data:{session:{access_token:'mock'}}})}},webmasterSession:async()=>'mock',rememberGallery:{refresh:async()=>{}},refresh:async()=>{},id:'album',token:'t'.repeat(43),ownerAccessBlocked:false,send:node('send'),photo:node('photo'),uploadStatus:node('uploadStatus'),choosePhotos:node('choosePhotos'),sendCamera:node('sendCamera'),cameraUploadStatus:node('cameraUploadStatus'),cameraResults:node('cameraResults'),ownerFeedback:node('ownerFeedback'),ownerRetry:node('ownerRetry')});
  const name=start.match(/function (\w+)/)[1];await vm.runInContext(`let ${queue}=files.slice(),${busy}=false;${source}\n(async()=>{await ${name}();if(${queue}.length!==1||${queue}[0]!==files[1])throw Error('Queue lost');await ${name}();if(${queue}.length)throw Error('Not finished');})()`,context);assert.equal(sent.length,3);assert.equal(sent.filter(f=>f===files[0]).length,1);
 });
 console.log(passed+' recovery tests PASS; mocked network/Storage, not physical-device or live-concurrency PASS.');
})().catch(e=>{console.error(e);process.exitCode=1;});
