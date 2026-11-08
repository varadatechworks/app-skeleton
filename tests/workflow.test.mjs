import test from 'node:test';import assert from 'node:assert/strict';
import {createWorkflow,transition} from '../modules/workflow/index.mjs';
test('workflow transitions validated and authorized',()=>{const w=createWorkflow({initial:'draft',transitions:{draft:['submitted'],submitted:['approved','rejected']}});assert.equal(transition(w,'draft','submitted',{actorId:'u',allowed:true}).to,'submitted');assert.throws(()=>transition(w,'draft','approved',{actorId:'u',allowed:true}));assert.throws(()=>transition(w,'draft','submitted',{actorId:'u'}));});
