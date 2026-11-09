import {createServerHttpTransport} from './http.mjs';
/** Server-side Resend email provider. Dispatch only after explicit consent check. */
export function createResendEmail({apiKey,from,send=createServerHttpTransport()}){
 if(!apiKey||!from||typeof send!=='function')throw new Error('Resend config required');
 return {channel:'email',async send({recipient,subject,content}){
  if(!recipient||!subject||!content)throw new Error('Email payload required');
  const r=await send('https://api.resend.com/emails',{headers:{authorization:'Bearer '+apiKey,'content-type':'application/json'},body:{from,to:[recipient],subject,text:content}});
  if(!r.id)throw new Error('Email provider reference missing');return {reference:r.id};
 }};
}
/** Twilio Messaging REST API with form-encoded body and bounded network timeout. */
export function createTwilioSms({accountSid,authToken,from,fetchImpl=globalThis.fetch}){
 if(!/^AC[a-f0-9]{32}$/i.test(accountSid||'')||!authToken||!from||typeof fetchImpl!=='function')throw new Error('Twilio config required');
 return Object.freeze({channel:'sms',async send({recipient,content}){
  if(typeof recipient!=='string'||!/^\+[1-9][0-9]{6,14}$/.test(recipient)||typeof content!=='string'||!content||content.length>1600)throw new Error('Invalid SMS payload');
  const url='https://api.twilio.com/2010-04-01/Accounts/'+accountSid+'/Messages.json';
  const body=new URLSearchParams({To:recipient,From:from,Body:content}).toString();
  const auth='Basic '+Buffer.from(accountSid+':'+authToken).toString('base64');
  const response=await fetchImpl(url,{method:'POST',redirect:'error',signal:AbortSignal.timeout(10000),headers:{authorization:auth,'content-type':'application/x-www-form-urlencoded'},body});
  if(!response.ok)throw new Error('SMS provider rejected request ('+response.status+')');
  const data=await response.json();
  if(!data.sid)throw new Error('SMS provider reference missing');
  return {reference:data.sid};
 }});
}
