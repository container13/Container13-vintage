/* Gen17 synthetic-only split signal/position integration. Never trades. */
'use strict';
const assert=require('node:assert/strict');
const {normalizeToSession}=require('./gen17-split-normalize.DRAFT.js');
const {events,apply}=require('./gen17-split-accounting.DRAFT.js');
const rows=[
 {d:'2020-08-28',o:500,h:510,l:490,c:500,v:100},
 {d:'2020-08-31',o:100,h:102,l:98,c:100,v:500},
 {d:'2022-08-24',o:300,h:306,l:294,c:300,v:100},
 {d:'2022-08-25',o:100,h:102,l:98,c:100,v:300},
 {d:'2022-08-26',o:110,h:112,l:108,c:110,v:320}
];
const original=JSON.stringify(rows);
assert.equal(normalizeToSession('TSLA',rows,'2020-08-28')[0].c,500);
assert.equal(normalizeToSession('TSLA',rows,'2020-08-31')[0].c,100);
assert.equal(normalizeToSession('TSLA',rows,'2022-08-26')[0].c,500/15);
let position={s:'TSLA',qty:2,entryPrice:500};
for(const event of events.filter(e=>e.symbol==='TSLA')){
 position=apply(position,event);
 assert.ok(Math.abs(position.qty*position.entryPrice-1000)<1e-9);
 assert.throws(()=>apply(position,event),/SPLIT_DUPLICATE/);
}
assert.equal(position.qty,30);
assert.equal(position.qty*110-1000,2300);
assert.equal(JSON.stringify(rows),original);
console.log('PASS_GEN17_SYNTHETIC_SIGNAL_POSITION_SPLIT_SELL');
