import {allowedSimple} from './simple.mjs';
/** Multi-role functional grants with independent tenant and geography scope. */
export function allowedScoped({actor,resource,action,roleGrants,target,containsGeography}){
 if(!actor?.verified||!actor.tenantId||!actor.userId||!target||actor.tenantId!==target.tenantId)return false;
 if(!Array.isArray(actor.roles))return false;
 if(typeof target.geographyId!=='string'||!target.geographyId)return false;
 if(typeof containsGeography!=='function')return false;
 const assignments=Array.isArray(actor.assignments)?actor.assignments:[];
 return assignments.some(a=>a.active===true&&a.tenantId===actor.tenantId&&a.geographyId&&
    actor.roles.includes(a.roleCode)&&allowedSimple({roles:[a.roleCode],roleGrants,resource,action})&&
    (a.functionCode===resource||a.functionCode==='*')&&
    containsGeography({level:a.level,id:a.geographyId,tenantId:actor.tenantId},{level:target.level,id:target.geographyId,tenantId:target.tenantId}));
}
export function requireScoped(input){if(!allowedScoped(input))throw new Error('Scoped access denied');return true;}
