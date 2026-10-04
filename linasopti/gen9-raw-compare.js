(function(w){
'use strict';
const K='lina_gen9_candidate_alpaca_compare_v1',RK='lina_gen9_raw_compare_v1';
async function sha(t){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function canon(a){return a.map(r=>({d:String(r.t||r.d||'').slice(0,10),symbol:String(r.symbol||''),o:Number(r.o),h:Number(r.h),l:Number(r.l),c:Number(r.c)})).sort((a,b)=>a.d.localeCompare(b.d)||a.symbol.localeCompare(b.symbol))}
async function compare(status){
 const raw=JSON.parse(sessionStorage.getItem('lina_gen9_raw_rows_v1')||'[]');if(raw.length!==20128)throw Error('Kör RAW-hämtningen först');
 status('RAW 2/2 · verifierar låst kandidat och jämför…');
 const r=await fetch('SOURCE_gen9-data.json',{cache:'no-store'}),t=await r.text(),h=await sha(t);if(h!=='cb84e436a0527b44262949994306dcb85eaf5f10ad88fc7906d443833cc6589c')throw Error('Kandidat-SHA avviker');
 const j=JSON.parse(t),a=[];for(const symbol of Object.keys(j.data||{}))for(const row of j.data[symbol])a.push({...row,symbol});
 const A=canon(a),B=canon(raw),m=new Map(B.map(x=>[x.d+'|'+x.symbol,x])),ds=[];let exact=0,diffRows=0;
 for(const x of A){const y=m.get(x.d+'|'+x.symbol);if(!y)continue;let d=false;for(const f of ['o','h','l','c'])if(!Object.is(x[f],y[f])){d=true;ds.push({d:x.d,symbol:x.symbol,field:f,candidate:x[f],alpaca:y[f],absDifference:Math.abs(x[f]-y[f])})}d?diffRows++:exact++}
 ds.sort((a,b)=>b.absDifference-a.absDifference);const ts=[.00001,.0001,.001,.01,.1,1,10],bands=Object.fromEntries(ts.map(n=>['lt_'+n,ds.filter(x=>x.absDifference<n).length]));bands.gte_10=ds.filter(x=>x.absDifference>=10).length;
 const report={schema:'LINA-GEN9-CANDIDATE-ALPACA-RAW-DIAGNOSTIC-1',createdAt:new Date().toISOString(),release:w.LinaVersion?.release,candidate:{sha256:h,rowCount:A.length},alpaca:{rowCount:B.length,feed:'sip',adjustment:'raw'},comparison:{method:'EXACT_NUMERIC_OHLC_NO_TOLERANCE_DIAGNOSTIC',matchedKeys:A.length,exactRows:exact,rowsWithDifference:diffRows,fieldDifferences:ds.length,differenceBands:bands,largestDifferences:ds.slice(0,100)},diagnosticOnly:true,verifiedForResearch:false,decision:'DIAGNOSTIC_ONLY_NO_APPROVAL',researchStarted:false,tradeEnabled:false,forwardOpened:false};
 sessionStorage.setItem(RK,JSON.stringify(report));
 const base=w.LinaAPI&&w.LinaAPI.workerBase,code=sessionStorage.getItem('linasopti_login_code')||'';if(!base||!code)throw Error('Lina-session/API saknas');
 status('RAW · sparar separat GEN9_COMPARE_RAW-rapport till GitHub…');
 const ur=await fetch(base+'/runtime-report',{method:'POST',headers:{'Content-Type':'application/json','X-Lina-Login-Code':code},body:JSON.stringify({schema:'LINA-RUNTIME-REPORT-1',name:'GEN9_COMPARE_RAW',report})});
 const ub=await ur.json().catch(()=>({}));if(!ur.ok||!ub.ok)throw Error(ub.error||('RAW-upload HTTP '+ur.status));
 if(!String(ub.path||'').includes('/GEN9_COMPARE_RAW_'))throw Error('RAW-upload gav oväntad rapportsökväg');
 status('RAW-kontroll klar · separat rapport sparad: '+ub.path);return report;
}
document.addEventListener('lina:gen9-raw-ready',async()=>{const s=document.querySelector('[data-gen9-run-status]');try{await compare(t=>{if(s)s.textContent=t})}catch(e){if(s)s.textContent='RAW-JÄMFÖRELSE STOPPAD: '+e.message}});
w.LinaGen9RawCompare=Object.freeze({compare});
})(window);
