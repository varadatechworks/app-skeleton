import {sqlIdentifier} from '../../modules/database/index.mjs';
import {requireTenantFilter} from '../../modules/tenant/index.mjs';
/** D1 lacks RLS. All access must be through tenant-bound queries; transactions/batch handling caller-owned. */
export function d1Repository(db,{table,columns},context){
 const {tenant_id}=requireTenantFilter(context);sqlIdentifier(table);
 if(typeof db?.prepare!=='function'||!Array.isArray(columns)||!columns.length)throw new Error('D1 binding and columns required');
 columns.forEach(sqlIdentifier);const safe=[...new Set(columns)].filter(c=>!['id','tenant_id'].includes(c));const select=['id','tenant_id',...safe].join(',');
 return {
  async get(id){return db.prepare(`SELECT ${select} FROM ${table} WHERE tenant_id=? AND id=?`).bind(tenant_id,id).first();},
  async list(limit=50){if(!Number.isSafeInteger(limit)||limit<1||limit>200)throw new Error('Limit invalid');const x=await db.prepare(`SELECT ${select} FROM ${table} WHERE tenant_id=? ORDER BY id LIMIT ?`).bind(tenant_id,limit).all();return x.results||[];},
  async create({id,...data}){if(!id)throw new Error('Record ID required');const keys=safe.filter(k=>Object.hasOwn(data,k));const fields=['id','tenant_id',...keys];await db.prepare(`INSERT INTO ${table} (${fields.join(',')}) VALUES (${fields.map(()=>'?').join(',')})`).bind(id,tenant_id,...keys.map(k=>data[k])).run();return this.get(id);},
  async update(id,data){const keys=safe.filter(k=>Object.hasOwn(data,k));if(!id||!keys.length)throw new Error('Update requires allowed fields');await db.prepare(`UPDATE ${table} SET ${keys.map(k=>`${k}=?`).join(',')} WHERE tenant_id=? AND id=?`).bind(...keys.map(k=>data[k]),tenant_id,id).run();return this.get(id);}
 };
}
