import {requireTrustedPrincipal} from '../../modules/identity/index.mjs';
/** Framework-agnostic route adapter; resolvePrincipal must verify session cryptographically. */
export function guardedHandler({resolvePrincipal,authorize,handler}){
 if([resolvePrincipal,authorize,handler].some(x=>typeof x!=='function'))throw new Error('Route adapters required');
 return async(req,{feature,action,target}={})=>{
  let principal;
  try{principal=requireTrustedPrincipal(await resolvePrincipal(req));}catch{return {status:401,body:{message:'Please sign in'}};}
  if(!feature||!action||await authorize(principal,feature,action,target)!==true)return {status:403,body:{message:'Access denied'}};
  try{return await handler(req,principal);}catch(e){return {status:500,body:{message:'Something went wrong'}};}
 };
}
