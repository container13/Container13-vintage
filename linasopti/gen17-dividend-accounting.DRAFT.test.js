/* Synthetic dividend entitlement/payment regression; draft-only, no market calls. */
'use strict';
const assert=require('node:assert/strict');
function iso(s){if(typeof s!=='string'||!/^\d{4}-\d\d-\d\d$/.test(s)||new Date(s+'T00:00:00Z').toISOString().slice(0,10)!==s)throw Error('BAD_DATE');return s;}
function entitlement({symbol,exDate,payDate,amountPerShare,positions}){
 iso(exDate);iso(payDate);if(payDate<exDate)throw Error('PAY_BEFORE_EX');
 if(!symbol||!(Number.isFinite(amountPerShare)&&amountPerShare>0))throw Error('BAD_DIVIDEND');
 const eligible=positions.filter(p=>p.symbol===symbol&&iso(p.date)<exDate).at(-1);
 const qty=eligible?.qty||0;
 if(!(Number.isFinite(qty)&&qty>=0))throw Error('BAD_QTY');
 return Object.freeze({symbol,exDate,payDate,qty,amount:qty*amountPerShare,key:symbol+':'+exDate+':'+payDate});
}
function settle(e,day,ledger){iso(day);if(day<e.payDate)return 0;if(ledger.has(e.key))throw Error('DIVIDEND_DUPLICATE');ledger.add(e.key);return e.amount;}
const snapshots=[{symbol:'SPY',date:'2024-03-14',qty:10},{symbol:'SPY',date:'2024-03-15',qty:0}];
const e=entitlement({symbol:'SPY',exDate:'2024-03-15',payDate:'2024-03-20',amountPerShare:1.5,positions:snapshots});
assert.equal(e.qty,10);assert.equal(e.amount,15);
const ledger=new Set();assert.equal(settle(e,'2024-03-19',ledger),0);assert.equal(ledger.size,0);
assert.equal(settle(e,'2024-03-20',ledger),15);
assert.throws(()=>settle(e,'2024-03-21',ledger),/DIVIDEND_DUPLICATE/);
const boughtOnEx=entitlement({symbol:'SPY',exDate:'2024-03-15',payDate:'2024-03-20',amountPerShare:1.5,positions:[{symbol:'SPY',date:'2024-03-15',qty:10}]});
assert.equal(boughtOnEx.amount,0);
assert.throws(()=>entitlement({symbol:'SPY',exDate:'2024-03-15',payDate:'2024-03-14',amountPerShare:1,positions:[]}),/PAY_BEFORE_EX/);
console.log('PASS_GEN17_SYNTHETIC_DIVIDEND_ENTITLEMENT_PAYMENT');
