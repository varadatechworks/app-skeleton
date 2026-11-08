import {assertSameTenant} from '../tenant/index.mjs';
import {normalizeIdentifier,transitionUser,publicProfile} from './index.mjs';
/** Real CRUD against injected tenant-bound transactional repository. Provider owns session/MFA. */
export function createUserService({repository,authorize,audit}){
 if(!repository?.tenantBound||!['list','get','create','save'].every(k=>typeof repository[k]==='function')||typeof authorize!=='function'||typeof audit!=='function')throw new Error('Tenant-bound user repository, authorization and audit required');
 function check(actor,action){if(!actor?.verified||!actor.userId||!actor.tenantId||authorize(actor,'users',action)!==true)throw new Error('User management forbidden');}
 return Object.freeze({
  async list(actor,{limit=50}={}){check(actor,'view');if(!Number.isSafeInteger(limit)||limit<1||limit>200)throw new Error('Invalid limit');return (await repository.list(actor.tenantId,limit)).map(u=>{assertSameTenant(actor,u.tenantId);return publicProfile(u);});},
  async get(actor,id){check(actor,'view');const u=await repository.get(actor.tenantId,id);if(!u)return null;assertSameTenant(actor,u.tenantId);return publicProfile(u);},
  async create(actor,{id,displayName,email,mobile,locale='en'}){check(actor,'create');if(!id||!displayName?.trim()||!email&&!mobile)throw new Error('Invalid user');const profile={id,tenantId:actor.tenantId,displayName:displayName.trim(),email:email?normalizeIdentifier(email):null,mobile:mobile?normalizeIdentifier(mobile):null,locale,status:'pending'};await repository.create(profile);await audit({action:'user_created',actorId:actor.userId,tenantId:actor.tenantId,resourceId:id});return publicProfile(profile);},
  async changeStatus(actor,id,to,reason){check(actor,'edit');const current=await repository.get(actor.tenantId,id);if(!current)throw new Error('User not found');assertSameTenant(actor,current.tenantId);const next=transitionUser(current,to,{actorId:actor.userId,reason});await repository.save(next);await audit({action:'user_status_changed',actorId:actor.userId,tenantId:actor.tenantId,resourceId:id,to});return publicProfile(next);}
 });
}
