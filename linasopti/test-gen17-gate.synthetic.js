/* Research-only synthetic assertions. Run with: node linasopti/test-gen17-gate.synthetic.js */
'use strict';
const assert=require('node:assert/strict');
const gate=require('./gen17-volatility-contraction-gate.js');
const bars=(left,right,signal=0.1)=>[...Array(20).fill(left),...Array(20).fill(right),signal].map(x=>({h:100+x*50,l:100-x*50,c:100}));
assert.equal(gate.evaluate(bars(.08,.02),40).allow,true,'contracting');
assert.equal(gate.evaluate(bars(.02,.08),40).allow,false,'expanding');
assert.equal(gate.evaluate(bars(.04,.04),40).allow,false,'equal');
assert.equal(gate.evaluate(bars(.08,.02,1),40).allow,true,'signal bar excluded');
assert.equal(gate.evaluate(bars(.08,.02),39).allow,false,'insufficient lookback');
const invalid=bars(.08,.02);invalid[10].h=0;assert.equal(gate.evaluate(invalid,40).allow,false,'invalid OHLC');
const scaled=bars(.08,.02).map((r,i)=>Object.fromEntries(Object.entries(r).map(([k,v])=>[k,v*(i%3+1)])));
assert.equal(gate.evaluate(scaled,40).allow,true,'multiplicative adjustment invariant');
console.log('PASS: 7 synthetic gate assertions');
