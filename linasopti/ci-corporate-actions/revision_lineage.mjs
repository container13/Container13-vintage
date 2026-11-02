// Gen17 offline-only reducer. Event IDs do not prove ordering.
export function reconstructLineage(events, targetCaId, cutoff) {
 if(!Array.isArray(events)||typeof targetCaId!=="string"||!targetCaId||typeof cutoff!=="string"||!Number.isFinite(Date.parse(cutoff)))throw Error("INVALID_INPUT");
 const relevant=events.filter(e=>e?.ca?.id===targetCaId), seen=new Map(), ordered=[];
 let duplicateCount=0,invalidCount=0,ambiguous=false,applied=0,hasInsert=false,deleted=false,state=null;
 for(const e of relevant){
  if(typeof e.event_id!=="string"||!e.event_id||typeof e.at!=="string"||!Number.isFinite(Date.parse(e.at))||!["insert","update","delete"].includes(e.action)){invalidCount++;continue}
  const fingerprint=JSON.stringify(e);
  if(seen.has(e.event_id)){duplicateCount++;if(seen.get(e.event_id)!==fingerprint)ambiguous=true;continue}
  seen.set(e.event_id,fingerprint);
  if(Date.parse(e.at)<=Date.parse(cutoff))ordered.push(e);
 }
 ordered.sort((a,b)=>Date.parse(a.at)-Date.parse(b.at));
 for(let i=1;i<ordered.length;i++)if(Date.parse(ordered[i].at)===Date.parse(ordered[i-1].at))ambiguous=true;
 for(const e of ordered){
  if(e.action==="insert"){if(hasInsert){invalidCount++;continue}hasInsert=true;deleted=false;state=structuredClone(e.ca)}
  else if(e.action==="update"){if(!hasInsert||deleted){invalidCount++;continue}state=structuredClone(e.ca)}
  else{if(!hasInsert||deleted){invalidCount++;continue}deleted=true;state=null}
  applied++;
 }
 if(ambiguous||invalidCount)state=null;
 return {caId:targetCaId,cutoff,observedEvents:relevant.length,applied,duplicateCount,invalidCount,ambiguous,hasInsert,deleted,state,chainComplete:false,pitVerified:false,reason:ambiguous?"AMBIGUOUS_EVENT_ORDER_OR_ID":invalidCount?"INVALID_OR_MISSING_CHAIN":"RETENTION_AND_COVERAGE_UNVERIFIED"};
}
