'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {checkSchedule}=require('../journey-engine.js');
const requirements={stage:'outbound',outbound:'2027-03-14',airportCutoff:'20:00',hotelCutoff:'22:00',allowConnections:true,maxLayoverMinutes:240};
const connection=(departure='10:15',arrival='11:45')=>({segments:[
 {origin:'ARN',destination:'CDG',departureLocal:'2027-03-14 06:10',arrivalLocal:'2027-03-14 09:10'},
 {origin:'CDG',destination:'MXP',departureLocal:'2027-03-14 '+departure,arrivalLocal:'2027-03-14 '+arrival}
]});
test('user screenshot: 12h15 in Paris and23:00 landing is hidden',()=>{
 assert.equal(checkSchedule(connection('21:25','23:00'),requirements).status,'REJECTED');
 assert.match(checkSchedule(connection('21:25','23:00'),requirements).reasons.join(),/väntan/);
 assert.match(checkSchedule(connection('21:25','23:00'),{...requirements,maxLayoverMinutes:1440}).reasons.join(),/hotellets/);
});
test('morning connection stays visible but never claims a verified hotel arrival',()=>{
 assert.deepEqual(checkSchedule(connection(),requirements),{status:'NOT_REJECTED',reasons:[],hotelArrivalStatus:'UNVERIFIED'});
});
test('airport cutoff and strict hotel cutoff both apply independently',()=>{
 assert.equal(checkSchedule(connection('19:00','20:00'),{...requirements,maxLayoverMinutes:1440}).status,'NOT_REJECTED');
 assert.equal(checkSchedule(connection('19:00','20:01'),{...requirements,maxLayoverMinutes:1440}).status,'REJECTED');
 assert.equal(checkSchedule(connection('19:00','22:00'),{...requirements,airportCutoff:'23:00',maxLayoverMinutes:1440}).status,'REJECTED');
});
test('next-day arrival cannot consume a full ski day silently',()=>{
 const flight=connection();flight.segments[1].arrivalLocal='2027-03-15 00:10';
 assert.equal(checkSchedule(flight,requirements).status,'REJECTED');
});
test('layover limit is editable; exactly4h allowed; larger hidden',()=>{
 assert.equal(checkSchedule(connection('13:10','14:30'),requirements).status,'NOT_REJECTED');
 assert.equal(checkSchedule(connection('13:11','14:30'),requirements).status,'REJECTED');
 assert.equal(checkSchedule(connection('13:11','14:30'),{...requirements,maxLayoverMinutes:300}).status,'NOT_REJECTED');
});
test('direct-only, broken connections and missing timetable fail closed',()=>{
 assert.equal(checkSchedule(connection(),{...requirements,allowConnections:false}).status,'REJECTED');
 const broken=connection();broken.segments[1].origin='ORY';
 assert.equal(checkSchedule(broken,requirements).status,'REJECTED');
 const missing=connection();delete missing.segments[1].arrivalLocal;
 assert.equal(checkSchedule(missing,requirements).status,'UNKNOWN');
 assert.equal(checkSchedule({segments:[]},requirements).status,'UNKNOWN');
});
test('return flight uses connection limits without applying outbound hotel cutoff',()=>{
 assert.equal(checkSchedule(connection('21:25','23:00'),{...requirements,stage:'returns',maxLayoverMinutes:1440}).status,'NOT_REJECTED');
 assert.equal(checkSchedule(connection('21:25','23:00'),{...requirements,stage:'returns'}).status,'REJECTED');
});
test('browser timezone does not change same-airport or destination-local comparisons',()=>{
 const previous=process.env.TZ;try{
 for(const tz of ['Asia/Bangkok','Europe/Stockholm','America/Los_Angeles']){
 process.env.TZ=tz;assert.equal(checkSchedule(connection(),requirements).status,'NOT_REJECTED');
 assert.equal(checkSchedule(connection('21:25','23:00'),requirements).status,'REJECTED');
 }
 }finally{if(previous===undefined)delete process.env.TZ;else process.env.TZ=previous;}
});

