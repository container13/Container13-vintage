/* UI owner for staged live search; no provider credentials in browser. */
(()=>{'use strict';
const API='https://flyg-search-api.mangaj73.workers.dev';
const form=document.getElementById('liveForm'),results=document.getElementById('liveResults'),status=document.getElementById('liveStatus');
const airport=document.getElementById('liveAirport'),start=document.getElementById('liveOutbound'),end=document.getElementById('liveReturn');
const maxPrice=document.getElementById('maxPrice');
const airlineNames={FR:/ryanair/i,W6:/wizz air/i,U2:/easyjet/i,D8:/norwegian/i,SK:/^(sas|scandinavian airlines)/i,LH:/lufthansa/i,KL:/klm/i,LX:/^(swiss|swiss international)/i,OS:/austrian airlines/i};
const airlineChecks=Object.keys(airlineNames).map(code=>({code,element:document.getElementById('exclude'+code)}));
const airlineStore='flyg-excluded-airlines-v1';
try{const stored=JSON.parse(localStorage.getItem(airlineStore));if(Array.isArray(stored))for(const a of airlineChecks)a.element.checked=stored.includes(a.code);}catch{}
function excludedAirlines(){const selected=airlineChecks.filter(a=>a.element.checked).map(a=>a.code);if(selected.includes('D8'))selected.push('DY');return selected;}
function excludedFlight(f){return (f.segments||[]).some(seg=>excludedAirlines().some(code=>(airlineNames[code]||(/norwegian/i)).test(seg.airline||'')||String(seg.number||'').replace(/\s/g,'').toUpperCase().startsWith(code)));}
for(const a of airlineChecks)a.element.addEventListener('change',()=>{try{localStorage.setItem(airlineStore,JSON.stringify(excludedAirlines()));}catch{}if(history.length)render(history.at(-1));});

let busy=false,history=[],generation=0,chosenOutbound=null,chosenReturn=null;
const choices=document.getElementById('searchChoices');
for(const id of ['searchForm','liveForm'])document.getElementById(id).addEventListener('invalid',()=>{choices.open=true;},true);
maxPrice.addEventListener('input',()=>{if(maxPrice.checkValidity()&&history.length)render(history.at(-1));});
const el=(tag,text,className)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;if(className)n.className=className;return n;};
const money=v=>new Intl.NumberFormat('sv-SE',{style:'currency',currency:'SEK',maximumFractionDigits:0}).format(v);
const resortField=document.getElementById('skiResortField'),resortSelect=document.getElementById('skiResort'),regionSelect=document.getElementById('tripRegion');
const resortData=[["Val Thorens / Les 3 Vallées","LYS GVA GNB"],["Zermatt","ZRH GVA MXP"],["St. Anton am Arlberg","INN ZRH MUC FDH"],["Ischgl","INN MUC ZRH FDH"],["Verbier","GVA ZRH MXP"],["Chamonix","GVA LYS GNB"],["Cervinia","TRN MXP BGY"],["Saalbach-Hinterglemm","SZG MUC INN"],["Mayrhofen","INN MUC SZG"],["Livigno","BGY MXP INN ZRH"],["Courchevel","LYS GVA GNB"],["Tignes","LYS GVA GNB"],["Val d'Isère","LYS GVA GNB"],["La Plagne","LYS GVA GNB"],["Les Arcs","LYS GVA GNB"],["Kitzbühel","INN SZG MUC"],["Sölden","INN MUC ZRH"],["Serfaus-Fiss-Ladis","INN MUC ZRH"],["Val Gardena / Dolomiterna","INN VCE VRN"],["Cortina d'Ampezzo","VCE TSF INN"],["Madonna di Campiglio","VRN BGY MXP"],["Laax","ZRH BSL FDH"],["Davos / Klosters","ZRH FDH INN"],["St. Moritz","ZRH MXP BGY"],["Andermatt","ZRH BSL MXP"],["Engelberg","ZRH BSL"],["Flachau / Ski amadé","SZG MUC INN"],["Zell am See / Kaprun","SZG MUC INN"],["Les Deux Alpes","GNB LYS GVA"],["Alpe d'Huez","GNB LYS GVA"],["Méribel","LYS GVA GNB"],["Megève","GVA LYS"],["La Clusaz","GVA LYS"],["Sestriere / Via Lattea","TRN MXP BGY"],["Sauze d'Oulx","TRN MXP BGY"],["Courmayeur","GVA TRN MXP"],["Alta Badia","INN VCE VRN"],["Arabba / Marmolada","INN VCE VRN"],["Canazei","INN VRN VCE"],["Kronplatz","INN VCE VRN"],["Obergurgl-Hochgurgl","INN MUC"],["Leogang","SZG MUC"],["Schladming","SZG GRZ MUC"],["Hochzillertal","INN MUC"],["Stubai","INN MUC"],["Garmisch-Partenkirchen","MUC INN"],["Zugspitze","MUC INN"],["Morzine","GVA LYS"],["Avoriaz","GVA LYS"],["Les Gets","GVA LYS"],["Flaine","GVA LYS"],["Wengen / Grindelwald","ZRH BSL GVA"],["Obertauern","SZG MUC"],["Bad Gastein","SZG MUC"],["Bormio","BGY MXP INN"],["Bardonecchia","TRN MXP"],["Seefeld","INN MUC"],["Kühtai","INN MUC"],["Wagrain","SZG MUC"],["Serre Chevalier","TRN LYS GNB"]];
resortData.forEach(([name,codes],i)=>{const option=document.createElement('option');option.value=String(i);option.textContent=name;resortSelect.append(option);});
try{const saved=localStorage.getItem('flyg-resort-v1');if(saved!==null&&[...resortSelect.options].some(o=>o.value===saved))resortSelect.value=saved;}catch{}
function resortCodes(){return resortSelect.value==='all'?null:resortData[Number(resortSelect.value)]?.[1].split(' ')||null;}
function updateResortVisibility(){resortField.hidden=regionSelect.value!=='alps';}
regionSelect.addEventListener('change',()=>{updateResortVisibility();syncAirports();});
resortSelect.addEventListener('change',()=>{try{localStorage.setItem('flyg-resort-v1',resortSelect.value);}catch{}syncAirports();if(history.length)render(history.at(-1));});
updateResortVisibility();
function syncAirports(){const current=airport.value;const codes=regionSelect.value==='alps'?resortCodes():null;airport.replaceChildren(...[...document.getElementById('destination').options].filter(o=>!codes||codes.includes(o.value)).map(o=>o.cloneNode(true)));if([...airport.options].some(o=>o.value===current))airport.value=current;else airport.value=codes?codes[0]:'all';}
syncAirports();if(!resortCodes())airport.value=document.getElementById('destination').value;
document.querySelectorAll('[name=profile]').forEach(r=>r.addEventListener('change',()=>{syncAirports();datesFromWeek();}));
document.getElementById('destination').addEventListener('change',e=>{if([...airport.options].some(o=>o.value===e.target.value))airport.value=e.target.value;});
const week=document.getElementById('tripWeek'),nightsInput=document.getElementById('nights'),year=document.getElementById('year'),mode=document.getElementById('searchMode');
function selectedWindow(){return window.FlygJourney.weekWindow(Number(year.value),Number(week.value),Number(nightsInput.value));}
function datesFromWeek(){
 try{const w=selectedWindow();if(mode.value==='week'){start.value=w.from;end.value=w.firstReturn;}document.getElementById('weekHint').textContent=mode.value==='week'?`Avresa ${w.from}–${w.to} · ${nightVariants().join(' eller ')} nätter. Lördagen före veckan ingår.`:`Exakta datum: ${start.value}–${end.value}.`;}
 catch{document.getElementById('weekHint').textContent='Kontrollera vecka och antal nätter.';}
}
for(const control of [week,nightsInput,year])control.addEventListener(control===nightsInput?'input':'change',()=>{mode.value='week';datesFromWeek();});
mode.addEventListener('change',datesFromWeek);
for(const control of [start,end])control.addEventListener('input',()=>{mode.value='exact';datesFromWeek();});
datesFromWeek();
function button(text,action){const b=el('button',text);b.type='button';b.disabled=busy;b.addEventListener('click',action);return b;}
function setBusy(value){busy=value;form.setAttribute('aria-busy',String(value));document.getElementById('liveSearch').disabled=value;results.querySelectorAll('button').forEach(b=>b.disabled=value);}
const errors={SEARCH_SOURCE_ERROR:'Datakällan kunde inte besvara den här sökningen.',SEARCH_TIMEOUT:'Datakällan svarade inte i tid.',SEARCH_HTTP_502:'Datakällan har ett tillfälligt fel.',ACCOUNT_HTTP_403:'Datakällan nekar servern åtkomst till kontokontrollen (403).',ACCOUNT_HTTP_401:'Datakällan godkänner inte den sparade nyckeln.',SEARCH_HTTP_403:'Datakällan nekar servern åtkomst till flygsökningen (403).',SEARCH_HTTP_429:'Datakällans anropsgräns är nådd. Försök igen senare.',APP_QUOTA_REACHED:'Appens gratiskvot är nådd. Försök igen senare; ingen betaltjänst aktiveras.',FREE_QUOTA_UNAVAILABLE:'Datakällans gratiskvot är slut eller gratisvillkoret kan inte bekräftas.',SELECTION_EXPIRED:'Valet har gått ut. Starta en ny sökning.',PROVIDER_UNAVAILABLE:'Datakällan svarade inte. Försök igen senare.',INVALID_DATES:'Kontrollera datumen. Hemresan ska vara efter utresan, inom 30 nätter och högst ett år framåt.',SEARCH_NOT_ENABLED:'Livesökningen är inte aktiverad ännu.'};
async function requestData(query){
 const r=await fetch(API+'/search',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(query),cache:'no-store',credentials:'omit',signal:AbortSignal.timeout(90000)});
 const data=await r.json();if(!r.ok||data.error)throw new Error(data.error||'SEARCH_FAILED');return data;
}
async function search(query,trigger=null){
 if(query.stage==='outbound'||query.stage==='calendar')query={...query,excludeAirlines:excludedAirlines()};
 if(busy)return;
 if(!maxPrice.checkValidity()){status.textContent='Kontrollera maxpriset. Ange ett belopp i steg om 100 kr.';choices.open=true;maxPrice.reportValidity();maxPrice.focus();return;}
 const loading=query.stage==='returns'?'Hämtar hemresor…':query.stage==='details'?'Hämtar biljettvillkor…':query.stage==='calendar'?'Jämför avresedatum…':'Hämtar flyg…';
 const action=window.FlygSelectionUI.begin(trigger,loading);
 if(!navigator.onLine){const message='Du är offline. Aktuella flyg behöver internet.';status.textContent=message;window.FlygSelectionUI.error(action,message);window.FlygSelectionUI.finish(action);if(!action)status.scrollIntoView({block:'center'});return;}
 setBusy(true);status.textContent=loading;const active=++generation;
 try{
  const data=await requestData(query);
  if(active!==generation)return;history.push(data);if(!maxPrice.checkValidity()){status.textContent='Kontrollera maxpriset för att visa resultatet.';choices.open=true;maxPrice.reportValidity();maxPrice.focus();return;}render(data);status.textContent=data.cached?'Tidigare hämtat resultat återanvänds.':'Flyguppgifter hämtade.';window.FlygSelectionUI.reveal(results);
 }catch(e){const message=errors[e.message]||'Sökningen kunde inte slutföras. Dina tidigare resultat finns kvar. Försök igen senare.';status.textContent=message;window.FlygSelectionUI.error(action,message);if(!action)status.scrollIntoView({block:'center'});}
 finally{window.FlygSelectionUI.finish(action);setBusy(false);}
}
function baseNights(){return Number(nightsInput.value);}
function maxTripNights(){return Math.min(30,baseNights()+(document.getElementById('allowExtraNight').checked?1:0));}
function rowNights(row){return (Date.parse(row.return)-Date.parse(row.outbound))/86400000;}
function extraRow(row){return rowNights(row)>baseNights();}
function rowCeiling(row){return Number(maxPrice.value)+(extraRow(row)?Number(document.getElementById('extraBudget').value):0);}
function nightVariants(){return baseNights()<maxTripNights()?[baseNights(),maxTripNights()]:[baseNights()];}
function activeCalendarJobs(data){return data.coverage.jobs.filter(job=>job.nights<=maxTripNights());}
function refreshCalendarCoverage(data){if(!data.coverage?.jobs)return;const active=activeCalendarJobs(data);data.coverage.empty=active.filter(j=>j.status==='DONE'&&j.emptyResult).map(j=>({airport:j.code,nights:j.nights}));data.coverage.completed=data.coverage.requested.filter(code=>active.some(j=>j.code===code)&&active.filter(j=>j.code===code).every(j=>j.status==='DONE'));data.coverage.failed=data.coverage.requested.filter(code=>active.some(j=>j.code===code&&j.status==='FAILED'));data.coverage.unsearched=data.coverage.requested.filter(code=>active.some(j=>j.code===code&&j.status==='PENDING'));}
async function searchCalendar(query,previous=null){
 if(busy)return;if(!navigator.onLine){status.textContent='Du är offline. Aktuella flyg behöver internet.';return;}
 const requested=previous?previous.coverage.requested:(regionSelect.value==='alps'&&resortCodes()?resortCodes():airport.value==='all'?[...airport.options].map(o=>o.value).filter(code=>code!=='all'):[airport.value]);
 const variants=previous?previous.calendarNights:nightVariants();
 const data=previous||{stage:'calendar',context:{...query,destination:airport.value==='all'?'alla relevanta flygplatser':airport.value},adults:2,currency:'SEK',flights:[],prices:[],resumeQuery:query,calendarNights:variants,fetchedAt:new Date().toISOString(),coverage:{requested,completed:[],failed:[],unsearched:[...requested],failures:[],jobs:requested.flatMap(code=>variants.map(nights=>({code,nights,status:'PENDING'})))}};
 data.stopReason='';setBusy(true);let calls=0;
 try{
  for(const job of activeCalendarJobs(data).filter(j=>j.status==='PENDING')){
   if(calls>=8)break;calls++;status.textContent=`Söker ${job.code} · ${job.nights} nätter · ${activeCalendarJobs(data).filter(j=>j.status==='DONE').length}/${activeCalendarJobs(data).length} datumintervall klara…`;
   try{const part=await requestData({...query,nights:job.nights,destination:job.code,excludeAirlines:excludedAirlines()});data.prices.push(...part.prices.map(row=>({...row,nights:job.nights})));job.status='DONE';job.emptyResult=part.prices.length===0;}
   catch(error){const code=String(error?.message||'UNKNOWN_ERROR').slice(0,80);data.coverage.failures.push({airports:[job.code],nights:job.nights,code});if(['APP_QUOTA_REACHED','FREE_QUOTA_UNAVAILABLE','ACCOUNT_HTTP_401','ACCOUNT_HTTP_403','SEARCH_HTTP_403','SEARCH_HTTP_429','SEARCH_NOT_ENABLED','PROVIDER_UNAVAILABLE'].includes(code)){data.stopReason=(errors[code]||'Sökningen stoppades')+' (felkod '+code+').';break;}job.status='FAILED';}
  }
  refreshCalendarCoverage(data);
  if(!previous)history.push(data);render(data);window.FlygSelectionUI.reveal(results);
  status.textContent=data.coverage.unsearched.length||data.coverage.failed.length?'Sökningen är inte färdig. Återstående datumintervall kan fortsättas utan att färdiga söks igen.':'Alla valda nattalternativ har sökts.';
  if(!previous&&resortCodes()&&data.prices.length)await calendarTimes(data,comparisonBatch(calendarRows(data)),true);
 }finally{setBusy(false);}
}
async function searchAll(query,previous=null){
 if(query.stage==='calendar')return searchCalendar(query,previous);
 if(busy)return;if(!navigator.onLine){status.textContent='Du är offline. Aktuella flyg behöver internet.';return;}
 const requested=previous?previous.coverage.requested:(regionSelect.value==='alps'&&resortCodes()?resortCodes():airport.value==='all'?[...airport.options].map(o=>o.value).filter(code=>code!=='all'):[airport.value]);
 const data=previous||{stage:'outbound',context:{...query,destination:airport.value==='all'?'alla relevanta flygplatser':airport.value},adults:2,currency:'SEK',flights:[],prices:[],resumeQuery:query,fetchedAt:new Date().toISOString(),coverage:{requested,completed:[],failed:[],unsearched:[...requested],failures:[]}};
 const pending=[...data.coverage.unsearched];data.coverage.failures ||= [];data.stopReason='';setBusy(true);let index=0;
 try{
  for(;index<pending.length;index+=3){const group=pending.slice(index,index+3);status.textContent=`Söker ${group.join(', ')} · ${data.coverage.completed.length}/${requested.length} flygplatser klara…`;
   try{const part=await requestData({...query,excludeAirlines:excludedAirlines(),destination:group.join(',')});data.flights.push(...part.flights);data.coverage.completed.push(...group);}
   catch(error){const code=String(error?.message||'UNKNOWN_ERROR').slice(0,80);data.coverage.failures.push({airports:[...group],code});if(['APP_QUOTA_REACHED','FREE_QUOTA_UNAVAILABLE','ACCOUNT_HTTP_401','ACCOUNT_HTTP_403','SEARCH_HTTP_403','SEARCH_HTTP_429','SEARCH_NOT_ENABLED','PROVIDER_UNAVAILABLE'].includes(code)){data.stopReason=(errors[code]||'Sökningen stoppades')+' (felkod '+code+').';break;}data.coverage.failed.push(...group);}
  }
  data.coverage.unsearched=pending.slice(index);if(!previous)history.push(data);render(data);window.FlygSelectionUI.reveal(results);status.textContent=data.coverage.failed.length||data.coverage.unsearched.length?'Sökningen är inte färdig. Se återstående flygplatser nedan.':'Alla valda flygplatser har sökts.';
 }finally{setBusy(false);}
}
// Calendar feed has dates/prices only. Retrieve a bounded matched itinerary before showing times.
function calendarRows(data){return data.prices.filter(row=>rowNights(row)<=maxTripNights()&&row.quotedPriceSEK<=rowCeiling(row)).sort((a,b)=>a.quotedPriceSEK-b.quotedPriceSEK);}
function comparisonBatch(rows){const dates=new Set();const unique=rows.filter(row=>{const key=row.outbound+'/'+row.return;if(dates.has(key))return false;dates.add(key);return true;});const preferred=document.getElementById('allowExtraNight').checked?[unique.find(row=>!extraRow(row)),unique.find(extraRow)].filter(Boolean):[];return [...new Set([...preferred,...unique])].slice(0,3);}
function calendarContext(data,row){return {stage:'outbound',destination:row.destination,outbound:row.outbound,return:row.return,direct:data.context.direct};}
function outboundFits(flight,data){
 if(!Number.isFinite(flight.quotedPriceSEK)||flight.quotedPriceSEK>rowCeiling(data.context)||excludedFlight(flight))return false;
 if(window.FlygJourney.checkSchedule(flight,scheduleRequirements(data)).status!=='NOT_REJECTED')return false;
 const ground=resortRequirements(data);
 const plan=window.FlygJourney.resortArrival(flight,ground);return !ground.resort||['ON_TIME','UNKNOWN'].includes(plan.status);
}
function skiRequirements(data){return {...resortRequirements(data),maxNights:maxTripNights(),skiDays:Number(document.getElementById('skiDays').value),returnPlan:document.getElementById('returnPlan').value,breakfastEnd:document.getElementById('breakfastEnd').value,earliestCityDeparture:document.getElementById('earliestCityDeparture').value,skiStart:document.getElementById('skiStart').value,skiEnd:document.getElementById('skiEnd').value,earliestHotelDeparture:document.getElementById('earliestHotelDeparture').value,airportReturnMinutes:Number(document.getElementById('airportReturnMinutes').value),cityAirportMinutes:Number(document.getElementById('cityAirportMinutes').value)};}
function skiPlan(out,back,data){if(document.querySelector('input[name=profile]:checked')?.value==='football')return {status:'NOT_REQUIRED'};return window.FlygJourney.skiTrip(out,back,skiRequirements(data));}
function returnChoices(data,row,out,flights,allowRejected=false){return flights.filter(f=>f.selection&&!excludedFlight(f)&&f.quotedPriceSEK<=rowCeiling(row)&&f.segments?.[0]?.origin===out.segments.at(-1).destination&&f.segments.at(-1)?.destination==='ARN'&&f.segments[0].departureLocal?.startsWith(row.return)&&window.FlygJourney.checkSchedule(f,{...scheduleRequirements(data),stage:'returns'}).status==='NOT_REJECTED'&&(allowRejected||skiPlan(out,f,data).status!=='REJECTED')).sort((a,b)=>a.quotedPriceSEK-b.quotedPriceSEK);}
function skiLabel(card,plan){
 if(plan.status==='NOT_REQUIRED')return;
 if(plan.status==='PLANNED'){
  card.append(el('p',plan.fullSkiDays>plan.requiredSkiDays?`${plan.requiredSkiDays} skiddagar räcker; ${plan.fullSkiDays} hela dagar får plats: ${plan.skiDates.join(', ')}. Extra skidåkning är valfri.`:`${plan.fullSkiDays} hela planerade skiddagar: ${plan.skiDates.join(', ')}.`));
  if(plan.preference)card.append(el('p',plan.preference));
  if(plan.city)card.append(el('p',`Efter sista skiddagen: lämna skidorten ${plan.leaveResortLocal}, uppskattat framme i ${plan.city} ${plan.cityArrivalLocal}. Sista natten i staden.`));
  card.append(el('p',`Hemresedagen: avresa från hotellet ${plan.hotelDepartureLocal}${plan.city?' till flygplatsen':' för transfer till flygplatsen'}.`));
  card.append(el('p','Planen klarar valda tidsmarginaler. Liftöppettider, hotell, transporter och kostnader är inte bekräftade.','muted'));
 }else card.append(el('p',plan.reason||'Skiddagar och hemresa behöver kontrolleras.','muted'));
}
for(const id of ['skiDays','returnPlan','skiStart','skiEnd','earliestHotelDeparture','airportReturnMinutes','cityAirportMinutes','breakfastEnd','earliestCityDeparture'])document.getElementById(id).addEventListener(id==='returnPlan'?'change':'input',()=>{if(history.length)render(history.at(-1));});
function extraCostRequirements(){const number=id=>{const field=document.getElementById(id);return field.value.trim()===''?null:Number(field.value);};return {extraBudget:Number(document.getElementById('extraBudget').value),hotelExtra:number('extraHotelCost'),groundDifference:number('extraGroundCost'),baggageDifference:number('extraBaggageCost'),otherExtra:number('extraOtherCost')};}
function extraAssessment(data,row){
 if(!extraRow(row))return {status:'BASELINE'};
 const base=data.prices.filter(other=>rowNights(other)===baseNights()&&matchedTimesFit(data,other)&&['PLANNED','NOT_REQUIRED'].includes(skiPlan(other.comparison.outbound,other.comparison.returnFlight,data).status)).sort((a,b)=>a.comparison.returnFlight.quotedPriceSEK-b.comparison.returnFlight.quotedPriceSEK)[0];
 const check=window.FlygJourney.extraNightCost(row.comparison?.status==='READY'?{nights:rowNights(row),flightPrice:row.comparison.returnFlight.quotedPriceSEK}:null,base?{nights:rowNights(base),flightPrice:base.comparison.returnFlight.quotedPriceSEK}:null,extraCostRequirements());return {...check,baselineFlightPrice:base?.comparison.returnFlight.quotedPriceSEK};
}
function extraCostLabel(card,data,row){const check=extraAssessment(data,row);if(check.status==='UNKNOWN')card.append(el('p','Extranatt: '+check.reason+' Riktmärke cirka '+money(Number(document.getElementById('extraBudget').value))+' extra totalt för två.'));else card.append(el('p',`Uppskattad merkostnad för extranatten: ${money(check.extraCost)} totalt för två jämfört med billigaste hittills matchade grundresa (${money(check.baselineFlightPrice)} i flygpris) – ${check.status==='WITHIN_ESTIMATE'?'inom':'över'} riktmärket ${money(check.extraBudget)}. Bygger på matchade flygpriser och dina kostnadsuppskattningar, inte ett verifierat totalpris.`));}
for(const id of ['allowExtraNight','extraBudget','extraHotelCost','extraGroundCost','extraBaggageCost','extraOtherCost'])document.getElementById(id).addEventListener(id==='allowExtraNight'?'change':'input',()=>{datesFromWeek();if(history.length)render(history.at(-1));});
function matchedTimesFit(data,row){
 const c=row.comparison;if(c?.status!=='READY')return false;
 return outboundFits(c.outbound,{stage:'outbound',context:calendarContext(data,row)})&&!excludedFlight(c.returnFlight)&&c.returnFlight.quotedPriceSEK<=rowCeiling(row)&&window.FlygJourney.checkSchedule(c.returnFlight,{...scheduleRequirements(data),stage:'returns'}).status==='NOT_REJECTED'&&skiPlan(c.outbound,c.returnFlight,data).status!=='REJECTED';
}
async function calendarTimes(data,rows,alreadyBusy=false){
 if(busy&&!alreadyBusy)return;if(!navigator.onLine){status.textContent='Flygtider behöver internet.';return;}
 if(!alreadyBusy)setBusy(true);
 try{
  for(let i=0;i<Math.min(rows.length,3);i++){
   const row=rows[i];if(row.comparison?.status==='READY')continue;
   row.comparison={status:'LOADING'};render(data);status.textContent=`Hämtar ut- och hemresetider för ${row.outbound} (${i+1}/${Math.min(rows.length,3)})…`;
   try{
    const query=calendarContext(data,row),out=await requestData({...query,excludeAirlines:excludedAirlines()});
    const flight=out.flights.filter(f=>f.selection&&outboundFits(f,{stage:'outbound',context:query})).sort((a,b)=>a.quotedPriceSEK-b.quotedPriceSEK)[0];
    if(!flight){row.comparison={status:'NO_MATCH',message:'Inga hämtade utresor passar nuvarande pris-, flygbolags- och ankomstkrav.'};render(data);continue;}
    const back=await requestData({stage:'returns',selection:flight.selection});
    const returns=returnChoices(data,row,flight,back.flights),fallback=returnChoices(data,row,flight,back.flights,true);
    if(!fallback.length)row.comparison={status:'NO_MATCH',message:'Ingen hämtad hemresa passar den valda utresan och dina filter.'};
    else row.comparison={status:'READY',outbound:flight,returnFlight:returns[0]||fallback[0],returnFlights:back.flights,fetchedAt:back.fetchedAt};
   }catch(error){row.comparison={status:'ERROR',message:errors[error.message]||'Tiderna kunde inte hämtas. Kalenderpriset finns kvar.'};render(data);break;}
   render(data);
  }
  status.textContent='Datumlistan är kvar. Tider och pris gäller den matchade resa som visas; övriga datum kan hämtas separat.';
 }finally{if(!alreadyBusy)setBusy(false);}
}
function flightTimeLabel(label,flight){const first=flight.segments[0],last=flight.segments.at(-1);return `${label}: ${first.departureLocal} ${first.origin} → ${last.arrivalLocal} ${last.destination} · ${flight.segments.length===1?'direktflyg':(flight.segments.length-1)+' byte'} (lokala tider)`;}
function baggageLabel(raw){
 const match=String(raw).match(/^(?:1st checked bag|1 carry-on bag):\s*(\d+)(?:\s*[-–]\s*(\d+))?$/i);
 if(match){const name=/checked/i.test(raw)?'Incheckad väska':'Kabinväska';return `${name}: ${match[2]?money(Number(match[1]))+'–'+money(Number(match[2]))+' (prisintervall)':money(Number(match[1]))} · vikt ej angiven`;}
 if(raw==='1 free carry-on')return 'En kabinväska ingår enligt datakällan; extra personlig väska och mått är inte bekräftade.';
 return raw;
}
function baggageRequirements(){const parts=[];const kg=Number(document.getElementById('baggage').value);if(kg>0)parts.push(`minst ${String(kg).replace('.',',')} kg incheckat`);if(document.getElementById('cabinBoots').checked)parts.push('separat kabinväska för pjäxor');if(document.getElementById('personalBag').checked)parts.push('extra liten personlig väska');return 'Bagagekrav per person: '+(parts.join(' + ')||'inga extra väskor valda')+'.';}
for(const id of ['baggage','cabinBoots','personalBag'])document.getElementById(id).addEventListener('change',()=>{if(history.length)render(history.at(-1));});
function scheduleRequirements(data){
 return {stage:data.stage,outbound:data.context.outbound,allowConnections:document.getElementById('connections').value!=='direct',airportCutoff:document.getElementById('arrival').value.padStart(2,'0')+':00',hotelCutoff:document.getElementById('hotelArrival').value,maxLayoverMinutes:Number(document.getElementById('maxLayover').value)*60};
}
for(const id of ['arrival','hotelArrival','connections','maxLayover'])document.getElementById(id).addEventListener(id==='maxLayover'?'input':'change',()=>{if(history.length)render(history.at(-1));});
function resortRequirements(data){
 return {resort:regionSelect.value==='alps'&&resortSelect.value!=='all'?resortData[Number(resortSelect.value)]?.[0]:null,transport:document.getElementById('groundMode').value,dinnerTarget:document.getElementById('dinnerTarget').value,hotelCutoff:document.getElementById('hotelArrival').value,airportMinutes:Number(document.getElementById('airportMinutes').value),roadBufferMinutes:Number(document.getElementById('roadBuffer').value),checkinMinutes:Number(document.getElementById('checkinMinutes').value)};
}
for(const id of ['dinnerTarget','groundMode','airportMinutes','roadBuffer','checkinMinutes','showCityFallback'])document.getElementById(id).addEventListener(['airportMinutes','roadBuffer','checkinMinutes','dinnerTarget'].includes(id)?'input':'change',()=>{if(history.length)render(history.at(-1));});
function planLabel(card,plan){
 if(plan?.readyLocal){
  card.append(el('p',`Uppskattad ankomst till skidorten: ${plan.hotelLocal}. Redo för middag cirka ${plan.readyLocal}.`));
  const info=el('details'),summary=el('summary','Så räknas ankomsten');info.append(summary,el('p',`${plan.airportMinutes} min för bagage + ${plan.roadMinutes} min bil/privat transfer + ${plan.roadBufferMinutes} min marginal + ${plan.checkinMinutes} min incheckning. Ingen transfer är bokad och tid/pris/tillgänglighet behöver bekräftas.`,'muted'));
  const source=el('a','Källa för körtid');source.href=plan.source;source.target='_blank';source.rel='noopener noreferrer';info.append(source);card.append(info);
 }else card.append(el('p',plan?.reason||'Transfer och hotellankomst behöver kontrolleras.','muted'));
}
function segments(card,flight){for(const s of flight.segments){card.append(el('p',`${s.origin||'?'} → ${s.destination||'?'} · ${s.number||s.airline||'Flyg'}`),el('p',`${s.departureLocal||'?'} → ${s.arrivalLocal||'?'} (lokala tider)`,'muted'));}}
function render(data){
 if(data.stage==='calendar')refreshCalendarCoverage(data);
 const ceiling=data.context?.outbound?rowCeiling(data.context):Number(maxPrice.value);
 if(!maxPrice.checkValidity())return;
 if(!['maxLayover','dinnerTarget','airportMinutes','roadBuffer','checkinMinutes','skiStart','skiEnd','earliestHotelDeparture','airportReturnMinutes','cityAirportMinutes','skiDays','breakfastEnd','earliestCityDeparture','extraBudget','extraHotelCost','extraGroundCost','extraBaggageCost','extraOtherCost'].every(id=>document.getElementById(id).checkValidity())){results.replaceChildren(el('p','Kontrollera tider, antal nätter och kostnadsuppskattningar under Ändra sökval.'));choices.open=true;return;}
 const withinBudget=items=>items.filter(item=>Number.isFinite(item.quotedPriceSEK)&&item.quotedPriceSEK<=ceiling).sort((a,b)=>a.quotedPriceSEK-b.quotedPriceSEK);
 results.replaceChildren();const titles={calendar:'Välj avresedatum',outbound:'Välj utresa',returns:'Välj hemresa',details:'Biljettpris och villkor'};
 results.append(el('h3',titles[data.stage]),el('p',`ARN ↔ ${data.context.selectedDestination||data.context.destination} · ${data.context.from||data.context.outbound}–${data.context.to||data.context.return} · 2 vuxna`));
 if(history.length>1)results.append(button('Tillbaka till föregående val',()=>{if(!busy){history.pop();render(history.at(-1));window.FlygSelectionUI.reveal(results);}}));
 results.append(el('p',`Maxpris ${money(ceiling)} i visat flygpris för två. Eventuellt okänt bagage tillkommer.`,'muted'));
 if(document.getElementById('allowExtraNight').checked)results.append(el('p',`Grundresa ${baseNights()} nätter; även ${maxTripNights()} nätter jämförs. Riktmärke cirka ${money(Number(document.getElementById('extraBudget').value))} mer totalt för två. Okända hotell-, bagage- och transferkostnader räknas inte som noll.`,'muted'));
 const h=history.find(x=>x.stage==='outbound');if(data.stage!=='outbound'&&h)results.append(el('p','Retur och villkor gäller den utresa du valt.','muted'));
 if(data.coverage){
  const c=data.coverage;results.append(el('p',`Kontrollerade flygplatser: ${c.completed.join(', ')||'inga'}`,'muted'));
  if(c.empty?.length){const byAirport=new Map();for(const item of c.empty){if(!byAirport.has(item.airport))byAirport.set(item.airport,[]);byAirport.get(item.airport).push(item.nights);}results.append(el('p','Inga prisuppgifter hittades hos datakällan för '+[...byAirport].map(([code,nights])=>`${code} (${[...new Set(nights)].sort((a,b)=>a-b).join(' och ')} nätter)`).join(', ')+'. Övriga resultat visas som vanligt.','muted'));}
  if(c.failed.length)results.append(el('p',`Kunde inte kontrollera ${c.failed.join(', ')}. Resultaten från övriga flygplatser finns kvar.`));
  const failures=(c.failures||[]).filter(f=>!c.jobs||c.jobs.some(job=>f.airports.includes(job.code)&&job.nights===f.nights&&job.nights<=maxTripNights()&&job.status!=='DONE'));
  if(failures.length){const info=el('details');info.append(el('summary','Visa detaljer om sökningar som inte kunde slutföras'));for(const f of failures)info.append(el('p',`${f.airports.join(', ')}${f.nights?' ('+f.nights+' nätter)':''}: ${errors[f.code]||'Datakällan kunde inte slutföra sökningen.'} (kod ${f.code}).`));results.append(info);}
  if(c.unsearched.length)results.append(el('p',`Inte färdigsökta: ${c.unsearched.join(', ')}.`));if(data.stopReason)results.append(el('p',data.stopReason));if(c.unsearched.length&&data.resumeQuery)results.append(button('Fortsätt söka återstående flygplatser',()=>searchAll(data.resumeQuery,data)));
 }
 results.append(el('p',baggageRequirements()));
 const needBag=Number(document.getElementById('baggage').value)>0;
 const note=el('p',needBag?'Bagageavgifter visas när de finns. Vikt, båda kabinväskorna och exakt totalpris är ännu inte bekräftade.':'Kontrollera att valda kabinväskor är tillåtna tillsammans, med rätt vikt och mått.');note.className='muted';results.append(note);
 results.append(el('h3',data.stage==='outbound'?'Ankomst enligt dina val – billigast först':needBag?'Bagagepris ej verifierat – billigaste prisuppgift först':'Billigaste prisuppgift först'));
 if(data.stage==='details'&&chosenOutbound&&chosenReturn){const trip=el('section');trip.append(el('h4','Skiddagar och hemresa'));skiLabel(trip,skiPlan(chosenOutbound,chosenReturn,data));results.append(trip);}
 if(data.stage!=='outbound'&&chosenOutbound){const plan=window.FlygJourney.resortArrival(chosenOutbound,resortRequirements(data));const box=el('section');box.append(el('h4','Vald utresa – ankomstplan'));planLabel(box,plan);results.append(box);}
 if(excludedAirlines().length)results.append(el('p','Bortvalda flygbolag: '+excludedAirlines().join(', ')+'. Flygbolagen utesluts hos dataleverantören för nya sökningar. Ändra valen och sök igen för nya kalenderpriser.','muted'));
 if(data.stage==='calendar'){
  results.append(el('p',`${(data.calendarNights||[data.context.nights]).filter(n=>n<=maxTripNights()).join(' eller ')} nätter. Kalenderpriser för två, tur och retur; flygtider och bagage kontrolleras efter datumval.`,'muted'));
  const affordable=calendarRows(data);
  for(const row of affordable){const c=row.comparison;if(c?.status==='READY'&&c.returnFlights){const candidate=returnChoices(data,row,c.outbound,c.returnFlights)[0];if(candidate)c.returnFlight=candidate;}}
  const group=row=>matchedTimesFit(data,row)?extraRow(row)?extraAssessment(data,row).status==='OVER_ESTIMATE'?3:extraAssessment(data,row).status==='UNKNOWN'?1:0:0:row.comparison?.status==='READY'?3:2;
  const rankCost=row=>{const check=extraAssessment(data,row);return check.status==='WITHIN_ESTIMATE'?check.baselineFlightPrice+check.extraCost:row.comparison?.returnFlight?.quotedPriceSEK??row.quotedPriceSEK;};
  affordable.sort((a,b)=>group(a)-group(b)||(group(a)===0?rankCost(a)-rankCost(b):a.quotedPriceSEK-b.quotedPriceSEK));
  if(!affordable.length)results.append(el('p','Inga kalenderpriser inom maxpriset för de sökta flygplatserna.'));
  if(affordable.some(row=>!row.comparison))results.append(button('Jämför tider för tre datum',()=>calendarTimes(data,comparisonBatch(affordable.filter(row=>!row.comparison)))));
  let previousGroup=-1;
  for(const row of affordable){
   const currentGroup=group(row);if(currentGroup!==previousGroup){results.append(el('h4',currentGroup===0?'Matchade resor – flygpris och uppskattad merkostnad':currentGroup===1?'Extranatt – hela merkostnaden är ännu okänd':currentGroup===2?'Fler datum – endast kalenderpris tills tider har hämtats':'Hämtade resor utanför nuvarande val eller kostnadsriktmärke'));previousGroup=currentGroup;}
   const card=el('article',null,'flight-card');card.append(el('h3',`${row.outbound} → ${row.return} · ${rowNights(row)} nätter${extraRow(row)?' (en extra natt)':''}`),el('p',`${row.destination} · kalender från ${money(row.quotedPriceSEK)} för två`));
   const c=row.comparison;
   if(c?.status==='READY'&&c.returnFlights){const candidate=returnChoices(data,row,c.outbound,c.returnFlights)[0];if(candidate)c.returnFlight=candidate;}
   if(c?.status==='LOADING')card.append(el('p','Hämtar matchade ut- och hemresetider…','muted'));
   else if(c?.status==='READY'){
    card.append(el('p',flightTimeLabel('Utresa',c.outbound)),el('p',flightTimeLabel('Hemresa',c.returnFlight)),el('p',`${money(c.returnFlight.quotedPriceSEK)} för två, tur och retur · prisuppgift för just dessa flyg`));
    planLabel(card,window.FlygJourney.resortArrival(c.outbound,resortRequirements(data)));
    skiLabel(card,skiPlan(c.outbound,c.returnFlight,data));
    if(c.fetchedAt)card.append(el('p','Tider hämtade '+new Date(c.fetchedAt).toLocaleString('sv-SE')+'.','muted'));
    const all=el('details');all.append(el('summary','Alla flyg och bytestider'));segments(all,c.outbound);segments(all,c.returnFlight);card.append(all);
    card.append(el('p','Kalenderns frånpris kan avse andra flyg. Bagage och transferpris är inte bekräftade.','muted'));
    if(extraRow(row))extraCostLabel(card,data,row);
    if(matchedTimesFit(data,row)&&extraAssessment(data,row).status!=='OVER_ESTIMATE')card.append(button(skiPlan(c.outbound,c.returnFlight,data).status==='UNKNOWN'?'Kontrollera flyget – transfer saknas':extraRow(row)&&extraAssessment(data,row).status==='UNKNOWN'?'Kontrollera flyget – merkostnad okänd':'Välj denna resa',event=>{chosenOutbound=c.outbound;chosenReturn=c.returnFlight;search({stage:'details',selection:c.returnFlight.selection},event.currentTarget);}));
    else card.append(el('p','Dessa tider passar inte längre dina nuvarande filter. Visa avgångar för att välja ett annat flyg.'));
   }else{
    card.append(el('p',c?.message||'Flygtider saknas i kalenderpriset. De hämtas som en separat matchad resa.','muted'));
    card.append(button('Hämta ut- och hemresetider',()=>calendarTimes(data,[row])));
   }
   card.append(button('Visa alla avgångar',event=>search(calendarContext(data,row),event.currentTarget)));results.append(card);
  }

 }else if(data.stage==='details'){
  if(!data.options.length)results.append(el('p','Inga säljarpriser kunde verifieras för det här valet. Öppna sökningen hos Google Flights.'));
  const affordable=withinBudget(data.options);if(data.options.length&&!affordable.length)results.append(el('p','Inga biljettpriser inom maxpriset. Höj beloppet för att visa fler, utan ny sökning.'));
  for(const o of affordable){const card=el('article',null,'flight-card');card.append(el('h3',`${o.seller||'Säljare'}${o.fare?' · '+o.fare:''}`),el('p',`${money(o.quotedPriceSEK)} · prisuppgift för två, tur och retur`));
   const feePolicies=o.baggagePolicies.length?o.baggagePolicies:(data.routeBaggagePolicies?.together||[]);card.append(el('h4','Bagageavgifter från datakällan'));if(feePolicies.length){const list=el('ul');feePolicies.forEach(policy=>list.append(el('li',baggageLabel(policy))));card.append(list);}else card.append(el('p','Ingen bagageavgift angiven i underlaget.'));for(const [key,label]of [['departing','Utresa'],['returning','Hemresa']]){const entries=data.routeBaggagePolicies?.[key]||[];if(entries.length){card.append(el('p',label));const list=el('ul');entries.forEach(policy=>list.append(el('li',baggageLabel(policy))));card.append(list);}}card.append(el('p','Avgifterna är källuppgifter, inte ett verifierat totalpris för ert bagage. Kontrollera vikt, antal personer och ut-/hemresa hos säljaren.','muted'));card.append(el('p','Pjäxväska + extra liten väska: inte bekräftat att båda ingår tillsammans.','muted'));
   o.extensions.forEach(p=>card.append(el('p',p,'muted')));results.append(card);
  }
 }else{
  if(!data.flights.length)results.append(el('p','Inga flyg hittades för dessa datum. Prova en annan flygplats eller andra datum.'));
  const requirements=scheduleRequirements(data),ground=resortRequirements(data);
  const needsResort=data.stage==='outbound'&&regionSelect.value==='alps'&&document.querySelector('input[name=profile]:checked')?.value!=='football';
  const assessed=withinBudget(data.flights).filter(f=>!excludedFlight(f)).map(f=>({flight:f,check:window.FlygJourney.checkSchedule(f,requirements),plan:needsResort?window.FlygJourney.resortArrival(f,ground):{status:'NOT_REQUIRED'},trip:data.stage==='returns'&&chosenOutbound?skiPlan(chosenOutbound,f,data):{status:'UNKNOWN'}}));
  const primary=assessed.filter(x=>x.check.status==='NOT_REJECTED'&&['ON_TIME','NOT_REQUIRED'].includes(x.plan.status)&&x.trip.status!=='REJECTED');
  const unknown=assessed.filter(x=>x.check.status==='NOT_REJECTED'&&x.plan.status==='UNKNOWN');
  const reserves=needsResort?assessed.filter(x=>!primary.includes(x)&&!unknown.includes(x)&&window.FlygJourney.checkSchedule(x.flight,{...requirements,airportCutoff:'23:59',hotelCutoff:'23:59'}).status==='NOT_REJECTED'):[];
  if(data.flights.length)results.append(el('p',`Visar ${primary.length} av ${data.flights.length} alternativ i huvudlistan efter pris-, flygbolags-, tids- och ankomstfilter.`));
  results.append(el('p',needsResort?`Mål: redo för middag på ${ground.resort||'vald skidort'} senast ${ground.dinnerTarget}. Senaste hotellankomst ${ground.hotelCutoff}. Bil/privat transfer är en uppskattning; tillgänglighet och totalpris är inte bekräftade.`:`Högst ${requirements.maxLayoverMinutes/60} timmars väntan per mellanlandning.`,'muted'));
  if(needsResort&&!ground.resort)results.append(el('p','Välj en skidort för att beräkna ankomsten. Flyg utan beräknad transfer finns separat nedan.'));
  const hidden=assessed.filter(x=>!primary.includes(x)&&!unknown.includes(x));
  if(hidden.length){const counts=new Map();for(const {check,plan,trip}of hidden){const reasons=trip.status==='REJECTED'?[trip.reason]:check.status==='NOT_REJECTED'?[plan.status==='LATE'?'Redo för middag efter vald tid':plan.status==='TOO_LATE'?'Uppskattad hotellankomst för sen':'Ankomst behöver kontrolleras']:check.reasons;for(const reason of reasons)counts.set(reason,(counts.get(reason)||0)+1);}results.append(el('p','Utanför huvudlistan: '+[...counts].map(([reason,count])=>`${reason} (${count})`).join('; ')+'.','muted'));}
  if(data.flights.length&&!primary.length)results.append(el('p','Inga alternativ i huvudlistan uppfyller dina nuvarande val. Ändra sökvalen eller välj andra datum. Okända transferresor visas separat.'));
  function flightCard(item,reserve=false){
   const f=item.flight,card=el('article',null,'flight-card');segments(card,f);card.append(el('p',`${money(f.quotedPriceSEK)} · prisuppgift för två, tur och retur`),el('p',data.stage==='outbound'?'Preliminärt tills hemresan är vald.':'Kontrollera biljettvillkoren i nästa steg.','muted'));
   if(needsResort)planLabel(card,item.plan);
   if(data.stage==='returns'&&chosenOutbound)skiLabel(card,item.trip);
   if(reserve)card.append(el('p','Reserv – kan kräva en första natt i stad eller senare ankomst. Stadshotell och fortsatt resa är inte planerade. Extra natt kan behövas för tre hela skiddagar.'));
   card.append(el('p','Bagageavgifter: välj hemresa och visa biljettvillkor för att hämta tillgängliga priser.','muted'));
   if(f.selection)card.append(button(reserve?'Kontrollera detta reservflyg':data.stage==='outbound'?'Välj utresa':'Visa biljettvillkor',event=>{if(data.stage==='outbound'){chosenOutbound=f;chosenReturn=null;}else chosenReturn=f;search({stage:data.stage==='outbound'?'returns':'details',selection:f.selection},event.currentTarget);}));
   return card;
  }
  for(const item of primary)results.append(flightCard(item));
  if(unknown.length){const list=el('details');list.append(el('summary',`${unknown.length} alternativ utan kontrollerad transfer – visa separat`),el('p','Dessa räknas inte som ankomst i tid för middag. Kontrollera transporten innan du väljer resan.'));for(const item of unknown)list.append(flightCard(item));results.append(list);}
  if(document.getElementById('showCityFallback').checked&&reserves.length){const list=el('details');list.append(el('summary',`${reserves.length} reserver – första natt i stad eller ändrad ankomstplan`));for(const item of reserves)list.append(flightCard(item,true));results.append(list);}

 }
 if(data.stage==='details'){
  if(data.selectedFlightUrl){const link=el('a','Öppna valt flyg i Google Flights');link.href=data.selectedFlightUrl;link.target='_blank';link.rel='noopener noreferrer';results.append(link);}
  else results.append(el('p','Datakällan saknar en direktlänk till just detta flyg. Ingen allmän startsida öppnas.','muted'));
 }
 results.append(el('p',`Hämtat ${new Date(data.fetchedAt).toLocaleString('sv-SE')}. Källan kan återanvända upp till en timme gamla uppgifter. Priset bekräftas hos säljaren.`,'muted'));
 results.append(el('p','Transfer, hotellankomst och hela skiddagar är ännu inte verifierade för dessa flyg.','muted'));
}
form.addEventListener('submit',e=>{e.preventDefault();if(busy)return;if(!document.getElementById('searchForm').checkValidity()){choices.open=true;document.getElementById('searchForm').reportValidity();return;}if(mode.value==='week'){let w;try{w=selectedWindow();}catch{status.textContent='Kontrollera vecka och antal nätter.';return;}choices.open=false;history=[];chosenOutbound=null;chosenReturn=null;searchAll({stage:'calendar',from:w.from,to:w.to,nights:w.nights,direct:document.getElementById('connections').value==='direct'});return;}const nights=(Date.parse(end.value)-Date.parse(start.value))/86400000;const max=maxTripNights();
 if(!Number.isInteger(nights)||nights<1||nights>max){status.textContent=`Välj en resa med 1–${max} nätter enligt ditt sökunderlag.`;return;}
 choices.open=false;history=[];chosenOutbound=null;chosenReturn=null;const query={stage:'outbound',destination:airport.value,outbound:start.value,return:end.value,direct:document.getElementById('connections').value==='direct'};if(airport.value==='all'||(regionSelect.value==='alps'&&resortCodes()))searchAll(query);else search(query);
});
})();

