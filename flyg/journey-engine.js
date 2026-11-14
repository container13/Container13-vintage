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
function weekWindow(year,week,nights){
 if(!Number.isInteger(year)||year<2026||year>2100||!Number.isInteger(week)||week<1||!Number.isInteger(nights)||nights<1||nights>30)throw new RangeError('Ogiltig vecka eller antal nätter');
 const monday=y=>{const d=new Date(Date.UTC(y,0,4));d.setUTCDate(d.getUTCDate()-(d.getUTCDay()+6)%7);return d;};
 const mon=monday(year),next=monday(year+1);if(week>(next-mon)/604800000)throw new RangeError('Veckan finns inte det året');
 mon.setUTCDate(mon.getUTCDate()+(week-1)*7);const day=offset=>new Date(mon.getTime()+offset*86400000).toISOString().slice(0,10);
 return {from:day(-2),to:day(6),monday:day(0),firstReturn:day(-2+nights),nights};
}
return Object.freeze({evaluate,weekWindow});
});
