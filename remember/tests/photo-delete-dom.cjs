// DOM regression: real gallery/settings modules, mocked network and confirmation.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {JSDOM}=require('jsdom');let passed=0;
async function scenario({managed=true,cancel=false,fail=false}={}){
 const dom=new JSDOM('<body><section id="gallery"></section></body>',{url:'https://mock.invalid',runScripts:'outside-only',pretendToBeVisual:true}),context=dom.getInternalVMContext();
 context.setInterval=(fn,ms)=>{const timer=setInterval(fn,ms);timer.unref();return timer;};context.clearInterval=clearInterval;
 const doc=dom.window.document;let confirmation=0,deletes=0;const images=[{id:'one',url:'https://mock.invalid/a.jpg'},{id:'two',url:'https://mock.invalid/b.jpg'}];
 context.Error=Error;
 context.confirm=()=>{confirmation++;return !cancel;};context.fetch=async()=>Response.json({ok:true,photos:images});context.requestAnimationFrame=fn=>fn();
 const crop=new vm.SyntheticModule(['prepareRememberCrop','sharePreparedRememberCrop'],function(){this.setExport('prepareRememberCrop',async()=>null);this.setExport('sharePreparedRememberCrop',()=>{});},{context});await crop.link(()=>{});await crop.evaluate();
 const source=fs.readFileSync(path.join(__dirname,'../photo-gallery.js'),'utf8');const module=new vm.SourceTextModule(source,{context});await module.link(()=>crop);await module.evaluate();
 const gallery=module.namespace.mountRememberGallery({container:doc.getElementById('gallery'),auth:async()=>({token:'mock-only'}),onDelete:managed?async id=>{deletes++;assert.equal(id,'one');if(fail)throw Error('Storage unavailable');}:undefined});
 for(let i=0;i<5;i++)await new Promise(r=>setTimeout(r,0));
 assert.equal(doc.querySelectorAll('.remember-gallery-delete').length,managed?2:0);
 if(managed){const trash=doc.querySelector('.remember-gallery-delete');assert(trash.querySelector('svg[aria-hidden="true"]'));assert(trash.getAttribute('aria-label').includes('Ta bort bild'));assert.equal(trash.textContent,'');trash.click();for(let i=0;i<5;i++)await new Promise(r=>setTimeout(r,0));assert.equal(confirmation,1);assert.equal(deletes,cancel?0:1);assert.equal(doc.querySelectorAll('.remember-gallery-grid img').length,cancel||fail?2:1);assert(doc.querySelector('.remember-gallery-viewer').hidden);if(fail)assert(doc.querySelector('.remember-gallery-status').textContent.includes('Storage unavailable'));}
 else{doc.querySelector('.remember-gallery-grid img').click();assert(!doc.querySelector('.remember-gallery-viewer').hidden);}
 gallery.stop();dom.window.close();console.log('PASS gallery',JSON.stringify({managed,cancel,fail}));passed++;
}
(async()=>{
 await scenario();await scenario({cancel:true});await scenario({fail:true});await scenario({managed:false});
 const dom=new JSDOM('<div id="settings"></div>',{url:'https://mock.invalid',runScripts:'outside-only'}),context=dom.getInternalVMContext();
 const m=new vm.SourceTextModule(fs.readFileSync(path.join(__dirname,'../webmaster-album-settings.js'),'utf8'),{context});await m.link(()=>{throw Error('Unexpected import');});await m.evaluate();
 const album={id:'album',owner_email:'owner@example.invalid',photo_limit:10,photo_count:7,event_timezone:'Europe/Stockholm',default_opens_at:'2026-10-21T00:00:00Z',default_closes_at:'2026-10-23T00:00:00Z',revision:'1'};
 const ctl=m.namespace.mountWebmasterAlbumSettings({host:dom.window.document.getElementById('settings'),album,enabled:false,request:async()=>({album})});
 const field=dom.window.document.querySelector('[name="closes"]');field.value='2026-10-25T15:20';ctl.updatePhotoCount(6);assert.equal(field.value,'2026-10-25T15:20');assert.equal(dom.window.document.querySelector('[data-count]').textContent,'6 / 10');dom.window.close();passed++;
 console.log(passed+' DOM cases PASS: confirm/cancel/error/guest/viewer/count without resetting schedule draft.');
})().catch(e=>{console.error(e);process.exitCode=1;});
