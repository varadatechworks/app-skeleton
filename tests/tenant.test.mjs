import test from 'node:test';import assert from 'node:assert/strict';
import {tenantContext,assertSameTenant,requireTenantFilter} from '../modules/tenant/index.mjs';
test('tenant enforcement fail closed',()=>{const ctx=tenantContext({mode:'shared_saas',tenantId:'t1',verified:true});assert.equal(assertSameTenant(ctx,'t1'),true);assert.throws(()=>assertSameTenant(ctx,'t2'));assert.deepEqual(requireTenantFilter(ctx),{tenant_id:'t1'});assert.throws(()=>tenantContext({mode:'shared_saas',tenantId:'t1'}));});
