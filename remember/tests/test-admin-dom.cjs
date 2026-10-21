const {JSDOM}=require('jsdom');const fs=require('node:fs');const assert=require('node:assert/strict');
(async()=>{
 const dom=new JSDOM(fs.readFileSync(require('node:path').join(__dirname,'../test-admin.html'),'utf8'),{url:'https://container13.se/remember/test-admin.html'}),doc=dom.window.document;
 dom.window.scrollTo=()=>{};
 dom.window.HTMLDialogElement.prototype.showModal=function(){this.open=true;};dom.window.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new dom.window.Event('close'));};
 let session=null,callback,config,row={id:'11111111-1111-4111-8111-111111111111',title:'Testalbum',owner_email:'owner@example.invalid',event_timezone:'Europe/Stockholm',default_opens_at:new Date(Date.now()-86400000).toISOString(),default_closes_at:new Date(Date.now()-3600000).toISOString(),forced_closed:true,is_active:true,revision:'1',photo_limit:10,photo_count:0};
 let allowLeave=false,conflict=false,forbidden=false,logoutScope;const calls=[];
 const createClient=(url,key,options)=>{config={url,key,options};return {auth:{getSession:async()=>({data:{session}}),onAuthStateChange:cb=>{callback=cb;},signInWithPassword:async input=>{if(input.password!=='correct')return {data:{},error:{}};session={user:{id:'22222222-2222-4222-8222-222222222222',email:input.email},access_token:'mock-only'};callback('SIGNED_IN',session);return {data:{session}};},signOut:async options=>{logoutScope=options.scope;session=null;callback('SIGNED_OUT',null);return {};}}};};
 const send=async(url,options)=>{
  assert.equal(url,'https://kauxrvshxgpbvptdwhog.supabase.co/functions/v1/remember-webmaster');assert.equal(options.headers.Authorization,'Bearer mock-only');
  const input=JSON.parse(options.body);calls.push(input);
  let status=200,body={authorized:true};
  if(forbidden){status=403;body={error:'Forbidden'};}
  else if(input.action==='list')body={authorized:true,albums:[{...row}],capabilities:{albumActivation:true,albumSettings:true}};
  else if(input.action==='save_album_activation'){assert.equal(input.expectedRevision,row.revision);row={...row,is_active:input.active,revision:String(+row.revision+1)};body={authorized:true,album:{...row}};}
  else if(input.action==='save_album_settings'){
   if(conflict){conflict=false;status=409;body={error:'revision_conflict'};row={...row,revision:String(+row.revision+1),override_closes_at:new Date(Date.now()+48*3600000).toISOString()};}
   else{assert.equal(input.expectedRevision,row.revision);row={...row,override_opens_at:input.opensAt,override_closes_at:input.closesAt,forced_closed:input.forcedClosed,revision:String(+row.revision+1)};body={authorized:true,album:{...row}};}
  }else body={authorized:true,album:{...row}};
  return new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json'}});
 };
 const {mountTestAdmin}=await import('../test-admin.js');await mountTestAdmin({document:doc,createClient,fetch:send,confirm:()=>allowLeave});
 const $=s=>doc.querySelector(s),flush=async()=>{for(let i=0;i<8;i++)await new Promise(r=>setTimeout(r,0));};
 const submit=s=>$(s).dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));
 assert.equal(config.url,'https://kauxrvshxgpbvptdwhog.supabase.co');assert.equal(config.options.auth.storageKey,'container13-remember-test-admin-auth-v1');assert.equal(config.options.auth.detectSessionInUrl,false);
 $('#testEmail').value='test@example.invalid';$('#testPassword').value='wrong';submit('#testLoginForm');await flush();assert($('#testFeedback').textContent.includes('Kunde inte logga in'));assert.equal($('#testPassword').value,'');
 $('#testPassword').value='correct';submit('#testLoginForm');await flush();assert.equal($('#webmasterTools').hidden,false);assert($('#testFeedback').textContent.includes('Redo.'));
 const saves=()=>calls.filter(x=>x.action.startsWith('save_'));
 $('[role=switch]').click();await flush();$('[data-cancel]').click();assert.equal(saves().length,0);
 $('[role=switch]').click();await flush();submit('.album-activation-dialog form');await flush();assert.equal(row.is_active,false);assert.equal($('[role=switch]').getAttribute('aria-checked'),'false');
 $('[role=switch]').click();await flush();submit('.album-activation-dialog form');await flush();assert.equal(row.is_active,true);assert.equal(row.override_closes_at,undefined);assert.equal(row.forced_closed,true);
 $('.test-open').click();await flush();const prior=saves().length;$('[data-hours="24"]').click();assert.equal(saves().length,prior);assert(Date.parse($('[name=closes]').value)>Date.now()+23.9*3600000);assert.equal($('[name=closed]').checked,true);
 submit('[data-time-form]');await flush();assert.equal(saves().length,prior+1);assert.equal(row.forced_closed,true);assert.equal($('[data-settings-feedback]').textContent,'Ändringarna är sparade.');
 $('[data-hours="24"]').click();assert.equal(Date.parse($('[name=closes]').value),Date.parse(row.override_closes_at)+86400000);$('#testBack').click();assert.equal($('#testDetails').hidden,false);
 conflict=true;submit('[data-time-form]');await flush();assert($('[data-settings-feedback]').textContent.includes('Aktuella tider har hämtats'));assert.equal(saves().length,prior+2);
 $('#testBack').click();assert.equal($('#testDetails').hidden,true);
 forbidden=true;$('#testReload').click();await flush();assert.equal($('#webmasterTools').hidden,true);assert($('#testFeedback').textContent.includes('saknar webmasterbehörighet'));
 $('#testLogout').click();await flush();assert.equal(logoutScope,'local');assert.equal($('#testLogin').hidden,false);assert.equal($('#testSettings').textContent,'');
 console.log(JSON.stringify({result:'DOM PASS',checks:['test-only URL/storage key','login/error/password clearing','activation cancel/read/save/reactivate','draft extension from now and future close','closure preserved','unsaved navigation guard','409 readback/no auto retry','403 fail closed','local logout'],calls:calls.length}));
 dom.window.close();
})().catch(e=>{console.error(e);process.exit(1);});
