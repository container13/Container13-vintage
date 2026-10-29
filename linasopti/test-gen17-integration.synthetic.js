/* Synthetic integration only; never invokes simulate(). Run with node. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=__dirname;
const context={globalThis:{},crypto:require('node:crypto').webcrypto,TextEncoder};
vm.runInNewContext(fs.readFileSync(path.join(root,'gen17-generation-engine.DRAFT.js'),'utf8'),context);
const engine=context.globalThis.LinaGen17DraftEngine;
assert.ok(engine,'draft engine exports');
const gate=require('./gen17-volatility-contraction-gate.js');
const rows=Array.from({length:232},(_,i)=>({d:'S'+i,o:100,h:101,l:99,c:100}));
for(let i=0;i<200;i++){rows[i].h=104;rows[i].l=96;}
for(let i=200;i<230;i++){rows[i].h=101;rows[i].l=99;}
rows[230]={d:'S230',o:105,h:108,l:104,c:107};
const by=Object.fromEntries(engine.SPEC.symbols.map(s=>[s,rows.map(x=>({...x}))]));
const original=engine.signalAt(by,230,'PRICE_CHANNEL_BREAKOUT');
assert.equal(original.candidates.length,16,'all eligible on contraction');
assert.equal(engine.gen17Gate(rows,230),gate.evaluate(rows,230).allow,'standalone and integrated gate parity');
for(let i=210;i<230;i++){by.AMD[i].h=110;by.AMD[i].l=90;}
assert.equal(engine.gen17Gate(by.AMD,230),false,'AMD expansion denied');
const filtered=engine.signalAt(by,230,'PRICE_CHANNEL_BREAKOUT');
assert.equal(filtered.candidates.length,15,'filter before ranking');
assert.ok(!filtered.candidates.some(x=>x.s==='AMD'),'blocked symbol absent');
assert.equal(engine.SPEC.params.hold,12,'exit unchanged');
assert.equal(engine.SPEC.costSide,.001,'cost unchanged');
assert.equal(engine.SPEC.maxPositions,8,'capacity unchanged');
assert.equal(engine.SPEC.tradeEnabled,false,'trade off');
assert.equal(engine.SPEC.forwardOpened,false,'Forward off');
console.log('PASS: 10 synthetic integration assertions; no backtest');
