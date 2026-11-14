/* Flyg runtime 0.1.11. Secrets and provider selection tokens stay server-side. */
export const VERSION='0.1.22';
const ORIGIN='https://container13.se';
const AIRPORTS=new Set('ZRH GVA INN SZG MXP LIN BGY TRN MUC LYS BSL VRN VCE BLQ STR VIE NCE GNB TSF TRS FDH GRZ KLU CGN LHR LGW STN'.split(' '));
const TTL=30*60*1000;
const AIRLINES=new Set('FR W6 U2 D8 DY SK LH KL LX OS'.split(' '));
function validateExcluded(value){if(value===undefined)return '';if(!Array.isArray(value)||value.length>AIRLINES.size||new Set(value).size!==value.length||value.some(code=>!AIRLINES.has(code)))throw new SafeError('INVALID_AIRLINES');return [...value].sort().join(',');}
export class SafeError extends Error {constructor(code,status=400){super(code);this.status=status;}}
function response(data,status=200){return Response.json(data,{status,headers:{'Cache-Control':'no-store','Access-Control-Allow-Origin':ORIGIN,'Vary':'Origin','X-Content-Type-Options':'nosniff'}});}
export function validate(input,now=Date.now()){
 if(!input||typeof input!=='object'||Array.isArray(input))throw new SafeError('INVALID_REQUEST');
 if(input.stage==='returns'||input.stage==='details'){
  if(typeof input.selection!=='string'||! /^[a-f\d-]{36}$/.test(input.selection))throw new SafeError('INVALID_SELECTION');
  return {stage:input.stage,selection:input.selection};
 }
 const destinations=typeof input.destination==='string'?input.destination.split(','):[];
 if(!['outbound','calendar'].includes(input.stage)||destinations.length<1||destinations.length>3||new Set(destinations).size!==destinations.length||destinations.some(code=>!AIRPORTS.has(code)))throw new SafeError('INVALID_DESTINATION');
 const calendar=input.stage==='calendar';
 if(calendar&&destinations.length!==1)throw new SafeError('INVALID_DESTINATION');
 const dates=calendar?[input.from,input.to]:[input.outbound,input.return];
 if(!dates.every(s=>typeof s==='string'&&/^\d{4}-\d\d-\d\d$/.test(s)&&Number.isFinite(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s))throw new SafeError('INVALID_DATES');
 const start=Date.parse(dates[0]),end=Date.parse(dates[1]);
 if(start<Math.floor(now/86400000)*86400000||end<start||(!calendar&&end===start)||end-start>(calendar?8:30)*86400000||end-now>365*86400000||(calendar&&(!Number.isInteger(input.nights)||input.nights<1||input.nights>30||end+input.nights*86400000-now>365*86400000)))throw new SafeError('INVALID_DATES');
 const excludeAirlines=validateExcluded(input.excludeAirlines);
 if(calendar)return {stage:'calendar',destination:input.destination,from:input.from,to:input.to,nights:input.nights,direct:input.direct===true,excludeAirlines};
 return {stage:'outbound',destination:input.destination,outbound:dates[0],return:dates[1],direct:input.direct===true,excludeAirlines};
}
export function freeAccount(data){
 if(data?.plan_id!=='free'||data.plan_monthly_price!==0||!Number.isInteger(data.plan_searches_left)||data.plan_searches_left<=0)throw new SafeError('FREE_QUOTA_UNAVAILABLE',429);
 return data.plan_searches_left;
}
function price(value){return typeof value==='number'&&Number.isFinite(value)&&value>0?value:null;}
function short(value){return typeof value==='string'?value.slice(0,250):null;}
function policies(value){return Array.isArray(value)?value.filter(x=>typeof x==='string').slice(0,12).map(short):[];}
export function normalizeFlight(offer){
 if(!Array.isArray(offer.flights)||!offer.flights.length||price(offer.price)===null)return null;
 return {quotedPriceSEK:price(offer.price),priceScope:'PROVIDER_QUOTE_FOR_REQUESTED_TWO_ADULTS',type:short(offer.type),baggageStatus:'UNVERIFIED',hotelArrivalStatus:'UNVERIFIED',
  segments:offer.flights.slice(0,8).map(s=>({number:short(s.flight_number),airline:short(s.airline),origin:short(s.departure_airport?.id),destination:short(s.arrival_airport?.id),departureLocal:short(s.departure_airport?.time),arrivalLocal:short(s.arrival_airport?.time)}))};
}
export function normalizeCalendar(data,context){
 if(!Array.isArray(data.prices))throw new SafeError('PROVIDER_UNAVAILABLE',502);
 const validDate=s=>typeof s==='string'&&/^\d{4}-\d\d-\d\d$/.test(s)&&Number.isFinite(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;
 const seen=new Set();return data.prices.filter(row=>validDate(row.outbound_date)&&validDate(row.return_date)&&row.outbound_date>=context.from&&row.outbound_date<=context.to&&(Date.parse(row.return_date)-Date.parse(row.outbound_date))===context.nights*86400000&&price(row.price)!==null).sort((a,b)=>a.price-b.price).filter(row=>{if(seen.has(row.outbound_date))return false;seen.add(row.outbound_date);return true;}).map(row=>({outbound:row.outbound_date,return:row.return_date,quotedPriceSEK:row.price,destination:context.destination}));
}
export function normalizeBooking(data){
 const result=[];
 for(const row of (data.booking_options||[]).slice(0,30)){
  // Separate-ticket prices must never masquerade as a combined roundtrip total.
  const o=row.together;if(!o||row.separate_tickets===true||price(o.price)===null)continue;
  result.push({seller:short(o.book_with),fare:short(o.option_title),quotedPriceSEK:price(o.price),baggagePolicies:policies(o.baggage_prices),extensions:policies(o.extensions),baggageStatus:'UNVERIFIED',hotelArrivalStatus:'UNVERIFIED'});
 }
 // Free-text policy does not establish every passenger/direction's allowance.
 // Keep UNKNOWN until a structured, offer-bound proof exists for that scope.
 return {options:result,routeBaggagePolicies:Object.fromEntries(['together','departing','returning'].map(k=>[k,policies(data.baggage_prices?.[k])]))};
}
export function selectedFlightUrl(value,key=''){
 if(typeof value!=='string'||value.length>20000||(key&&value.includes(key)))return null;
 try{const u=new URL(value);if(u.protocol!=='https:'||u.hostname!=='www.google.com'||u.username||u.password||!['/travel/flights','/travel/flights/booking'].includes(u.pathname)||!u.searchParams.get('tfs'))return null;
  if([...u.searchParams.keys()].some(k=>/api.?key|access.?token/i.test(k)))return null;
  return value;
 }catch{return null;}
}
export async function provider(path,params,key,fetcher=fetch){
 const url=new URL('https://serpapi.com/'+path);url.search=new URLSearchParams({...params,api_key:key});
 const phase=path==='account.json'?'ACCOUNT':'SEARCH';
 let r;try{r=await fetcher(url,{redirect:'manual',signal:AbortSignal.timeout(70000),headers:{'Accept':'application/json','User-Agent':'Flyg/0.1.17 (+https://container13.se/flyg/)'}});}catch(error){const reason=/not allowed|blocked|restricted|forbidden/i.test(String(error?.message))?'ACCESS_DENIED':error?.name==='TimeoutError'?'TIMEOUT':'NETWORK';throw new SafeError(phase+'_'+reason,502);}
 if(!r.ok)throw new SafeError((path==='account.json'?'ACCOUNT':'SEARCH')+'_HTTP_'+r.status,502);
 let data;try{data=await r.json();}catch{throw new SafeError(phase+'_INVALID_JSON',502);}
 if(data.error){const reason=/invalid.*api.*key|api.*key.*invalid/i.test(String(data.error))?'KEY_REJECTED':/run out|quota|limit/i.test(String(data.error))?'QUOTA':'SOURCE_ERROR';throw new SafeError(phase+'_'+reason,502);}
 return data;
}
export default {async fetch(req,env){
 const url=new URL(req.url);
 if(url.pathname==='/health'&&req.method==='GET'){
  const stub=env.SEARCH_GATE.get(env.SEARCH_GATE.idFromName('flyg-global-v1'));
  const diagnostics=await (await stub.fetch(new Request('https://internal/status'))).json();
  return response({version:VERSION,configured:Boolean(env.FLYG_SERPAPI_KEY),enabled:env.FLYG_ENABLED==='true',...diagnostics});
 }
 if(req.headers.get('Origin')!==ORIGIN)return response({error:'ORIGIN_NOT_ALLOWED'},403);
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:{'Access-Control-Allow-Origin':ORIGIN,'Access-Control-Allow-Methods':'POST','Access-Control-Allow-Headers':'Content-Type','Vary':'Origin'}});
 if(url.pathname!=='/search'||req.method!=='POST')return response({error:'NOT_FOUND'},404);
 if(env.FLYG_ENABLED!=='true'||!env.FLYG_SERPAPI_KEY)return response({error:'SEARCH_NOT_ENABLED'},503);
 if(!req.headers.get('Content-Type')?.startsWith('application/json'))return response({error:'INVALID_REQUEST'},400);
 try{
  const raw=await req.text();if(raw.length>2048)throw new SafeError('INVALID_REQUEST');
  let input;try{input=validate(JSON.parse(raw));}catch(e){throw e instanceof SafeError?e:new SafeError('INVALID_REQUEST');}
  const stub=env.SEARCH_GATE.get(env.SEARCH_GATE.idFromName('flyg-global-v1'));
  return await stub.fetch(new Request('https://internal/search',{method:'POST',body:JSON.stringify(input)}));
 }catch(e){return response({error:e instanceof SafeError?e.message:'SEARCH_FAILED'},e instanceof SafeError?e.status:503);}
}};
// One persistent object owns the cache, selection records and ALL runtime quotas.
// Queue holds through provider I/O, preventing concurrent quota/account races.
export class SearchGate {
 constructor(state,env){this.storage=state.storage;this.env=env;this.tail=Promise.resolve();}
 fetch(req){const work=this.tail.then(()=>this.run(req));this.tail=work.catch(()=>{});return work;}
 async run(req){try{
  if(req.method==='GET'&&new URL(req.url).pathname==='/status')return response({lastFailure:await this.storage.get('lastFailure')||null});
  const input=validate(await req.json());const now=Date.now();
  const saved=await this.storage.get('state')||{schema:1,month:'',monthUsed:0,hour:'',hourUsed:0,records:{},cache:{}};
  if(saved.schema!==1)throw new SafeError('STATE_UNAVAILABLE',503);
  for(const k of ['records','cache'])for(const [id,v]of Object.entries(saved[k]))if(v.expires<=now)delete saved[k][id];
  let context=input,extra={};
  if(['returns','details'].includes(input.stage)){
   const selection=saved.records[input.selection];
   if(!selection||selection.nextStage!==input.stage)throw new SafeError('SELECTION_EXPIRED');
   context=selection.context;extra={[input.stage==='returns'?'departure_token':'booking_token']:selection.token};
  }
  const cacheKey=(input.stage==='details'?VERSION+':':'')+JSON.stringify(input);const hit=saved.cache[cacheKey];
  if(hit)return response({...hit.body,cached:true});
  const month=new Date(now).toISOString().slice(0,7),hour=new Date(now).toISOString().slice(0,13);
  if(saved.month!==month){saved.month=month;saved.monthUsed=0;}
  if(saved.hour!==hour){saved.hour=hour;saved.hourUsed=0;}
  // Global caps include failures, count before I/O, persist across deploy/restarts.
  // Provider Free plan is authoritative: freeAccount() checks remaining quota before every uncached search.
  // No additional 180/month or 20/hour application caps; never accept a paid plan.
  if(Object.keys(saved.records).length>500)throw new SafeError('APP_BUSY',429);
  saved.monthUsed++;saved.hourUsed++;await this.storage.put('state',saved);
  const account=await provider('account.json',{},this.env.FLYG_SERPAPI_KEY);
  const remaining=freeAccount(account);
  const query={...(context.excludeAirlines?{exclude_airlines:context.excludeAirlines}:{}),engine:'google_flights',departure_id:'ARN',arrival_id:context.destination,outbound_date:context.outbound,return_date:context.return,type:'1',adults:'2',currency:'SEK',hl:'en',gl:'se',stops:context.direct?'1':'0',no_cache:'false',sort_by:'2',...extra};
  if(input.stage==='calendar'){query.engine='google_flights_calendar';delete query.outbound_date;delete query.return_date;delete query.sort_by;Object.assign(query,{date_range_start:context.from,date_range_end:context.to,round_trip_days:String(context.nights)});}
  const data=await provider('search.json',query,this.env.FLYG_SERPAPI_KEY);
  if(data.search_metadata?.status!=='Success')throw new SafeError('PROVIDER_UNAVAILABLE',502);
  if(input.stage==='outbound')for(const [key,value]of Object.entries({departure_id:'ARN',arrival_id:context.destination,outbound_date:context.outbound,return_date:context.return,adults:'2',currency:'SEK'}))if(String(data.search_parameters?.[key])!==value)throw new SafeError('PROVIDER_CONTEXT_MISMATCH',502);
  if(input.stage==='calendar')for(const [key,value]of Object.entries({engine:'google_flights_calendar',departure_id:'ARN',arrival_id:context.destination,adults:'2',currency:'SEK',date_range_start:context.from,date_range_end:context.to,round_trip_days:String(context.nights)}))if(String(data.search_parameters?.[key])!==value)throw new SafeError('PROVIDER_CONTEXT_MISMATCH',502);
  const body={version:VERSION,stage:input.stage,context,adults:2,currency:'SEK',fetchedAt:new Date(now).toISOString(),expiresAt:new Date(now+TTL).toISOString(),cached:false,remainingAtLastCheck:remaining-1};
  if(input.stage==='calendar')body.prices=normalizeCalendar(data,context);
  else if(input.stage==='details')Object.assign(body,normalizeBooking(data),{selectedFlightUrl:selectedFlightUrl(data.search_metadata?.google_flights_url,this.env.FLYG_SERPAPI_KEY)});
  else{
   body.flights=[];
   for(const offer of [...(data.best_flights||[]),...(data.other_flights||[])].sort((a,b)=>(price(a.price)??Infinity)-(price(b.price)??Infinity)).slice(0,30)){
    const flight=normalizeFlight(offer);if(!flight)continue;
    const token=input.stage==='outbound'?offer.departure_token:offer.booking_token;
    if(typeof token==='string'&&token.length<20000){const id=crypto.randomUUID();saved.records[id]={token,context:{...context,selectedDestination:input.stage==='outbound'?flight.segments.at(-1)?.destination:context.selectedDestination},nextStage:input.stage==='outbound'?'returns':'details',expires:now+TTL};flight.selection=id;}
    body.flights.push(flight);
   }
  }
  if(body.flights)body.flights.sort((a,b)=>a.quotedPriceSEK-b.quotedPriceSEK);
  if(body.options)body.options.sort((a,b)=>a.quotedPriceSEK-b.quotedPriceSEK);
  saved.cache[cacheKey]={body,expires:now+TTL};await this.storage.put('state',saved);
  return response(body);
 }catch(e){const code=e instanceof SafeError?e.message:'SEARCH_FAILED';await this.storage.put('lastFailure',{code,time:new Date().toISOString()});return response({error:code},e instanceof SafeError?e.status:503);}}
}
