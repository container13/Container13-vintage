/* UI owner for staged live search; no provider credentials in browser. */
(()=>{'use strict';
const API='https://flyg-search-api.mangaj73.workers.dev';
const form=document.getElementById('liveForm'),results=document.getElementById('liveResults'),status=document.getElementById('liveStatus');
const airport=document.getElementById('liveAirport'),start=document.getElementById('liveOutbound'),end=document.getElementById('liveReturn');
const maxPrice=document.getElementById('maxPrice');
let busy=false,history=[],generation=0;
maxPrice.addEventListener('input',()=>{if(maxPrice.checkValidity()&&history.length)render(history.at(-1));});
const el=(tag,text,className)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;if(className)n.className=className;return n;};
const money=v=>new Intl.NumberFormat('sv-SE',{style:'currency',currency:'SEK',maximumFractionDigits:0}).format(v);
function syncAirports(){const current=airport.value;airport.replaceChildren(...[...document.getElementById('destination').options].map(o=>o.cloneNode(true)));if([...airport.options].some(o=>o.value===current))airport.value=current;}
syncAirports();airport.value=document.getElementById('destination').value;
document.querySelectorAll('[name=profile]').forEach(r=>r.addEventListener('change',syncAirports));
document.getElementById('destination').addEventListener('change',e=>{airport.value=e.target.value;});
function datesFromWeek(){if(start.dataset.edited)return;const year=Number(document.getElementById('year').value),week=Number(document.querySelector('#weeks input:checked')?.value||11);const jan=new Date(Date.UTC(year,0,4));jan.setUTCDate(jan.getUTCDate()-(jan.getUTCDay()+6)%7+(week-1)*7-1);start.value=jan.toISOString().slice(0,10);jan.setUTCDate(jan.getUTCDate()+Number(document.getElementById('nights').value||4));end.value=jan.toISOString().slice(0,10);}
datesFromWeek();start.addEventListener('input',()=>{start.dataset.edited='true';});end.addEventListener('input',()=>{start.dataset.edited='true';});
document.getElementById('weeks').addEventListener('change',datesFromWeek);document.getElementById('year').addEventListener('change',datesFromWeek);
function button(text,action){const b=el('button',text);b.type='button';b.disabled=busy;b.addEventListener('click',action);return b;}
function setBusy(value){busy=value;form.setAttribute('aria-busy',String(value));document.getElementById('liveSearch').disabled=value;results.querySelectorAll('button').forEach(b=>b.disabled=value);}
const errors={ACCOUNT_HTTP_403:'Datakällan nekar servern åtkomst till kontokontrollen (403).',ACCOUNT_HTTP_401:'Datakällan godkänner inte den sparade nyckeln.',SEARCH_HTTP_403:'Datakällan nekar servern åtkomst till flygsökningen (403).',SEARCH_HTTP_429:'Datakällans anropsgräns är nådd. Försök igen senare.',APP_QUOTA_REACHED:'Appens gratiskvot är nådd. Försök igen senare; ingen betaltjänst aktiveras.',FREE_QUOTA_UNAVAILABLE:'Datakällans gratiskvot är slut eller gratisvillkoret kan inte bekräftas.',SELECTION_EXPIRED:'Valet har gått ut. Starta en ny sökning.',PROVIDER_UNAVAILABLE:'Datakällan svarade inte. Försök igen senare.',INVALID_DATES:'Kontrollera datumen. Hemresan ska vara efter utresan, inom 30 nätter och högst ett år framåt.',SEARCH_NOT_ENABLED:'Livesökningen är inte aktiverad ännu.'};
async function requestData(query){
 const r=await fetch(API+'/search',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(query),cache:'no-store',credentials:'omit',signal:AbortSignal.timeout(90000)});
 const data=await r.json();if(!r.ok||data.error)throw new Error(data.error||'SEARCH_FAILED');return data;
}
async function search(query,trigger=null){
 if(busy)return;
 if(!maxPrice.checkValidity()){status.textContent='Kontrollera maxpriset. Ange ett belopp i steg om 100 kr.';maxPrice.reportValidity();maxPrice.focus();return;}
 const loading=query.stage==='returns'?'Hämtar hemresor…':query.stage==='details'?'Hämtar biljettvillkor…':'Hämtar flyg…';
 const action=window.FlygSelectionUI.begin(trigger,loading);
 if(!navigator.onLine){const message='Du är offline. Aktuella flyg behöver internet.';status.textContent=message;window.FlygSelectionUI.error(action,message);window.FlygSelectionUI.finish(action);if(!action)status.scrollIntoView({block:'center'});return;}
 setBusy(true);status.textContent=loading;const active=++generation;
 try{
  const data=await requestData(query);
  if(active!==generation)return;history.push(data);if(!maxPrice.checkValidity()){status.textContent='Kontrollera maxpriset för att visa resultatet.';maxPrice.reportValidity();maxPrice.focus();return;}render(data);status.textContent=data.cached?'Tidigare hämtat resultat återanvänds.':'Flyguppgifter hämtade.';window.FlygSelectionUI.reveal(results);
 }catch(e){const message=errors[e.message]||'Sökningen kunde inte slutföras. Dina tidigare resultat finns kvar. Försök igen senare.';status.textContent=message;window.FlygSelectionUI.error(action,message);if(!action)status.scrollIntoView({block:'center'});}
 finally{window.FlygSelectionUI.finish(action);setBusy(false);}
}
async function searchAll(query){
 if(busy)return;if(!navigator.onLine){status.textContent='Du är offline. Aktuella flyg behöver internet.';return;}
 const requested=[...airport.options].map(o=>o.value).filter(code=>code!=='all');
 const data={stage:'outbound',context:{...query,destination:'alla relevanta flygplatser'},adults:2,currency:'SEK',flights:[],fetchedAt:new Date().toISOString(),coverage:{requested,completed:[],failed:[],unsearched:[]}};
 setBusy(true);let index=0;
 try{
  for(;index<requested.length;index+=3){const group=requested.slice(index,index+3);status.textContent=`Söker ${group.join(', ')} · ${Math.min(index+3,requested.length)}/${requested.length} flygplatser…`;
   try{const part=await requestData({...query,destination:group.join(',')});data.flights.push(...part.flights);data.coverage.completed.push(...group);}
   catch(error){data.coverage.failed.push(...group);if(['APP_QUOTA_REACHED','FREE_QUOTA_UNAVAILABLE','ACCOUNT_HTTP_401'].includes(error.message)){data.coverage.unsearched=requested.slice(index+3);data.stopReason=errors[error.message];break;}}
  }
  history.push(data);render(data);status.textContent=data.coverage.failed.length||data.coverage.unsearched.length?'Sökningen är delvis klar. Se vilka flygplatser som saknas i resultatet.':'Alla valda flygplatser har sökts. Billigast först.';
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
 results.replaceChildren();const titles={outbound:'Välj utresa',returns:'Välj hemresa',details:'Biljettpris och villkor'};
 results.append(el('h3',titles[data.stage]),el('p',`ARN ↔ ${data.context.selectedDestination||data.context.destination} · ${data.context.outbound}–${data.context.return} · 2 vuxna`));
 if(history.length>1)results.append(button('Tillbaka till föregående val',()=>{if(!busy){history.pop();render(history.at(-1));window.FlygSelectionUI.reveal(results);}}));
 results.append(el('p',`Maxpris ${money(ceiling)} totalt för två. Eventuellt okänt bagage tillkommer.`,'muted'));
 const h=history.find(x=>x.stage==='outbound');if(data.stage!=='outbound'&&h)results.append(el('p','Retur och villkor gäller den utresa du valt.','muted'));
 if(data.coverage){const c=data.coverage;results.append(el('p',`Sökta flygplatser: ${c.completed.join(', ')||'inga'}`,'muted'));if(c.failed.length)results.append(el('p',`Resultat saknas för: ${c.failed.join(', ')}.`));if(c.unsearched.length)results.append(el('p',`Inte sökta: ${c.unsearched.join(', ')}.`));if(data.stopReason)results.append(el('p',data.stopReason));}
 results.append(el('p',baggageRequirements()));
 const needBag=Number(document.getElementById('baggage').value)>0;
 const note=el('p',needBag?'Bagageavgifter visas när de finns. Vikt, båda kabinväskorna och exakt totalpris är ännu inte bekräftade.':'Kontrollera att valda kabinväskor är tillåtna tillsammans, med rätt vikt och mått.');note.className='muted';results.append(note);
 results.append(el('h3',needBag?'Bagagepris ej verifierat – billigaste prisuppgift först':'Billigaste prisuppgift först'));
 if(data.stage==='details'){
  if(!data.options.length)results.append(el('p','Inga säljarpriser kunde verifieras för det här valet. Öppna sökningen hos Google Flights.'));
  const affordable=withinBudget(data.options);if(data.options.length&&!affordable.length)results.append(el('p','Inga biljettpriser inom maxpriset. Höj beloppet för att visa fler, utan ny sökning.'));
  for(const o of affordable){const card=el('article',null,'flight-card');card.append(el('h3',`${o.seller||'Säljare'}${o.fare?' · '+o.fare:''}`),el('p',`${money(o.quotedPriceSEK)} · prisuppgift för två, tur och retur`));
   const feePolicies=o.baggagePolicies.length?o.baggagePolicies:(data.routeBaggagePolicies?.together||[]);card.append(el('h4','Bagageavgifter från datakällan'));if(feePolicies.length){const list=el('ul');feePolicies.forEach(policy=>list.append(el('li',baggageLabel(policy))));card.append(list);}else card.append(el('p','Ingen bagageavgift angiven i underlaget.'));for(const [key,label]of [['departing','Utresa'],['returning','Hemresa']]){const entries=data.routeBaggagePolicies?.[key]||[];if(entries.length){card.append(el('p',label));const list=el('ul');entries.forEach(policy=>list.append(el('li',baggageLabel(policy))));card.append(list);}}card.append(el('p','Avgifterna är källuppgifter, inte ett verifierat totalpris för ert bagage. Kontrollera vikt, antal personer och ut-/hemresa hos säljaren.','muted'));card.append(el('p','Pjäxväska + extra liten väska: inte bekräftat att båda ingår tillsammans.','muted'));
   o.extensions.forEach(p=>card.append(el('p',p,'muted')));results.append(card);
  }
 }else{
  if(!data.flights.length)results.append(el('p','Inga flyg hittades för dessa datum. Prova en annan flygplats eller andra datum.'));
  const affordable=withinBudget(data.flights);if(data.flights.length)results.append(el('p',`Visar ${affordable.length} av ${data.flights.length} alternativ inom maxpriset.`));if(data.flights.length&&!affordable.length)results.append(el('p','Inga flyg inom maxpriset. Höj beloppet för att visa fler, utan ny sökning.'));
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
form.addEventListener('submit',e=>{e.preventDefault();if(busy)return;const nights=(Date.parse(end.value)-Date.parse(start.value))/86400000;const max=Number(document.getElementById('nights').value);
 if(!Number.isInteger(nights)||nights<1||nights>max){status.textContent=`Välj en resa med 1–${max} nätter enligt ditt sökunderlag.`;return;}
 history=[];const query={stage:'outbound',destination:airport.value,outbound:start.value,return:end.value,direct:document.getElementById('connections').value==='direct'};if(airport.value==='all')searchAll(query);else search(query);
});
})();
