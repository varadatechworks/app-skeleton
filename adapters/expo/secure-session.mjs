/**
 * Expo SecureStore bridge. Pass the installed expo-secure-store module by DI.
 * Never store tokens in AsyncStorage or persist raw credentials in app logs.
 * Token issuance/rotation/revocation remains owned by the backend.
 */
export function createSecureSession({secureStore,key='varada.session.access'}){
 if(typeof secureStore?.getItemAsync!=='function'||typeof secureStore?.setItemAsync!=='function'||typeof secureStore?.deleteItemAsync!=='function'||!/^[a-z][a-z0-9._-]{3,100}$/.test(key))throw new Error('Expo SecureStore adapter required');
 return Object.freeze({
  async getAccessToken(){const token=await secureStore.getItemAsync(key);return typeof token==='string'&&token?token:null;},
  async setAccessToken(token){if(typeof token!=='string'||!token||token.length>16000)throw new Error('Invalid access token');await secureStore.setItemAsync(key,token);},
  async clear(){await secureStore.deleteItemAsync(key);}
 });
}
