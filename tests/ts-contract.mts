import {allowedSimple} from '../modules/authorization/index.mjs';
import {tenantContext} from '../modules/tenant/index.mjs';
import {calculateQuote} from '../modules/billing/index.mjs';
const c=tenantContext({mode:'shared_saas',tenantId:'t',verified:true});
const allowed:boolean=allowedSimple({roles:['ADMIN'],roleGrants:{ADMIN:{users:['view']}},resource:'users',action:'view'});
const total:number=calculateQuote({tenantId:c.tenantId,unitPriceMinor:100}).totalMinor;
void allowed;void total;
