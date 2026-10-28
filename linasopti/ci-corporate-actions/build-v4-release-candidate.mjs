// Isolated build-only candidate. NEVER deploy from this script.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {build} from 'esbuild';
const file=new URL('../worker/WORKER_PENDING_RUNTIME_REPORT.js',import.meta.url);
const original=await readFile(file,'utf8');
const marker='    if (preUrl.pathname === "/deploy-status") return handleDeployStatus(request);';
assert.equal(original.split(marker).length,2,'Worker insertion point changed: stop');
const route='    if (preUrl.pathname === "/corporate-actions-diagnostic") { const response=await corporateProbeV4(request,env); const headers=new Headers(response.headers); for(const [k,v] of Object.entries(corsHeaders(request))) headers.set(k,v); return new Response(response.body,{status:response.status,headers}); }\n';
const entry='import {corporateProbeV4} from "./corporate_probe_v4_candidate.mjs";\n'+original.replace(marker,route+marker);
const compiled=await build({stdin:{contents:entry,resolveDir:new URL('.',import.meta.url).pathname,sourcefile:'v4-candidate-entry.mjs',loader:'js'},bundle:true,write:false,format:'esm',platform:'browser',target:'es2022'});
assert.ok(compiled.outputFiles[0].text.includes('/corporate-actions-diagnostic'));
assert.ok(compiled.outputFiles[0].text.includes('STRUCTURAL_ONLY_NOT_POINT_IN_TIME'));
const target=new URL('./.candidate-build/',import.meta.url);
await mkdir(target,{recursive:true});
await writeFile(new URL('WORKER_V4_RELEASE_CANDIDATE.js',target),compiled.outputFiles[0].text);
console.log('PASS V4 candidate build only; no deploy; isolated candidate release target V0.4.46');
