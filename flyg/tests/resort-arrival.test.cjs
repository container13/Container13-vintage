const {test}=require('node:test');const assert=require('node:assert/strict');
const {resortArrival}=require('../journey-engine.js');
const req={resort:'Cervinia',transport:'road',dinnerTarget:'20:00',hotelCutoff:'22:00',airportMinutes:60,roadBufferMinutes:30,checkinMinutes:30};
const flight=(airport='MXP',time='15:00')=>({segments:[{destination:airport,arrivalLocal:'2027-03-14 '+time}]});
test('landing plus baggage, published road time, margin and checkin yields dinner time',()=>{
 const r=resortArrival(flight(),req);assert.equal(r.status,'ON_TIME');assert.equal(r.hotelLocal,'2027-03-14 18:46');assert.equal(r.readyLocal,'2027-03-14 19:16');assert.equal(r.verification,'ESTIMATE_ONLY');assert.equal(r.roadMinutes,136);
});
test('late Milan arrival cannot count as dinner at resort',()=>{
 const r=resortArrival(flight('MXP','18:30'),req);assert.equal(r.status,'TOO_LATE');assert.equal(r.readyLocal,'2027-03-14 22:46');
});
test('dinner target and hard hotel deadline are different constraints',()=>{
 assert.equal(resortArrival(flight('MXP','16:00'),req).status,'LATE');
 assert.equal(resortArrival(flight('MXP','15:44'),req).status,'ON_TIME');
 assert.equal(resortArrival(flight('MXP','15:45'),req).status,'LATE');
});
test('airport routes use their own sourced times, not one Milan estimate',()=>{
 assert.equal(resortArrival(flight('TRN'),req).roadMinutes,102);assert.equal(resortArrival(flight('BGY'),req).roadMinutes,170);assert.equal(resortArrival(flight('LIN'),req).roadMinutes,149);
});
test('public transport and unsupported routes/resorts stay unknown',()=>{
 for(const [f,r] of [[flight(),{...req,transport:'public'}],[flight('INN'),req],[flight(),{...req,resort:'Ischgl'}],[flight(),{...req,resort:null}]])assert.equal(resortArrival(f,r).status,'UNKNOWN');
});
test('invalid or contradictory planning values fail closed',()=>{
 for(const patch of [{airportMinutes:NaN},{roadBufferMinutes:-1},{dinnerTarget:'23:00'},{dinnerTarget:''}])assert.equal(resortArrival(flight(),{...req,...patch}).status,'UNKNOWN');
 assert.equal(resortArrival({segments:[{destination:'MXP',arrivalLocal:'2027-02-30 15:00'}]},req).status,'UNKNOWN');
});
test('cross-midnight resort arrival is late on next calendar date',()=>{
 const r=resortArrival(flight('BGY','23:30'),req);assert.equal(r.status,'TOO_LATE');assert.equal(r.readyLocal,'2027-03-15 04:20');
});
test('airport and checkin allowances are visible editable planning inputs',()=>{
 const r=resortArrival(flight(),{...req,airportMinutes:90,checkinMinutes:45});assert.equal(r.readyLocal,'2027-03-14 20:01');assert.equal(r.status,'LATE');
});


test('St Anton private road estimates are source-backed for four listed airports and never verified',()=>{
 const required={resort:'St. Anton am Arlberg',transport:'road',dinnerTarget:'20:00',hotelCutoff:'22:00',airportMinutes:60,roadBufferMinutes:30,checkinMinutes:30};
 const examples={INN:75,ZRH:135,MUC:195,FDH:100};
 for(const [destination,minutes] of Object.entries(examples)){
  const arrival=resortArrival({segments:[{destination,arrivalLocal:'2027-03-14 12:00'}]},required);
  assert.equal(arrival.roadMinutes,minutes,destination);
  assert.equal(arrival.verification,'ESTIMATE_ONLY');
  assert.match(arrival.source,/taxi-st-anton/);
 }
});
test('St Anton unavailable airports, public transport and city-night routes remain unknown',()=>{
 const required={resort:'St. Anton am Arlberg',transport:'road',dinnerTarget:'20:00',hotelCutoff:'22:00',airportMinutes:60,roadBufferMinutes:30,checkinMinutes:30};
 assert.equal(resortArrival({segments:[{destination:'BGY',arrivalLocal:'2027-03-14 12:00'}]},required).status,'UNKNOWN');
 assert.equal(resortArrival({segments:[{destination:'INN',arrivalLocal:'2027-03-14 12:00'}]},{...required,transport:'rail'}).status,'UNKNOWN');
 const out={segments:[{origin:'ARN',destination:'INN',departureLocal:'2027-03-14 07:00',arrivalLocal:'2027-03-14 12:00'}]};
 const back={segments:[{origin:'INN',destination:'ARN',departureLocal:'2027-03-18 14:00',arrivalLocal:'2027-03-18 18:00'}]};
 const plan={...required,returnPlan:'city',maxNights:5,skiDays:3,skiStart:'09:00',skiEnd:'16:00',earliestHotelDeparture:'07:00',earliestCityDeparture:'05:00',airportReturnMinutes:120,cityAirportMinutes:90};
 assert.equal(skiTrip(out,back,plan).status,'UNKNOWN');
 assert.equal(skiTrip(out,back,{...plan,returnPlan:'auto',breakfastEnd:'09:00'}).returnPlan,'direct');
});
