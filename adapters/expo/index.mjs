/**
 * Small Expo/React Native HTTP client. Pass getAccessToken implemented through
 * SecureStore (NOT AsyncStorage), and refreshToken with a single-flight policy.
 * Server must validate roles; mobile navigation gating is cosmetic only.
 */
export function createExpoApi({baseUrl,getAccessToken,fetchImpl=globalThis.fetch,onUnauthorized=()=>{}}){
 if(typeof baseUrl!=='string'||!/^https:\/\//.test(baseUrl)||typeof getAccessToken!=='function'||typeof fetchImpl!=='function'||typeof onUnauthorized!=='function')throw new Error('Secure Expo API configuration required');
 const root=baseUrl.replace(/\/$/,'');
 return Object.freeze({
  async request(path,{method='GET',body,signal}={}){
   if(typeof path!=='string'||!/^\/[a-zA-Z0-9/_?=&.%-]*$/.test(path)||path.startsWith('//'))throw new Error('Invalid API path');
   if(!['GET','POST','PUT','PATCH','DELETE'].includes(method))throw new Error('Invalid method');
   if(body!==undefined&&['GET','DELETE'].includes(method))throw new Error('Unexpected request body');
   const token=await getAccessToken();
   if(typeof token!=='string'||!token){onUnauthorized();throw new Error('Please sign in');}
   const res=await fetchImpl(root+path,{method,signal,redirect:'error',headers:{authorization:'Bearer '+token,accept:'application/json',...(body!==undefined?{'content-type':'application/json'}:{})},body:body===undefined?undefined:JSON.stringify(body)});
   if(res.status===401){onUnauthorized();throw new Error('Session expired. Please sign in');}
   if(!res.ok)throw new Error(res.status===403?'Access denied':res.status===429?'Too many requests. Please try again':'Request unsuccessful. Please retry');
   if(res.status===204)return null;
   return res.json();
  }
 });
}
