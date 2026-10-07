import fs from 'node:fs';

const required = [
  'PROJECT_RELEASE_STANDARD.md','PROJECT_MASTER_RULES.md','PROJECT_RELEASE_CHECKLIST.md',
  'PROJECT_CURRENT_STATE.json','PROJECT_HANDOFF_CURRENT.md','version.js','README.md'
];
let failed = false;
for (const file of required) {
  if (!fs.existsSync(file)) { console.error('MISSING', file); failed = true; }
}
let state;
try { state = JSON.parse(fs.readFileSync('PROJECT_CURRENT_STATE.json','utf8')); }
catch (e) { console.error('INVALID PROJECT_CURRENT_STATE.json', e.message); process.exit(1); }
if (state.schema !== 'PROJECT-CURRENT-STATE-1') { console.error('BAD schema'); failed = true; }
if (!['LOW','MEDIUM','HIGH'].includes(state.riskClass)) { console.error('BAD riskClass'); failed = true; }
if (!['IDLE','IN_PROGRESS','UNVERIFIED'].includes(state.workCheckpoint?.status)) { console.error('BAD checkpoint status'); failed = true; }
const v = fs.readFileSync('version.js','utf8').match(/RELEASE=['\"]([^'\"]+)/)?.[1];
if (!v) { console.error('VERSION NOT FOUND'); failed = true; }
if (state.release?.candidate && state.release.candidate !== v && state.release?.currentVerified !== v) {
  console.error('VERSION/STATE MISMATCH', {version:v,candidate:state.release?.candidate,current:state.release?.currentVerified}); failed = true;
}
if (state.release?.integrity === 'PASS' && state.release?.currentVerified !== v) {
  console.error('INVALID PASS: currentVerified must equal version.js'); failed = true;
}
if (failed) process.exit(1);
console.log('PROJECT RELEASE INTEGRITY: PASS', {version:v,risk:state.riskClass,checkpoint:state.workCheckpoint.status});
