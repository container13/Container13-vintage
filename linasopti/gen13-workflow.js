(function(global){
'use strict';
const C=global.LinaGen13WorkflowCore,D=global.LinaGen13WorkflowData,R=global.LinaGen13Research;
function approveStart(){
 let g=C.state();C.assertContract(g);
 if(g.researchOpened||Object.keys(g.checkpoints||{}).length)throw Error('Gen13 start får inte godkännas om observerad state redan finns');
 g.startReceipt={schema:'LINA-GEN13-HUMAN-START-1',approved:true,approvedAt:C.now(),release:global.LinaVersion.release,specSha256:C.E.SPEC_SHA256,releaseGateKey:global.LinaReleaseGate.KEY};
 g.state='START_APPROVED';return C.save(g);
}
async function startApprovedResearch(){let g=C.state();if(!g.startReceipt?.approved)approveStart();return R.run()}
global.LinaGen13Workflow=Object.freeze({state:C.state,approveStart,startApprovedResearch,run:R.run,prepareData:D.prepareData,recoverFinalStateFromImmutableEvidence:D.recoverFinalStateFromImmutableEvidence});
})(window);
