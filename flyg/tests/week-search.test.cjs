const {test}=require('node:test');const assert=require('node:assert/strict');const vm=require('node:vm');const fs=require('node:fs');
class Node{
 constructor(tag='div',text=''){this.tag=tag;this.textContent=text;this.children=[];this.listeners={};this.value='';this.dataset={};this.checked=true;this.open=false;}
 append(...nodes){this.children.push(...nodes);}
 replaceChildren(...nodes){this.children=[...nodes];}
 addEventListener(type,fn){(this.listeners[type]??=[]).push(fn);}
 setAttribute(){}checkValidity(){return true;}reportValidity(){}focus(){}scrollIntoView(){}
 cloneNode(){const n=new Node(this.tag,this.textContent);n.value=this.value;return n;}
 get options(){return this.children;}querySelectorAll(tag){return this.children.flatMap(n=>[...(n.tag===tag?[n]:[]),...n.querySelectorAll(tag)]);}
}
function fixture(fetcher){
 const ids={};for(const id of ['liveForm','liveResults','liveStatus','liveAirport','liveOutbound','liveReturn','maxPrice','searchChoices','searchForm','destination','tripWeek','nights','year','searchMode','weekHint','liveSearch','baggage','cabinBoots','personalBag','connections','skiResortField','skiResort','tripRegion','arrival','hotelArrival','maxLayover','dinnerTarget','groundMode','airportMinutes','roadBuffer','checkinMinutes','showCityFallback','skiDays','returnPlan','skiStart','skiEnd','earliestHotelDeparture','airportReturnMinutes','cityAirportMinutes',...['FR','W6','U2','D8','SK','LH','KL','LX','OS'].map(c=>'exclude'+c)])ids[id]=new Node();
 for(const [id,value]of Object.entries({maxPrice:'5000',tripWeek:'11',nights:'4',year:'2027',searchMode:'week',baggage:'19.9',connections:'allow',skiResort:'all',tripRegion:'alps',arrival:'20',hotelArrival:'22:00',maxLayover:'4',dinnerTarget:'20:00',groundMode:'road',airportMinutes:'60',roadBuffer:'30',checkinMinutes:'30',skiDays:'3',returnPlan:'city',skiStart:'09:00',skiEnd:'16:00',earliestHotelDeparture:'07:00',airportReturnMinutes:'120',cityAirportMinutes:'90'}))ids[id].value=value;
 for(const code of ['all','ZRH','GVA','INN','SZG','MXP','LIN','BGY','TRN','MUC','LYS','BSL','VRN','VCE','BLQ','STR','VIE','NCE','GNB','TSF','TRS','FDH','GRZ','KLU']){const o=new Node('option',code);o.value=code;ids.destination.append(o);}ids.destination.value='all';
 for(const code of ['FR','W6','U2','D8','SK','LH','KL','LX','OS'])ids['exclude'+code].checked=false;
 const context={document:{getElementById:id=>ids[id],querySelector:()=>null,querySelectorAll:()=>[],createElement:tag=>new Node(tag)},window:{FlygJourney:require('../journey-engine.js'),FlygSelectionUI:{begin(){},error(){},finish(){},reveal(){}}},navigator:{onLine:true},fetch:fetcher,AbortSignal,Date,Intl,Number,Error};
 vm.runInNewContext(fs.readFileSync(require.resolve('../live-search.js'),'utf8'),context);return ids;
}
async function settle(ids){for(let i=0;i<40;i++){await new Promise(setImmediate);if(!ids.liveSearch.disabled)return;}throw Error('UI stayed busy');}
const response=query=>({ok:true,json:async()=>({stage:'calendar',context:query,prices:[{outbound:'2027-03-13',return:'2027-03-17',quotedPriceSEK:3000,destination:query.destination}]})});
test('whole-week search uses one airport/call, eight per batch and resumes without requerying completed airports',async()=>{
 const calls=[];const ids=fixture(async(url,opts)=>{const q=JSON.parse(opts.body);calls.push(q);return response(q);});
 ids.liveForm.listeners.submit[0]({preventDefault(){}});await settle(ids);assert.equal(calls.length,8);
 assert.ok(calls.every(q=>q.stage==='calendar'&&q.from==='2027-03-13'&&q.to==='2027-03-21'&&q.nights===4&&!q.destination.includes(',')));
 for(let batch=0;batch<2;batch++){const more=ids.liveResults.querySelectorAll('button').find(n=>n.textContent==='Fortsätt söka återstående flygplatser');assert.ok(more);more.listeners.click[0]();await settle(ids);}
 assert.equal(calls.length,23);assert.equal(new Set(calls.map(q=>q.destination)).size,23);assert.ok(!ids.liveResults.querySelectorAll('button').some(n=>n.textContent==='Fortsätt söka återstående flygplatser'));
});
test('quota stop preserves unsearched airport for continuation and keeps prior dated quotes',async()=>{
 const calls=[];let blocked=true;const ids=fixture(async(url,opts)=>{const q=JSON.parse(opts.body);calls.push(q.destination);if(q.destination==='INN'&&blocked)return {ok:false,json:async()=>({error:'APP_QUOTA_REACHED'})};return response(q);});
 ids.liveForm.listeners.submit[0]({preventDefault(){}});await settle(ids);assert.deepEqual(calls,['ZRH','GVA','INN']);assert.ok(ids.liveResults.children.some(n=>/gratiskvot/.test(n.textContent)));
 blocked=false;ids.liveResults.querySelectorAll('button').find(n=>n.textContent==='Fortsätt söka återstående flygplatser').listeners.click[0]();await settle(ids);assert.equal(calls[3],'INN');assert.equal(calls.filter(x=>x==='ZRH').length,1);assert.equal(calls.filter(x=>x==='GVA').length,1);
});

test('editing nights updates visible hint and selected date window immediately',()=>{
 const ids=fixture(async()=>{throw Error('editing must not query provider');});ids.tripWeek.value='13';ids.tripWeek.listeners.change[0]();ids.nights.value='3';ids.nights.listeners.input[0]();assert.match(ids.weekHint.textContent,/2027-03-27–2027-04-04 · 3 nätter/);assert.equal(ids.liveReturn.value,'2027-03-30');
});

test('live timetable filters update immediately while typing without provider calls',async()=>{
 let calls=0;
 const flights=[
 {quotedPriceSEK:3440,segments:[{origin:'ARN',destination:'CDG',arrivalLocal:'2027-03-14 09:10',departureLocal:'2027-03-14 06:10'},{origin:'CDG',destination:'MXP',departureLocal:'2027-03-14 21:25',arrivalLocal:'2027-03-14 23:00'}]},
 {quotedPriceSEK:3632,segments:[{origin:'ARN',destination:'CDG',arrivalLocal:'2027-03-14 09:10',departureLocal:'2027-03-14 06:10'},{origin:'CDG',destination:'MXP',departureLocal:'2027-03-14 10:15',arrivalLocal:'2027-03-14 11:45'}]}
 ];
 const ids=fixture(async(url,opts)=>{calls++;return {ok:true,json:async()=>({stage:'outbound',context:JSON.parse(opts.body),flights,fetchedAt:'2026-11-14T12:00:00Z'})};});
 ids.showCityFallback.checked=false;ids.skiResort.value='6';ids.searchMode.value='exact';ids.liveAirport.value='MXP';ids.liveOutbound.value='2027-03-14';ids.liveReturn.value='2027-03-18';
 ids.liveForm.listeners.submit[0]({preventDefault(){}});await settle(ids);
 const count=()=>ids.liveResults.children.filter(n=>n.tag==='article').length;
 assert.equal(count(),1);assert.equal(calls,1);
 ids.maxLayover.value='1';ids.maxLayover.listeners.input[0]();assert.equal(count(),0);
 ids.maxLayover.value='4';ids.maxLayover.listeners.input[0]();assert.equal(count(),1);
 ids.maxLayover.value='24';ids.maxLayover.listeners.input[0]();assert.equal(count(),1,'late landing stays hidden even when layover cap is raised');
 assert.equal(calls,1,'filter edits must not query provider');
});

test('Cervinia dinner results keep late arrivals in optional reserve list and unknown transit separate',async()=>{
 let calls=0;const flights=[{quotedPriceSEK:3000,segments:[{origin:'ARN',destination:'MXP',departureLocal:'2027-03-14 10:00',arrivalLocal:'2027-03-14 12:00'}]},{quotedPriceSEK:2000,segments:[{origin:'ARN',destination:'MXP',departureLocal:'2027-03-14 16:00',arrivalLocal:'2027-03-14 18:30'}]}];
 const ids=fixture(async(url,opts)=>{calls++;return {ok:true,json:async()=>({stage:'outbound',context:JSON.parse(opts.body),flights,fetchedAt:'2026-11-14T12:00:00Z'})};});
 ids.showCityFallback.checked=false;ids.skiResort.value='6';ids.searchMode.value='exact';ids.liveAirport.value='MXP';ids.liveOutbound.value='2027-03-14';ids.liveReturn.value='2027-03-18';
 ids.liveForm.listeners.submit[0]({preventDefault(){}});await settle(ids);
 const primary=()=>ids.liveResults.children.filter(n=>n.tag==='article');
 assert.equal(primary().length,1);assert.ok(primary()[0].children.some(n=>String(n.textContent).includes('3')));
 assert.equal(ids.liveResults.querySelectorAll('summary').filter(n=>/reserver/.test(n.textContent)).length,0);
 ids.showCityFallback.checked=true;ids.showCityFallback.listeners.change[0]();assert.equal(primary().length,1);assert.equal(ids.liveResults.querySelectorAll('summary').filter(n=>/reserver/.test(n.textContent)).length,1);
 ids.groundMode.value='public';ids.groundMode.listeners.change[0]();assert.equal(primary().length,0);assert.equal(ids.liveResults.querySelectorAll('summary').filter(n=>/utan kontrollerad transfer/.test(n.textContent)).length,1);
 assert.equal(calls,1);
});

test('calendar enriches three date pairs with matched outbound/return times and price without losing list',async()=>{
 const calls=[];let active;const dates=['2027-03-13','2027-03-14','2027-03-15','2027-03-16'];
 const ids=fixture(async(url,opts)=>{const q=JSON.parse(opts.body);calls.push(q);
  if(q.stage==='calendar')return {ok:true,json:async()=>({stage:'calendar',context:q,prices:q.destination==='MXP'?dates.map((d,i)=>({outbound:d,return:d.slice(0,8)+String(Number(d.slice(-2))+4),destination:'MXP',quotedPriceSEK:3440+i})):[]})};
  if(q.stage==='outbound'){active=q;return {ok:true,json:async()=>({stage:q.stage,context:q,flights:[{quotedPriceSEK:3632,selection:'out-'+q.outbound,segments:[{origin:'ARN',destination:'MXP',departureLocal:q.outbound+' 07:00',arrivalLocal:q.outbound+' 10:00'}]}]})};}
  assert.equal(q.selection,'out-'+active.outbound);return {ok:true,json:async()=>({stage:'returns',context:active,fetchedAt:'2026-11-14T12:00:00Z',flights:[{quotedPriceSEK:active.outbound==='2027-03-14'?3500:3662,selection:'return-'+active.outbound,segments:[{origin:'MXP',destination:'ARN',departureLocal:active.return+' 16:00',arrivalLocal:active.return+' 19:00'}]}]})};
 });
 ids.skiResort.value='6';ids.showCityFallback.checked=false;ids.liveForm.listeners.submit[0]({preventDefault(){}});await settle(ids);
 assert.equal(calls.filter(q=>q.stage==='calendar').length,3);assert.equal(calls.filter(q=>q.stage==='outbound').length,3);assert.equal(calls.filter(q=>q.stage==='returns').length,3);
 const cards=ids.liveResults.children.filter(n=>n.tag==='article');assert.equal(cards.length,4);
 const text=cards[0].children.map(n=>n.textContent).join(' ');assert.match(text,/Utresa: 2027-03-14 07:00 ARN/);assert.match(text,/Hemresa: 2027-03-18 16:00 MXP/);assert.match(text,/3\s*500/);assert.match(text,/3\s*441/);assert.ok(cards[0].children.some(n=>n.tag==='button'&&n.textContent==='Välj denna resa'));
 const before=calls.length;ids.dinnerTarget.value='19:00';ids.dinnerTarget.listeners.input[0]();assert.equal(calls.length,before);
 cards[3].children.find(n=>n.tag==='button'&&n.textContent==='Hämta ut- och hemresetider').listeners.click[0]();await settle(ids);assert.equal(calls.length,before+2);assert.equal(ids.liveResults.children.filter(n=>n.tag==='article').length,4);
});

test('calendar chooses a later return for rested departure and reuses all fetched options when assumptions change',async()=>{
 let calls=0,active;const ids=fixture(async(url,opts)=>{calls++;const q=JSON.parse(opts.body);
 if(q.stage==='calendar')return {ok:true,json:async()=>({stage:'calendar',context:q,prices:q.destination==='MXP'?[{outbound:'2027-03-14',return:'2027-03-18',destination:'MXP',quotedPriceSEK:3000}]:[]})};
 if(q.stage==='outbound'){active=q;return {ok:true,json:async()=>({stage:'outbound',context:q,flights:[{quotedPriceSEK:3000,selection:'out',segments:[{origin:'ARN',destination:'MXP',departureLocal:q.outbound+' 07:00',arrivalLocal:q.outbound+' 10:00'}]}]})};}
 return {ok:true,json:async()=>({stage:'returns',context:active,flights:[{quotedPriceSEK:3000,selection:'early',segments:[{origin:'MXP',destination:'ARN',departureLocal:'2027-03-18 06:30',arrivalLocal:'2027-03-18 09:00'}]},{quotedPriceSEK:3050,selection:'later',segments:[{origin:'MXP',destination:'ARN',departureLocal:'2027-03-18 12:00',arrivalLocal:'2027-03-18 14:30'}]}]})};
 });
 ids.skiResort.value='6';ids.liveForm.listeners.submit[0]({preventDefault(){}});await settle(ids);
 const card=()=>ids.liveResults.children.find(n=>n.tag==='article');const text=()=>card().children.map(n=>n.textContent).join(' ');
 assert.match(text(),/Hemresa: 2027-03-18 12:00/);assert.match(text(),/3 hela planerade skiddagar/);const before=calls;
 ids.earliestHotelDeparture.value='02:00';ids.earliestHotelDeparture.listeners.input[0]();assert.match(text(),/Hemresa: 2027-03-18 06:30/);assert.equal(calls,before);
 ids.skiDays.value='4';ids.skiDays.listeners.input[0]();assert.match(text(),/minst 4/);assert.ok(!card().children.some(n=>n.textContent==='Välj denna resa'));assert.equal(calls,before);
});
