import {sqlIdentifier} from '../../modules/database/index.mjs';
import {requireTenantFilter} from '../../modules/tenant/index.mjs';
/** Calls SET LOCAL inside the SAME connection and transaction used for RLS-protected queries. */
export async function withTenantTransaction(pool,context,work){
 const {tenant_id}=requireTenantFilter(context);
 if(typeof pool?.connect!=='function'||typeof work!=='function')throw new Error('Postgres pool and work callback required');
 const client=await pool.connect();let begun=false;
 try{await client.query('BEGIN');begun=true;await client.query("SELECT set_config('app.tenant_id', $1, true)",[tenant_id]);
  const result=await work(client);await client.query('COMMIT');begun=false;return result;
 }catch(e){if(begun)try{await client.query('ROLLBACK');}catch{}throw e;}finally{client.release();}
}
/** Call only inside withTenantTransaction; allowed columns are explicitly schema-defined. */
export function postgresRepository(client,{table,columns},context){
 const {tenant_id}=requireTenantFilter(context);sqlIdentifier(table);
 if(typeof client?.query!=='function'||!Array.isArray(columns)||!columns.length)throw new Error('SQL client and columns required');
 columns.forEach(sqlIdentifier);const safe=[...new Set(columns)].filter(c=>!['id','tenant_id'].includes(c));
 const select=['id','tenant_id',...safe].join(',');
 return {
  async get(id){return (await client.query(`SELECT ${select} FROM ${table} WHERE tenant_id=$1 AND id=$2`,[tenant_id,id])).rows[0]??null;},
  async list(limit=50){if(!Number.isSafeInteger(limit)||limit<1||limit>200)throw new Error('Limit invalid');return (await client.query(`SELECT ${select} FROM ${table} WHERE tenant_id=$1 ORDER BY id LIMIT $2`,[tenant_id,limit])).rows;},
  async create({id,...data}){if(!id)throw new Error('Record ID required');const keys=safe.filter(k=>Object.hasOwn(data,k));const fields=['id','tenant_id',...keys];const binds=[id,tenant_id,...keys.map(k=>data[k])];const sql=`INSERT INTO ${table} (${fields.join(',')}) VALUES (${fields.map((_,i)=>`$${i+1}`).join(',')}) RETURNING ${select}`;return (await client.query(sql,binds)).rows[0];},
  async update(id,data){const keys=safe.filter(k=>Object.hasOwn(data,k));if(!id||!keys.length)throw new Error('Update requires allowed fields');const sql=`UPDATE ${table} SET ${keys.map((k,i)=>`${k}=$${i+3}`).join(',')} WHERE tenant_id=$1 AND id=$2 RETURNING ${select}`;return (await client.query(sql,[tenant_id,id,...keys.map(k=>data[k])])).rows[0]??null;}
 };
}
