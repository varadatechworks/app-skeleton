import {randomUUID} from 'node:crypto';
import {withTenantTransaction} from './index.mjs';
import {requireTenantFilter} from '../../modules/tenant/index.mjs';

/** Postgres outbox with a fenced lease. Delivery is at-least-once, not exactly-once. */
export function createPgOutbox(pool,context,{maxAttempts=5,leaseSeconds=60}={}){
 const {tenant_id}=requireTenantFilter(context);
 if(!Number.isInteger(maxAttempts)||maxAttempts<1||maxAttempts>20||!Number.isInteger(leaseSeconds)||leaseSeconds<10||leaseSeconds>600)throw new Error('Invalid outbox policy');
 return Object.freeze({
  async claim(){
   const token=randomUUID();
   return withTenantTransaction(pool,context,async client=>{
    const found=await client.query(
     `SELECT id FROM notification_outbox WHERE tenant_id=$1
        AND ((status='pending' AND (next_attempt_at IS NULL OR next_attempt_at<=now()))
          OR (status='processing' AND locked_until<now()))
        AND attempts<$2 ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1`,
     [tenant_id,maxAttempts]);
    if(found.rows.length===0)return null;
    const {rows}=await client.query(
     `UPDATE notification_outbox SET status='processing', attempts=attempts+1,
       claim_token=$3, locked_until=now()+($4::integer * interval '1 second')
       WHERE tenant_id=$1 AND id=$2 RETURNING id,tenant_id,user_id,channel,payload,attempts,claim_token`,
     [tenant_id,found.rows[0].id,token,leaseSeconds]);
    return rows[0]??null;
   });
  },
  async complete(message,{reference}){
   if(!message?.id||!message.claim_token||typeof reference!=='string'||!reference)throw new Error('Outbox completion requires provider reference and lease');
   return withTenantTransaction(pool,context,async client=>{
    const res=await client.query(
     `UPDATE notification_outbox SET status='sent',provider_ref=$4,claim_token=NULL,locked_until=NULL
      WHERE tenant_id=$1 AND id=$2 AND claim_token=$3 AND status='processing'
        AND locked_until>=now() RETURNING id`,
     [tenant_id,message.id,message.claim_token,reference]);
    if(res.rowCount!==1)throw new Error('Outbox lease lost');return true;
   });
  },
  async fail(message,{code='delivery_error'}={}){
   if(!message?.id||!message.claim_token||!/^[a-z][a-z0-9_]{0,49}$/.test(code))throw new Error('Invalid outbox failure');
   return withTenantTransaction(pool,context,async client=>{
    const backoff=Math.min(3600,2**Math.min(message.attempts,10)*5);
    const res=await client.query(
     `UPDATE notification_outbox SET status=CASE WHEN attempts >= $4 THEN 'dead_letter' ELSE 'pending' END,
        next_attempt_at=CASE WHEN attempts >= $4 THEN NULL ELSE now()+($5::integer*interval '1 second') END,
        claim_token=NULL,locked_until=NULL,last_error_code=$6
      WHERE tenant_id=$1 AND id=$2 AND claim_token=$3 AND status='processing'
        AND locked_until>=now() RETURNING id`,
     [tenant_id,message.id,message.claim_token,maxAttempts,backoff,code]);
    if(res.rowCount!==1)throw new Error('Outbox lease lost');return true;
   });
  }
 });
}

/** One-message runner; scheduling / concurrency / alerting belong to the host service. */
export async function runOutboxOnce({outbox,deliver}){
 if(!outbox||typeof outbox.claim!=='function'||typeof outbox.complete!=='function'||typeof outbox.fail!=='function'||typeof deliver!=='function')throw new Error('Outbox worker adapters required');
 const message=await outbox.claim();if(!message)return {status:'idle'};
 try{
  const result=await deliver(message);
  if(typeof result?.reference!=='string'||!result.reference)throw new Error('Missing provider delivery reference');
  await outbox.complete(message,result);
  return {status:'submitted',id:message.id};
 }catch(error){
  // If completion fails due to a lost lease, leave the row for recovery.
  if(error?.message==='Outbox lease lost')throw error;
  await outbox.fail(message,{code:'delivery_error'});
  return {status:'retry_scheduled',id:message.id};
 }
}
