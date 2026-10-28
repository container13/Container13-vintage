// Offline-only V4 candidate. Never proves historical availability.
import {classifyEvent as v3} from './corporate_probe_v3_1.mjs';
export function classifyEventV4(kind,event){
 const result=v3(kind,event);
 if(result.status!=='validated')return result;
 if(typeof event.id!=='string'||event.id.trim().length===0)return {status:'incomplete',reason:'MISSING_ID'};
 if(kind==='forward_splits'&&(typeof event.cusip!=='string'||event.cusip.trim().length===0))return {status:'incomplete',reason:'MISSING_CUSIP'};
 return {status:'validated'};
}

export async function inspectV4Pages(pages){
 const counts={validated:{forward_splits:0,cash_dividends:0},incomplete:{forward_splits:0,cash_dividends:0}};
 const seen=new Set();let expected=null;
 if(!Array.isArray(pages)||pages.length===0||pages.length>5)return {ok:false,error:'PAGE_COUNT'};
 for(let i=0;i<pages.length;i++){
  const page=pages[i];
  if(!page||typeof page!=='object'||Array.isArray(page)||!page.corporate_actions||typeof page.corporate_actions!=='object'||Array.isArray(page.corporate_actions))return {ok:false,error:'SCHEMA'};
  if(i>0&&expected===null)return {ok:false,error:'EXTRA_PAGE'};
  for(const kind of Object.keys(page.corporate_actions))if(!['forward_splits','cash_dividends'].includes(kind))return {ok:false,error:'UNKNOWN_TYPE'};
  for(const kind of ['forward_splits','cash_dividends']){
   const rows=page.corporate_actions[kind]??[];
   if(!Array.isArray(rows))return {ok:false,error:'SCHEMA'};
   for(const row of rows){
    const result=classifyEventV4(kind,row);
    if(result.status==='invalid')return {ok:false,error:'INVALID_EVENT'};
    counts[result.status][kind]++;
   }
  }
  const next=page.next_page_token;
  if(next==null||next===''){expected=null;if(i!==pages.length-1)return {ok:false,error:'EXTRA_PAGE'};}
  else if(typeof next!=='string'||next.length>1024||seen.has(next))return {ok:false,error:'TOKEN'};
  else {seen.add(next);expected=next;}
 }
 if(expected!==null)return {ok:false,error:'TRUNCATED'};
 return {ok:true,complete:true,counts,semanticCheck:'STRUCTURAL_ONLY_NOT_POINT_IN_TIME'};
}
