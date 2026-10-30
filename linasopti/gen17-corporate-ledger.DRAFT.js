/* Draft-only synthetic corporate ledger. No market access, no trading or historical runner. */
'use strict';
const Split=require('./gen17-split-portfolio-integration.DRAFT.js');
function create(initialCash=0){
 if(!Number.isFinite(initialCash))throw Error('INVALID_CASH');
 return {cash:initialCash,positions:[],entitlements:[],paid:[],day:null};
}
function validDate(d){
 if(typeof d!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(d))return false;
 const t=Date.parse(d+'T00:00:00Z');
 return Number.isFinite(t)&&new Date(t).toISOString().slice(0,10)===d;
}
function step(state,day,orders=[],dividends=[]){
 if(!validDate(day)||state.day&&day<=state.day)throw Error('DAY_ORDER');
 let positions=state.positions.map(p=>({...p})),cash=state.cash;
 const entitlements=state.entitlements.map(e=>({...e})),paid=[...state.paid];
 const knownIds=new Set(entitlements.map(e=>e.id));
 // Existing split adapter adjusts holdings at session open.
 positions=Split.applyDay(positions,day).positions;
 // Ex-date entitlement is based on holdings before today's trades.
 for(const d of dividends.filter(d=>d.exDate===day)){
  if(!(d.symbol&&d.id&&validDate(d.payDate)&&d.payDate>=day&&Number.isFinite(d.rate)&&d.rate>0))throw Error('INVALID_DIVIDEND');
  if(knownIds.has(d.id))throw Error('DUPLICATE_DIVIDEND');
  knownIds.add(d.id);
  const qty=positions.filter(p=>p.s===d.symbol).reduce((n,p)=>n+p.qty,0);
  const amount=qty*d.rate;
  if(!Number.isFinite(amount))throw Error('AMOUNT_OVERFLOW');
  entitlements.push({id:d.id,payDate:d.payDate,amount,qty});
 }
 for(const o of orders){
  if(!(o.s&&Number.isFinite(o.qty)&&o.qty>0&&Number.isFinite(o.price)&&o.price>0&&['buy','sell'].includes(o.side)))throw Error('INVALID_ORDER');
  const i=positions.findIndex(p=>p.s===o.s);
  if(o.side==='buy'){
   const tradeValue=o.qty*o.price;
   if(!Number.isFinite(tradeValue)||!Number.isFinite(cash-tradeValue))throw Error('AMOUNT_OVERFLOW');
   cash-=tradeValue;
   if(i<0)positions.push({s:o.s,qty:o.qty,entryPrice:o.price});
   else {const p=positions[i];const qty=p.qty+o.qty,bookValue=p.qty*p.entryPrice+tradeValue;
    if(!Number.isFinite(qty)||!Number.isFinite(bookValue)||!Number.isFinite(bookValue/qty))throw Error('AMOUNT_OVERFLOW');
    p.entryPrice=bookValue/qty;p.qty=qty;}
  }else{
   if(i<0||positions[i].qty<o.qty)throw Error('INSUFFICIENT_SHARES');
   const tradeValue=o.qty*o.price;
   if(!Number.isFinite(tradeValue)||!Number.isFinite(cash+tradeValue))throw Error('AMOUNT_OVERFLOW');
   cash+=tradeValue;positions[i].qty-=o.qty;
   if(positions[i].qty===0)positions.splice(i,1);
  }
 }
 for(const e of entitlements.filter(e=>e.payDate<=day&&!paid.includes(e.id))){
  if(!Number.isFinite(e.amount)||!Number.isFinite(cash+e.amount))throw Error('AMOUNT_OVERFLOW');
  cash+=e.amount;paid.push(e.id);
}
 return {cash,positions,entitlements,paid,day};
}
module.exports=Object.freeze({create,step});
