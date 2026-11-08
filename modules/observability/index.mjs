import {randomUUID} from 'node:crypto';
export function correlationId(supplied){return typeof supplied==='string'&&/^[A-Za-z0-9_-]{8,80}$/.test(supplied)?supplied:randomUUID();}
export function safeApiError({status=500,correlationId:cid,code='INTERNAL_ERROR'}={}){
 const messages={400:'Invalid request',401:'Please sign in',403:'You do not have permission',404:'Resource not found',409:'Request conflicts with current state',429:'Too many requests',500:'Something went wrong',503:'Service temporarily unavailable'};
 return {status:messages[status]?status:500,body:{error:code,message:messages[status]??messages[500],correlationId:cid??randomUUID()}};
}
export function requestTelemetry({correlationId:cid,method,path,status,durationMs}){
 if(!cid||!['GET','POST','PATCH','PUT','DELETE'].includes(method)||typeof path!=='string'||!Number.isFinite(durationMs))throw new Error('Invalid request telemetry');
 return {correlationId:cid,method,path:path.split('?')[0].slice(0,250),status,durationMs:Math.max(0,Math.round(durationMs)),at:new Date().toISOString()};
}
