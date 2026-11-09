import {createServerHttpTransport} from './http.mjs';
/** Server-side Razorpay REST adapter; never expose keySecret to a browser. */
export function createRazorpayProvider({keyId,keySecret,send=createServerHttpTransport()}){
 if(typeof keyId!=='string'||!keyId.startsWith('rzp_')||typeof keySecret!=='string'||keySecret.length<16||typeof send!=='function')throw new Error('Razorpay server credentials required');
 const auth='Basic '+Buffer.from(keyId+':'+keySecret).toString('base64');
 const invoke=(path,method,body)=>send('https://api.razorpay.com/v1/'+path,{method,headers:{authorization:auth,'content-type':'application/json'},body});
 return Object.freeze({
  async createOrder({amountMinor,currency='INR',receipt}){
   if(!Number.isSafeInteger(amountMinor)||amountMinor<=0||!/^([A-Z]{3})$/.test(currency)||typeof receipt!=='string'||!receipt||receipt.length>40)throw new Error('Invalid order');
   return invoke('orders','POST',{amount:amountMinor,currency,receipt});
  },
  async fetchPayment(paymentId){
   if(!/^pay_[a-zA-Z0-9]+$/.test(paymentId))throw new Error('Invalid payment identifier');
   return invoke('payments/'+paymentId,'GET');
  },
  async refund(paymentId,{amountMinor,notes}={}){
   if(!/^pay_[a-zA-Z0-9]+$/.test(paymentId)||!Number.isSafeInteger(amountMinor)||amountMinor<=0)throw new Error('Invalid refund');
   return invoke('payments/'+paymentId+'/refund','POST',{amount:amountMinor,notes:notes??{}});
  }
 });
}
