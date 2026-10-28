import assert from 'node:assert/strict';
import {classifyEvent} from './corporate_probe_v3_1.mjs';
const event={id:'sample-id',symbol:'AAPL',cusip:'037833100',process_date:'2020-08-31',ex_date:'2020-08-31',old_rate:1,new_rate:4};
const missingId={...event};delete missingId.id;
const missingCusip={...event};delete missingCusip.cusip;
assert.equal(classifyEvent('forward_splits',event).status,'validated');
assert.equal(classifyEvent('forward_splits',missingId).status,'validated');
assert.equal(classifyEvent('forward_splits',missingCusip).status,'validated');
function strict(e){const c=classifyEvent('forward_splits',e);if(c.status!=='validated')return c.status;return e.id&&e.cusip?'validated':'incomplete';}
assert.equal(strict(event),'validated');
assert.equal(strict(missingId),'incomplete');
assert.equal(strict(missingCusip),'incomplete');
assert.equal(classifyEvent('forward_splits',{...event,new_rate:0}).status,'invalid');
assert.equal(classifyEvent('forward_splits',{...event,ex_date:null}).status,'incomplete');
console.log('PASS synthetic fixtures: documented V3.1 missing ID/CUSIP gap; stricter candidate contract; no provider calls');
