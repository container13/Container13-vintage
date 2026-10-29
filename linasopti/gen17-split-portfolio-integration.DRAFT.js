/* Isolated draft portfolio adapter. No historical simulation is authorized. */
'use strict';
const Split=require('./gen17-split-accounting.DRAFT.js');
function applyDay(positions,day){
 if(!Array.isArray(positions))throw Error('POSITIONS_REQUIRED');
 let changed=[];
 const updated=positions.map(p=>{
   let result={...p};
   for(const event of Split.events.filter(e=>e.symbol===p.s&&e.date===day)){
     result=Split.apply(result,event);
     changed.push({symbol:p.s,date:day,ratio:event.ratio});
   }
   return result;
 });
 return {positions:updated,events:changed};
}
function value(positions,closeBySymbol){
 return positions.reduce((total,p)=>{
  const close=closeBySymbol[p.s];
  if(!Number.isFinite(close)||close<=0)throw Error('INVALID_MARK');
  return total+p.qty*close;
 },0);
}
module.exports=Object.freeze({applyDay,value});
