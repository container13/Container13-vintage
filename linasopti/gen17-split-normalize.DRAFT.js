/* Draft-only split-normalized historical indicator bars; no lookahead authorization. */
'use strict';
const {events}=require('./gen17-split-accounting.DRAFT.js');
function normalizeToSession(symbol,rows,asOfDate){
 if(!Array.isArray(rows)||!asOfDate)throw Error('SPLIT_NORMALIZE_INPUT');
 const known=events.filter(e=>e.symbol===symbol&&e.date<=asOfDate).sort((a,b)=>a.date.localeCompare(b.date));
 let previous='';
 return rows.filter(r=>r.d<=asOfDate).map(r=>{
   if(typeof r.d!=='string'||r.d<=previous)throw Error('SPLIT_DATE_ORDER');
   previous=r.d;
   let factor=1;
   for(const e of known)if(r.d<e.date)factor*=e.ratio;
   const out={...r};
   for(const k of ['o','h','l','c']){
     if(!Number.isFinite(r[k])||r[k]<=0)throw Error('SPLIT_INVALID_OHLC');
     out[k]=r[k]/factor;
   }
   if(r.v!==undefined){if(!Number.isFinite(r.v)||r.v<0)throw Error('SPLIT_INVALID_VOLUME');out.v=r.v*factor;}
   return out;
 });
}
module.exports=Object.freeze({normalizeToSession});
