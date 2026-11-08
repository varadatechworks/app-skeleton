import {createHmac,timingSafeEqual} from 'node:crypto';

/** Verify a Razorpay-style order/payment signature using server-stored order ID and key secret. */
export function verifyCheckoutSignature({orderId,paymentId,signature,secret}) {
 if (![orderId,paymentId,signature,secret].every(x => typeof x==='string') || !orderId || !paymentId || secret.length<16 || !/^[0-9a-f]{64}$/i.test(signature)) return false;
 const message=`${orderId}|${paymentId}`;
 const expected=createHmac('sha256',secret).update(message).digest();
 const received=Buffer.from(signature,'hex');
 return expected.length===received.length && timingSafeEqual(expected,received);
}

/** Read checkout providers from server-owned configuration; never receive provider secrets from browsers. */
export function createPaymentProviderRegistry(providers={}) {
 const map=new Map();
 for (const [name,provider] of Object.entries(providers)) {
  if (!/^[a-z][a-z0-9_-]{1,50}$/.test(name) || typeof provider?.createOrder!=='function' || typeof provider?.refund!=='function' || typeof provider?.fetchPayment!=='function') throw new Error('Invalid payment provider');
  map.set(name,Object.freeze(provider));
 }
 return Object.freeze({
  get(name){const provider=map.get(name);if(!provider)throw new Error('Payment provider unavailable');return provider;},
  list(){return [...map.keys()];}
 });
}

/** Never infer captured status from a browser redirect. Query the provider and compare all server-owned facts. */
export function confirmCapturedPayment({expected,providerPayment}) {
 if (!expected || !providerPayment || !expected.tenantId || !expected.orderId) throw new Error('Missing server-owned payment intent');
 if (providerPayment.status!=='captured' || providerPayment.orderId!==expected.providerOrderId || providerPayment.amountMinor!==expected.amountMinor || providerPayment.currency!==expected.currency) throw new Error('Payment not captured or amount mismatch');
 if (expected.paymentId && expected.paymentId!==providerPayment.id) throw new Error('Payment identifier mismatch');
 return Object.freeze({tenantId:expected.tenantId,intentId:expected.orderId,providerPaymentId:providerPayment.id,capturedMinor:expected.amountMinor,currency:expected.currency});
}
