const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const aid='11111111-1111-4111-8111-111111111111';
(async()=>{
 for(const [file,mode,active] of [['album-admin.html','owner',false],['album-admin.html','owner',true],['album-admin.html','webmaster',false],['owner.html','owner',false],['owner.html','owner',true]]){
  const html=fs.readFileSync(require('node:path').join(__dirname,'../'+file),'utf8');const dom=new JSDOM(html,{url:'https://container13.se/remember/'+file+'?id='+aid+(mode==='owner'&&file==='album-admin.html'?'&view=owner':''),runScripts:'outside-only'});
  const context=dom.getInternalVMContext(),doc=dom.window.document;dom.window.scrollTo=()=>{};
  let galleryMounts=0,settingsMounts=0;const calls=[];
  const session={access_token:'mock-only',user:{id:aid,email:'test@example.invalid'}},client={auth:{getSession:async()=>({data:{session}}),getUser:async()=>({data:{user:session.user}})}};
  const album={id:aid,title:'Testalbum',is_active:active,revision:'2',activation_reason:'PRIVATE_REASON_NOT_FOR_OWNER'};
  context.fetch=async(url,options)=>{
   const action=JSON.parse(options.body).action;calls.push({url,action});
   if(url.endsWith('remember-webmaster'))return Response.json({authorized:true,albums:[album],capabilities:{albumSettings:true}});
   if(url.endsWith('remember-owner-manager'))return Response.json({ok:true,albums:[album]});
   if(url.endsWith('remember-photo-gallery'))return Response.json({ok:true,photos:[]});
   return Response.json({ok:true,featureEnabled:false,photos:[]});
  };
  const modules=new Map();
  async function dependency(spec){
   if(modules.has(spec))return modules.get(spec);
   let exports;
   if(spec.includes('supabase-js'))exports={createClient:()=>client};
   else if(spec.includes('remember-auth'))exports={createRememberAuth:async()=>client,restoreRememberSession:async()=>({session,before:{marker:'mock',authRecord:'mock',tabMarker:'mock'}})};
   else if(spec.includes('upload-prepare'))exports={prepareRememberUpload:()=>{throw Error('No upload expected')}};
   else if(spec.includes('upload-session'))exports={createRememberUploader:()=>()=>{throw Error('No upload expected')}};
   else if(spec.includes('remember-role-switcher'))exports={rememberRoleSwitcherCSS:'',mountRememberRoleSwitcher:({host})=>{host.textContent='Webmaster / Albumägare / Gäst';}};
   else if(spec.includes('webmaster-album-settings'))exports={mountWebmasterAlbumSettings:()=>{settingsMounts++;}};
   else if(spec.includes('photo-gallery'))exports={mountRememberGallery:()=>{galleryMounts++;return {refresh:async()=>{}};}};
   else if(spec.includes('remember-camera-controller'))exports={mountRememberCamera:()=>{}};
   else throw Error('Unexpected dependency '+spec);
   const m=new vm.SyntheticModule(Object.keys(exports),function(){for(const [key,value]of Object.entries(exports))this.setExport(key,value);},{context});modules.set(spec,m);await m.link(()=>{});await m.evaluate();return m;
  }
  const source=html.match(/<script type="module">([\s\S]*?)<\/script>/)[1];const m=new vm.SourceTextModule(source,{context,importModuleDynamically:dependency});await m.link(dependency);await m.evaluate();for(let i=0;i<4;i++)await new Promise(r=>setTimeout(r,0));
  assert(!doc.body.textContent.includes('PRIVATE_REASON_NOT_FOR_OWNER'));
  if(file==='album-admin.html'){
   assert.equal(doc.getElementById('albumInactiveNotice').hidden,!(mode==='owner'&&!active));
   assert.equal(doc.getElementById('albumActions').hidden,mode==='owner'&&!active);
   assert.equal(doc.getElementById('sharing').hidden,mode==='owner'&&!active);
   assert.equal(doc.getElementById('roleSwitcher').hidden,false);
   assert.equal(galleryMounts,mode==='owner'&&active?1:0);
   assert.equal(settingsMounts,mode==='webmaster'?1:0);
   if(mode==='webmaster'){doc.getElementById('showAdminGallery').click();for(let i=0;i<4;i++)await new Promise(r=>setTimeout(r,0));assert.equal(galleryMounts,1);}
  }else{
   assert.equal(doc.getElementById('content').hidden,!active);
   assert.equal(calls.filter(c=>c.url.endsWith('remember-photo-gallery')).length,active?1:0);
   if(!active)assert(doc.getElementById('status').textContent.includes('tillfälligt avstängt'));
  }
  console.log('PASS',file,mode,active?'active':'inactive');dom.window.close();
 }
 console.log('Owner preview and actual owner blocked view; active owners and webmaster review preserved; no private reason rendered.');
})().catch(e=>{console.error(e);process.exit(1);});
