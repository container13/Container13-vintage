// Read-only candidate. NOT wired to production routes. No deployment.
// POST /corporate-actions-sse-diagnostic; X-Lina-Login-Code required.
const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json","cache-control":"no-store"}});
export async function sseDiagnostic(request,env,upstreamFetch=fetch){
  if(request.method!=="POST")return reply({ok:false,error:"METHOD_NOT_ALLOWED"},405);
  if(!env.LINA_LOGIN_CODE)return reply({ok:false,error:"AUTH_NOT_CONFIGURED"},503);
  if(request.headers.get("X-Lina-Login-Code")!==env.LINA_LOGIN_CODE)return reply({ok:false,error:"UNAUTHORIZED"},401);
  if(!env.APCA_API_KEY_ID||!env.APCA_API_SECRET_KEY)return reply({ok:false,error:"PROVIDER_NOT_CONFIGURED"},503);
  let input;
  try{input=await request.json()}catch{return reply({ok:false,error:"INVALID_JSON"},400)}
  const day=input?.day;
  if(typeof day!=="string"||!/^(2020|2021|2022|2023|2024|2025|2026)-\d{2}-\d{2}$/.test(day)||new Date(day+"T00:00:00Z").toISOString().slice(0,10)!==day||day>new Date().toISOString().slice(0,10))return reply({ok:false,error:"INVALID_DAY"},400);
  const endpoint=new URL("https://stream.data.alpaca.markets/v1beta1/events/corporate-actions");
  endpoint.searchParams.set("since",day+"T00:00:00Z");
  endpoint.searchParams.set("until",day+"T23:59:59Z");
  endpoint.searchParams.set("region","us");
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),9000);
  let reader;
  try{
    const res=await upstreamFetch(endpoint.toString(),{headers:{"APCA-API-KEY-ID":env.APCA_API_KEY_ID,"APCA-API-SECRET-KEY":env.APCA_API_SECRET_KEY,"Accept":"text/event-stream"},signal:controller.signal});
    if(!res.ok)return reply({ok:false,error:"UPSTREAM_HTTP",providerStatus:res.status},502);
    if(!res.body)return reply({ok:false,error:"NO_STREAM_BODY"},502);
    reader=res.body.getReader();const decoder=new TextDecoder();let buffer="",bytes=0,events=0,observedKeys=new Set(),eventIds=0,timestampKeys=new Set(),stopReason="EOF";
    const inspect=(block)=>{
      const data=block.split(/\r?\n/).filter(line=>line.startsWith("data:")).map(line=>line.slice(5).trimStart()).join("\n");
      if(!data)return;
      events++;
      try{const obj=JSON.parse(data);if(obj&&typeof obj==="object"&&!Array.isArray(obj)){
        Object.keys(obj).forEach(k=>observedKeys.add(k));
        if(typeof obj.event_id==="string")eventIds++;
        Object.keys(obj).filter(k=>/time|date|at$|timestamp/i.test(k)).forEach(k=>timestampKeys.add(k));
      }}catch{ /* preserve count but no raw data */ }
    };
    while(true){
      let next;
      try{next=await reader.read()}catch(e){stopReason=controller.signal.aborted?"TIME_LIMIT":"STREAM_ERROR";break}
      if(next.done)break;
      bytes+=next.value.byteLength;
      if(bytes>65536){stopReason="BYTE_LIMIT";break}
      buffer+=decoder.decode(next.value,{stream:true});
      let boundary;
      while((boundary=buffer.search(/\r?\n\r?\n/))!==-1){
        const sep=buffer.slice(boundary).match(/^\r?\n\r?\n/)[0];const block=buffer.slice(0,boundary);buffer=buffer.slice(boundary+sep.length);
        inspect(block);
        if(events>=20){stopReason="EVENT_LIMIT";break}
      }
      if(stopReason==="EVENT_LIMIT")break;
    }
    return reply({ok:true,day,providerStatus:res.status,events,bytes,observedEnvelopeKeys:[...observedKeys].sort(),eventIdFieldCount:eventIds,timestampLikeKeys:[...timestampKeys].sort(),stopReason,complete:stopReason==="EOF",pitVerified:false,warning:"A zero-event result or HTTP 200 does not establish retention or PIT availability."});
  }catch{return reply({ok:false,error:controller.signal.aborted?"TIME_LIMIT":"UPSTREAM_UNREACHABLE"},502)}
  finally{controller.abort();clearTimeout(timeout);if(reader)try{await reader.cancel()}catch{}}
}
