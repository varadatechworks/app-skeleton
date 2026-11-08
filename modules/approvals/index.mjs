export const DECISIONS=['approve','reject','request_changes','cancel'];
export function submitApproval({id,entityType,entityId,makerId,payload,tenantId,required=true,version=1,at=new Date().toISOString()}){
 if(!id||!entityType||!entityId||!makerId||!tenantId||!Number.isSafeInteger(version)||version<1)throw new Error('Invalid approval request');
 return {id,entityType,entityId,makerId,tenantId,payload:structuredClone(payload??{}),required,version,status:'pending',submittedAt:at,review:null};
}
export function decideApproval(request,{reviewerId,reviewerTenantId,decision,note='',canApprove=false,expectedVersion,at=new Date().toISOString()}){
 if(request?.status!=='pending'||!DECISIONS.includes(decision))throw new Error('Approval is not pending');
 if(expectedVersion!==request.version)throw new Error('Stale approval revision');
 if(!reviewerId||reviewerId===request.makerId)throw new Error('Maker cannot approve own request');
 if(!canApprove||reviewerTenantId!==request.tenantId)throw new Error('Reviewer not authorized');
 if(decision!=='approve'&&!note.trim())throw new Error('Review note required');
 const status={approve:'approved',reject:'rejected',request_changes:'change_requested',cancel:'cancelled'}[decision];
 return {...request,status,version:request.version+1,review:{reviewerId,decision,note:note.trim(),at}};
}
