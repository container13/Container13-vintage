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

let busy=false,history=[],generation=0;
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
resortSelect.addEventListener('change',()=>{try{localStorage.setItem('flyg-resort-v1',resortSelect.value);}catch{}syncAirports();});
updateResortVisibility();
function syncAirports(){const current=airport.value;const codes=regionSelect.value==='alps'?resortCodes():null;airport.replaceChildren(...[...document.getElementById('destination').options].filter(o=>!codes||codes.includes(o.value)).map(o=>o.cloneNode(true)));if([...airport.options].some(o=>o.value===current))airport.value=current;else airport.value=codes?codes[0]:'all';}
syncAirports();if(!resortCodes())airport.value=document.getElementById('destination').value;
document.querySelectorAll('[name=profile]').forEach(r=>r.addEventListener('change',()=>{syncAirports();datesFromWeek();}));
document.getElementById('destination').addEventListener('change',e=>{if([...airport.options].some(o=>o.value===e.target.value))airport.value=e.target.value;});
const week=document.getElementById('tripWeek'),nightsInput=document.getElementById('nights'),year=document.getElementById('year'),mode=document.getElementById('searchMode');
function selectedWindow(){return window.FlygJourney.weekWindow(Number(year.value),Number(week.value),Number(nightsInput.value));}
function datesFromWeek(){
 try{const w=selectedWindow();if(mode.value==='week'){start.value=w.from;end.value=w.firstReturn;}document.getElementById('weekHint').textContent=mode.value==='week'?`Avresa ${w.from}–${w.to} · ${w.nights} nätter. Lördagen före veckan ingår.`:`Exakta datum: ${start.value}–${end.value}.`;}
 catch{document.getElementById('weekHint').textContent='Kontrollera vecka och antal nätter.';}
}
for(const control of [week,nightsInput,year])control.addEventListener(control===nightsInput?'input':'change',()=>{mode.value='week';datesFromWeek();});
mode.addEventListener('change',datesFromWeek);
for(const control of [start,end])control.addEventListener('input',()=>{mode.value='exact';datesFromWeek();});
datesFromWeek();
function button(text,action){const b=el('button',text);b.type='button';b.disabled=busy;b.addEventListener('click',action);return b;}
function setBusy(value){busy=value;form.setAttribute('aria-busy',String(value));document.getElementById('liveSearch').disabled=value;results.querySelectorAll('button').forEach(b=>b.disabled=value);}
const errors={ACCOUNT_HTTP_403:'Datakällan nekar servern åtkomst till kontokontrollen (403).',ACCOUNT_HTTP_401:'Datakällan godkänner inte den sparade nyckeln.',SEARCH_HTTP_403:'Datakällan nekar servern åtkomst till flygsökningen (403).',SEARCH_HTTP_429:'Datakällans anropsgräns är nådd. Försök igen senare.',APP_QUOTA_REACHED:'Appens gratiskvot är nådd. Försök igen senare; ingen betaltjänst aktiveras.',FREE_QUOTA_UNAVAILABLE:'Datakällans gratiskvot är slut eller gratisvillkoret kan inte bekräftas.',SELECTION_EXPIRED:'Valet har gått ut. Starta en ny sökning.',PROVIDER_UNAVAILABLE:'Datakällan svarade inte. Försök igen senare.',INVALID_DATES:'Kontrollera datumen. Hemresan ska vara efter utresan, inom 30 nätter och högst ett år framåt.',SEARCH_NOT_ENABLED:'Livesökningen är inte aktiverad ännu.'};
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
async function searchAll(query,previous=null){
 if(busy)return;if(!navigator.onLine){status.textContent='Du är offline. Aktuella flyg behöver internet.';return;}
 const calendar=query.stage==='calendar';
 const requested=previous?previous.coverage.requested:(regionSelect.value==='alps'&&resortCodes()?resortCodes():airport.value==='all'?[...airport.options].map(o=>o.value).filter(code=>code!=='all'):[airport.value]);
 const data=previous||{stage:query.stage,context:{...query,destination:airport.value==='all'?'alla relevanta flygplatser':airport.value},adults:2,currency:'SEK',flights:[],prices:[],resumeQuery:query,fetchedAt:new Date().toISOString(),coverage:{requested,completed:[],failed:[],unsearched:[...requested],failures:[]}};
 const pending=[...data.coverage.unsearched];data.coverage.failures ||= [];data.stopReason='';
 setBusy(true);let index=0,calls=0;const groupSize=calendar?1:3;
 try{
  for(;index<pending.length&&(!calendar||calls<8);index+=groupSize){const group=pending.slice(index,index+groupSize);calls++;status.textContent=`Söker ${group.join(', ')} · ${data.coverage.completed.length}/${requested.length} flygplatser klara…`;
   try{const part=await requestData({...query,excludeAirlines:excludedAirlines(),destination:group.join(',')});if(calendar)data.prices.push(...part.prices);else data.flights.push(...part.flights);data.coverage.completed.push(...group);}
   catch(error){const code=String(error?.message||'UNKNOWN_ERROR').slice(0,80);data.coverage.failures.push({airports:[...group],code});if(['APP_QUOTA_REACHED','FREE_QUOTA_UNAVAILABLE','ACCOUNT_HTTP_401','ACCOUNT_HTTP_403','SEARCH_HTTP_403','SEARCH_HTTP_429','SEARCH_NOT_ENABLED','PROVIDER_UNAVAILABLE'].includes(code)){data.stopReason=(errors[code]||'Sökningen stoppades')+' (felkod '+code+'). Inga fler flygplatser söks automatiskt.';break;}data.coverage.failed.push(...group);}
  }
  data.coverage.unsearched=pending.slice(index);
  if(!previous)history.push(data);render(data);window.FlygSelectionUI.reveal(results);status.textContent=data.coverage.failed.length||data.coverage.unsearched.length?'Sökningen är inte färdig. Se felorsak och återstående flygplatser nedan.':'Alla valda flygplatser har sökts. Billigast först.';
 }finally{setBusy(false);}
}
function baggageLabel(raw){
 const match=String(raw).match(/^(?:1st checked bag|1 carry-on bag):\s*(\d+)(?:\s*[-–]\s*(\d+))?$/i);
 if(match){const name=/checked/i.test(raw)?'Incheckad väska':'Kabinväska';return `${name}: ${match[2]?money(Number(match[1]))+'–'+money(Number(match[2]))+' (prisintervall)':money(Number(match[1]))} · vikt ej angiven`;}
 if(raw==='1 free carry-on')return 'En kabinväska ingår enligt datakällan; extra personlig väska och mått är inte bekräftade.';
 return raw;
}
function baggageRequirements(){const parts=[];const kg=Number(document.getElementById('baggage').value);if(kg>0)parts.push(`minst ${String(kg).replace('.',',')} kg incheckat`);if(document.getElementById('cabinBoots').checked)parts.push('separat kabinväska för pjäxor');if(document.getElementById('personalBag').checked)parts.push('extra liten personlig väska');return 'Bagagekrav per person: '+(parts.join(' + ')||'inga extra väskor valda')+'.';}
for(const id of ['baggage','cabinBoots','personalBag'])document.getElementById(id).addEventListener('change',()=>{if(history.length)render(history.at(-1));});
function segments(card,flight){for(const s of flight.segments){card.append(el('p',`${s.origin||'?'} → ${s.destination||'?'} · ${s.number||s.airline||'Flyg'}`),el('p',`${s.departureLocal||'?'} → ${s.arrivalLocal||'?'} (lokala tider)`,'muted'));}}
function render(data){
 const ceiling=Number(maxPrice.value);
 if(!maxPrice.checkValidity())return;
 const withinBudget=items=>items.filter(item=>Number.isFinite(item.quotedPriceSEK)&&item.quotedPriceSEK<=ceiling).sort((a,b)=>a.quotedPriceSEK-b.quotedPriceSEK);
 results.replaceChildren();const titles={calendar:'Välj avresedatum',outbound:'Välj utresa',returns:'Välj hemresa',details:'Biljettpris och villkor'};
 results.append(el('h3',titles[data.stage]),el('p',`ARN ↔ ${data.context.selectedDestination||data.context.destination} · ${data.context.from||data.context.outbound}–${data.context.to||data.context.return} · 2 vuxna`));
 if(history.length>1)results.append(button('Tillbaka till föregående val',()=>{if(!busy){history.pop();render(history.at(-1));window.FlygSelectionUI.reveal(results);}}));
 results.append(el('p',`Maxpris ${money(ceiling)} totalt för två. Eventuellt okänt bagage tillkommer.`,'muted'));
 const h=history.find(x=>x.stage==='outbound');if(data.stage!=='outbound'&&h)results.append(el('p','Retur och villkor gäller den utresa du valt.','muted'));
 if(data.coverage){const c=data.coverage;results.append(el('p',`Sökta flygplatser: ${c.completed.join(', ')||'inga'}`,'muted'));if(c.failed.length)results.append(el('p',`Sökningen misslyckades för: ${c.failed.join(', ')}.`));if(c.failures?.length)for(const failure of c.failures)results.append(el('p',`Fel vid ${failure.airports.join(', ')}: ${errors[failure.code]||'Okänt serverfel'} (kod ${failure.code}).`));if(c.unsearched.length)results.append(el('p',`Inte sökta: ${c.unsearched.join(', ')}.`));if(data.stopReason)results.append(el('p',data.stopReason));if(c.unsearched.length&&data.resumeQuery)results.append(button('Fortsätt söka återstående flygplatser',()=>searchAll(data.resumeQuery,data)));}
 results.append(el('p',baggageRequirements()));
 const needBag=Number(document.getElementById('baggage').value)>0;
 const note=el('p',needBag?'Bagageavgifter visas när de finns. Vikt, båda kabinväskorna och exakt totalpris är ännu inte bekräftade.':'Kontrollera att valda kabinväskor är tillåtna tillsammans, med rätt vikt och mått.');note.className='muted';results.append(note);
 results.append(el('h3',needBag?'Bagagepris ej verifierat – billigaste prisuppgift först':'Billigaste prisuppgift först'));
 if(excludedAirlines().length)results.append(el('p','Bortvalda flygbolag: '+excludedAirlines().join(', ')+'. Flygbolagen utesluts hos dataleverantören för nya sökningar. Ändra valen och sök igen för nya kalenderpriser.','muted'));
 if(data.stage==='calendar'){
  results.append(el('p',`${data.context.nights} nätter. Kalenderpriser för två, tur och retur; flygtider och bagage kontrolleras efter datumval.`,'muted'));
  const affordable=withinBudget(data.prices);if(!affordable.length)results.append(el('p','Inga kalenderpriser inom maxpriset för de sökta flygplatserna.'));
  for(const row of affordable){const card=el('article',null,'flight-card');card.append(el('h3',`${row.outbound} → ${row.return}`),el('p',`${row.destination} · från ${money(row.quotedPriceSEK)} för två`),button('Visa avgångar',event=>search({stage:'outbound',destination:row.destination,outbound:row.outbound,return:row.return,direct:data.context.direct},event.currentTarget)));results.append(card);}
 }else if(data.stage==='details'){
  if(!data.options.length)results.append(el('p','Inga säljarpriser kunde verifieras för det här valet. Öppna sökningen hos Google Flights.'));
  const affordable=withinBudget(data.options);if(data.options.length&&!affordable.length)results.append(el('p','Inga biljettpriser inom maxpriset. Höj beloppet för att visa fler, utan ny sökning.'));
  for(const o of affordable){const card=el('article',null,'flight-card');card.append(el('h3',`${o.seller||'Säljare'}${o.fare?' · '+o.fare:''}`),el('p',`${money(o.quotedPriceSEK)} · prisuppgift för två, tur och retur`));
   const feePolicies=o.baggagePolicies.length?o.baggagePolicies:(data.routeBaggagePolicies?.together||[]);card.append(el('h4','Bagageavgifter från datakällan'));if(feePolicies.length){const list=el('ul');feePolicies.forEach(policy=>list.append(el('li',baggageLabel(policy))));card.append(list);}else card.append(el('p','Ingen bagageavgift angiven i underlaget.'));for(const [key,label]of [['departing','Utresa'],['returning','Hemresa']]){const entries=data.routeBaggagePolicies?.[key]||[];if(entries.length){card.append(el('p',label));const list=el('ul');entries.forEach(policy=>list.append(el('li',baggageLabel(policy))));card.append(list);}}card.append(el('p','Avgifterna är källuppgifter, inte ett verifierat totalpris för ert bagage. Kontrollera vikt, antal personer och ut-/hemresa hos säljaren.','muted'));card.append(el('p','Pjäxväska + extra liten väska: inte bekräftat att båda ingår tillsammans.','muted'));
   o.extensions.forEach(p=>card.append(el('p',p,'muted')));results.append(card);
  }
 }else{
  if(!data.flights.length)results.append(el('p','Inga flyg hittades för dessa datum. Prova en annan flygplats eller andra datum.'));
  const affordable=withinBudget(data.flights).filter(f=>!excludedFlight(f));if(data.flights.length)results.append(el('p',`Visar ${affordable.length} av ${data.flights.length} alternativ efter pris- och flygbolagsfilter.`));if(data.flights.length&&!affordable.length)results.append(el('p','Inga flyg inom maxpriset. Höj beloppet för att visa fler, utan ny sökning.'));
  for(const f of affordable){const card=el('article',null,'flight-card');segments(card,f);card.append(el('p',`${money(f.quotedPriceSEK)} · prisuppgift för två, tur och retur`),el('p',data.stage==='outbound'?'Preliminärt tills hemresan är vald.':'Kontrollera biljettvillkoren i nästa steg.','muted'));
   card.append(el('p','Bagageavgifter: välj hemresa och visa biljettvillkor för att hämta tillgängliga priser.','muted'));
   if(f.selection)card.append(button(data.stage==='outbound'?'Välj utresa':'Visa biljettvillkor',event=>search({stage:data.stage==='outbound'?'returns':'details',selection:f.selection},event.currentTarget)));
   results.append(card);
  }
 }
 if(data.stage==='details'){
  if(data.selectedFlightUrl){const link=el('a','Öppna valt flyg i Google Flights');link.href=data.selectedFlightUrl;link.target='_blank';link.rel='noopener noreferrer';results.append(link);}
  else results.append(el('p','Datakällan saknar en direktlänk till just detta flyg. Ingen allmän startsida öppnas.','muted'));
 }
 results.append(el('p',`Hämtat ${new Date(data.fetchedAt).toLocaleString('sv-SE')}. Källan kan återanvända upp till en timme gamla uppgifter. Priset bekräftas hos säljaren.`,'muted'));
 results.append(el('p','Transfer, hotellankomst och hela skiddagar är ännu inte verifierade för dessa flyg.','muted'));
}
form.addEventListener('submit',e=>{e.preventDefault();if(busy)return;if(mode.value==='week'){let w;try{w=selectedWindow();}catch{status.textContent='Kontrollera vecka och antal nätter.';return;}choices.open=false;history=[];searchAll({stage:'calendar',from:w.from,to:w.to,nights:w.nights,direct:document.getElementById('connections').value==='direct'});return;}const nights=(Date.parse(end.value)-Date.parse(start.value))/86400000;const max=Number(document.getElementById('nights').value);
 if(!Number.isInteger(nights)||nights<1||nights>max){status.textContent=`Välj en resa med 1–${max} nätter enligt ditt sökunderlag.`;return;}
 choices.open=false;history=[];const query={stage:'outbound',destination:airport.value,outbound:start.value,return:end.value,direct:document.getElementById('connections').value==='direct'};if(airport.value==='all'||(regionSelect.value==='alps'&&resortCodes()))searchAll(query);else search(query);
});
})();
