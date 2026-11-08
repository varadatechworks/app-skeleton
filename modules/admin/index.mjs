const base=[{id:'dashboard',title:'Dashboard',feature:'dashboard'},{id:'users',title:'Users',feature:'users'},{id:'roles',title:'Roles & permissions',feature:'roles'},{id:'notifications',title:'Notifications',feature:'notifications'},{id:'reports',title:'Reports',feature:'reports'},{id:'cms',title:'CMS',feature:'cms'},{id:'audit',title:'Audit logs',feature:'audit'}];
const operations=[{id:'bookings',title:'Bookings',feature:'bookings'},{id:'check-in',title:'Check-in',feature:'check_in'},{id:'payments',title:'Payments & refunds',feature:'payments'},{id:'pricing',title:'Tax & pricing',feature:'pricing'},{id:'app-management',title:'App releases',feature:'app_management'}];
const governance=[{id:'hierarchy',title:'Geography masters',feature:'geography'},{id:'field-team',title:'Field staff',feature:'field_users'},{id:'survey',title:'Survey / Varadi',feature:'surveys'},{id:'approvals',title:'Approval inbox',feature:'approvals'},{id:'report-builder',title:'Custom reports',feature:'report_builder'}];
export const ADMIN_PRESETS=Object.freeze({basic:base,operational:[...base,...operations],governance:[...base,...governance],comprehensive:[...base,...operations,...governance]});
export function navigationFor({preset='basic',grants={},extra=[]}={}){
 if(!Object.hasOwn(ADMIN_PRESETS,preset)||!Array.isArray(extra))throw new Error('Unknown admin preset');
 return [...ADMIN_PRESETS[preset],...extra].filter(item=>typeof item.id==='string'&&Array.isArray(grants[item.feature])&&grants[item.feature].includes('view'));
}
export function verifyAdminAction(grants,feature,action){if(!Array.isArray(grants?.[feature])||!grants[feature].includes(action))throw new Error('Admin operation forbidden');return true;}
