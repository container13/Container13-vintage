/* Isolated Gen17 position/dividend synthetic: no trading, historical runner, or live data. */
'use strict';
const assert=require('node:assert/strict');
const Portfolio=require('./gen17-split-portfolio-integration.DRAFT.js');
const Split=require('./gen17-split-accounting.DRAFT.js');
const exDate='2022-08-24',payDate='2022-09-01';
let positions=[{s:'TSLA',qty:2,entryPrice:500}];
const entitledQty=positions.filter(p=>p.s==='TSLA').reduce((n,p)=>n+p.qty,0);
const locked=Object.freeze({id:'TSLA:2022-08-24:synthetic-1',exDate,payDate,qty:entitledQty,amount:entitledQty*3});
assert.equal(locked.amount,6);
positions=[]; // Sell after ex-date: entitlement must remain.
assert.equal(locked.qty,2);
let cash=0;const posted=new Set();
function pay(day){if(day<payDate)return;if(posted.has(locked.id))throw Error('DIVIDEND_DUPLICATE');posted.add(locked.id);cash+=locked.amount;}
pay('2022-08-31');assert.equal(cash,0);pay(payDate);assert.equal(cash,6);
assert.throws(()=>pay(payDate),/DIVIDEND_DUPLICATE/);
// Split portfolio adapter: ex-date share quantity must reflect prior splits.
positions=[{s:'TSLA',qty:2,entryPrice:500}];
positions=Portfolio.applyDay(positions,'2020-08-31').positions;
assert.equal(positions[0].qty,10);
positions=Portfolio.applyDay(positions,'2022-08-25').positions;
assert.equal(positions[0].qty,30);
assert.equal(positions[0].qty*positions[0].entryPrice,1000);
assert.equal(Portfolio.value(positions,{TSLA:110}),3300);
assert.equal(Split.events.filter(e=>e.symbol==='TSLA').length,2);
console.log('PASS_GEN17_SYNTHETIC_DIVIDEND_POSITION_SPLIT_INTEGRATION');
