import {requireTrustedPrincipal} from '../../modules/identity/index.mjs';
/**
 * Next.js App Router route-handler boundary. Authentication and permissions are
 * checked before loading private data. Explicitly set no-store for sensitive data.
 */
export function createNextRoute({verifyPrincipal,authorize,feature,action,handler}){
 if([verifyPrincipal,authorize,handler].some(f=>typeof f!=='function')||!feature||!action)throw new Error('Next route configuration invalid');
 return async function route(request,context){
  const headers={'cache-control':'no-store','content-type':'application/json'};
  let actor;
  try{actor=requireTrustedPrincipal(await verifyPrincipal(request));}
  catch{return new Response(JSON.stringify({message:'Please sign in'}),{status:401,headers});}
  if(await authorize(actor,feature,action,context)!==true)return new Response(JSON.stringify({message:'Access denied'}),{status:403,headers});
  try{return await handler(request,actor,context);}
  catch{return new Response(JSON.stringify({message:'Something went wrong'}),{status:500,headers});}
 };
}
