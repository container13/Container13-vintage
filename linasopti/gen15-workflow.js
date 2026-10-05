(function(global){
'use strict';
const C=global.LinaGen15WorkflowCore,D=global.LinaGen15WorkflowData,R=global.LinaGen15Research;
const AUTH=Object.freeze({schema:'LINA-GEN15-HUMAN-START-AUTH-1',approved:true,approvedRelease:'V0.3.87',specSha256:'726b1631365c5df4880dd926b32461f870eacd1bdf2f610f00b5ad844c61b43c',source:'explicit human approval before V0.3.87 build'});
function approveStart(){
 let g=C.state();C.assertContract(g);
 if(g.researchOpened||Object.keys(g.checkpoints||{}).length)throw Error('Gen15 start får inte godkännas om observerad state redan finns');
 if(global.LinaVersion.release!==AUTH.approvedRelease||C.E.SPEC_SHA256!==AUTH.specSha256)throw Error('Gen15 start authorization matchar inte release/spec');
 g.startReceipt={schema:'LINA-GEN15-HUMAN-START-1',approved:true,approvedAt:C.now(),release:AUTH.approvedRelease,specSha256:AUTH.specSha256,releaseGateKey:global.LinaReleaseGate.KEY,authorization:AUTH};
 g.state='START_APPROVED';return C.save(g);
}
async function startApprovedResearch(){let g=C.state();if(!g.startReceipt?.approved)approveStart();return R.run()}
global.LinaGen15Workflow=Object.freeze({AUTH,state:C.state,approveStart,startApprovedResearch,run:R.run,prepareData:D.prepareData,recoverFinalStateFromImmutableEvidence:D.recoverFinalStateFromImmutableEvidence});
})(window);
