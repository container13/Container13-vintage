/* Draft-only synthetic corporate ledger. No market access, no trading or historical runner. */
'use strict';
const Split=require('./gen17-split-portfolio-integration.DRAFT.js');
function create(initialCash=0){
 if(!Number.isFinite(initialCash))throw Error('INVALID_CASH');
 return {cash:initialCash,positions:[],entitlements:[],paid:[],day:null};
}
function step(state,day,orders=[],dividends=[]){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||state.day&&day<=state.day)throw Error('DAY_ORDER');
 let positions=state.positions.map(p=>({...p})),cash=state.cash;
 const entitlements=state.entitlements.map(e=>({...e})),paid=[...state.paid];
 // Existing split adapter adjusts holdings at session open.
 positions=Split.applyDay(positions,day).positions;
 // Ex-date entitlement is based on holdings before today's trades.
 for(const d of dividends.filter(d=>d.exDate===day)){
  if(!(d.symbol&&d.id&&d.payDate>=day&&Number.isFinite(d.rate)&&d.rate>0))throw Error('INVALID_DIVIDEND');
  if(entitlements.some(e=>e.id===d.id))throw Error('DUPLICATE_DIVIDEND');
  const qty=positions.filter(p=>p.s===d.symbol).reduce((n,p)=>n+p.qty,0);
  entitlements.push({id:d.id,payDate:d.payDate,amount:qty*d.rate,qty});
 }
 for(const o of orders){
  if(!(o.s&&Number.isFinite(o.qty)&&o.qty>0&&Number.isFinite(o.price)&&o.price>0&&['buy','sell'].includes(o.side)))throw Error('INVALID_ORDER');
  const i=positions.findIndex(p=>p.s===o.s);
  if(o.side==='buy'){
   cash-=o.qty*o.price;
   if(i<0)positions.push({s:o.s,qty:o.qty,entryPrice:o.price});
   else {const p=positions[i];p.entryPrice=(p.qty*p.entryPrice+o.qty*o.price)/(p.qty+o.qty);p.qty+=o.qty;}
  }else{
   if(i<0||positions[i].qty<o.qty)throw Error('INSUFFICIENT_SHARES');
   cash+=o.qty*o.price;positions[i].qty-=o.qty;
   if(positions[i].qty===0)positions.splice(i,1);
  }
 }
 for(const e of entitlements.filter(e=>e.payDate===day&&!paid.includes(e.id))){cash+=e.amount;paid.push(e.id);}
 return {cash,positions,entitlements,paid,day};
}
module.exports=Object.freeze({create,step});
