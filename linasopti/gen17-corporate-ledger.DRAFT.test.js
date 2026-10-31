'use strict';
const assert=require('node:assert/strict');
const {create,step}=require('./gen17-corporate-ledger.DRAFT.js');
let s=create(2000);
s=step(s,'2020-08-28',[{side:'buy',s:'TSLA',qty:2,price:500}]);
s=step(s,'2020-08-31');assert.equal(s.positions[0].qty,10);
s=step(s,'2022-08-24',[],[{id:'div1',symbol:'TSLA',exDate:'2022-08-24',payDate:'2022-09-01',rate:3}]);
assert.equal(s.entitlements[0].amount,30);
s=step(s,'2022-08-25',[{side:'sell',s:'TSLA',qty:30,price:110}]);
assert.equal(s.positions.length,0);
assert.equal(s.cash,4300);
s=step(s,'2022-08-31');assert.equal(s.cash,4300);
s=step(s,'2022-09-01');assert.equal(s.cash,4330);
assert.equal(s.paid.length,1);
assert.throws(()=>step(s,'2022-09-01'),/DAY_ORDER/);
assert.equal(s.entitlements[0].qty,10);
let delayed=create(100);delayed=step(delayed,'2024-01-02',[{side:'buy',s:'SPY',qty:2,price:10}]);delayed=step(delayed,'2024-01-03',[],[{id:'weekend-pay',symbol:'SPY',exDate:'2024-01-03',payDate:'2024-01-06',rate:2}]);delayed=step(delayed,'2024-01-08');assert.equal(delayed.cash,84);assert.deepEqual(delayed.paid,['weekend-pay']);
// A buy on ex-date cannot create entitlement for that same distribution.
let exBuy=create(100);
exBuy=step(exBuy,'2024-02-05',[{side:'buy',s:'SPY',qty:2,price:10}],[{id:'ex-buy',symbol:'SPY',exDate:'2024-02-05',payDate:'2024-02-07',rate:2}]);
assert.equal(exBuy.entitlements[0].amount,0);
exBuy=step(exBuy,'2024-02-07');assert.equal(exBuy.cash,80);
// A sale on ex-date must not erase entitlement from the prior close.
let exSell=create(100);
exSell=step(exSell,'2024-02-02',[{side:'buy',s:'SPY',qty:2,price:10}]);
exSell=step(exSell,'2024-02-05',[{side:'sell',s:'SPY',qty:2,price:11}],[{id:'ex-sell',symbol:'SPY',exDate:'2024-02-05',payDate:'2024-02-07',rate:2}]);
assert.equal(exSell.entitlements[0].amount,4);
exSell=step(exSell,'2024-02-07');assert.equal(exSell.cash,106);
// Invalid trades must reject without mutating the previous state.
const snapshot=JSON.stringify(exSell);
assert.throws(()=>step(exSell,'2024-02-08',[{side:'sell',s:'SPY',qty:1,price:10}]),/INSUFFICIENT_SHARES/);
assert.throws(()=>step(exSell,'2024-02-08',[{side:'buy',s:'SPY',qty:-1,price:10}]),/INVALID_ORDER/);
assert.equal(JSON.stringify(exSell),snapshot);
// Duplicate distribution IDs must not be accepted on the same ex-date.
assert.throws(()=>step(exSell,'2024-02-08',[],[
 {id:'duplicate',symbol:'SPY',exDate:'2024-02-08',payDate:'2024-02-09',rate:1},
 {id:'duplicate',symbol:'SPY',exDate:'2024-02-08',payDate:'2024-02-09',rate:1}
]),/DUPLICATE_DIVIDEND/);
assert.throws(()=>step(exSell,'2024-02-08',[],[
 {id:'bad-date',symbol:'SPY',exDate:'2024-02-08',payDate:'2024-02-07',rate:1}
]),/INVALID_DIVIDEND/);
// Two distributions for one symbol retain distinct entitlements and payment IDs.
let multi=create(100);
multi=step(multi,'2024-03-01',[{side:'buy',s:'SPY',qty:2,price:10}]);
multi=step(multi,'2024-03-04',[],[
 {id:'spy-march-a',symbol:'SPY',exDate:'2024-03-04',payDate:'2024-03-07',rate:1},
 {id:'spy-march-b',symbol:'SPY',exDate:'2024-03-04',payDate:'2024-03-08',rate:1.5}
]);
assert.deepEqual(multi.entitlements.map(e=>e.amount),[2,3]);
multi=step(multi,'2024-03-07');assert.equal(multi.cash,82);
multi=step(multi,'2024-03-08');assert.equal(multi.cash,85);
assert.deepEqual(multi.paid,['spy-march-a','spy-march-b']);
multi=step(multi,'2024-03-11');assert.equal(multi.cash,85);
// Reusing an event ID on a later ex-date is rejected.
assert.throws(()=>step(multi,'2024-03-12',[],[
 {id:'spy-march-a',symbol:'SPY',exDate:'2024-03-12',payDate:'2024-03-14',rate:1}
]),/DUPLICATE_DIVIDEND/);
// A rejected batch must not mutate the caller's existing ledger.
const beforeRejected=JSON.stringify(multi);
assert.throws(()=>step(multi,'2024-03-12',[
 {side:'buy',s:'SPY',qty:1,price:10},
 {side:'sell',s:'SPY',qty:999,price:10}
]),/INSUFFICIENT_SHARES/);
assert.equal(JSON.stringify(multi),beforeRejected);
// Calendar validation must reject impossible dates without mutating state.
const dateSnapshot=JSON.stringify(multi);
assert.throws(()=>step(multi,'2024-02-30'),/DAY_ORDER/);
assert.throws(()=>step(multi,'2024-03-12',[],[{id:'bad-calendar',symbol:'SPY',exDate:'2024-03-12',payDate:'2024-02-30',rate:1}]),/INVALID_DIVIDEND/);
assert.equal(JSON.stringify(multi),dateSnapshot);
// Overflow must reject without changing previously committed state.
const overflowSnapshot=JSON.stringify(multi);
assert.throws(()=>step(multi,'2024-03-12',[{side:'buy',s:'HUGE',qty:1e308,price:1e308}]),/AMOUNT_OVERFLOW/);
assert.throws(()=>step(multi,'2024-03-12',[],[{id:'huge-div',symbol:'SPY',exDate:'2024-03-12',payDate:'2024-03-13',rate:1e308}]),/AMOUNT_OVERFLOW/);
assert.equal(JSON.stringify(multi),overflowSnapshot);
// Cash-only mode rejects unfunded buys and preserves the prior ledger.
let funded=create(100);
const cashSnapshot=JSON.stringify(funded);
assert.throws(()=>step(funded,'2024-04-01',[{side:'buy',s:'SPY',qty:11,price:10}]),/INSUFFICIENT_CASH/);
assert.equal(JSON.stringify(funded),cashSnapshot);
funded=step(funded,'2024-04-01',[{side:'buy',s:'SPY',qty:10,price:10}]);
assert.equal(funded.cash,0);
assert.throws(()=>step(funded,'2024-04-02',[{side:'buy',s:'SPY',qty:1,price:10}]),/INSUFFICIENT_CASH/);
// A batch with enough cash for only its first order must be atomic.
let batchCash=create(100);
const batchCashBefore=JSON.stringify(batchCash);
assert.throws(()=>step(batchCash,'2024-04-03',[
 {side:'buy',s:'SPY',qty:6,price:10},
 {side:'buy',s:'NVDA',qty:5,price:10}
]),/INSUFFICIENT_CASH/);
assert.equal(JSON.stringify(batchCash),batchCashBefore);
// Same-day sale proceeds can fund a later buy in the explicitly ordered batch.
batchCash=step(batchCash,'2024-04-03',[{side:'buy',s:'SPY',qty:10,price:10}]);
batchCash=step(batchCash,'2024-04-04',[
 {side:'sell',s:'SPY',qty:5,price:10},
 {side:'buy',s:'NVDA',qty:5,price:10}
]);
assert.equal(batchCash.cash,0);
assert.equal(batchCash.positions.find(p=>p.s==='NVDA').qty,5);
console.log('PASS_GEN17_SYNTHETIC_CORPORATE_LEDGER_CHAIN');
