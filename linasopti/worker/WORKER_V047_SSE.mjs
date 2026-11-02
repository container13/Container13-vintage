// V0.4.47: bounded Gen17 SSE diagnostic in user's existing test Worker.
import base from "./WORKER_V046_PREBUNDLED.js";
import {sseDiagnostic} from "../ci-corporate-actions/sse_diagnostic_candidate.mjs";
export default {async fetch(request,env,ctx){
 if(request.method==="OPTIONS" || new URL(request.url).pathname!=="/corporate-actions-sse-diagnostic") return base.fetch(request,env,ctx);
 const response=await sseDiagnostic(request,env);
 const preflight=await base.fetch(new Request(request.url,{method:"OPTIONS",headers:request.headers}),env,ctx);
 const headers=new Headers(response.headers);
 preflight.headers.forEach((v,k)=>headers.set(k,v));
 headers.set("X-Lina-Diagnostic-Release","V0.4.47");
 return new Response(response.body,{status:response.status,headers});
}};
