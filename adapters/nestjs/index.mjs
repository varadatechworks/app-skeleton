import {requireTrustedPrincipal} from '../../modules/identity/index.mjs';
/**
 * Framework-compatible guard factory. Wire as NestJS CanActivate via useGuards;
 * verifyPrincipal must validate JWT/signature/audience/expiry/revocation itself.
 * Do not trust request headers as an identity source.
 */
export function createNestGuard({verifyPrincipal,authorize,feature,action,resolveTarget=()=>null}){
 if(typeof verifyPrincipal!=='function'||typeof authorize!=='function'||!feature||!action||typeof resolveTarget!=='function')throw new Error('Nest guard configuration invalid');
 return Object.freeze({
  async canActivate(context){
   const req=context.switchToHttp().getRequest();
   let actor;
   try{actor=requireTrustedPrincipal(await verifyPrincipal(req));}
   catch {const e=new Error('Authentication required');e.status=401;throw e;}
   if(await authorize(actor,feature,action,await resolveTarget(req,actor))!==true){
    const e=new Error('Access denied');e.status=403;throw e;
   }
   req.actor=actor;
   return true;
  }
 });
}
