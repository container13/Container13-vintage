/* UI owner for staged live search; no provider credentials in browser. */
(()=>{'use strict';
const API='https://flyg-search-api.mangaj73.workers.dev';
const form=document.getElementById('liveForm'),results=document.getElementById('liveResults'),status=document.getElementById('liveStatus');
const airport=document.getElementById('liveAirport'),start=document.getElementById('liveOutbound'),end=document.getElementById('liveReturn');
let busy=false,history=[],generation=0;
const el=(tag,text,className)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;if(className)n.className=className;return n;};
const money=v=>new Intl.NumberFormat('sv-SE',{style:'currency',currency:'SEK',maximumFractionDigits:0}).format(v);
function syncAirports(){const current=airport.value;airport.replaceChildren(...[...document.getElementById('destination').options].map(o=>o.cloneNode(true)));if([...airport.options].some(o=>o.value===current))airport.value=current;}
syncAirports();airport.value=document.getElementById('destination').value;
document.querySelectorAll('[name=profile]').forEach(r=>r.addEventListener('change',syncAirports));
document.getElementById('destination').addEventListener('change',e=>{airport.value=e.target.value;});
function datesFromWeek(){if(start.dataset.edited)return;const year=Number(document.getElementById('year').value),week=Number(document.querySelector('#weeks input:checked')?.value||11);const jan=new Date(Date.UTC(year,0,4));jan.setUTCDate(jan.getUTCDate()-(jan.getUTCDay()+6)%7+(week-1)*7-1);start.value=jan.toISOString().slice(0,10);jan.setUTCDate(jan.getUTCDate()+Number(document.getElementById('nights').value||4));end.value=jan.toISOString().slice(0,10);}
datesFromWeek();start.addEventListener('input',()=>{start.dataset.edited='true';});end.addEventListener('input',()=>{start.dataset.edited='true';});
document.getElementById('weeks').addEventListener('change',datesFromWeek);document.getElementById('year').addEventListener('change',datesFromWeek);
function button(text,action){const b=el('button',text);b.type='button';b.addEventListener('click',action);return b;}
function setBusy(value){busy=value;form.setAttribute('aria-busy',String(value));document.getElementById('liveSearch').disabled=value;results.querySelectorAll('button').forEach(b=>b.disabled=value);}
const errors={ACCOUNT_HTTP_403:'Datakällan nekar servern åtkomst till kontokontrollen (403).',ACCOUNT_HTTP_401:'Datakällan godkänner inte den sparade nyckeln.',SEARCH_HTTP_403:'Datakällan nekar servern åtkomst till flygsökningen (403).',SEARCH_HTTP_429:'Datakällans anropsgräns är nådd. Försök igen senare.',APP_QUOTA_REACHED:'Appens gratiskvot är nådd. Försök igen senare; ingen betaltjänst aktiveras.',FREE_QUOTA_UNAVAILABLE:'Datakällans gratiskvot är slut eller gratisvillkoret kan inte bekräftas.',SELECTION_EXPIRED:'Valet har gått ut. Starta en ny sökning.',PROVIDER_UNAVAILABLE:'Datakällan svarade inte. Försök igen senare.',INVALID_DATES:'Kontrollera datumen. Hemresan ska vara efter utresan, inom 30 nätter och högst ett år framåt.',SEARCH_NOT_ENABLED:'Livesökningen är inte aktiverad ännu.'};
async function requestData(query){
 const r=await fetch(API+'/search',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(query),cache:'no-store',credentials:'omit',signal:AbortSignal.timeout(90000)});
 const data=await r.json();if(!r.ok||data.error)throw new Error(data.error||'SEARCH_FAILED');return data;
}
async function search(query){
 if(busy)return;if(!navigator.onLine){status.textContent='Du är offline. Sökunderlaget fungerar, men aktuella flyg behöver internet.';return;}
 setBusy(true);status.textContent='Hämtar flyg…';const active=++generation;
 try{
  const data=await requestData(query);
  if(active!==generation)return;history.push(data);render(data);status.textContent=data.cached?'Tidigare hämtat resultat återanvänds.':'Flyguppgifter hämtade.';
 }catch(e){status.textContent=errors[e.message]||'Sökningen kunde inte slutföras. Dina tidigare resultat finns kvar. Försök igen senare.';}
 finally{setBusy(false);}
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
function segments(card,flight){for(const s of flight.segments){card.append(el('p',`${s.origin||'?'} → ${s.destination||'?'} · ${s.number||s.airline||'Flyg'}`),el('p',`${s.departureLocal||'?'} → ${s.arrivalLocal||'?'} (lokala tider)`,'muted'));}}
function render(data){
 results.replaceChildren();const titles={outbound:'Välj utresa',returns:'Välj hemresa',details:'Biljettpris och villkor'};
 results.append(el('h3',titles[data.stage]),el('p',`ARN ↔ ${data.context.selectedDestination||data.context.destination} · ${data.context.outbound}–${data.context.return} · 2 vuxna`));
 if(history.length>1)results.append(button('Tillbaka till föregående val',()=>{if(!busy){history.pop();render(history.at(-1));}}));
 const h=history.find(x=>x.stage==='outbound');if(data.stage!=='outbound'&&h)results.append(el('p','Retur och villkor gäller den utresa du valt.','muted'));
 if(data.coverage){const c=data.coverage;results.append(el('p',`Sökta flygplatser: ${c.completed.join(', ')||'inga'}`,'muted'));if(c.failed.length)results.append(el('p',`Resultat saknas för: ${c.failed.join(', ')}.`));if(c.unsearched.length)results.append(el('p',`Inte sökta: ${c.unsearched.join(', ')}.`));if(data.stopReason)results.append(el('p',data.stopReason));}
 const needBag=Number(document.getElementById('baggage').value)>0;
 const note=el('p',needBag?'Bagagepris ej verifierat. Priserna ska inte jämföras som kompletta totalpriser med incheckat bagage.':'Kontrollera handbagagets villkor hos säljaren.');note.className='muted';results.append(note);
 results.append(el('h3',needBag?'Bagagepris ej verifierat – billigaste prisuppgift först':'Billigaste prisuppgift först'));
 if(data.stage==='details'){
  if(!data.options.length)results.append(el('p','Inga säljarpriser kunde verifieras för det här valet. Öppna sökningen hos Google Flights.'));
  for(const o of [...data.options].sort((a,b)=>a.quotedPriceSEK-b.quotedPriceSEK)){const card=el('article',null,'flight-card');card.append(el('h3',`${o.seller||'Säljare'}${o.fare?' · '+o.fare:''}`),el('p',`${money(o.quotedPriceSEK)} · prisuppgift för två, tur och retur`));
   if(o.baggagePolicies.length){card.append(el('p','Bagage enligt datakällan:'));const list=el('ul');o.baggagePolicies.forEach(p=>list.append(el('li',p)));card.append(list);}
   o.extensions.forEach(p=>card.append(el('p',p,'muted')));results.append(card);
  }
 }else{
  if(!data.flights.length)results.append(el('p','Inga flyg hittades för dessa datum. Prova en annan flygplats eller andra datum.'));
  for(const f of [...data.flights].sort((a,b)=>a.quotedPriceSEK-b.quotedPriceSEK)){const card=el('article',null,'flight-card');segments(card,f);card.append(el('p',`${money(f.quotedPriceSEK)} · prisuppgift för två, tur och retur`),el('p',data.stage==='outbound'?'Preliminärt tills hemresan är vald.':'Kontrollera biljettvillkoren i nästa steg.','muted'));
   if(f.selection)card.append(button(data.stage==='outbound'?'Välj utresa':'Visa biljettvillkor',()=>search({stage:data.stage==='outbound'?'returns':'details',selection:f.selection})));
   results.append(card);
  }
 }
 const q=`Flights from ARN to ${data.context.selectedDestination||data.coverage?.requested.join(',')||data.context.destination} on ${data.context.outbound} returning ${data.context.return} for 2 adults`;
 const link=el('a','Öppna samma datum och sträcka i Google Flights');link.href='https://www.google.com/travel/flights?hl=sv&curr=SEK&q='+encodeURIComponent(q);link.target='_blank';link.rel='noopener noreferrer';results.append(link);
 results.append(el('p',`Hämtat ${new Date(data.fetchedAt).toLocaleString('sv-SE')}. Källan kan återanvända upp till en timme gamla uppgifter. Priset bekräftas hos säljaren.`,'muted'));
 results.append(el('p','Transfer, hotellankomst och hela skiddagar är ännu inte verifierade för dessa flyg.','muted'));
}
form.addEventListener('submit',e=>{e.preventDefault();if(busy)return;const nights=(Date.parse(end.value)-Date.parse(start.value))/86400000;const max=Number(document.getElementById('nights').value);
 if(!Number.isInteger(nights)||nights<1||nights>max){status.textContent=`Välj en resa med 1–${max} nätter enligt ditt sökunderlag.`;return;}
 history=[];const query={stage:'outbound',destination:airport.value,outbound:start.value,return:end.value,direct:document.getElementById('connections').value==='direct'};if(airport.value==='all')searchAll(query);else search(query);
});
})();
