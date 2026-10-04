(function(w){
'use strict';
const S=['AMD','SHOP','ADBE','MU','FDX','TSLA','LUV','NFLX','C','NOW','QCOM','BAC','GM','DDOG','PYPL','NVDA'];
async function run(setStatus){
 const base=w.LinaAPI&&w.LinaAPI.workerBase;if(!base)throw Error('API-bas saknas');
 setStatus('RAW 1/2 · hämtar Alpaca SIP/raw…');
 const q=new URLSearchParams({symbols:S.join(','),timeframe:'1Day',start:'2020-01-01',end:'2024-12-31',feed:'sip',adjustment:'raw'});
 const r=await fetch(base+'/bars?'+q,{cache:'no-store'}),j=await r.json();
 if(!r.ok||!j.ok||j.feed!=='sip'||j.adjustment!=='raw')throw Error(j.error||'Felaktigt RAW-svar');
 const rows=j.rows||[];if(rows.length!==20128)throw Error('RAW måste innehålla 20 128 rader');
 sessionStorage.setItem('lina_gen9_raw_rows_v1',JSON.stringify(rows));
 setStatus('RAW 2/2 · 20 128 rader klara för automatisk jämförelse');
 document.dispatchEvent(new CustomEvent('lina:gen9-raw-ready'));
 return rows;
}
function mount(root){
 const s=root.querySelector('[data-gen9-build]'),status=s&&s.querySelector('[data-gen9-run-status]');if(!s||!status||s.querySelector('[data-gen9-raw-run]'))return;
 const b=document.createElement('button');b.textContent='🧪 Kör RAW-kontroll';b.dataset.gen9RawRun='1';status.insertAdjacentElement('afterend',b);
 b.onclick=async()=>{b.disabled=true;try{await run(t=>status.textContent=t)}catch(e){status.textContent='RAW STOPPAD: '+e.message}finally{b.disabled=false}};
}
w.LinaGen9Raw=Object.freeze({run,mount});
const boot=()=>mount(document);document.addEventListener('lina:unlocked',()=>setTimeout(boot,0));new MutationObserver(boot).observe(document.documentElement,{childList:true,subtree:true});setTimeout(boot,0);
})(window);
