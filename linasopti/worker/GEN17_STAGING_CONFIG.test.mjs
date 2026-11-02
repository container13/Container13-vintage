import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=(name)=>JSON.parse(readFileSync(new URL(name,import.meta.url),"utf8"));
test("production Worker remains pinned to original V046 bundle",()=>{
  const c=read("./wrangler.jsonc");
  assert.equal(c.name,"linas-opti-api");
  assert.equal(c.main,"./WORKER_V046_PREBUNDLED.js");
});
test("Gen17 staging Worker is separately named and has no routes or inherited vars",()=>{
  const c=read("./wrangler.gen17-sse-staging.jsonc");
  assert.equal(c.name,"linas-opti-gen17-sse-staging");
  assert.equal(c.main,"./WORKER_GEN17_SSE_CANDIDATE.mjs");
  assert.equal(c.workers_dev,true);
  assert.equal(c.keep_vars,undefined);
  assert.equal(c.route,undefined);
  assert.equal(c.routes,undefined);
  assert.equal(c.vars,undefined);
});
