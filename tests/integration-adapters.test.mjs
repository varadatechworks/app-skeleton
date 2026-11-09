import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {createNestGuard} from '../adapters/nestjs/index.mjs';
import {createNextRoute} from '../adapters/nextjs/index.mjs';
import {createExpoApi} from '../adapters/expo/index.mjs';
import {createResendEmail,createTwilioSms} from '../adapters/providers/notifications.mjs';
import {createRazorpayProvider} from '../adapters/providers/razorpay.mjs';
import {handleWebhook} from '../modules/payments/index.mjs';
import {createPgIdempotencyStore} from '../adapters/postgres/idempotency.mjs';

const principal={verified:true,userId:'user1',tenantId:'tenant1'};
test('Nest guard denies absent identity and denies missing grants',async()=>{
 const req={};const ctx={switchToHttp:()=>({getRequest:()=>req})};
 const guard=createNestGuard({verifyPrincipal:async()=>principal,authorize:async()=>true,feature:'users',action:'view'});
 assert.equal(await guard.canActivate(ctx),true);assert.deepEqual(req.actor,principal);
 await assert.rejects(()=>createNestGuard({verifyPrincipal:async()=>null,authorize:async()=>true,feature:'users',action:'view'}).canActivate(ctx),e=>e.status===401);
 await assert.rejects(()=>createNestGuard({verifyPrincipal:async()=>principal,authorize:async()=>false,feature:'users',action:'view'}).canActivate(ctx),e=>e.status===403);
});

test('Next route requires verified identity and explicit grant',async()=>{
 const base={verifyPrincipal:async()=>principal,authorize:async()=>true,feature:'billing',action:'view',handler:async()=>new Response('ok')};
 assert.equal((await createNextRoute(base)(new Request('https://example.com'))).status,200);
 const unauthorized=await createNextRoute({...base,verifyPrincipal:async()=>null})(new Request('https://example.com'));
 assert.equal(unauthorized.status,401);assert.equal(unauthorized.headers.get('cache-control'),'no-store');
 assert.equal((await createNextRoute({...base,authorize:async()=>false})(new Request('https://example.com'))).status,403);
});

test('Expo client limits credentials and translates errors to safe messages',async()=>{
 let got;let expired=0;
 const api=createExpoApi({baseUrl:'https://api.example.com/',getAccessToken:async()=> 'validtoken',fetchImpl:async(url,opts)=>{got={url,opts};return new Response(JSON.stringify({ok:true}),{status:200,headers:{'content-type':'application/json'}});}});
 assert.deepEqual(await api.request('/health'),{ok:true});assert.equal(got.opts.headers.authorization,'Bearer validtoken');
 assert.equal(got.url,'https://api.example.com/health');
 await assert.rejects(()=>api.request('//evil.com'),/Invalid API path/);
 assert.throws(()=>createExpoApi({baseUrl:'http://api.example.com',getAccessToken:async()=>''}),/Secure Expo/);
 const rejected=createExpoApi({baseUrl:'https://api.example.com',getAccessToken:async()=> 't',fetchImpl:async()=>new Response('',{status:401}),onUnauthorized:()=>expired++});
 await assert.rejects(()=>rejected.request('/account'),/Session expired/);assert.equal(expired,1);
});

test('Resend, Twilio and Razorpay inject HTTPS transport and enforce request shapes',async()=>{
 let emailRequest;
 const email=createResendEmail({apiKey:'test-secret',from:'hello@example.com',send:async(url,args)=>{emailRequest={url,args};return {id:'email_1'};}});
 assert.deepEqual(await email.send({recipient:'a@example.com',subject:'Welcome',content:'Hello'}),{reference:'email_1'});
 assert.equal(emailRequest.url,'https://api.resend.com/emails');
 let smsRequest;
 const sms=createTwilioSms({accountSid:'AC'+'a'.repeat(32),authToken:'testsecret',from:'+12025550123',fetchImpl:async(url,args)=>{smsRequest={url,args};return new Response(JSON.stringify({sid:'SM1'}),{status:201});}});
 assert.deepEqual(await sms.send({recipient:'+919900001234',content:'Code is 1234'}),{reference:'SM1'});
 assert.match(smsRequest.args.body,/To=%2B919900001234/);
 await assert.rejects(()=>sms.send({recipient:'91123',content:'Hi'}),/Invalid SMS/);
 let paymentRequest;
 const gateway=createRazorpayProvider({keyId:'rzp_test_key',keySecret:'long_test_secret_do_not_use',send:async(url,args)=>{paymentRequest={url,args};return {id:'order_1'};}});
 await gateway.createOrder({amountMinor:1200,receipt:'receipt_1'});
 assert.equal(paymentRequest.url,'https://api.razorpay.com/v1/orders');
 await assert.rejects(()=>gateway.createOrder({amountMinor:-1,receipt:'r'}),/Invalid order/);
 await assert.rejects(()=>gateway.fetchPayment('../../foo'),/Invalid payment/);
});

test('Postgres idempotency passes transaction client to webhook business action',async()=>{
 const results=new Map(),log=[];let active=false;let effects=0;
 const client={async query(sql,args=[]){
  log.push(sql);
  if(sql==='BEGIN'){active=true;return {rows:[],rowCount:0};}
  if(sql==='COMMIT'||sql==='ROLLBACK'){active=false;return {rows:[],rowCount:0};}
  if(sql.startsWith('INSERT INTO skeleton_idempotency')){
   const k=args.join('|');if(results.has(k))return {rowCount:0,rows:[]};
   results.set(k,null);return {rowCount:1,rows:[{}]};
  }
  if(sql.startsWith('SELECT result_json'))return {rows:[{result_json:results.get(args.join('|'))}]};
  if(sql.startsWith('UPDATE skeleton_idempotency')){results.set(args.slice(0,3).join('|'),JSON.parse(args[3]));return {rowCount:1,rows:[]};}
  return {rows:[],rowCount:1};
 },release(){}};
 const pool={connect:async()=>client};
 const store=createPgIdempotencyStore(pool,{verified:true,tenantId:'tenant1'});
 const raw=JSON.stringify({event:'payment.captured',payload:{id:'pay1'}}),secret='long_fake_webhook_secret';
 const signature=createHmac('sha256',secret).update(raw).digest('hex');
 const deliver=eventId=>handleWebhook({rawBody:raw,signature,secret,tenantId:'tenant1',provider:'razorpay',eventId,idempotencyStore:store,process:async(_,tx)=>{assert.equal(tx,client);assert.equal(active,true);effects++;return {accepted:true};}});
 assert.deepEqual(await deliver('eventA'),{accepted:true});
 assert.deepEqual(await deliver('eventB'),{accepted:true});
 assert.equal(effects,1);
 assert.equal(log.filter(x=>x==='COMMIT').length,2);
});
