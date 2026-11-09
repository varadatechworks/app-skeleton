import {requireTrustedPrincipal} from '../../modules/identity/index.mjs';
/**
 * Next.js App Router route-handler boundary. Token verification and grants are
 * injected by the consumer; route results are always marked private/no-store.
 */
export function createNextRoute({verifyPrincipal,authorize,feature,action,handler}){
 if([verifyPrincipal,authorize,handler].some(f=>typeof f!=='function')||!feature||!action)throw new Error('Next route configuration invalid');
 return async function route(request,context){
  const headers={'cache-control':'private, no-store','content-type':'application/json'};
  let actor;
  try{actor=requireTrustedPrincipal(await verifyPrincipal(request));}
  catch{return new Response(JSON.stringify({message:'Please sign in'}),{status:401,headers});}
  if(await authorize(actor,feature,action,context)!==true)return new Response(JSON.stringify({message:'Access denied'}),{status:403,headers});
  try{
   const result=await handler(request,actor,context);
   if(!(result instanceof Response))throw new Error('Handler must return Response');
   const safeHeaders=new Headers(result.headers);
   safeHeaders.set('cache-control','private, no-store');
   return new Response(result.body,{status:result.status,statusText:result.statusText,headers:safeHeaders});
  }catch{return new Response(JSON.stringify({message:'Something went wrong'}),{status:500,headers});}
 };
}
