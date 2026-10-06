(function(global){
'use strict';
const C=global.LinaGen16WorkflowCore,D=global.LinaGen16WorkflowData,R=global.LinaGen16Research;
const AUTH=Object.freeze({schema:'LINA-GEN16-HUMAN-START-AUTH-1',approved:true,approvedRelease:'V0.3.95',specSha256:'a065ce8ad2285010493f8491c86116f01025ed3554be18744471de394dbdeafa',source:'explicit human approval after visible V0.3.94 Gen16 ENGINE VERIFIED and before V0.3.95 build'});
function approveStart(){
 let g=C.state();C.assertContract(g);
 if(g.researchOpened||Object.keys(g.checkpoints||{}).length)throw Error('Gen16 start får inte godkännas om observerad state redan finns');
 if(global.LinaVersion.release!==AUTH.approvedRelease||C.E.SPEC_SHA256!==AUTH.specSha256)throw Error('Gen16 start authorization matchar inte release/spec');
 g.startReceipt={schema:'LINA-GEN16-HUMAN-START-1',approved:true,approvedAt:C.now(),release:AUTH.approvedRelease,specSha256:AUTH.specSha256,releaseGateKey:global.LinaReleaseGate.KEY,authorization:AUTH};
 g.state='START_APPROVED';return C.save(g);
}
async function startApprovedResearch(){let g=C.state();if(!g.startReceipt?.approved)approveStart();return R.run()}
global.LinaGen16Workflow=Object.freeze({AUTH,state:C.state,approveStart,startApprovedResearch,run:R.run,prepareData:D.prepareData,recoverFinalStateFromImmutableEvidence:D.recoverFinalStateFromImmutableEvidence});
})(window);
