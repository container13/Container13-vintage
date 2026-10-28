// Isolated diagnostic only; NEVER merge this branch into production.
export async function corporateProbe(request,env,upstreamFetch=fetch){
 const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json","cache-control":"no-store"}});
 if(request.method!=="POST")return reply({ok:false,error:"METHOD_NOT_ALLOWED"},405);
 if(!env.LINA_LOGIN_CODE)return reply({ok:false,error:"AUTH_NOT_CONFIGURED"},503);
 if(request.headers.get("X-Lina-Login-Code")!==env.LINA_LOGIN_CODE)return reply({ok:false,error:"UNAUTHORIZED"},401);
 if(!env.APCA_API_KEY_ID||!env.APCA_API_SECRET_KEY)return reply({ok:false,error:"PROVIDER_NOT_CONFIGURED"},503);
 let token=null,pages=0,total=0;const seen=new Set(),types={};
 const known=new Set(["forward_splits","reverse_splits","unit_splits","cash_dividends","stock_dividends","spin_offs","cash_mergers","stock_mergers","stock_and_cash_mergers","redemptions","name_changes","worthless_removals","rights_distributions","partial_calls","reorganizations","capital_gains_distributions"]);
 while(pages<5){
  const url=new URL("https://data.alpaca.markets/v1/corporate-actions");
  for(const [k,v]of Object.entries({symbols:"AAPL",types:"forward_split,cash_dividend",start:"2020-01-01",end:"2020-12-31",data_quality:"all",limit:"100"}))url.searchParams.set(k,v);
  if(token)url.searchParams.set("page_token",token);
  let response;try{response=await upstreamFetch(url.toString(),{method:"GET",headers:{"APCA-API-KEY-ID":env.APCA_API_KEY_ID,"APCA-API-SECRET-KEY":env.APCA_API_SECRET_KEY,Accept:"application/json"},signal:AbortSignal.timeout(15000)})}catch{return reply({ok:false,error:"UPSTREAM_UNREACHABLE"},502)}
  if(!response.ok)return reply({ok:false,error:"UPSTREAM_HTTP",providerStatus:response.status},502);
  let payload;try{payload=await response.json()}catch{return reply({ok:false,error:"UPSTREAM_INVALID_JSON"},502)}
  if(!payload||typeof payload!=="object"||Array.isArray(payload)||!payload.corporate_actions||typeof payload.corporate_actions!=="object"||Array.isArray(payload.corporate_actions))return reply({ok:false,error:"UPSTREAM_UNKNOWN_SCHEMA"},502);
  for(const [kind,rows]of Object.entries(payload.corporate_actions)){
   if(!known.has(kind)||!Array.isArray(rows))return reply({ok:false,error:"UPSTREAM_UNKNOWN_SCHEMA"},502);
   total+=rows.length;if(total>500)return reply({ok:false,error:"RESULT_LIMIT"},502);
   if(kind==="forward_splits"||kind==="cash_dividends"){
    if(rows.some(x=>!x||typeof x!=="object"||Array.isArray(x)))return reply({ok:false,error:"UPSTREAM_UNKNOWN_SCHEMA"},502);
    const group=types[kind]||(types[kind]={count:0,fields:[]});group.count+=rows.length;group.fields=[...new Set([...group.fields,...rows.flatMap(x=>Object.keys(x))])].sort();
   }else if(rows.length)return reply({ok:false,error:"UNEXPECTED_EVENT_TYPE"},502);
  }
  pages++;const next=payload.next_page_token;
  if(next==null||next==="")return reply({ok:true,types,pages,complete:true,warning:"Not point-in-time evidence."},200);
  if(typeof next!=="string"||next.length>1024||seen.has(next))return reply({ok:false,error:"PAGINATION_INVALID"},502);
  seen.add(next);token=next;
 }
 return reply({ok:false,error:"PAGINATION_LIMIT",pages},502);
}