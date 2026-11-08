import {createHmac,timingSafeEqual} from 'node:crypto';
/** Razorpay-like HMAC SHA256 over the raw, unmodified webhook body. */
export function verifyWebhook(rawBody,signature,secret){
 if(!(typeof rawBody==='string'||Buffer.isBuffer(rawBody))||typeof signature!=='string'||!/^[a-f0-9]{64}$/i.test(signature)||typeof secret!=='string'||secret.length<16)return false;
 const provided=Buffer.from(signature,'hex');const expected=createHmac('sha256',secret).update(rawBody).digest();
 return provided.length===expected.length&&timingSafeEqual(provided,expected);
}
/** Persistent idempotency repository is required for exactly-once effects. */
export async function handleWebhook({rawBody,signature,secret,tenantId,provider,eventId,idempotencyStore,process}){
 if(!verifyWebhook(rawBody,signature,secret))throw new Error('Invalid webhook signature');
 if(!tenantId||!provider||!eventId||typeof idempotencyStore?.runOnce!=='function'||typeof process!=='function')throw new Error('Durable idempotency adapter required');
 return idempotencyStore.runOnce(JSON.stringify([tenantId,provider,eventId]),()=>process(JSON.parse(rawBody.toString())));
}
