import test from 'node:test';import assert from 'node:assert/strict';
import {correlationId,safeApiError,requestTelemetry} from '../modules/observability/index.mjs';
test('correlation and errors hide internal errors',()=>{assert.equal(correlationId('abcdef012345'),'abcdef012345');assert.notEqual(correlationId('bad'),'bad');assert.equal(safeApiError({status:401,correlationId:'a'}).body.message,'Please sign in');assert.equal(requestTelemetry({correlationId:'123456789',method:'GET',path:'/api?password=secret',status:200,durationMs:2}).path,'/api');});
