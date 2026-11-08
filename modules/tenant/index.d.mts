export type TenancyMode='customer_hosted'|'managed_single_tenant'|'shared_saas';
export interface TenantContext{mode:TenancyMode;tenantId:string;verified:true}
export declare const DEPLOYMENT_MODES:readonly TenancyMode[];
export declare function tenantContext(input:{mode:TenancyMode;tenantId:string;verified:boolean}):TenantContext;
export declare function assertSameTenant(context:TenantContext,entityTenantId:string):true;
export declare function requireTenantFilter(context:TenantContext):{tenant_id:string};
