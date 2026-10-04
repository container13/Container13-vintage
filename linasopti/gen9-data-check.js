(function(global){
'use strict';
const KEY='lina_gen9_data_diagnostic',INDEPENDENT_KEY='lina_gen9_independent_line_v1',COMPARE_KEY='lina_gen9_candidate_alpaca_compare_v1',GEN9_SYMBOLS=['AMD','SHOP','ADBE','MU','FDX','TSLA','LUV','NFLX','C','NOW','QCOM','BAC','GM','DDOG','PYPL','NVDA'],sources=[{label:'Yahoo via Worker',path:'/yahoo-bars?symbols=AMD&timeframe=1Day&start=2020-01-01&end=2020-12-31'},{label:'EODHD via Worker',path:'/eod-bars?symbols=AMD.US&timeframe=1Day&start=2020-01-01&end=2020-12-31'}];
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

async function sha256(text){const b=await global.crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function canonicalRows(rows){return rows.map(r=>({d:String(r.t||r.d||'').slice(0,10),symbol:String(r.symbol||''),o:Number(r.o),h:Number(r.h),l:Number(r.l),c:Number(r.c)})).sort((a,b)=>a.d.localeCompare(b.d)||a.symbol.localeCompare(b.symbol))}
async function fetchIndependent(onProgress=()=>{}){
 const base=global.LinaAPI?.workerBase;if(!base)throw Error('API-bas saknas');
 const q=new URLSearchParams({symbols:GEN9_SYMBOLS.join(','),timeframe:'1Day',start:'2020-01-01',end:'2024-12-31',feed:'sip',adjustment:'all'});
 onProgress('Alpaca SIP/all · hämtar 16 symboler 2020–2024');
 const response=await global.fetch(base+'/bars?'+q.toString(),{cache:'no-store'});const body=await response.json();
 if(!response.ok||!body?.ok)throw Error(body?.error||('HTTP '+response.status));
 if(body.feed!=='sip'||body.adjustment!=='all'||body.timeframe!=='1Day')throw Error('Alpaca-svaret matchar inte SIP/all/1Day');
 const rows=canonicalRows(body.rows||[]),counts=Object.fromEntries(GEN9_SYMBOLS.map(s=>[s,rows.filter(r=>r.symbol===s).length]));
 if(rows.length!==20128||GEN9_SYMBOLS.some(s=>counts[s]!==1258))throw Error('Radantal avviker från förväntad 16 × 1258');
 const rawText=JSON.stringify(body),normalizedText=JSON.stringify(rows);
 const report={schema:'LINA-GEN9-INDEPENDENT-DATA-LINE-1',createdAt:new Date().toISOString(),source:{provider:'Alpaca',feed:'sip',adjustment:'all',timeframe:'1Day',range:['2020-01-01','2024-12-31'],symbols:GEN9_SYMBOLS},rowCount:rows.length,counts,rawSha256:await sha256(rawText),normalizedSha256:await sha256(normalizedText),calendarShapeVerified:true,independentDataLineFetched:true,independentDataLineVerified:false,researchStarted:false,tradeEnabled:false,forwardOpened:false,raw:body,normalizedRows:rows};
 global.sessionStorage.setItem(INDEPENDENT_KEY,JSON.stringify(report));onProgress('Alpaca SIP/all klar · 20 128 rader hashade och redo att exportera');return report;
}
function savedIndependent(){try{return JSON.parse(global.sessionStorage.getItem(INDEPENDENT_KEY)||'null')}catch{return null}}
async function copyCandidate(onProgress=()=>{}){
 onProgress('Kandidatdata · läser SOURCE_gen9-data.json');
 const response=await global.fetch('SOURCE_gen9-data.json',{cache:'no-store'});
 if(!response.ok)throw Error('Kandidatfil kunde inte läsas · HTTP '+response.status);
 const text=await response.text();
 const hash=await sha256(text);
 if(hash!=='cb84e436a0527b44262949994306dcb85eaf5f10ad88fc7906d443833cc6589c')throw Error('Kandidatfilens SHA-256 matchar inte låst original');
 let body;try{body=JSON.parse(text)}catch{throw Error('Kandidatfilen är inte giltig JSON')}
 onProgress('Kandidatdata verifierad · kopierar exakt originalfil');
 global.LinaStatusExport?.downloadText?.('SOURCE_gen9-data.json',text,'application/json;charset=utf-8');
 return{sha256:hash,body};
}
function candidateRows(body){
 const rows=Array.isArray(body)?body:Array.isArray(body?.rows)?body.rows:Array.isArray(body?.data)?body.data:Array.isArray(body?.prices)?body.prices:[];
 return canonicalRows(rows);
}
async function compareCandidateIndependent(onProgress=()=>{}){
 const independent=savedIndependent();if(!independent?.normalizedRows?.length)throw Error('Hämta Alpaca SIP/all först');
 onProgress('Jämför · verifierar låst kandidatfil');
 const response=await global.fetch('SOURCE_gen9-data.json',{cache:'no-store'});if(!response.ok)throw Error('Kandidatfil HTTP '+response.status);
 const text=await response.text(),candidateSha256=await sha256(text);
 if(candidateSha256!=='cb84e436a0527b44262949994306dcb85eaf5f10ad88fc7906d443833cc6589c')throw Error('Kandidatfilens SHA-256 matchar inte låst original');
 let body;try{body=JSON.parse(text)}catch{throw Error('Kandidatfilen är inte giltig JSON')}
 const a=candidateRows(body),b=canonicalRows(independent.normalizedRows),mapA=new Map(a.map(r=>[r.d+'|'+r.symbol,r])),mapB=new Map(b.map(r=>[r.d+'|'+r.symbol,r]));
 const keys=[...new Set([...mapA.keys(),...mapB.keys()])].sort(),fields=['o','h','l','c'],bySymbol=Object.fromEntries(GEN9_SYMBOLS.map(s=>[s,{rowsCompared:0,rowsWithDifference:0,fieldDifferences:{o:0,h:0,l:0,c:0},maxAbsDifference:{o:0,h:0,l:0,c:0}}]));
 let exactRows=0,rowsWithDifference=0,fieldDifferences=0;const missingCandidate=[],missingAlpaca=[],examples=[];
 for(const key of keys){const x=mapA.get(key),y=mapB.get(key),symbol=(x||y)?.symbol;if(!x){missingCandidate.push(key);continue}if(!y){missingAlpaca.push(key);continue}
  const s=bySymbol[symbol]||(bySymbol[symbol]={rowsCompared:0,rowsWithDifference:0,fieldDifferences:{o:0,h:0,l:0,c:0},maxAbsDifference:{o:0,h:0,l:0,c:0}});s.rowsCompared++;const diffs={};
  for(const f of fields){if(!Object.is(x[f],y[f])){const abs=Math.abs(x[f]-y[f]);diffs[f]={candidate:x[f],alpaca:y[f],absDifference:abs};s.fieldDifferences[f]++;s.maxAbsDifference[f]=Math.max(s.maxAbsDifference[f],abs);fieldDifferences++}}
  if(Object.keys(diffs).length){rowsWithDifference++;s.rowsWithDifference++;if(examples.length<100)examples.push({d:x.d,symbol,differences:diffs})}else exactRows++;
 }
 const report={schema:'LINA-GEN9-CANDIDATE-ALPACA-COMPARE-1',createdAt:new Date().toISOString(),release:global.LinaVersion?.release,candidate:{sha256:candidateSha256,rowCount:a.length},alpaca:{rawSha256:independent.rawSha256,normalizedSha256:independent.normalizedSha256,rowCount:b.length,feed:'sip',adjustment:'all'},comparison:{method:'EXACT_NUMERIC_OHLC_NO_TOLERANCE',keysCompared:keys.length,matchedKeys:keys.length-missingCandidate.length-missingAlpaca.length,exactRows,rowsWithDifference,fieldDifferences,missingCandidateCount:missingCandidate.length,missingAlpacaCount:missingAlpaca.length,missingCandidate:missingCandidate.slice(0,100),missingAlpaca:missingAlpaca.slice(0,100),bySymbol,examplesFirst100:examples},independentDataLineVerified:false,verifiedForResearch:false,decision:'REVIEW_REQUIRED_NO_AUTOMATIC_APPROVAL',researchStarted:false,tradeEnabled:false,forwardOpened:false};
 global.sessionStorage.setItem(COMPARE_KEY,JSON.stringify(report));onProgress('Jämförelse klar · kopiera den lilla rapporten');return report;
}
function savedComparison(){try{return JSON.parse(global.sessionStorage.getItem(COMPARE_KEY)||'null')}catch{return null}}
function compactComparison(report){
 const c=report?.comparison||{},symbols={};
 for(const [symbol,s] of Object.entries(c.bySymbol||{}))symbols[symbol]={rows:s.rowsCompared,diffRows:s.rowsWithDifference,fieldDiffs:s.fieldDifferences,maxAbs:s.maxAbsDifference};
 return{schema:'LINA-GEN9-COMPARE-CHAT-1',release:report?.release,candidateSha256:report?.candidate?.sha256,alpacaNormalizedSha256:report?.alpaca?.normalizedSha256,method:c.method,candidateRows:report?.candidate?.rowCount,alpacaRows:report?.alpaca?.rowCount,matchedKeys:c.matchedKeys,exactRows:c.exactRows,rowsWithDifference:c.rowsWithDifference,fieldDifferences:c.fieldDifferences,missingCandidateCount:c.missingCandidateCount,missingAlpacaCount:c.missingAlpacaCount,bySymbol:symbols,decision:report?.decision,independentDataLineVerified:false,verifiedForResearch:false,researchStarted:false,tradeEnabled:false,forwardOpened:false};
}
function mount(root){const section=root.querySelector('[data-gen9-build]'),panel=root.querySelector('.engine-export-primary');if(!section||!panel)return;
 const info=document.createElement('p');info.setAttribute('aria-live','polite');const old=saved();info.textContent=old?'Datakällrapport finns att exportera.':'Kontrollera datakällan före planlås. Kontrollen läser prisdata och ändrar inget forskningsstate.';
 const button=document.createElement('button');button.textContent='🔎 Kontrollera Gen9-datakälla';section.append(button,info);
 const independent=document.createElement('button');independent.textContent='🧪 Hämta oberoende Alpaca SIP/all';section.append(independent);
 const independentExport=document.createElement('button');independentExport.textContent='📋 Kopiera Alpaca SIP/all';independentExport.disabled=!savedIndependent();panel.append(independentExport);
 const candidateExport=document.createElement('button');candidateExport.textContent='📋 Kopiera Gen9-kandidatdata';panel.append(candidateExport);
 const compare=document.createElement('button');compare.textContent='🔎 Jämför kandidat ↔ Alpaca';section.append(compare);
 const compareExport=document.createElement('button');compareExport.textContent='📋 Kopiera jämförelserapport';compareExport.disabled=!savedComparison();panel.append(compareExport);
 compare.onclick=async()=>{compare.disabled=true;try{await compareCandidateIndependent(t=>info.textContent=t);compareExport.disabled=false}catch(e){info.textContent='JÄMFÖRELSE STOPPAD: '+e.message}finally{compare.disabled=false}};
 compareExport.onclick=()=>{const report=savedComparison();if(report)global.LinaStatusExport?.downloadObject?.('LINA_GEN9_COMPARE_CHAT',compactComparison(report))};
 candidateExport.onclick=async()=>{candidateExport.disabled=true;try{await copyCandidate(t=>info.textContent=t)}catch(e){info.textContent='KANDIDATDATA STOPPAD: '+e.message}finally{candidateExport.disabled=false}};
 independent.onclick=async()=>{independent.disabled=true;try{await fetchIndependent(t=>info.textContent=t);independentExport.disabled=false}catch(e){info.textContent='ALPACA STOPPAD: '+e.message}finally{independent.disabled=false}};
 independentExport.onclick=()=>{const report=savedIndependent();if(report)global.LinaStatusExport?.downloadObject?.('LINA_GEN9_ALPACA_SIP_ALL_2020_2024',report)};
 const exp=document.createElement('button');exp.textContent='📥 Exportera Gen9-datakällkontroll';exp.disabled=!old;panel.append(exp);
 exp.onclick=()=>{const report=saved();if(report)global.LinaStatusExport?.downloadObject?.('LINA_GEN9_DATA_DIAGNOSTIC',report)};
 button.onclick=async()=>{button.disabled=true;try{const report=await check(t=>info.textContent=t);exp.disabled=false;const descriptions=report.attempts.map(a=>a.source+': '+(a.error||a.analysis?.warnings.join('; ')||'schema läst, full verifiering återstår'));info.textContent=descriptions.join(' | ')}catch(e){info.textContent='DATAKONTROLL STOPPAD: '+e.message}finally{button.disabled=false}};
}
const api=Object.freeze({inspect,check,saved,fetchIndependent,savedIndependent,copyCandidate,compareCandidateIndependent,savedComparison,compactComparison,mount});if(typeof module==='object'&&module.exports)module.exports=api;else global.LinaGen9DataCheck=api;
})(typeof window==='object'?window:globalThis);
