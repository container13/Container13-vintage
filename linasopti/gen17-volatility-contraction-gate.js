/* Gen17 draft research-only pure entry gate. Not a runner. No trading, Forward, or backtest. */
(function(root){
'use strict';
const WINDOW=20;
function range(bar){
 if(!bar||![bar.h,bar.l,bar.c].every(x=>typeof x==='number'&&Number.isFinite(x)&&x>0)||bar.h<bar.l||bar.c<bar.l||bar.c>bar.h)return null;
 return (bar.h-bar.l)/bar.c;
}
/** signalIndex is the Gen16 signalAt index, not the next-open execution index. */
function evaluate(rows,signalIndex){
 if(!Array.isArray(rows)||!Number.isInteger(signalIndex)||signalIndex<40||signalIndex>=rows.length)return {allow:false,reason:'INSUFFICIENT_HISTORY'};
 let previous=0,recent=0;
 for(let k=signalIndex-40;k<signalIndex;k++){
  const v=range(rows[k]);if(v===null)return {allow:false,reason:'INVALID_OHLC',barIndex:k};
  if(k<signalIndex-20)previous+=v;else recent+=v;
 }
 previous/=WINDOW;recent/=WINDOW;
 return {allow:recent<previous,reason:recent<previous?'CONTRACTION':'NO_CONTRACTION',recent,previous};
}
const api=Object.freeze({schema:'LINA-GEN17-GATE-DRAFT-1',window:WINDOW,evaluate});
if(typeof module==='object'&&module.exports)module.exports=api;
else root.LinaGen17VolatilityContractionGate=api;
})(typeof globalThis!=='undefined'?globalThis:this);
