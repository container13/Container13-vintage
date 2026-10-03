(function(global){
'use strict';
const KEY='lina_gen9_data_diagnostic',sources=[{label:'Yahoo via Worker',path:'/yahoo-bars?symbols=AMD&timeframe=1Day&start=2020-01-01&end=2020-12-31'},{label:'EODHD via Worker',path:'/eod-bars?symbols=AMD.US&timeframe=1Day&start=2020-01-01&end=2020-12-31'}];
let running=false;
function inspect(body,start='2020-01-01',end='2020-12-31'){
 const rows=Array.isArray(body)?body:Array.isArray(body?.rows)?body.rows:Array.isArray(body?.bars)?body.bars:Array.isArray(body?.data)?body.data:[];
 const dates=rows.map(r=>String(r.d||r.date||r.t||r.timestamp||'').slice(0,10)).sort();
 const m=body?.manifest||body?.metadata||{},warnings=[];
 if(!rows.length)warnings.push('Inga dagsrader');
 if(dates.some(d=>d<start||d>end))warnings.push('DATUMFEL: svar innehåller priser utanför begärd period '+start+'–'+end);
 if(dates.some(d=>!/^\d{4}-\d{2}-\d{2}$/.test(d)))warnings.push('Ogiltiga datum i svar');
 if(m.adjustmentStatus!=='VERIFIED_ADJUSTED_OHLC')warnings.push('Verifierad justeringsstatus för samtliga OHLC-fält saknas');
 if(!m.corporateActionsVerified)warnings.push('Verifiering av split/utdelning saknas');
 if(!m.calendarVerified)warnings.push('Verifierad handelskalender saknas');
 if(!m.contentSha256)warnings.push('Datasethash saknas');
 if((body?.errors||[]).length)warnings.push('Datakällan rapporterar fel');
 return{rowCount:rows.length,firstDate:dates[0]||null,lastDate:dates.at(-1)||null,topLevelKeys:Array.isArray(body)?['array']:Object.keys(body||{}),sampleKeys:Object.keys(rows[0]||{}),sampleRows:rows.slice(0,3),provider:body?.provider||body?.source||null,metadata:m,warnings,verifiedForResearch:false,decision:'DIAGNOSTIC_ONLY_FULL_DATA_VERIFICATION_REQUIRED'};
}
function saved(){try{return JSON.parse(global.sessionStorage.getItem(KEY)||'null')}catch{return null}}
async function check(onProgress=()=>{}){
 if(running)throw Error('Datakällkontroll pågår');const base=global.LinaAPI?.workerBase;if(!base)throw Error('API-bas saknas');running=true;
 const report={schema:'LINA-GEN9-DATA-DIAGNOSTIC-1',release:global.LinaVersion?.release,startedAt:new Date().toISOString(),scope:'AMD 2020: schema/provenance only, not complete dataset',researchStarted:false,tradeEnabled:false,attempts:[]};
 try{
 for(const source of sources){onProgress(source.label+' · läser datakällans svar');const attempt={source:source.label,path:source.path};const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
 try{const response=await global.fetch(base+source.path,{cache:'no-store',signal:controller.signal});attempt.httpStatus=response.status;const body=await response.json();attempt.httpOk=response.ok;attempt.analysis=inspect(body);attempt.error=typeof body?.error==='string'?body.error:null}catch(e){attempt.error=String(e.message||e)}finally{clearTimeout(timer)}report.attempts.push(attempt);
 }
 report.finishedAt=new Date().toISOString();global.sessionStorage.setItem(KEY,JSON.stringify(report));onProgress('Datakällkontroll klar · exportera rapporten');return report;
 }finally{running=false}
}
function mount(root){const section=root.querySelector('[data-gen9-build]'),panel=root.querySelector('.engine-export-primary');if(!section||!panel)return;
 const info=document.createElement('p');info.setAttribute('aria-live','polite');const old=saved();info.textContent=old?'Datakällrapport finns att exportera.':'Kontrollera datakällan före planlås. Kontrollen läser prisdata och ändrar inget forskningsstate.';
 const button=document.createElement('button');button.textContent='🔎 Kontrollera Gen9-datakälla';section.append(button,info);
 const exp=document.createElement('button');exp.textContent='📥 Exportera Gen9-datakällkontroll';exp.disabled=!old;panel.append(exp);
 exp.onclick=()=>{const report=saved();if(report)global.LinaStatusExport?.downloadObject?.('LINA_GEN9_DATA_DIAGNOSTIC',report)};
 button.onclick=async()=>{button.disabled=true;try{const report=await check(t=>info.textContent=t);exp.disabled=false;const descriptions=report.attempts.map(a=>a.source+': '+(a.error||a.analysis?.warnings.join('; ')||'schema läst, full verifiering återstår'));info.textContent=descriptions.join(' | ')}catch(e){info.textContent='DATAKONTROLL STOPPAD: '+e.message}finally{button.disabled=false}};
}
const api=Object.freeze({inspect,check,saved,mount});if(typeof module==='object'&&module.exports)module.exports=api;else global.LinaGen9DataCheck=api;
})(typeof window==='object'?window:globalThis);
