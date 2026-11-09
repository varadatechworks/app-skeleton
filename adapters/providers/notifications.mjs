import {createServerHttpTransport} from './http.mjs';
/**
 * Provider-specific authenticated submission. No implicit delivery guarantees.
 * Call through a durable outbox; verify consent and template approval upstream.
 */
export function createResendEmail({apiKey,from,send=createServerHttpTransport()}){
 if(!apiKey||!from||typeof send!=='function')throw new Error('Resend config required');
 return {channel:'email',async send({recipient,subject,content}){
  if(!recipient||!subject||!content)throw new Error('Email payload required');
  const r=await send('https://api.resend.com/emails',{headers:{authorization:'Bearer '+apiKey,'content-type':'application/json'},body:{from,to:[recipient],subject,text:content}});
  if(!r.id)throw new Error('Email provider reference missing');return {reference:r.id};
 }};
}
export function createTwilioSms({accountSid,authToken,from,send=createServerHttpTransport()}){
 if(!/^AC[a-f0-9]{32}$/i.test(accountSid||'')||!authToken||!from||typeof send!=='function')throw new Error('Twilio config required');
 return {channel:'sms',async send({recipient,content}){
  if(!recipient||!content)throw new Error('SMS payload required');
  // Transport accepts JSON; Twilio requires URL-encoded form. See integration documentation.
  throw new Error('Twilio SMS transport requires a form-encoded transport adapter');
 }};
}
