// Offline only; no production integration. Structural diagnostic, not point-in-time certification.
import { corporateProbe as v2 } from './corporate_probe.mjs';
const date = x => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x) && !Number.isNaN(Date.parse(x+'T00:00:00Z')) && new Date(x+'T00:00:00Z').toISOString().slice(0,10) === x;
const positive = x => (typeof x === 'number' && Number.isFinite(x) && x > 0) || (typeof x === 'string' && /^(?:\d+)(?:\.\d+)?$/.test(x) && Number(x) > 0 && Number.isFinite(Number(x)));
export function classifyEvent(kind, e) {
  if (!e || typeof e !== 'object' || Array.isArray(e)) return {status:'invalid',reason:'NOT_OBJECT'};
  if (e.symbol !== 'AAPL' || (e.process_date != null && !date(e.process_date)) || (e.ex_date != null && !date(e.ex_date))) return {status:'invalid',reason:'IDENTITY_OR_DATE'};
  const required = kind === 'forward_splits' ? ['old_rate','new_rate'] : ['rate'];
  for (const k of required) if (e[k] != null && !positive(e[k])) return {status:'invalid',reason:'INVALID_RATE'};
  if (kind === 'forward_splits' && e.old_rate != null && e.new_rate != null && Number(e.new_rate) <= Number(e.old_rate)) return {status:'invalid',reason:'NOT_FORWARD_SPLIT'};
  // data_quality=all may legally include incomplete records. Do not count them as validated.
  if (!date(e.process_date) || !date(e.ex_date) || required.some(k=>e[k] == null)) return {status:'incomplete',reason:'MISSING_REQUIRED'};
  return {status:'validated'};
}
// v3 uses v2 for request/response transport, but upstream response is checked before v2 sees it.
export async function corporateProbeV3(request, env, upstreamFetch=fetch){
 let validated={forward_splits:0,cash_dividends:0}, incomplete={forward_splits:0,cash_dividends:0};
 let reasonCounts={};
 const guarded=async (url,init)=>{
  const response=await upstreamFetch(url,init);
  if(!response.ok) return response;
  let payload;try {payload=await response.clone().json()} catch {return response;}
  for(const kind of ['forward_splits','cash_dividends']){
   const rows = payload?.corporate_actions?.[kind];
   // Let V2 reject malformed provider schemas safely; never iterate a non-array.
   if(rows != null && !Array.isArray(rows)) return Response.json({error:'UPSTREAM_UNKNOWN_SCHEMA'}, {status:422});
   for(const e of rows||[]){
    const c=classifyEvent(kind,e);
    if(c.status==='invalid') return Response.json({error:'UPSTREAM_EVENT_INVALID'}, {status:422});
    if(c.status==='validated') validated[kind]++;else incomplete[kind]++;
    reasonCounts[c.reason||'VALIDATED']=(reasonCounts[c.reason||'VALIDATED']||0)+1;
   }
  }
  return response;
 };
 const r=await v2(request,env,guarded);
 if(!r.ok) return r;
 const body=await r.json();
 return new Response(JSON.stringify({...body,validated,incomplete,semanticCheck:'STRUCTURAL_ONLY_NOT_POINT_IN_TIME'}),{status:200,headers:{'content-type':'application/json','cache-control':'no-store'}});
}
