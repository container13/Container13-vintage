(function(){
'use strict';
let day='2026-09-15';
const key=()=> 'lina_gen17_sse_probe_'+day.replaceAll('-','')+'_v1';
const name=()=> 'GEN17_SSE_DIAGNOSTIC_'+day.replaceAll('-','');
let busy=false;
const read=()=>{try{return JSON.parse(sessionStorage.getItem(key())||'null')}catch{return null}};
const save=x=>sessionStorage.setItem(key(),JSON.stringify(x));
function mount(root){
 const box=document.createElement('section');box.className='workspace';
 box.innerHTML='<h2>Gen17 · kontroll av bolagshändelser</h2><p>Kontrollerar en vald dag. Datumet gäller när strömhändelser skickades, inte ex-datum. Högst 20 händelser, 64 KiB och 9 sekunder. Ingen forskning eller handel startas.</p><label>Kontrolldag <input type="date" data-sse-day min="2020-01-01"></label><button class="back" data-sse-run>Kör SSE-kontroll och spara resultat</button><p role="status" data-sse-status></p><pre data-sse-result style="white-space:pre-wrap;overflow-wrap:anywhere"></pre>';
 root.prepend(box);
 const button=box.querySelector('[data-sse-run]'),status=box.querySelector('[data-sse-status]'),out=box.querySelector('[data-sse-result]');
 const date=box.querySelector('[data-sse-day]');date.value=day;date.max=new Date().toISOString().slice(0,10);date.onchange=()=>{if(busy)return;day=date.value;render()};
 function render(){const x=read();out.textContent=x?.report?JSON.stringify(x.report,null,2):'';button.disabled=busy||x?.phase==='saved'||x?.phase==='pending'||x?.phase==='uncertain';button.textContent=x?.report&&!x?.receipt?'Spara befintligt resultat till GitHub':'Kör SSE-kontroll och spara resultat';status.textContent=x?.phase==='saved'?'Resultat sparat och GitHub-kvitto verifierat.':x?.phase==='pending'||x?.phase==='uncertain'?'Kontrollen har startats. Utfallet måste granskas innan ett nytt anrop får göras.':x?.report?'Resultat mottaget. Sparning återstår; kontrollen körs inte om.':'Redo. Handel och Forward AV.';}
 async function persist(code,x){
  const r=await fetch(window.LinaAPI.workerBase+'/runtime-report',{method:'POST',headers:{'Content-Type':'application/json','X-Lina-Login-Code':code},body:JSON.stringify({schema:'LINA-RUNTIME-REPORT-1',name:name(),report:x.report})});
  const j=await r.json();if(!r.ok||!j.ok||j.verified!==true||j.receipt?.schema!=='LINA-GITHUB-COMMIT-RECEIPT-1')throw Error('GitHub-sparning saknar verifierat kvitto');
  x.phase='saved';x.receipt=j.receipt;save(x);
 }
 button.onclick=async()=>{
  if(busy)return;
  const code=sessionStorage.getItem('linasopti_login_code');if(!code){status.textContent='Logga in i Lina innan kontrollen startas.';return}
  if(!/^20\d{2}-\d{2}-\d{2}$/.test(day)||day<'2020-01-01'||day>date.max){status.textContent='Välj ett giltigt avslutat datum.';return}
  busy=true;button.disabled=true;date.disabled=true;
  try{
   let x=read();if(x?.phase==='saved'||x?.phase==='pending'||x?.phase==='uncertain')return;
   if(!x?.report){
    x={phase:'pending',startedAt:new Date().toISOString()};save(x);status.textContent='Kontrollerar den avgränsade dagen…';
    const r=await fetch(window.LinaAPI.workerBase+'/corporate-actions-sse-diagnostic',{method:'POST',headers:{'Content-Type':'application/json','X-Lina-Login-Code':code},body:JSON.stringify({day}),signal:AbortSignal.timeout(20000)});
    const body=await r.json();x={phase:'received',report:{schema:'LINA-GEN17-SSE-OBSERVATION-1',day,httpStatus:r.status,response:body,observedAt:new Date().toISOString(),pitVerified:false}};save(x);out.textContent=JSON.stringify(x.report,null,2);
   }
   status.textContent='Sparar befintligt resultat till GitHub…';await persist(code,x);render();
  }catch(e){const x=read();if(x?.phase==='pending'){x.phase='uncertain';save(x)}status.textContent='STOPPAD: '+String(e?.message||e)+'. Inget automatiskt återförsök görs.'}
  finally{busy=false;date.disabled=false;const message=status.textContent;render();if(message.startsWith('STOPPAD:'))status.textContent=message}
 };
 render();
}
window.LinaGen17SSE=Object.freeze({mount});
})();
