(function(global){
'use strict';const C=global.LinaGen15WorkflowCore,D=global.LinaGen15WorkflowData,E=C.E;
async function run(){return C.single(async()=>{let g=C.state();C.assertContract(g);if(g.summaryFreeze?.frozen)return g.summary;
if(!g.startReceipt?.approved)throw Error('Gen15 STOPP: mänskligt startkvitto saknas');
// Research ownership starts BEFORE dataset evidence. This prevents ordinary app-state autosync from racing immutable evidence writes.
g.researchAuthorized=true;g.researchAuthorizedAt=g.researchAuthorizedAt||C.now();g.state='RESEARCH_STARTING';g.automation={status:'RUNNING',lastStep:'START_AUTHORIZED',attemptAt:C.now()};C.save(g);
if(!g.dataEvidence)await D.prepareData();g=C.state();const pkg=await D.restoreDataCheckpoint();
g.researchOpened=true;g.state='RESEARCH_RUNNING';g.automation={...(g.automation||{}),status:'RUNNING',lastStep:'DATA_EVIDENCE_VERIFIED',attemptAt:C.now()};C.save(g);
try{
 for(const variant of E.SPEC.variants)for(const year of E.SPEC.foldYears){
  g=C.state();const key=variant+'_'+year,storageKey='fold:'+E.SPEC_SHA256+':'+C.DATA_SHA+':'+key;C.report('Gen15 '+key+' · checkpoint/evidens');
  g.automation.lastStep=key;C.save(g);let ref=g.checkpoints?.[key],cp=await C.get(storageKey);
  if(!ref&&!cp){const recovered=await D.recoverImmutableCheckpoint(key,variant,year,storageKey);if(recovered){cp=recovered.cp;ref=recovered.ref;g=C.state();g.checkpoints={...(g.checkpoints||{}),[key]:ref};C.save(g)}}
  if(ref)cp=await D.restoreCheckpoint(ref);
  else if(cp){if(cp.key!==key||cp.specSha256!==E.SPEC_SHA256||await C.digest(cp.result)!==cp.resultSha256)throw Error('Okänt checkpoint: recovery krävs');ref={key,variant,year,resultSha256:cp.resultSha256,storageKey,observedAt:cp.observedAt}}
  else{if(g.observationAttempts?.[key])throw Error('Påbörjat observerat steg saknar checkpoint: ingen rerun');g.observationAttempts={...(g.observationAttempts||{}),[key]:C.now()};C.save(g);const result=E.simulate(pkg.data,variant,year+'-01-01',year+'-12-31');cp={key,variant,year,specSha256:E.SPEC_SHA256,observedAt:C.now(),result};cp.resultSha256=await C.digest(result);await C.put(storageKey,cp);ref={key,variant,year,resultSha256:cp.resultSha256,storageKey,observedAt:cp.observedAt}}
  g=C.state();g.checkpoints={...(g.checkpoints||{}),[key]:ref};C.save(g);await D.validateCheckpoint(cp,ref);
  if(!ref.evidence){const evidence=await D.secure('LINAS_GEN15_'+E.SPEC_SHA256+'_'+key+'.json',cp);g=C.state();g.checkpoints[key]={...ref,evidence};C.save(g)}
 }
 g=C.state();const results={};for(const variant of E.SPEC.variants){const folds=[];for(const year of E.SPEC.foldYears){const ref=g.checkpoints[variant+'_'+year];folds.push((await D.validateCheckpoint(await C.get(ref.storageKey),ref)).result)}results[variant]=E.aggregate(folds,variant)}
 const summary={schema:'LINA-GEN15-RESEARCH-SUMMARY-1',specSha256:E.SPEC_SHA256,dataManifest:g.dataManifest,results,decision:results.TREND_INVALIDATION_EXIT.candidateEligible?'CANDIDATE_REVIEW_REQUIRED':'NO_CANDIDATE',tradeEnabled:false,forwardOpened:false};
 await C.put('summary:'+E.SPEC_SHA256,summary);g=C.state();g.summary=summary;g.state='RESEARCH_COMPLETE_AWAITING_FREEZE';g.automation={...g.automation,status:'RESEARCH_COMPLETE',lastStep:'SUMMARY_CHECKPOINT'};C.save(g);
 const evidence=await D.secure('LINAS_GEN15_SUMMARY_'+E.SPEC_SHA256+'.json',summary);g=C.state();g.summaryFreeze={frozen:true,frozenAt:C.now(),evidence};g.state=summary.decision==='NO_CANDIDATE'?'GEN15_COMPLETE_NO_CANDIDATE':'SUMMARY_FROZEN_CANDIDATE_REVIEW_REQUIRED';g.automation={...g.automation,status:'COMPLETE',lastStep:'SUMMARY_FROZEN'};C.save(g);C.report('Gen15 klar · '+summary.decision);return summary;
}catch(e){g=C.state();g.state='RESEARCH_STOPPED';g.automation={...(g.automation||{}),status:'STOPPED',lastError:String(e?.message||e)};C.save(g);throw e}
})}
global.LinaGen15Research=Object.freeze({run});
})(window);
