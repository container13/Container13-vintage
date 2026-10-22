// UI fixture check; no real login, mail or uploads.
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const packed=require(process.env.REMEMBER_CHROMIUM_MODULE).default;
 const browser=await chromium.launch({headless:true,args:packed.args,executablePath:await packed.executablePath()});
 try{
  const page=await browser.newPage();const root=path.join(__dirname,'..');
  await page.route('**/*',async route=>{
   const url=new URL(route.request().url());
   if(url.hostname==='esm.sh')return route.fulfill({contentType:'text/javascript',body:'export const createClient=()=>({auth:{getSession:async()=>({data:{session:null}})}});'});
   if(url.hostname!=='remember.local')return route.fulfill({status:404,body:''});
   const file=path.join(root,path.basename(url.pathname));
   if(!fs.existsSync(file)||url.pathname.endsWith('.js'))return route.fulfill({contentType:'text/javascript',body:''});
   return route.fulfill({contentType:file.endsWith('.css')?'text/css':'text/html',body:fs.readFileSync(file)});
  });
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:844});await page.goto('http://remember.local/register.html');
   await page.waitForFunction(()=>!document.getElementById('send').disabled);
   assert.match(await page.locator('#trialTerms').innerText(),/30 bilder i mobilkvalitet/);
   assert.match(await page.locator('#trialTerms').innerText(),/originalbilderna laddas upp på nytt/);
   assert(await page.locator('#guestModeOpen').isChecked());await page.locator('label[for=guestModeReviewed]').click();assert(await page.locator('#guestModeReviewed').isChecked());
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   const size=await page.locator('#trialTerms').evaluate(el=>parseFloat(getComputedStyle(el).fontSize));assert(size>=12);
   console.log('PASS registration terms/readability/review choice/no overflow '+width);
  }
  await page.goto('http://remember.local/index.html');await page.locator('#info').click();
  assert(await page.locator('#infoOverlay').isVisible());assert.match(await page.locator('#infoOverlay').innerText(),/30 bilder i mobilkvalitet/);assert.match(await page.locator('#infoOverlay').innerText(),/originalbilderna laddas upp på nytt/);
  await page.locator('#closeInfo').click();assert(await page.locator('#infoOverlay').isHidden());console.log('PASS information dialog terms/open/close');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
