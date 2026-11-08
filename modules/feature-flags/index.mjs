/** Feature visibility != authorization. Enforce permission again in backend route/service. */
export function featureEnabled(feature,{tenantId,roles=[],environment='production',rules=[]}={}){
 if(!feature||!tenantId||!Array.isArray(roles))return false;
 return rules.some(r=>r.feature===feature&&r.enabled===true&&(r.tenantId===undefined||r.tenantId===tenantId)&&(r.environment===undefined||r.environment===environment)&&(r.roles===undefined||r.roles.some(role=>roles.includes(role))));
}
export function visibleFeatures(features,context){return features.filter(f=>featureEnabled(f,context));}
