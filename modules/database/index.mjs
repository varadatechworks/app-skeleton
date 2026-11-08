/** Application provides connection, transaction implementation and tenant-bound repositories. */
export function sqlIdentifier(value){if(typeof value!=='string'||!/^[a-z_][a-z0-9_]*$/.test(value))throw new Error('Unsafe SQL identifier');return value;}
export function parameterizedInsert(table,fields,{dialect='postgres'}={}){
 sqlIdentifier(table);if(!Array.isArray(fields)||!fields.length||new Set(fields).size!==fields.length)throw new Error('Fields required and must be unique');fields.forEach(sqlIdentifier);
 if(!['postgres','d1'].includes(dialect))throw new Error('Unknown dialect');
 const placeholders=fields.map((_,i)=>dialect==='postgres'?`$${i+1}`:'?').join(',');
 return `INSERT INTO ${table} (${fields.join(',')}) VALUES (${placeholders})`;
}
export async function inTransaction(adapter,fn){
 if(typeof adapter?.transaction!=='function'||typeof fn!=='function')throw new Error('Transactional adapter required');
 return adapter.transaction(fn);
}
export function requireTenantRepository(repo){if(!repo?.tenantBound||typeof repo.find!=='function'||typeof repo.save!=='function')throw new Error('Tenant-bound repository required');return repo;}
