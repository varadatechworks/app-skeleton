import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createPgIdempotencyStore} from '../adapters/postgres/idempotency.mjs';

test('real PostgreSQL idempotency, RLS and rollback', {skip:!process.env.SKELETON_PG_TEST_URL}, async()=>{
 const {Pool}=(await import('pg')).default;
 const admin=new Pool({connectionString:process.env.SKELETON_PG_TEST_URL});
 let pool;
 try{
  await admin.query(await readFile(new URL('../sql/postgres/0003_idempotency.sql',import.meta.url),'utf8'));
  await admin.query("DO $$ BEGIN IF NOT EXISTS(SELECT FROM pg_roles WHERE rolname='skeleton_ci_app') THEN CREATE ROLE skeleton_ci_app LOGIN PASSWORD 'ci_local_only'; END IF; END $$");
  await admin.query('GRANT USAGE ON SCHEMA public TO skeleton_ci_app');
  await admin.query('GRANT SELECT,INSERT,UPDATE ON skeleton_idempotency TO skeleton_ci_app');
  const appUrl=new URL(process.env.SKELETON_PG_TEST_URL);
  appUrl.username='skeleton_ci_app';appUrl.password='ci_local_only';
  pool=new Pool({connectionString:appUrl.toString(),max:8});
  const tenantA={verified:true,tenantId:'test_a'},tenantB={verified:true,tenantId:'test_b'};
  const a=createPgIdempotencyStore(pool,tenantA);
  let executions=0;
  const outcomes=await Promise.all(Array.from({length:8},()=>a.runOnce('same-event',async client=>{
   executions++;
   await client.query('SELECT pg_sleep(0.02)');
   return {effect:executions};
  })));
  assert.equal(executions,1);
  assert.ok(outcomes.every(x=>x.effect===1));
  const b=createPgIdempotencyStore(pool,tenantB);
  assert.deepEqual(await b.runOnce('same-event',async()=>({effect:'tenantB'})),{effect:'tenantB'});
  await assert.rejects(()=>a.runOnce('will-rollback',async()=>{throw new Error('failure');}),/failure/);
  assert.deepEqual(await a.runOnce('will-rollback',async()=>({effect:'after-rollback'})),{effect:'after-rollback'});
  const appClient=await pool.connect();
  try{
   // Without SET LOCAL app.tenant_id, RLS must hide all rows.
   const result=await appClient.query('SELECT * FROM skeleton_idempotency');
   assert.equal(result.rowCount,0);
  }finally{appClient.release();}
 }finally{if(pool)await pool.end();await admin.end();}
});
