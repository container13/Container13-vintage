// Actual Edge handler with mocked Auth/DB/Storage. Never deletes real photos.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {stripTypeScriptTypes}=require('node:module');
const album='11111111-1111-4111-8111-111111111111',photo='22222222-2222-4222-8222-222222222222';
function harness(options={}){
 const cfg={owner:true,webmaster:false,active:true,state:'ready',...options};const calls=[];let handler;
 class Query{
  constructor(table){this.table=table;this.filters={};this.operation='select';}
  select(columns,options){this.countOnly=options?.head;return this;}eq(k,v){this.filters[k]=v;return this;}in(k,v){this.filters[k]=v;return this;}
  update(v){this.operation='update';this.values=v;return this;}
  async maybeSingle(){
   calls.push({table:this.table,op:'read',filters:{...this.filters}});
   if(this.table==='albums')return {data:cfg.albumMissing?null:{id:album,owner_user_id:cfg.owner?'actor':'another-owner',is_active:cfg.active},error:null};
   return {data:cfg.photoMissing||this.filters.album_id!==album||this.filters.id!==photo||!this.filters.state.includes(cfg.state)?null:{id:photo,object_key:'server/selected-photo',state:cfg.state},error:null};
  }
  then(resolve,reject){return Promise.resolve().then(()=>{
   if(this.countOnly){assert.equal(this.filters.album_id,album);assert.deepEqual(Array.from(this.filters.state),['reserved','uploading','ready']);return {count:1,error:null};}
   assert.equal(this.operation,'update');assert.deepEqual(this.filters,{id:photo,album_id:album,state:'ready'});assert.equal(this.values.state,'deleted');
   calls.push({op:'mark-deleted'});if(!cfg.updateError)cfg.state='deleted';return {error:cfg.updateError?Error('DB failed'):null};
  }).then(resolve,reject);}
 }
 const db={auth:{getUser:async()=>cfg.invalidIdentity?{data:{user:null},error:Error('invalid')}:{data:{user:{id:'actor'}},error:null}},schema:()=>({from:t=>new Query(t)}),
  async rpc(name,args){calls.push({op:'role-check',name,args});assert.equal(name,'remember_webmaster_album_activation');assert.equal(args.p_actor,'actor');assert.equal(args.p_action,'read');return {data:{authorized:cfg.webmaster,album:{id:album}},error:cfg.roleError?Error('role lookup failed'):null};},
  storage:{from:bucket=>({async remove(keys){calls.push({op:'storage-remove',bucket,keys});return {error:cfg.storageError?Error('Storage failed'):null};}})}};
 const source=stripTypeScriptTypes(fs.readFileSync(path.join(__dirname,'../deploy/remember-owner-manager.ts'),'utf8').replace(/^import .*?;\n/,''),{mode:'strip'});
 vm.runInNewContext(source,{Deno:{env:{get:()=> 'mock-only'},serve:fn=>{handler=fn;}},createClient:()=>db,Response,Request,Error});
 return {cfg,calls,async send(body={},login=true){const r=await handler(new Request('https://mock.invalid',{method:'POST',headers:{Origin:'https://container13.se',...(login?{Authorization:'Bearer mock'}:{})},body:JSON.stringify({action:'deletePhoto',albumId:album,photoId:photo,...body})}));return {status:r.status,body:await r.json()};}};
}
let n=0;async function test(name,fn){await fn();console.log('PASS',name);n++;}
(async()=>{
 for(const [name,cfg]of [['owner',{owner:true}],['webmaster in another owner album',{owner:false,webmaster:true}],['webmaster inactive album',{owner:false,webmaster:true,active:false}],['webmaster own inactive album',{owner:true,webmaster:true,active:false}]])await test(name,async()=>{const h=harness(cfg);assert.equal((await h.send()).status,200);assert.equal(h.cfg.state,'deleted');assert(h.calls.findIndex(x=>x.op==='storage-remove')<h.calls.findIndex(x=>x.op==='mark-deleted'));assert.deepEqual(Array.from(h.calls.find(x=>x.op==='storage-remove').keys),['server/selected-photo']);});
 for(const [name,cfg,status,login,body] of [
  ['guest no login',{},401,false,{}],['invalid session',{invalidIdentity:true},401,true,{}],['unrelated logged-in user',{owner:false},403,true,{}],
  ['inactive owner',{active:false},403,true,{}],['role service failure',{owner:false,roleError:true},503,true,{}],['wrong photo id',{},404,true,{photoId:'33333333-3333-4333-8333-333333333333'}],
  ['photo from another album',{photoMissing:true},404,true,{}],['in-flight upload',{state:'uploading'},404,true,{}],['malformed ID',{},400,true,{photoId:'invalid'}]
 ])await test(name+' makes no Storage call',async()=>{const h=harness(cfg);assert.equal((await h.send(body,login)).status,status);assert(!h.calls.some(x=>x.op==='storage-remove'||x.op==='mark-deleted'));});
 await test('canceled/forged object key cannot redirect server deletion',async()=>{const h=harness();await h.send({object_key:'other-album/private'});assert.deepEqual(Array.from(h.calls.find(x=>x.op==='storage-remove').keys),['server/selected-photo']);});
 await test('Storage error keeps ready state and counted quota',async()=>{const h=harness({storageError:true});assert.equal((await h.send()).status,503);assert.equal(h.cfg.state,'ready');assert(!h.calls.some(x=>x.op==='mark-deleted'));});
 await test('DB error is retryable and retains request row',async()=>{const h=harness({updateError:true});assert.equal((await h.send()).status,503);assert.equal(h.cfg.state,'ready');h.cfg.updateError=false;assert.equal((await h.send()).status,200);assert.equal(h.cfg.state,'deleted');});
 await test('lost success replay returns success without deleting twice',async()=>{const h=harness();await h.send();await h.send();assert.equal(h.calls.filter(x=>x.op==='storage-remove').length,1);});
 console.log(n+' deletion Edge tests PASS; no real network/data writes.');
})().catch(e=>{console.error(e);process.exitCode=1;});
