import {createHash} from 'node:crypto';
import {withTenantTransaction} from './index.mjs';
import {requireTenantFilter} from '../../modules/tenant/index.mjs';

/**
 * Postgres-only durable event deduplication.
 * Run SQL migration 0003_idempotency.sql first. The callback MUST perform its
 * database changes using the provided transaction client, never pool.query.
 */
export function createPgIdempotencyStore(pool,context,{namespace='webhooks'}={}){
 const {tenant_id}=requireTenantFilter(context);
 if(!/^[a-z][a-z0-9_-]{0,63}$/.test(namespace))throw new Error('Invalid namespace');
 return Object.freeze({
  async runOnce(key,work){
   if(typeof key!=='string'||!key||key.length>8192||typeof work!=='function')throw new Error('Invalid idempotent operation');
   const digest=createHash('sha256').update(key).digest('hex');
   return withTenantTransaction(pool,context,async client=>{
    const created=await client.query(
      'INSERT INTO skeleton_idempotency (tenant_id, namespace, key_digest, result_json) VALUES ($1,$2,$3,NULL) ON CONFLICT DO NOTHING RETURNING key_digest',
      [tenant_id,namespace,digest]);
    if(created.rowCount===0){
      const existing=await client.query(
       'SELECT result_json FROM skeleton_idempotency WHERE tenant_id=$1 AND namespace=$2 AND key_digest=$3',
       [tenant_id,namespace,digest]);
      if(existing.rows.length!==1||existing.rows[0].result_json===null)throw new Error('Idempotency record unresolved');
      return existing.rows[0].result_json;
    }
    const result=await work(client);
    if(result===undefined)throw new Error('Idempotent callback must return a JSON value');
    const encoded=JSON.stringify(result);
    if(encoded===undefined||encoded.length>1048576)throw new Error('Idempotent result invalid or too large');
    await client.query('UPDATE skeleton_idempotency SET result_json=$4::jsonb WHERE tenant_id=$1 AND namespace=$2 AND key_digest=$3',
      [tenant_id,namespace,digest,encoded]);
    return result;
   });
  }
 });
}
