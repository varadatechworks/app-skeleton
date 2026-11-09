import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {verifyWebhook,handleWebhook} from '../modules/payments/index.mjs';

const secret='a very long fake secret';
const sign=raw=>createHmac('sha256',secret).update(raw).digest('hex');

test('raw webhook HMAC and idempotency adapter',async()=>{
 const raw='{"event":"payment.paid"}',signature=sign(raw);
 assert.equal(verifyWebhook(raw,signature,secret),true);
 assert.equal(verifyWebhook(raw+'x',signature,secret),false);
 assert.equal(verifyWebhook(raw,signature.slice(0,3),secret),false);
 let calls=0;
 const store={runOnce:async(_,fn)=>fn()};
 assert.equal((await handleWebhook({rawBody:raw,signature,secret,tenantId:'t',provider:'razorpay',eventId:'x',idempotencyStore:store,process:async parsed=>{calls++;return parsed.event;}})),'payment.paid');
 assert.equal(calls,1);
 await assert.rejects(()=>handleWebhook({rawBody:raw,signature:'bad',secret,tenantId:'t',provider:'razorpay',eventId:'x',idempotencyStore:store,process:async()=>{}}));
});

test('same signed webhook cannot execute twice by changing external event ID',async()=>{
 const raw='{"event":"payment.captured","payload":{"id":"pay_123"}}',signature=sign(raw);
 const seen=new Map();
 const store={runOnce:async(key,fn)=>{if(seen.has(key))return seen.get(key);const value=await fn();seen.set(key,value);return value;}};
 let effects=0;
 const deliver=(eventId,tenantId='tenant_a',provider='razorpay',body=raw)=>handleWebhook({
  rawBody:body,signature:sign(body),secret,tenantId,provider,eventId,idempotencyStore:store,
  process:async()=>++effects
 });
 assert.equal(await deliver('evt_1'),1);
 assert.equal(await deliver('evt_2'),1);
 assert.equal(effects,1,'replayed signed bytes must not repeat effects');
 assert.equal(await deliver('evt_3','tenant_b'),2,'separate tenant has independent replay scope');
 assert.equal(await deliver('evt_4','tenant_a','another_provider'),3,'separate provider has independent replay scope');
 const distinct='{"event":"payment.failed","payload":{"id":"pay_123"}}';
 assert.equal(await deliver('evt_5','tenant_a','razorpay',distinct),4,'distinct signed payload is a distinct event');
});

test('tampered payloads and missing durable repository fail closed',async()=>{
 const raw='{"event":"payment.paid"}',signature=sign(raw);
 const base={rawBody:raw,signature,secret,tenantId:'tenant_a',provider:'razorpay',eventId:'evt_1',process:async()=>true};
 await assert.rejects(()=>handleWebhook({...base,rawBody:raw+' ',idempotencyStore:{runOnce:async()=>true}}),/Invalid webhook signature/);
 await assert.rejects(()=>handleWebhook({...base,idempotencyStore:{}}),/Durable idempotency/);
 await assert.rejects(()=>handleWebhook({...base,eventId:'',idempotencyStore:{runOnce:async()=>true}}),/Durable idempotency/);
});
