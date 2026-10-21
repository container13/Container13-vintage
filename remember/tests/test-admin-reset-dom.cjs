const {JSDOM}=require('jsdom'),fs=require('fs'),assert=require('node:assert/strict');
(async()=>{
 const html=fs.readFileSync(require('node:path').join(__dirname,'../test-admin.html'),'utf8');
 const {mountTestAdmin}=await import('../test-admin.js');
 for(const scenario of ['success','rate-limit','network']){
  const dom=new JSDOM(html,{url:'https://container13.se/remember/test-admin.html'}),doc=dom.window.document;
  let calls=0,args,finish;const createClient=()=>({auth:{getSession:async()=>({data:{session:null}}),onAuthStateChange:()=>{},resetPasswordForEmail:(...input)=>{calls++;args=input;return new Promise((resolve,reject)=>{finish=()=>scenario==='network'?reject(Error('offline')):resolve({error:scenario==='rate-limit'?{status:429}:null});});}}});
  await mountTestAdmin({document:doc,createClient,fetch:()=>{throw Error('Unexpected Edge request')}});
  assert.equal(calls,0);const email=doc.getElementById('testEmail'),button=doc.getElementById('testResetPassword');
  email.value='not-an-email';button.click();assert.equal(calls,0);
  email.value='test@example.invalid';doc.getElementById('testPassword').value='';button.click();assert.equal(calls,1);button.click();assert.equal(calls,1);
  assert.deepEqual(args,['test@example.invalid',{redirectTo:'https://container13.se/remember-test/login.html'}]);
  finish();await new Promise(r=>setTimeout(r,0));assert.equal(button.disabled,true);assert(button.textContent.includes('60 s'));assert.equal(doc.querySelector('fieldset').disabled,false);
  const message=doc.getElementById('testFeedback').textContent;
  assert(message.includes(scenario==='success'?'Om testkontot finns':scenario==='rate-limit'?'För många':'Resultatet är osäkert'));
  assert.equal(doc.getElementById('testPassword').value,'');button.click();assert.equal(calls,1);dom.window.close();
 }
 console.log('PASS reset UI: no automatic email, email-only validation, fixed TEST redirect, double-click guard, 60s cooldown, generic success, 429 and ambiguous-network feedback. All sends mocked.');
})().catch(e=>{console.error(e);process.exit(1);});
