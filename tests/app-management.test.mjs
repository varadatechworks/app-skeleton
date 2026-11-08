import test from 'node:test';import assert from 'node:assert/strict';
import {publishRelease,updateDecision} from '../modules/app-management/index.mjs';
test('APK update metadata prevents downgrade and verifies integrity field',()=>{const r=publishRelease({platform:'android',versionName:'1.2.3',versionCode:12,downloadUrl:'https://example.com/app.apk',sha256:'f'.repeat(64),mandatory:true});assert.deepEqual([updateDecision(11,r).update,updateDecision(11,r).mandatory],[true,true]);assert.equal(updateDecision(12,r).update,false);assert.throws(()=>publishRelease({...r,sha256:'bad'}));});
