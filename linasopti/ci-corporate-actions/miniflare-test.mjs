import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { Miniflare, createFetchMock } from 'miniflare';
const entry=`import base from "../worker/WORKER_PENDING_RUNTIME_REPORT.js";
import { corporateProbeV3 } from "./corporate_probe_v3_1.mjs";
export default { async fetch(request,env,ctx) {
 if(new URL(request.url).pathname==="/corporate-actions-diagnostic") return corporateProbeV3(request,env);
 return base.fetch(request,env,ctx);
}};`;
const compiled=await build({stdin:{contents:entry,resolveDir:new URL('.',import.meta.url).pathname,sourcefile:'isolated-entry.mjs',loader:'js'},bundle:true,write:false,format:'esm',platform:'browser',target:'es2022'});
const mock=createFetchMock();mock.disableNetConnect();
const query=new URLSearchParams({symbols:'AAPL',types:'forward_split,cash_dividend',start:'2020-01-01',end:'2020-12-31',data_quality:'all',limit:'100'}).toString();
mock.get('https://data.alpaca.markets').intercept({method:'GET',path:'/v1/corporate-actions?'+query}).reply(200,{corporate_actions:{forward_splits:[{symbol:'AAPL',process_date:'2020-08-31',ex_date:'2020-08-31',old_rate:1,new_rate:4}],cash_dividends:[]},next_page_token:null});
const mf=new Miniflare({modules:true,script:compiled.outputFiles[0].text,fetchMock,bindings:{LINA_LOGIN_CODE:'TEST_ONLY',APCA_API_KEY_ID:'FAKE',APCA_API_SECRET_KEY:'FAKE'}});
const url='http://localhost:8787/corporate-actions-diagnostic';
try {
 const denied=await mf.dispatchFetch(url,{method:'POST',headers:{'X-Lina-Login-Code':'wrong'}});assert.equal(denied.status,401);
 const method=await mf.dispatchFetch(url,{method:'GET',headers:{'X-Lina-Login-Code':'TEST_ONLY'}});assert.equal(method.status,405);
 const passed=await mf.dispatchFetch(url,{method:'POST',headers:{'X-Lina-Login-Code':'TEST_ONLY'}});assert.equal(passed.status,200);const data=await passed.json();assert.equal(data.validated.forward_splits,1);assert.equal(data.complete,true);
 const health=await mf.dispatchFetch('http://localhost:8787/health');assert.equal(health.status,200);assert.equal((await health.json()).tradingEnabled,false);
 mock.assertNoPendingInterceptors();
 console.log('PASS Miniflare isolated exact Worker source + V3.1 module: auth, method, split, health, no outbound network');
} finally {await mf.dispose();}
