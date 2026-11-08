import test from 'node:test';import assert from 'node:assert/strict';import {mkdtemp,readFile,readdir,rm} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join,resolve} from 'node:path';import {spawnSync} from 'node:child_process';
test('generator includes transitive deps and selected tests only',async()=>{const tmp=await mkdtemp(join(tmpdir(),'varada-skel-'));try{
 const tool=resolve('tools/create-app.mjs');let r=spawnSync(process.execPath,[tool,'--project','sample-field','--modules','survey,notifications','--adapters','postgres','--db','postgres','--ui','next-admin','--out',tmp],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);
 const files=await readdir(join(tmp,'sample-field','modules'));assert.deepEqual(files.sort(),['database','geo','notifications','survey','tenant']);const manifest=JSON.parse(await readFile(join(tmp,'sample-field','modules.json'),'utf8'));assert.ok(manifest.modules.includes('geo'));assert.deepEqual(manifest.adapters,['postgres']);assert.equal(manifest.db,'postgres');assert.equal(manifest.ui,'next-admin');await readFile(join(tmp,'sample-field','adapters','postgres','index.mjs'));await readFile(join(tmp,'sample-field','templates','next-admin','UsersPage.tsx'));
 r=spawnSync(process.execPath,[tool,'--project','sample-field','--modules','survey','--out',tmp],{encoding:'utf8'});assert.notEqual(r.status,0);
 r=spawnSync(process.execPath,[tool,'--project','../danger','--modules','survey','--out',tmp],{encoding:'utf8'});assert.notEqual(r.status,0);
 r=spawnSync(process.execPath,['--test','tests/*.test.mjs'],{cwd:join(tmp,'sample-field'),encoding:'utf8',shell:true});assert.equal(r.status,0,r.stderr);
}finally{await rm(tmp,{recursive:true,force:true});}});

test('payment modules bring payment lifecycle tests and optional schema',async()=>{
 const tmp=await mkdtemp(join(tmpdir(),'varada-pay-skel-'));try{
  const tool=resolve('tools/create-app.mjs');const r=spawnSync(process.execPath,[tool,'--project','payment-app','--modules','payments,billing','--db','d1','--out',tmp],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);
  await readFile(join(tmp,'payment-app','tests','payment-lifecycle.test.mjs'));
  await readFile(join(tmp,'payment-app','sql','d1','0002_payments.sql'));
  const t=spawnSync(process.execPath,['--test','tests/*.test.mjs'],{cwd:join(tmp,'payment-app'),encoding:'utf8',shell:true});assert.equal(t.status,0,t.stderr);
 }finally{await rm(tmp,{recursive:true,force:true});}
});
