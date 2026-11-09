/**
 * Explicitly opt-in HTTPS transport for provider APIs. Caller supplies URL and
 * credentials from SERVER ENV only. No browser/mobile use. Tests inject fetch.
 */
export function createServerHttpTransport({fetchImpl=globalThis.fetch,timeoutMs=10000}={}){
 if(typeof fetchImpl!=='function'||!Number.isSafeInteger(timeoutMs)||timeoutMs<100||timeoutMs>60000)throw new Error('Invalid HTTP transport');
 return async function send(url,{method='POST',headers={},body}={}){
  const parsed=new URL(url);
  if(parsed.protocol!=='https:'||parsed.username||parsed.password)throw new Error('Provider HTTPS URL required');
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeoutMs);
  try{
   const response=await fetchImpl(parsed.href,{method,headers,body:JSON.stringify(body),signal:controller.signal,redirect:'error'});
   const text=await response.text();
   if(!response.ok)throw new Error('Provider request failed ('+response.status+')');
   try{return text?JSON.parse(text):{};}catch{throw new Error('Provider response invalid');}
  }finally{clearTimeout(timer);}
 };
}
