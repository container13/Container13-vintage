import test from "node:test";
import assert from "node:assert/strict";
import { sseDiagnostic } from "./sse_diagnostic_candidate.mjs";
const env={LINA_LOGIN_CODE:"test-code",APCA_API_KEY_ID:"test-key",APCA_API_SECRET_KEY:"test-secret"};
const request=(day="2020-08-31",code="test-code")=>new Request("https://example.test/corporate-actions-sse-diagnostic",{method:"POST",headers:{"X-Lina-Login-Code":code,"content-type":"application/json"},body:JSON.stringify({day})});
const response=(body,status=200)=>new Response(body,{status,headers:{"content-type":"text/event-stream"}});
const run=async(req,settings=env,fetcher=async()=>response(""))=>{const r=await sseDiagnostic(req,settings,fetcher);return {status:r.status,data:await r.json()}};
test("requires POST",async()=>{const r=await run(new Request("https://example.test/",{method:"GET"}));assert.equal(r.status,405)});
test("rejects bad login",async()=>{const r=await run(request("2020-08-31","wrong"));assert.equal(r.status,401)});
test("requires provider credentials",async()=>{const r=await run(request(),{...env,APCA_API_SECRET_KEY:""});assert.equal(r.status,503)});
test("rejects invalid dates",async()=>{for(const day of ["2020-02-30","2020-13-01","2027-01-01"]){const r=await run(request(day));assert.equal(r.status,400,day)}});
test("rejects provider HTTP errors without leaking body",async()=>{const r=await run(request(),env,async()=>response("sensitive",403));assert.equal(r.data.error,"UPSTREAM_HTTP");assert.equal(r.data.providerStatus,403);assert.ok(!JSON.stringify(r.data).includes("sensitive"))});
test("reads SSE envelope IDs, event names and JSON fields",async()=>{const payload='id: 123\\nevent: insert\\ndata: {"event_id":"abc","created_at":"2020-08-31T00:00:00Z","secret":"not-to-return"}\\n\\n'.replaceAll('\\n','\n');const r=await run(request(),env,async()=>response(payload));assert.equal(r.status,200);assert.equal(r.data.events,1);assert.equal(r.data.sseIdCount,1);assert.deepEqual(r.data.sseEventTypes,["insert"]);assert.ok(r.data.timestampLikeKeys.includes("created_at"));assert.ok(!JSON.stringify(r.data).includes("not-to-return"))});
test("empty SSE is not PIT evidence",async()=>{const r=await run(request());assert.equal(r.data.complete,false);assert.equal(r.data.pitVerified,false)});
test("caps event count",async()=>{const payload=Array.from({length:25},(_,i)=>'id: '+i+'\\ndata: {"event_id":"'+i+'"}\\n\\n').join("").replaceAll('\\n','\n');const r=await run(request(),env,async()=>response(payload));assert.equal(r.data.events,20);assert.equal(r.data.stopReason,"EVENT_LIMIT");assert.equal(r.data.complete,false)});
test("caps bytes",async()=>{const r=await run(request(),env,async()=>response("x".repeat(65537)));assert.equal(r.data.stopReason,"BYTE_LIMIT");assert.equal(r.data.complete,false)});
test("passes bounded date query and provider auth",async()=>{let u,h;await run(request(),env,async(url,opts)=>{u=new URL(url);h=opts.headers;return response("")});assert.equal(u.searchParams.get("since"),"2020-08-31T00:00:00Z");assert.equal(u.searchParams.get("until"),"2020-08-31T23:59:59Z");assert.equal(h["APCA-API-KEY-ID"],"test-key")});

test("partial trailing SSE frame is never complete",async()=>{const payload='data: {"event_id":"one"}\\n\\ndata: {"event_id":"unfinished"}'.replaceAll("\\n","\n");const r=await run(request(),env,async()=>response(payload));assert.equal(r.data.events,1);assert.equal(r.data.complete,false)});

test("hung upstream connect stops at timeout", {timeout:12000}, async()=>{const start=Date.now();const r=await run(request(),env,async()=>new Promise(()=>{}));assert.equal(r.status,502);assert.equal(r.data.error,"TIME_LIMIT");assert.ok(Date.now()-start>=8500);assert.ok(Date.now()-start<11500)});

test("sample is bounded, allowlisted and excludes provider secrets",async()=>{const event={action:"insert",at:"2026-09-16T12:00:00Z",event_id:"01KMAGXP2FCJ4NR1TDX8ZWKR6E",event_type:"cash_dividend_corporateaction_event",region:"us",secret:"test-secret",ca:{id:"1234-abcd",symbol:"MSFT",ex_date:"2026-11-19",rate:"0.98",raw:"test-secret"}};const frame="data: "+JSON.stringify(event)+"\n\n";const r=await run(request("2026-09-16"),env,async()=>response(frame.repeat(5)));assert.equal(r.data.samples.length,3);assert.equal(r.data.samples[0].at,event.at);assert.equal(r.data.samples[0].ca.symbol,"MSFT");assert.equal(r.data.samples[0].ca.rate,"0.98");assert.equal(r.data.samples[0].ca.raw,undefined);assert(!JSON.stringify(r.data).includes("test-secret"));assert.equal(r.data.pitVerified,false)});
