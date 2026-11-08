/** Server-side role/permission administration with mandatory independently approved privileged changes. */
export function createRoleService({repository,authorized,requestApproval,audit}){
 if(!repository?.tenantBound||typeof repository.create!=='function'||typeof repository.assign!=='function'||typeof repository.verifyApprovedRole!=='function'||typeof repository.userBelongsToTenant!=='function'||typeof authorized!=='function'||typeof requestApproval!=='function'||typeof audit!=='function')throw new Error('Role service adapters required');
 function check(actor,action){if(!actor?.verified||!actor.tenantId||!actor.userId||authorized(actor,'roles',action)!==true)throw new Error('Role management forbidden');}
 return Object.freeze({
  async proposeRole(actor,{code,name,permissions=[]}){check(actor,'create');if(!/^[a-z][a-z0-9_]{2,63}$/.test(code)||!name?.trim()||!Array.isArray(permissions))throw new Error('Invalid role');
   for(const p of permissions)if(!p.feature||!['view','create','edit','delete','approve','export','manage'].includes(p.action))throw new Error('Invalid permission');
   const payload={tenantId:actor.tenantId,code,name:name.trim(),permissions};
   const request=await requestApproval({tenantId:actor.tenantId,makerId:actor.userId,entityType:'role',entityId:code,payload});
   await audit({action:'role_proposed',tenantId:actor.tenantId,actorId:actor.userId,resourceId:code});return request;
  },
  async applyApprovedRole(actor,approval){check(actor,'approve');if(approval?.status!=='approved'||approval?.makerId===actor.userId||approval?.tenantId!==actor.tenantId||approval?.entityType!=='role'||approval?.review?.reviewerId!==actor.userId||!await repository.verifyApprovedRole(actor.tenantId,approval.id,actor.userId,approval.version))throw new Error('Persisted independent approval required');
   await repository.create({...approval.payload,tenantId:actor.tenantId});await audit({action:'role_approved',tenantId:actor.tenantId,actorId:actor.userId,resourceId:approval.entityId});return true;
  },
  async assignRole(actor,{userId,roleId,functionCode,geographyId}){check(actor,'manage');if(!userId||!roleId||!functionCode||!geographyId)throw new Error('Role assignment must be scoped');
   if(typeof repository.hasAssignableRole!=='function'||!await repository.hasAssignableRole(actor.tenantId,roleId,actor.userId)||!await repository.userBelongsToTenant(actor.tenantId,userId))throw new Error('Role delegation denied');
   await repository.assign({tenantId:actor.tenantId,userId,roleId,functionCode,geographyId,grantedBy:actor.userId});await audit({action:'role_assigned',tenantId:actor.tenantId,actorId:actor.userId,resourceId:userId});return true;
  }
 });
}
