const {test}=require('node:test');
const assert=require('node:assert/strict');
const {weekWindow}=require('../journey-engine.js');
test('week11 includes previous Saturday and fixes four-night return',()=>{
 assert.deepEqual(weekWindow(2027,11,4),{from:'2027-03-13',to:'2027-03-21',monday:'2027-03-15',firstReturn:'2027-03-17',nights:4});
});
test('week13 spans daylight saving without shifting calendar dates',()=>{
 assert.equal(weekWindow(2027,13,4).from,'2027-03-27');assert.equal(weekWindow(2027,13,4).firstReturn,'2027-03-31');
});
test('ISO first week can begin in prior calendar year',()=>{
 assert.equal(weekWindow(2026,1,3).from,'2025-12-27');assert.equal(weekWindow(2027,1,3).from,'2027-01-02');
});
test('invalid week53 and invalid durations fail before requests',()=>{
 assert.throws(()=>weekWindow(2027,53,4));assert.equal(weekWindow(2026,53,4).monday,'2026-12-28');
 for(const n of [0,31,1.5,NaN])assert.throws(()=>weekWindow(2027,11,n));
});
