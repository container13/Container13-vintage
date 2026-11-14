import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker,{validate,freeAccount,normalizeBooking,normalizeFlight,provider,SearchGate,selectedFlightUrl,normalizeCalendar} from './worker.mjs';
const input={stage:'outbound',destination:'ZRH',outbound:'2027-03-14',return:'2027-03-18'};
const now=Date.parse('2026-11-14');
test('fixed origin, two adults and allowed airport/date input',()=>{
 assert.equal(validate(input,now).destination,'ZRH');
 for(const change of [{destination:'https://evil.test'},{outbound:'2027-02-30'},{return:'2027-03-14'},{outbound:'2026-01-01'},{stage:'anything'}])assert.throws(()=>validate({...input,...change},now));
});
test('bounded multi-airport searches accept valid groups and reject duplicates, unknown or oversized lists',()=>{
 assert.equal(validate({...input,destination:'ZRH,GVA,INN'},now).destination,'ZRH,GVA,INN');
 for(const destination of ['ZRH,GVA,INN,TRN','ZRH,ZRH','ZRH,XXX','ZRH,','all'])assert.throws(()=>validate({...input,destination},now));
});
test('reject raw provider token injection; selection ids only',()=>{
 assert.throws(()=>validate({stage:'details',selection:'raw-provider-token'}));
 assert.deepEqual(validate({stage:'returns',selection:'11111111-1111-1111-1111-111111111111'}),{stage:'returns',selection:'11111111-1111-1111-1111-111111111111'});
});
test('free-only guard rejects paid, missing price, exhausted quota',()=>{
 assert.equal(freeAccount({plan_id:'free',plan_monthly_price:0,plan_searches_left:4}),4);
 for(const d of [{plan_id:'paid',plan_monthly_price:0,plan_searches_left:9},{plan_id:'free',plan_searches_left:9},{plan_id:'free',plan_monthly_price:0,plan_searches_left:0}])assert.throws(()=>freeAccount(d));
});
test('never infer complete23kg scope from free-text, Standard name or route policy',()=>{
 const result=normalizeBooking({baggage_prices:{together:['23kg included']},booking_options:[{together:{book_with:'KLM',option_title:'Standard',price:5680,baggage_prices:['1st checked bag up to23kg free'],booking_request:{post_data:'TOKEN-DO-NOT-LEAK'}}}]});
 assert.equal(result.options[0].baggageStatus,'UNVERIFIED');assert.equal(result.options[0].quotedPriceSEK,5680);
 assert.ok(!JSON.stringify(result).includes('TOKEN-DO-NOT-LEAK'));
});
test('separate-ticket components cannot be shown as combined trip total',()=>{
 assert.equal(normalizeBooking({booking_options:[{separate_tickets:true,together:{price:100},departing:{price:100}},{returning:{price:200}}]}).options.length,0);
});
test('flight allowlist drops tokens and raw fields; rejects nonnumeric prices',()=>{
 const offer={price:3680,type:'Round trip',flights:[{flight_number:'KL1214',departure_airport:{id:'ARN',time:'2027-03-14 06:25'},arrival_airport:{id:'AMS',time:'2027-03-14 08:35'}}],departure_token:'SECRET-TOKEN',private:'KEY'};
 assert.equal(normalizeFlight(offer).baggageStatus,'UNVERIFIED');assert.ok(!JSON.stringify(normalizeFlight(offer)).includes('SECRET-TOKEN'));assert.equal(normalizeFlight({...offer,price:'3680'}),null);
});
test('provider errors suppress payloads and redirects are forbidden',async()=>{
 let options;await assert.rejects(provider('search.json',{},'KEY',async(u,o)=>{options=o;return Response.json({error:'KEY RAW ERROR'});} ),/SEARCH_SOURCE_ERROR/);
 assert.equal(options.redirect,'manual');
});
test('public worker rejects other origins and disabled calls without provider I/O',async()=>{
 assert.equal((await worker.fetch(new Request('https://api.test/search',{method:'POST'}),{})).status,403);
 const r=await worker.fetch(new Request('https://api.test/search',{method:'POST',headers:{Origin:'https://container13.se','Content-Type':'application/json'},body:JSON.stringify(input)}),{FLYG_ENABLED:'false'});assert.equal(r.status,503);
});
function storage(initial){const entries=new Map([['state',initial]]);return {async get(k){return structuredClone(entries.get(k));},async put(k,v){entries.set(k,structuredClone(v));},get value(){return entries.get('state');}};}
function request(value=input){return new Request('https://internal/search',{method:'POST',body:JSON.stringify(value)});}
function data(){return {search_metadata:{status:'Success'},search_parameters:{departure_id:'ARN',arrival_id:'ZRH',outbound_date:input.outbound,return_date:input.return,adults:2,currency:'SEK'},best_flights:[{price:3680,flights:[{flight_number:'KL1214'}],departure_token:'opaque-token'}]};}
test('concurrent identical queries use one provider search and persist quota before network',async()=>{
 const store=storage();const gate=new SearchGate({storage:store},{FLYG_SERPAPI_KEY:'KEY'});let searches=0;const original=global.fetch;
 global.fetch=async url=>{if(url.pathname==='/account.json')return Response.json({plan_id:'free',plan_monthly_price:0,plan_searches_left:244});searches++;assert.equal(store.value.monthUsed,1);return Response.json(data());};
 try{const rs=await Promise.all([gate.fetch(request()),gate.fetch(request())]);const bodies=await Promise.all(rs.map(r=>r.json()));assert.equal(searches,1);assert.equal(bodies[1].cached,true);assert.ok(!JSON.stringify(bodies).includes('opaque-token'));assert.equal(store.value.monthUsed,1);}finally{global.fetch=original;}
});
test('exhausted app quota stops before account or search calls',async()=>{
 const iso=new Date().toISOString();const store=storage({schema:1,month:iso.slice(0,7),monthUsed:180,hour:iso.slice(0,13),hourUsed:0,cache:{},records:{}});const gate=new SearchGate({storage:store},{FLYG_SERPAPI_KEY:'KEY'});const original=global.fetch;let calls=0;global.fetch=async()=>{calls++;throw Error('unexpected');};
 try{const r=await gate.fetch(request());assert.equal(r.status,429);assert.equal(calls,0);}finally{global.fetch=original;}
});
test('failed provider request still consumes local reservation; no automatic retries',async()=>{
 const store=storage();const gate=new SearchGate({storage:store},{FLYG_SERPAPI_KEY:'KEY'});const original=global.fetch;let searches=0;global.fetch=async url=>{if(url.pathname==='/account.json')return Response.json({plan_id:'free',plan_monthly_price:0,plan_searches_left:244});searches++;throw Error('raw KEY');};
 try{const r=await gate.fetch(request());assert.equal(r.status,502);assert.equal(searches,1);assert.equal(store.value.monthUsed,1);assert.ok(!(await r.text()).includes('KEY'));}finally{global.fetch=original;}
});
test('expired selection causes zero provider calls',async()=>{
 const store=storage();const gate=new SearchGate({storage:store},{FLYG_SERPAPI_KEY:'KEY'});const r=await gate.fetch(request({stage:'details',selection:'11111111-1111-1111-1111-111111111111'}));assert.equal(r.status,400);assert.match(await r.text(),/SELECTION_EXPIRED/);
});
test('batch request preserves airport coverage and sorts all returned flight prices',async()=>{
 const store=storage();const gate=new SearchGate({storage:store},{FLYG_SERPAPI_KEY:'KEY'});const original=global.fetch;
 global.fetch=async url=>{if(url.pathname==='/account.json')return Response.json({plan_id:'free',plan_monthly_price:0,plan_searches_left:244});assert.equal(url.searchParams.get('arrival_id'),'ZRH,GVA,INN');assert.equal(url.searchParams.get('sort_by'),'2');const d=data();d.search_parameters.arrival_id='ZRH,GVA,INN';d.best_flights.push({price:1000,flights:[{flight_number:'TEST',arrival_airport:{id:'GVA'}}],departure_token:'private'});return Response.json(d);};
 try{const r=await gate.fetch(request({...input,destination:'ZRH,GVA,INN'}));const body=await r.json();assert.equal(r.status,200);assert.equal(body.context.destination,'ZRH,GVA,INN');assert.deepEqual(body.flights.map(x=>x.quotedPriceSEK),[1000,3680]);assert.equal(store.value.monthUsed,1);}finally{global.fetch=original;}
});

test('Cloudflare-compatible fetch rejects redirect response without following key to another host',async()=>{
 let calls=0;await assert.rejects(provider('account.json',{},'KEY',async(u,o)=>{calls++;if(o.redirect==='error')throw new TypeError('Unsupported redirect mode');assert.equal(o.redirect,'manual');return new Response(null,{status:302,headers:{Location:'https://untrusted.test'}});}),/ACCOUNT_HTTP_302/);assert.equal(calls,1);
});

test('selected itinerary link must be Google HTTPS with tfs; no generic search or secrets',()=>{
 const good='https://www.google.com/travel/flights/booking?tfs=opaque-itinerary&hl=sv';assert.equal(selectedFlightUrl(good),good);
 for(const url of ['https://www.google.com/travel/flights?q=ARN','https://evil.test/travel/flights?tfs=x','javascript:alert(1)','http://www.google.com/travel/flights?tfs=x','https://www.google.com/travel/flights?tfs=x&api_key=SECRET'])assert.equal(selectedFlightUrl(url,'SECRET'),null);
 assert.equal(selectedFlightUrl(undefined),null);
});

const cal={stage:'calendar',destination:'BGY',from:'2027-03-13',to:'2027-03-21',nights:4};
test('calendar validation bounds dates, duration and destination; no quota bypass',()=>{
 assert.equal(validate(cal,now).nights,4);
 for(const patch of [{destination:'ZRH,GVA'},{to:'2027-03-22'},{nights:0},{nights:4.5},{nights:31},{from:'2027-02-30'},{destination:'XXX'}])assert.throws(()=>validate({...cal,...patch},now));
});
test('calendar strips wrong duration, outside-window rows and secret fields; sorts prices',()=>{
 const prices=[{outbound_date:'2027-03-13',return_date:'2027-03-17',price:2000,api_key:'PRIVATE'},{outbound_date:'2027-03-14',return_date:'2027-03-18',price:1808},{outbound_date:'2027-03-12',return_date:'2027-03-16',price:1},{outbound_date:'2027-03-15',return_date:'2027-03-20',price:2}];
 assert.deepEqual(normalizeCalendar({prices},cal).map(x=>x.quotedPriceSEK),[1808,2000]);assert.ok(!JSON.stringify(normalizeCalendar({prices},cal)).includes('PRIVATE'));
});
test('calendar provider uses same persistent quota/cache, two adults SEK and exact date range',async()=>{
 const store=storage();const gate=new SearchGate({storage:store},{FLYG_SERPAPI_KEY:'KEY'});const original=global.fetch;let searches=0;
 global.fetch=async url=>{if(url.pathname==='/account.json')return Response.json({plan_id:'free',plan_monthly_price:0,plan_searches_left:99});searches++;const q=Object.fromEntries(url.searchParams);assert.equal(q.engine,'google_flights_calendar');assert.equal(q.adults,'2');assert.equal(q.currency,'SEK');assert.equal(q.round_trip_days,'4');assert.equal(q.outbound_date,undefined);assert.equal(store.value.monthUsed,1);return Response.json({search_metadata:{status:'Success'},search_parameters:q,prices:[{outbound_date:'2027-03-13',return_date:'2027-03-17',price:2000}]});};
 try{const first=await (await gate.fetch(request(cal))).json();assert.equal(first.prices[0].outbound,'2027-03-13');const second=await (await gate.fetch(request(cal))).json();assert.equal(second.cached,true);assert.equal(searches,1);assert.ok(!JSON.stringify(first).includes('KEY'));}finally{global.fetch=original;}
});
test('calendar source mismatch fails closed and consumes reservation',async()=>{
 const store=storage();const gate=new SearchGate({storage:store},{FLYG_SERPAPI_KEY:'KEY'});const original=global.fetch;
 global.fetch=async url=>url.pathname==='/account.json'?Response.json({plan_id:'free',plan_monthly_price:0,plan_searches_left:99}):Response.json({search_metadata:{status:'Success'},search_parameters:{engine:'google_flights_calendar',departure_id:'ARN',arrival_id:'BGY',adults:'1',currency:'USD'},prices:[]});
 try{const r=await gate.fetch(request(cal));assert.equal(r.status,502);assert.match(await r.text(),/PROVIDER_CONTEXT_MISMATCH/);assert.equal(store.value.monthUsed,1);}finally{global.fetch=original;}
});

test('airline exclusions are canonical and restricted to supported IATA codes',()=>{
 const a=validate({...input,excludeAirlines:['W6','FR']},now);
 assert.equal(a.excludeAirlines,'FR,W6');
 assert.equal(validate({...input,excludeAirlines:[]},now).excludeAirlines,'');
 for(const excludeAirlines of [['XX'],['FR','FR'],'FR',['FR','UA']])assert.throws(()=>validate({...input,excludeAirlines},now),/INVALID_AIRLINES/);
 assert.equal(validate({stage:'calendar',destination:'INN',from:'2027-03-13',to:'2027-03-21',nights:4,excludeAirlines:['FR']},now).excludeAirlines,'FR');
});
