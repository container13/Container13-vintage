/* Flyg journey evaluator: only evaluates supplied, verified timetable data. No live data here. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.FlygJourney=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
function validIso(s){return typeof s==='string'&&/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:Z|[+-]\d\d:\d\d)$/.test(s)&&Number.isFinite(Date.parse(s));}
function minutes(a,b){return (Date.parse(b)-Date.parse(a))/60000;}
function evaluate(itinerary,requirements){
 const errors=[];if(!itinerary||!requirements)return {status:'UNKNOWN',reasons:['Flyg- och reseunderlag saknas']};
 const segments=itinerary.flights;if(!Array.isArray(segments)||!segments.length)return {status:'UNKNOWN',reasons:['Verifierade flygsegment saknas']};
 if(!segments.every(s=>s&&validIso(s.departure)&&validIso(s.arrival)&&s.origin&&s.destination))return {status:'UNKNOWN',reasons:['Flygtider med tidszon eller flygplatser saknas']};
 if(segments[0].origin!=='ARN')return {status:'REJECTED',reasons:['Utresan måste börja på Arlanda']};
 for(let i=0;i<segments.length;i++){if(minutes(segments[i].departure,segments[i].arrival)<=0)errors.push('Ogiltig flygtid');if(i&&segments[i-1].destination!==segments[i].origin)errors.push('Flygsegmenten ansluter inte');if(i&&minutes(segments[i-1].arrival,segments[i].departure)<0)errors.push('Överlappande flygsegment');}
 if(errors.length)return {status:'REJECTED',reasons:errors};
 const stops=segments.length-1;if(requirements.allowConnections===false&&stops>0)return {status:'REJECTED',reasons:['Mellanlandning är inte tillåten']};
 if(requirements.maxStops!=null&&stops>requirements.maxStops)return {status:'REJECTED',reasons:['För många mellanlandningar']};
 const transfer=itinerary.groundTransfer;
 if(!transfer||transfer.verified!==true||!validIso(transfer.hotelArrival)||!validIso(transfer.departure)||transfer.fromAirport!==segments[segments.length-1].destination)return {status:'UNKNOWN',reasons:['Verifierad transfer och hotellankomst saknas']};
 if(minutes(segments[segments.length-1].arrival,transfer.departure)<0||minutes(transfer.departure,transfer.hotelArrival)<0)return {status:'REJECTED',reasons:['Transferns tider är orimliga']};
 if(!validIso(requirements.hotelDeadline))return {status:'UNKNOWN',reasons:['Hotellets sista ankomsttid med datum och tidszon saknas']};
 if(minutes(transfer.hotelArrival,requirements.hotelDeadline)<0)return {status:'REJECTED',reasons:['Ankomst till hotellet efter tidsgränsen'],hotelArrival:transfer.hotelArrival,stops};
 const baggage=itinerary.baggage;if(requirements.checkedBagKg>0){if(!baggage||baggage.verified!==true||!Number.isFinite(baggage.kgPerPerson))return {status:'UNKNOWN',reasons:['Verifierat incheckat bagage för båda saknas']};if(baggage.kgPerPerson<requirements.checkedBagKg)return {status:'REJECTED',reasons:['Otillräckligt incheckat bagage']};}
 if(!Number.isFinite(itinerary.totalPriceForTwoIncludingRequiredBaggage)||itinerary.totalPriceForTwoIncludingRequiredBaggage<0)return {status:'UNKNOWN',reasons:['Verifierat totalpris för två inklusive nödvändigt bagage saknas']};
 return {status:'ELIGIBLE',reasons:[],hotelArrival:transfer.hotelArrival,stops,totalTravelMinutes:minutes(segments[0].departure,transfer.hotelArrival),totalPriceForTwo:itinerary.totalPriceForTwoIncludingRequiredBaggage};
}
// Reject known timetable violations before offering a live itinerary.
// Local times are compared only at the same airport or against its local cutoff.
// Passing this check never establishes a verified ground transfer or hotel arrival.
function checkSchedule(flight,requirements){
 const segments=flight?.segments;
 const rejected=reason=>({status:'REJECTED',reasons:[reason]});
 const unknown=reason=>({status:'UNKNOWN',reasons:[reason]});
 if(!Array.isArray(segments)||!segments.length)return unknown('Flygtider saknas');
 const local=value=>{
  if(typeof value!=='string'||!/^\d{4}-\d\d-\d\d[ T]\d\d:\d\d$/.test(value))return null;
  const normalized=value.replace(' ','T'),stamp=Date.parse(normalized+':00Z');
  return Number.isFinite(stamp)&&new Date(stamp).toISOString().slice(0,16)===normalized?{date:normalized.slice(0,10),time:normalized.slice(11),stamp}:null;
 };
 if(requirements.allowConnections===false&&segments.length>1)return rejected('Mellanlandning är inte tillåten');
 for(let i=1;i<segments.length;i++){
  const previous=segments[i-1],current=segments[i];
  if(!previous.destination||previous.destination!==current.origin)return rejected('Flygplatsbyte mellan flygen');
  const arrival=local(previous.arrivalLocal),departure=local(current.departureLocal);
  if(!arrival||!departure)return unknown('Mellanlandningens tider saknas');
  const wait=(departure.stamp-arrival.stamp)/60000;
  if(wait<0)return rejected('Flygsegmentens tider överlappar');
  if(Number.isFinite(requirements.maxLayoverMinutes)&&wait>requirements.maxLayoverMinutes)return rejected('För lång väntan vid mellanlandning');
 }
 if(requirements.stage==='outbound'){
  const arrival=local(segments.at(-1).arrivalLocal);
  if(!arrival||!/^\d{4}-\d\d-\d\d$/.test(requirements.outbound||''))return unknown('Ankomstdatum eller flygtid saknas');
  if(arrival.date!==requirements.outbound)return rejected('Ankomst är inte på avresedagen');
  if(!/^\d\d:\d\d$/.test(requirements.hotelCutoff||'')||!/^\d\d:\d\d$/.test(requirements.airportCutoff||''))return unknown('Ankomstgräns saknas');
  if(arrival.time>=requirements.hotelCutoff)return rejected('Flyget landar för sent för hotellets ankomstgräns');
  if(arrival.time>requirements.airportCutoff)return rejected('Flyget landar efter vald flygplatsankomst');
 }
 return {status:'NOT_REJECTED',reasons:[],hotelArrivalStatus:'UNVERIFIED'};
}
function weekWindow(year,week,nights){
 if(!Number.isInteger(year)||year<2026||year>2100||!Number.isInteger(week)||week<1||!Number.isInteger(nights)||nights<1||nights>30)throw new RangeError('Ogiltig vecka eller antal nätter');
 const monday=y=>{const d=new Date(Date.UTC(y,0,4));d.setUTCDate(d.getUTCDate()-(d.getUTCDay()+6)%7);return d;};
 const mon=monday(year),next=monday(year+1);if(week>(next-mon)/604800000)throw new RangeError('Veckan finns inte det året');
 mon.setUTCDate(mon.getUTCDate()+(week-1)*7);const day=offset=>new Date(mon.getTime()+offset*86400000).toISOString().slice(0,10);
 return {from:day(-2),to:day(6),monday:day(0),firstReturn:day(-2+nights),nights};
}
return Object.freeze({evaluate,weekWindow,checkSchedule});
});

