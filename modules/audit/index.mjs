const SECRET=/(password|passcode|otp|token|authorization|cookie|secret|credential|pan|card|cvv|api.?key)/i;
export function redact(value,depth=0){
 if(depth>5)return '[MAX_DEPTH]';
 if(Array.isArray(value))return value.slice(0,200).map(v=>redact(v,depth+1));
 if(value&&typeof value==='object'&&!(value instanceof Date))return Object.fromEntries(Object.entries(value).slice(0,200).map(([k,v])=>[k,SECRET.test(k)?'[REDACTED]':redact(v,depth+1)]));
 if(typeof value==='string')return value.length>2000?value.slice(0,2000)+'[TRUNCATED]':value;
 return value;
}
export function createAuditEvent({id,tenantId,actorId,action,resource,resourceId,outcome='success',metadata={},location=null,occurredAt=new Date().toISOString(),correlationId}){
 if(!id||!tenantId||!actorId||!action||!resource||!correlationId||!['success','failure','denied'].includes(outcome)||!Number.isFinite(Date.parse(occurredAt)))throw new Error('Invalid audit event');
 return Object.freeze({id,tenantId,actorId,action,resource,resourceId:resourceId??null,outcome,metadata:redact(metadata),location:location??null,occurredAt,correlationId});
}
export async function appendAudit(store,event){if(typeof store?.append!=='function')throw new Error('Append-only audit store required');return store.append(event);}
