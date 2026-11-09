import test from 'node:test';
import assert from 'node:assert/strict';
import {createPgOutbox,runOutboxOnce} from '../adapters/postgres/outbox.mjs';

test('outbox worker safely handles idle, success, retry and missing references',async()=>{
 const events=[],message={id:'m1',claim_token:'claim1',attempts:1};
 const outbox={
  claim:async()=>message,
  complete:async(m,r)=>{events.push(['complete',m.id,r.reference]);},
  fail:async(m,o)=>{events.push(['fail',m.id,o.code]);}
 };
 assert.deepEqual(await runOutboxOnce({outbox:{...outbox,claim:async()=>null},deliver:async()=>({reference:'x'})}),{status:'idle'});
 assert.deepEqual(await runOutboxOnce({outbox,deliver:async()=>({reference:'provider_1'})}),{status:'submitted',id:'m1'});
 assert.deepEqual(await runOutboxOnce({outbox,deliver:async()=>{throw new Error('secret provider error');}}),{status:'retry_scheduled',id:'m1'});
 assert.deepEqual(await runOutboxOnce({outbox,deliver:async()=>({})}),{status:'retry_scheduled',id:'m1'});
 assert.deepEqual(events,[['complete','m1','provider_1'],['fail','m1','delivery_error'],['fail','m1','delivery_error']]);
 await assert.rejects(()=>runOutboxOnce({outbox:{...outbox,complete:async()=>{throw new Error('Outbox lease lost');}},deliver:async()=>({reference:'x'})}),/Outbox lease lost/);
});
test('outbox configuration denies invalid tenant and invalid retry parameters',()=>{
 const pool={connect:async()=>{throw new Error('not used');}};
 assert.throws(()=>createPgOutbox(pool,{tenantId:'a'},{}),/Verified tenant context/);
 assert.throws(()=>createPgOutbox(pool,{verified:true,tenantId:'a'},{maxAttempts:0}),/Invalid outbox policy/);
});
