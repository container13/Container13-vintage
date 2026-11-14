const {test}=require('node:test');const assert=require('node:assert/strict');const vm=require('node:vm');const fs=require('node:fs');
class Node{
 constructor(tag='div',text=''){this.tag=tag;this.textContent=text;this.children=[];this.listeners={};this.value='';this.dataset={};this.checked=true;this.open=false;}
 append(...nodes){this.children.push(...nodes);}
 replaceChildren(...nodes){this.children=[...nodes];}
 addEventListener(type,fn){(this.listeners[type]??=[]).push(fn);}
 setAttribute(){}checkValidity(){return true;}reportValidity(){}focus(){}scrollIntoView(){}
 cloneNode(){const n=new Node(this.tag,this.textContent);n.value=this.value;return n;}
 get options(){return this.children;}querySelectorAll(tag){return this.children.flatMap(n=>[...(n.tag===tag?[n]:[]),...n.querySelectorAll(tag)]);}
}
function fixture(fetcher){
 const ids={};for(const id of ['liveForm','liveResults','liveStatus','liveAirport','liveOutbound','liveReturn','maxPrice','searchChoices','searchForm','destination','tripWeek','nights','year','searchMode','weekHint','liveSearch','baggage','cabinBoots','personalBag','connections'])ids[id]=new Node();
 for(const [id,value]of Object.entries({maxPrice:'5000',tripWeek:'11',nights:'4',year:'2027',searchMode:'week',baggage:'19.9',connections:'allow'}))ids[id].value=value;
 for(const code of ['all','ZRH','GVA','INN','SZG','MXP','LIN','BGY','TRN','MUC','LYS','BSL','VRN','VCE','BLQ','STR','VIE','NCE','GNB','TSF','TRS','FDH','GRZ','KLU']){const o=new Node('option',code);o.value=code;ids.destination.append(o);}ids.destination.value='all';
 const context={document:{getElementById:id=>ids[id],querySelectorAll:()=>[],createElement:tag=>new Node(tag)},window:{FlygJourney:require('../journey-engine.js'),FlygSelectionUI:{begin(){},error(){},finish(){},reveal(){}}},navigator:{onLine:true},fetch:fetcher,AbortSignal,Date,Intl,Number,Error};
 vm.runInNewContext(fs.readFileSync(require.resolve('../live-search.js'),'utf8'),context);return ids;
}
async function settle(ids){for(let i=0;i<40;i++){await new Promise(setImmediate);if(!ids.liveSearch.disabled)return;}throw Error('UI stayed busy');}
const response=query=>({ok:true,json:async()=>({stage:'calendar',context:query,prices:[{outbound:'2027-03-13',return:'2027-03-17',quotedPriceSEK:3000,destination:query.destination}]})});
test('whole-week search uses one airport/call, eight per batch and resumes without requerying completed airports',async()=>{
 const calls=[];const ids=fixture(async(url,opts)=>{const q=JSON.parse(opts.body);calls.push(q);return response(q);});
 ids.liveForm.listeners.submit[0]({preventDefault(){}});await settle(ids);assert.equal(calls.length,8);
 assert.ok(calls.every(q=>q.stage==='calendar'&&q.from==='2027-03-13'&&q.to==='2027-03-21'&&q.nights===4&&!q.destination.includes(',')));
 for(let batch=0;batch<2;batch++){const more=ids.liveResults.querySelectorAll('button').find(n=>n.textContent==='Fortsätt söka återstående flygplatser');assert.ok(more);more.listeners.click[0]();await settle(ids);}
 assert.equal(calls.length,23);assert.equal(new Set(calls.map(q=>q.destination)).size,23);assert.ok(!ids.liveResults.querySelectorAll('button').some(n=>n.textContent==='Fortsätt söka återstående flygplatser'));
});
test('quota stop preserves unsearched airport for continuation and keeps prior dated quotes',async()=>{
 const calls=[];let blocked=true;const ids=fixture(async(url,opts)=>{const q=JSON.parse(opts.body);calls.push(q.destination);if(q.destination==='INN'&&blocked)return {ok:false,json:async()=>({error:'APP_QUOTA_REACHED'})};return response(q);});
 ids.liveForm.listeners.submit[0]({preventDefault(){}});await settle(ids);assert.deepEqual(calls,['ZRH','GVA','INN']);assert.ok(ids.liveResults.children.some(n=>/gratiskvot/.test(n.textContent)));
 blocked=false;ids.liveResults.querySelectorAll('button').find(n=>n.textContent==='Fortsätt söka återstående flygplatser').listeners.click[0]();await settle(ids);assert.equal(calls[3],'INN');assert.equal(calls.filter(x=>x==='ZRH').length,1);assert.equal(calls.filter(x=>x==='GVA').length,1);
});
