// Gen17 SSE integration candidate only. NOT referenced by production wrangler.jsonc.
// Existing V0.4.46 worker remains the fallback for every other path.
import productionWorker from "./WORKER_V046_PREBUNDLED.js";
import {sseDiagnostic} from "../ci-corporate-actions/sse_diagnostic_candidate.mjs";

export default {
  async fetch(request,env,ctx){
    const url=new URL(request.url);
    if(url.pathname!=="/corporate-actions-sse-diagnostic")return productionWorker.fetch(request,env,ctx);
    const response=await sseDiagnostic(request,env);
    // Do not change any other route, authentication, or trading state.
    return response;
  }
};
