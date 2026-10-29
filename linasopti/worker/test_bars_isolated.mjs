import assert from "node:assert/strict";
import worker from "./WORKER_PENDING_RUNTIME_REPORT.js";

const env = {LINA_LOGIN_CODE:"local-test-code",APCA_API_KEY_ID:"mock",APCA_API_SECRET_KEY:"mock"};
const endpoint = "https://test.invalid/bars";
const params = "?symbols=SPY&timeframe=1Day&feed=sip&adjustment=raw&start=2020-01-01&end=2024-12-31";
let upstreamCalls = 0;
const originalFetch = globalThis.fetch;
globalThis.fetch = async () => {
  upstreamCalls++;
  return new Response(JSON.stringify({
    bars:{SPY:[{t:"2024-12-30T05:00:00Z",o:1,h:2,l:1,c:2,v:100}]},
    next_page_token:null
  }),{status:200});
};

async function request(suffix, code) {
  const headers = code ? {"X-Lina-Login-Code":code} : {};
  return worker.fetch(new Request(endpoint + suffix,{headers}),env);
}

try {
  assert.equal((await request(params)).status,401);
  assert.equal((await request(params,"incorrect")).status,401);
  assert.equal(upstreamCalls,0);
  assert.equal((await request("?symbols=SPY&start=2010-01-01&end=2024-12-31","local-test-code")).status,400);
  assert.equal(upstreamCalls,0);
  const response = await request(params,"local-test-code");
  assert.equal(response.status,200);
  const body = await response.json();
  assert.equal(body.ok,true);
  assert.equal(body.rowCount,1);
  assert.equal(body.feed,"sip");
  assert.equal(body.adjustment,"raw");
  assert.equal(upstreamCalls,1);
  console.log("PASS: authorization, bounds, and mocked SPY response");
} finally {
  globalThis.fetch = originalFetch;
}
