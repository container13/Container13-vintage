// Offline-only, bounded SSE frame parser for a single corporate-action ID.
// No provider credentials, fetch, Worker routes, or persistence.
import {reconstructLineage} from "./revision_lineage.mjs";
const MAX_BYTES=65536,MAX_EVENTS=20;
export function inspectLineageSse(chunks,{caId,cutoff,upstreamComplete=false}={}){
 if(typeof caId!=="string"||!caId||typeof cutoff!=="string"||!Array.isArray(chunks))throw Error("INVALID_INPUT");
 const decoder=new TextDecoder("utf-8",{fatal:true});
 let buffer="",bytes=0,events=0,malformed=0,stopReason="EOF",frames=[];
 const readFrame=(block)=>{
  const data=block.split(/\r?\n/).filter(l=>l.startsWith("data:")).map(l=>l.slice(5).trimStart()).join("\n");
  if(!data)return;
  events++;
  try{const e=JSON.parse(data);if(e?.ca?.id===caId)frames.push(e)}catch{malformed++}
 };
 for(const chunk of chunks){
  if(!(typeof chunk==="string"||chunk instanceof Uint8Array))throw Error("INVALID_CHUNK");
  const raw=typeof chunk==="string"?new TextEncoder().encode(chunk):chunk;
  bytes+=raw.byteLength;
  if(bytes>MAX_BYTES){stopReason="BYTE_LIMIT";break}
  try{buffer+=decoder.decode(raw,{stream:true})}catch{stopReason="INVALID_UTF8";break}
  let match;
  while((match=/\r?\n\r?\n/.exec(buffer))){
   const frame=buffer.slice(0,match.index);
   buffer=buffer.slice(match.index+match[0].length);
   readFrame(frame);
   if(events>=MAX_EVENTS){stopReason="EVENT_LIMIT";break}
  }
  if(stopReason!=="EOF")break;
 }
 if(stopReason==="EOF")try{buffer+=decoder.decode()}catch{stopReason="INVALID_UTF8"}
 if(stopReason==="EOF"&&buffer.trim())stopReason="PARTIAL_FRAME";
 const lineage=reconstructLineage(frames,caId,cutoff);
 const evidenceUsable=stopReason==="EOF"&&malformed===0&&upstreamComplete;
 if(!evidenceUsable)lineage.state=null;
 return {caId,cutoff,bytes,events,matchedEvents:frames.length,malformed,stopReason,streamComplete:evidenceUsable, ...lineage,chainComplete:false,pitVerified:false,warning:"A bounded SSE window cannot establish historical retention or first availability."};
}
