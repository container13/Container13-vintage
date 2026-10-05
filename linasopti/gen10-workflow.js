(function(global){
'use strict';
const C=global.LinaGen10WorkflowCore,D=global.LinaGen10WorkflowData,R=global.LinaGen10Research;
async function exportResults(){
 const g=C.state(),folds={};
 for(const [key,ref] of Object.entries(g.checkpoints||{}))folds[key]=(await D.validateCheckpoint(await C.get(ref.storageKey),ref)).result;
 return{schema:'LINA-GEN10-RESULTS-EXPORT-1',state:g,folds,tradeEnabled:false,forwardOpened:false};
}
function mount(root){
 const box=root.querySelector('[data-generation="10"]');if(!box)return;
 let g;try{g=C.state();C.assertContract(g)}catch(e){return}
 let info=box.querySelector('[data-gen10-research-status]');
 if(!info){info=document.createElement('div');info.dataset.gen10ResearchStatus='';box.append(info)}
 const show=()=>{g=C.state();info.textContent=(g.automation?.status==='STOPPED'?'STOPPAD: '+(g.automation.lastError||'okänt fel'):'Gen10 research: '+g.state+(g.summary?' · '+g.summary.decision:''))};show();
 global.document.addEventListener('lina:gen10progress',e=>{info.textContent='PÅGÅR: '+e.detail.text});
 if(g.engineVerified&&!g.researchOpened&&!g.summaryFreeze?.frozen)setTimeout(()=>R.run().then(show).catch(show),0);
 const panel=root.querySelector('.engine-export-primary');
 if(panel&&!panel.querySelector('[data-gen10-export]')){const b=document.createElement('button');b.dataset.gen10Export='';b.textContent='Exportera Gen10-state och resultat';b.onclick=async()=>{try{await global.LinaStatusExport.downloadObjectAsync('LINA_GEN10_RESULTS',exportResults)}catch(e){info.textContent='EXPORT STOPPAD: '+e.message}};panel.append(b)}
}
global.LinaGen10Workflow=Object.freeze({state:C.state,prepareData:D.prepareData,run:R.run,exportResults,mount});
})(window);
