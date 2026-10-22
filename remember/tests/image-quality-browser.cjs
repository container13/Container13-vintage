// Requires Playwright and an installed Chromium. All photos are generated fixtures.
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
let browser,page;
(async()=>{
 const packed=process.env.REMEMBER_CHROMIUM_MODULE?require(process.env.REMEMBER_CHROMIUM_MODULE).default:null;
 browser=await chromium.launch({headless:true,...(packed?{args:packed.args,executablePath:await packed.executablePath()}:{})});
 page=await browser.newPage();const requests=[];page.on('request',r=>requests.push({method:r.method(),url:r.url()}));
 const root=path.join(__dirname,'..');
 await page.route('**/*',route=>{const url=new URL(route.request().url());const p=path.join(root,path.basename(url.pathname));
  if(!fs.existsSync(p))return route.fulfill({status:404,body:''});
  return route.fulfill({body:fs.readFileSync(p),contentType:p.endsWith('.js')?'text/javascript':'text/html'});
 });
 await page.goto('http://remember.local/image-compress-test.html');
 await page.waitForFunction(()=>document.getElementById('file')!==null);
 const small=await page.evaluate(async()=>{
  const {compareRememberImage}=await import('./image-quality-test.js?v=0.1.167');
  const c=document.createElement('canvas');c.width=800;c.height=600;c.getContext('2d').fillRect(0,0,800,600);
  const blob=await new Promise(r=>c.toBlob(r,'image/png'));return(await compareRememberImage(blob)).map(v=>({width:v.width,height:v.height,type:v.blob.type}));
 });
 assert(small.every(v=>v.width===800&&v.height===600));console.log('PASS no upscale');
 const portrait=await page.evaluate(async()=>{
  const {compareRememberImage}=await import('./image-quality-test.js?v=0.1.167');const c=document.createElement('canvas');c.width=3024;c.height=4032;c.getContext('2d').fillRect(0,0,c.width,c.height);
  const blob=await new Promise(r=>c.toBlob(r,'image/png'));return(await compareRememberImage(blob)).map(v=>({width:v.width,height:v.height}));
 });
 assert.deepEqual(portrait.map(v=>[v.width,v.height]),[[3024,4032],[1440,1920],[1800,2400],[1800,2400]]);console.log('PASS portrait aspect and limits');
 const errors=await page.evaluate(async()=>{
  const {compareRememberImage}=await import('./image-quality-test.js?v=0.1.167');const inputs=[new Blob([],{type:'image/jpeg'}),new Blob(['invalid'],{type:'text/plain'}),new Blob([new Uint8Array(10*1024*1024+1)],{type:'image/jpeg'})];const out=[];
  for(const file of inputs){try{await compareRememberImage(file);out.push(false);}catch{out.push(true);}}return out;
 });assert(errors.every(Boolean));console.log('PASS empty, unsupported and oversized input rejected');
 const base64=await page.evaluate(async()=>{
  const c=document.createElement('canvas');c.width=4032;c.height=3024;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,c.width,c.height);
  g.addColorStop(0,'#1d4169');g.addColorStop(.5,'#f0bf77');g.addColorStop(1,'#243c2c');x.fillStyle=g;x.fillRect(0,0,c.width,c.height);
  x.fillStyle='#fff';x.font='bold 180px serif';x.fillText('TEST 4032 × 3024',200,400);
  for(let i=0;i<120;i++){x.fillStyle=i%2?'#eee':'#111';x.fillRect(1200+i*4,1200,2,800);}
  return c.toDataURL('image/jpeg',0.95).split(',')[1];
 });
 const requestsBefore=requests.length;
 await page.locator('#file').setInputFiles({name:'synthetic-detail-fixture.jpg',mimeType:'image/jpeg',buffer:Buffer.from(base64,'base64')});
 await page.locator('#run').click();await page.waitForFunction(()=>document.getElementById('status').textContent.startsWith('Klart.')||document.getElementById('status').textContent.startsWith('Kunde inte jämföra:'),{timeout:30000});
 assert((await page.locator('#status').textContent()).startsWith('Klart.'),await page.locator('#status').textContent());
 assert.equal(await page.locator('.quality-card').count(),4);assert.equal(await page.locator('a[download]').count(),3);
 const metrics=await page.locator('.quality-card').evaluateAll(cards=>cards.map(c=>({id:c.dataset.variant,text:c.querySelector('.metrics').textContent})));
 assert(metrics[0].text.includes('4032 × 3024'));assert(metrics[1].text.includes('1920 × 1440'));
 assert(metrics.slice(2).every(m=>m.text.includes('2400 × 1800')&&m.text.includes('JPEG')));
 const before=await page.locator('.detail-image').first().evaluate(c=>c.toDataURL());
 await page.locator('#focusX').evaluate(e=>{e.value='75';e.dispatchEvent(new Event('input'));});
 const after=await page.locator('.detail-image').first().evaluate(c=>c.toDataURL());assert.notEqual(before,after);
 assert.equal(requests.length,requestsBefore,'selected photos must cause no network requests');assert(requests.every(r=>r.method==='GET'));
 console.log('PASS four versions, downloads, detail pan and no image network requests',JSON.stringify(metrics));
 for(const width of [320,390,1280]){
  await page.setViewportSize({width,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  console.log('PASS layout',width);
 }
 if(process.env.REMEMBER_TEST_SCREENSHOT){await page.setViewportSize({width:390,height:1600});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:process.env.REMEMBER_TEST_SCREENSHOT,fullPage:false});}
 await page.locator('#file').setInputFiles({name:'bad.jpg',mimeType:'image/jpeg',buffer:Buffer.from('not a JPEG')});
 await page.locator('#run').click();await page.waitForFunction(()=>document.getElementById('status').textContent.startsWith('Kunde inte jämföra:'));
 assert.equal(await page.locator('.quality-card').count(),0);assert(!(await page.locator('#file').isDisabled()));assert(!(await page.locator('#run').isDisabled()));
 console.log('PASS invalid image clears stale results and restores controls');
 await browser.close();
})().catch(async e=>{console.error(e);if(page)console.error('STATUS',await page.locator('#status').textContent().catch(()=>''));await browser?.close();process.exitCode=1;});
