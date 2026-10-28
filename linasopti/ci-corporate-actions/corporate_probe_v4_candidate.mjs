// Offline-only V4 candidate. Never proves historical availability.
import {classifyEvent as v3} from './corporate_probe_v3_1.mjs';
export function classifyEventV4(kind,event){
 const result=v3(kind,event);
 if(result.status!=='validated')return result;
 if(typeof event.id!=='string'||event.id.trim().length===0)return {status:'incomplete',reason:'MISSING_ID'};
 if(kind==='forward_splits'&&(typeof event.cusip!=='string'||event.cusip.trim().length===0))return {status:'incomplete',reason:'MISSING_CUSIP'};
 return {status:'validated'};
}
