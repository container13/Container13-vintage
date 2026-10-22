const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {stripTypeScriptTypes}=require('node:module'),{randomUUID}=require('node:crypto');
const source=fs.readFileSync(path.join(__dirname,'../guest-modes-candidate/edge/remember-onboarding.ts'),'utf8');
const actor=randomUUID(),rid=randomUUID();
async function run(input,{verified=true,session=true,dbError=null,count=0,authorization='Bearer session'}={}){
 let handler,inserts=[],rpcs=[];
 const query={select(){return this;},eq(){return this;},gte(){return this;},then(resolve){return Promise.resolve({count,error:null}).then(resolve);},insert:async row=>{inserts.push(row);return {error:dbError};}};
 const db={schema:()=>({from:()=>query}),auth:{getUser:async()=>({data:{user:session?{id:actor,email_confirmed_at:verified?'2026-01-01':null}:null},error:null})},rpc:async(name,args)=>{rpcs.push({name,args});return{data:{ok:true,created:true,albumId:rid,guestMode:'reviewed'},error:dbError};}};
 const context=vm.createContext({createClient:()=>db,Response,Request,Date,JSON,crypto:{randomUUID},Deno:{env:{get:()=> 'mock-only'},serve:fn=>handler=fn}});
 vm.runInContext(stripTypeScriptTypes(source.replace(/^import.*;$/m,'')),context);
 const response=await handler(new Request('https://mock.invalid',{method:'POST',headers:{Origin:'https://container13.se','Content-Type':'application/json',Authorization:authorization},body:JSON.stringify(input)}));
 return {status:response.status,body:await response.json(),inserts,rpcs};
}
(async()=>{
 let cases=0;
 const draft={action:'stage',email:'owner@example.invalid',title:'Party',days:1,startsAt:'2026-10-22T12:00:00.000Z',timezone:'Europe/Stockholm'};
 for(const [mode,expected]of [[undefined,'open'],['open','open'],['reviewed','reviewed']]){const r=await run({...draft,...(mode?{guestMode:mode}:{})});assert.equal(r.status,200);assert.equal(r.inserts[0].guest_mode,expected);cases++;}
 for(const mode of ['identified','typo',null,true,{},[]]){const r=await run({...draft,guestMode:mode});assert.equal(r.status,400);assert.equal(r.inserts.length,0);cases++;}
 for(const input of [null,[],{action:'wrong'}]){assert.equal((await run(input)).status,400);cases++;}
 assert.equal((await run(draft,{count:5})).status,429);cases++;
 for(const opts of [{verified:false},{session:false}]){const r=await run({action:'complete',requestId:rid},opts);assert.equal(r.status,401);assert.equal(r.rpcs.length,0);cases++;}
 const done=await run({action:'complete',requestId:rid,actor:'forged',guestMode:'open'});
 assert.equal(done.status,200);assert.equal(done.rpcs[0].name,'remember_complete_album_registration');
 assert.equal(done.rpcs[0].args.p_actor,actor);assert.equal(done.rpcs[0].args.p_request_id,rid);assert.equal(Object.keys(done.rpcs[0].args).length,2);cases++;
 const legacy=await run({action:'complete'});assert.equal(legacy.rpcs[0].args.p_request_id,null);cases++;
 const invalid=await run({action:'complete',requestId:'bad'});assert.equal(invalid.status,400);assert.equal(invalid.rpcs.length,0);cases++;
 for(const [code,status]of [['42501',403],['22023',409],['23505',409],['XX000',503]]){assert.equal((await run({action:'complete',requestId:rid},{dbError:{code}})).status,status);cases++;}
 console.log(cases+' onboarding Edge mock cases PASS; no network or database writes.');
})().catch(e=>{console.error(e);process.exitCode=1;});
