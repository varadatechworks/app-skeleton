import test from 'node:test';import assert from 'node:assert/strict';
import {validateBulk,csvExport} from '../modules/import-export/index.mjs';
test('bulk imports find missing/duplicate rows before writes',()=>{const x=validateBulk([{email:'A@b.com'},{email:'a@B.com'},{email:''}],{required:['email'],keyFields:['email']});assert.equal(x.valid,1);assert.equal(x.errors.length,2);assert.match(csvExport([{f:'=2+3'}],['f']),/"'=2\+3"/);});
