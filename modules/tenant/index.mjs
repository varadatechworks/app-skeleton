export const DEPLOYMENT_MODES=Object.freeze(['customer_hosted','managed_single_tenant','shared_saas']);
export function tenantContext({mode,tenantId,verified=false}){
  if(!DEPLOYMENT_MODES.includes(mode))throw new Error('Unsupported deployment mode');
  if(!verified||typeof tenantId!=='string'||!tenantId.trim())throw new Error('Verified tenant context required');
  return Object.freeze({mode,tenantId:tenantId.trim(),verified:true});
}
export function assertSameTenant(context,entityTenantId){
  if(context?.verified!==true||!context.tenantId||!entityTenantId||context.tenantId!==entityTenantId)throw new Error('Tenant access denied');
  return true;
}
export function requireTenantFilter(context){if(context?.verified!==true||!context.tenantId)throw new Error('Verified tenant context required');return {tenant_id:context.tenantId};}
