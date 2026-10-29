/* Draft-only accounting helper; not connected to simulations or trading. */
(function(root){
'use strict';
const events=Object.freeze([
 {symbol:'SHOP',date:'2022-06-29',ratio:10},
 {symbol:'TSLA',date:'2020-08-31',ratio:5},
 {symbol:'TSLA',date:'2022-08-25',ratio:3},
 {symbol:'NVDA',date:'2021-07-20',ratio:4},
 {symbol:'NVDA',date:'2024-06-10',ratio:10}
]);
function apply(position,event){
 if(!position||!event||position.s!==event.symbol)throw Error('SPLIT_SYMBOL_MISMATCH');
 if(!(Number.isFinite(position.qty)&&position.qty>0&&Number.isFinite(position.entryPrice)&&position.entryPrice>0))throw Error('SPLIT_INVALID_POSITION');
 if(!(Number.isFinite(event.ratio)&&event.ratio>0))throw Error('SPLIT_INVALID_RATIO');
 if(position.appliedSplitDates&&position.appliedSplitDates.includes(event.date))throw Error('SPLIT_DUPLICATE');
 const qty=position.qty*event.ratio,entryPrice=position.entryPrice/event.ratio;
 if(!Number.isFinite(qty)||!Number.isFinite(entryPrice))throw Error('SPLIT_OVERFLOW');
 return {...position,qty,entryPrice,appliedSplitDates:[...(position.appliedSplitDates||[]),event.date]};
}
const api=Object.freeze({events,apply});
if(typeof module==='object'&&module.exports)module.exports=api;
else root.LinaGen17SplitAccountingDraft=api;
})(typeof globalThis==='object'?globalThis:this);
