export const CHANNELS=['email','sms','whatsapp','push','in_app'];
/** Safe template placeholders, only literal keys from provided dictionary. */
export function renderTemplate(template,variables){
 if(typeof template!=='string'||template.length>20000)throw new Error('Invalid template');
 return template.replace(/\{\{([a-zA-Z][a-zA-Z0-9_]{0,49})\}\}/g,(_,k)=>{
   if(!Object.hasOwn(variables??{},k))throw new Error(`Missing template variable: ${k}`);
   const v=variables[k];if(!['string','number','boolean'].includes(typeof v))throw new Error('Invalid template variable');return String(v);
 });
}
export function createDispatcher({providers,now=()=>new Date()}={}){
 if(!providers||typeof providers!=='object')throw new Error('Notification providers required');
 return async function dispatch(message,{consent={},preferences={},dryRun=true}={}){
   const {id,tenantId,userId,channel,template,variables={}}=message||{};
   if(!id||!tenantId||!userId||!CHANNELS.includes(channel))throw new Error('Invalid notification');
   if(channel!=='in_app'&&consent[channel]!==true)return {id,status:'suppressed',reason:'consent_required'};
   if(preferences[channel]===false)return {id,status:'suppressed',reason:'user_preference'};
   const content=renderTemplate(template,variables);
   const record={id,tenantId,userId,channel,content,createdAt:now().toISOString()};
   if(dryRun)return {...record,status:'dry_run'};
   const provider=providers[channel];if(!provider||typeof provider.send!=='function')throw new Error(`Missing ${channel} transport`);
   const result=await provider.send(record);return {...record,status:'submitted',providerReference:result?.reference??null};
 };
}
/** Build an idempotency-aware outbox envelope; durable enqueue/claim/retry stays in the consuming app. */
export function outboxEnvelope(message,{attempt=0,nextAttemptAt=null}={}){
 if(!message?.id||!message.tenantId||!CHANNELS.includes(message.channel)||!Number.isSafeInteger(attempt)||attempt<0)throw new Error('Invalid outbox message');
 return {...structuredClone(message),attempt,status:'pending',nextAttemptAt};
}
