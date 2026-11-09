import test from 'node:test';
import assert from 'node:assert/strict';
import {createSecureSession} from '../adapters/expo/secure-session.mjs';
test('Expo tokens are read, updated and cleared through injected SecureStore only',async()=>{
 const map=new Map();
 const secureStore={getItemAsync:async k=>map.get(k)??null,setItemAsync:async(k,v)=>{map.set(k,v);},deleteItemAsync:async k=>{map.delete(k);}};
 const session=createSecureSession({secureStore});
 assert.equal(await session.getAccessToken(),null);
 await session.setAccessToken('token');
 assert.equal(await session.getAccessToken(),'token');
 await session.clear();
 assert.equal(await session.getAccessToken(),null);
 await assert.rejects(()=>session.setAccessToken(''),/Invalid access token/);
 assert.throws(()=>createSecureSession({secureStore:{}}),/SecureStore adapter/);
});
