const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {JSDOM,VirtualConsole}=require('jsdom');const {randomUUID}=require('node:crypto');
const root=path.join(__dirname,'..');
const tick=async()=>{for(let i=0;i<6;i++)await new Promise(r=>setImmediate(r));};
async function registration({logged=false,mode='open',fail=false}={}){
 const html=fs.readFileSync(path.join(root,'register.html'),'utf8');
 const vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!e.message.includes('navigation'))throw e;});
 const dom=new JSDOM(html,{url:'https://container13.se/remember/register.html',runScripts:'outside-only',virtualConsole:vc}),context=dom.getInternalVMContext();
 let calls=[],emails=0;const rid=randomUUID(),session=logged?{access_token:'mock',user:{id:'owner',email:'owner@example.invalid',email_confirmed_at:'2026-01-01'}}:null;
 const client={auth:{getSession:async()=>({data:{session}}),signInWithOtp:async()=>{emails++;return{error:null};}}};
 const mock=new vm.SyntheticModule(['createClient'],function(){this.setExport('createClient',()=>client);},{context});await mock.link(()=>{});await mock.evaluate();
 context.fetch=async(url,args)=>{const body=JSON.parse(args.body);calls.push(body);return Response.json(body.action==='stage'?(fail?{ok:false,error:'unavailable'}:{ok:true,id:rid}):{ok:true,created:true,albumId:rid},{status:fail?503:200});};
 const script=html.match(/<script type="module">([\s\S]*?)<\/script>/)[1];
 const m=new vm.SourceTextModule(script,{context,importModuleDynamically:()=>mock});await m.link(()=>{});await m.evaluate();
 const d=dom.window.document;assert.equal(d.getElementById('guestMode').value,'open');assert.equal(d.getElementById('guestMode').options.length,2);
 d.getElementById('guestMode').value=mode;d.getElementById('guestMode').dispatchEvent(new dom.window.Event('change'));
 assert(d.getElementById('guestModeHint').textContent.includes(mode==='reviewed'?'godkänner':'direkt'));
 d.getElementById('title').value='Party';d.getElementById('starts').value='2026-10-22T13:00';d.getElementById('email').value='owner@example.invalid';
 d.getElementById('start').dispatchEvent(new dom.window.Event('submit',{cancelable:true}));await tick();
 assert.equal(calls[0].guestMode,mode);
 if(fail){assert.equal(calls.length,1);assert.equal(emails,0);assert(!d.getElementById('start').hidden);assert.equal(d.getElementById('guestMode').value,mode);}
 else if(logged){assert.equal(calls[1].action,'complete');assert.equal(calls[1].requestId,rid);assert.equal(emails,0);}
 else {const saved=JSON.parse(dom.window.localStorage.getItem('remember-owner-onboarding-v1'));assert.equal(saved.guestMode,mode);assert.equal(saved.requestId,rid);assert.equal(emails,1);assert(d.getElementById('start').hidden);}
 dom.window.close();console.log('PASS registration',JSON.stringify({logged,mode,fail}));
}
(async()=>{await registration();await registration({mode:'reviewed'});await registration({mode:'reviewed',logged:true});await registration({mode:'reviewed',fail:true});
 // Activation must carry the staged ID when available and retain cross-device fallback.
 const activation=fs.readFileSync(path.join(root,'activate.html'),'utf8');assert(activation.includes('requestId:registration.requestId'));assert(activation.includes('registration?.requestId'));
 const owner=fs.readFileSync(path.join(root,'owner.html'),'utf8');assert(!owner.includes('Raderas \'')&&!owner.includes('högst 72 timmar'));
 console.log('4 registration DOM cases + activation contract and accurate quarantine copy PASS.');
})().catch(e=>{console.error(e);process.exitCode=1;});
