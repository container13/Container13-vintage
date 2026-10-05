(function(global){
'use strict';
const C=global.LinaGen12WorkflowCore,D=global.LinaGen12WorkflowData,R=global.LinaGen12Research;
function approveStart(){
 let g=C.state();C.assertContract(g);
 if(g.researchOpened||Object.keys(g.checkpoints||{}).length)throw Error('Gen12 start får inte godkännas om observerad state redan finns');
 g.startReceipt={schema:'LINA-GEN12-HUMAN-START-1',approved:true,approvedAt:C.now(),release:global.LinaVersion.release,specSha256:C.E.SPEC_SHA256,releaseGateKey:global.LinaReleaseGate.KEY};
 g.state='START_APPROVED';return C.save(g);
}
async function startApprovedResearch(){let g=C.state();if(!g.startReceipt?.approved)approveStart();return R.run()}
global.LinaGen12Workflow=Object.freeze({state:C.state,approveStart,startApprovedResearch,run:R.run,prepareData:D.prepareData,recoverFinalStateFromImmutableEvidence:D.recoverFinalStateFromImmutableEvidence});
})(window);
