// Gen17 offline-only reducer. Event IDs do not prove ordering.
const timestamp=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/;
function timeKey(s){
 if(typeof s!=="string"||!timestamp.test(s))return null;
 const m=/^(.*?)(?:\.(\d{1,9}))?(Z|[+-]\d{2}:\d{2})$/.exec(s);
 const ms=Date.parse(m[1]+m[3]);if(!Number.isFinite(ms))return null;
 return new Date(ms).toISOString().slice(0,19)+"."+(m[2]||"").padEnd(9,"0");
}
export function reconstructLineage(events, targetCaId, cutoff) {
 if(!Array.isArray(events)||typeof targetCaId!=="string"||!targetCaId||typeof cutoff!=="string"||timeKey(cutoff)===null)throw Error("INVALID_INPUT");
 const limit=timeKey(cutoff);
 const relevant=events.filter(e=>e?.ca?.id===targetCaId), seen=new Map(), ordered=[];
 let duplicateCount=0,invalidCount=0,ambiguous=false,applied=0,hasInsert=false,deleted=false,state=null;
 for(const e of relevant){
  if(typeof e.event_id!=="string"||!e.event_id||typeof e.at!=="string"||timeKey(e.at)===null||!["insert","update","delete"].includes(e.action)){invalidCount++;continue}
  const t=timeKey(e.at);
  const fingerprint=JSON.stringify(e);
  if(seen.has(e.event_id)){duplicateCount++;if(seen.get(e.event_id)!==fingerprint)ambiguous=true;continue}
  seen.set(e.event_id,fingerprint);
  if(t<=limit)ordered.push({e,t});
 }
 ordered.sort((a,b)=>a.t.localeCompare(b.t));
 for(let i=1;i<ordered.length;i++)if(ordered[i].t===ordered[i-1].t)ambiguous=true;
 for(const {e} of ordered){
  if(e.action==="insert"){if(hasInsert){invalidCount++;continue}hasInsert=true;deleted=false;state=structuredClone(e.ca)}
  else if(e.action==="update"){if(!hasInsert||deleted){invalidCount++;continue}state=structuredClone(e.ca)}
  else{if(!hasInsert||deleted){invalidCount++;continue}deleted=true;state=null}
  applied++;
 }
 if(ambiguous||invalidCount)state=null;
 return {caId:targetCaId,cutoff,observedEvents:relevant.length,applied,duplicateCount,invalidCount,ambiguous,hasInsert,deleted,state,chainComplete:false,pitVerified:false,reason:ambiguous?"AMBIGUOUS_EVENT_ORDER_OR_ID":invalidCount?"INVALID_OR_MISSING_CHAIN":"RETENTION_AND_COVERAGE_UNVERIFIED"};
}
