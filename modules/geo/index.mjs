export function validateCoordinates(latitude,longitude){
 if(typeof latitude!=='number'||!Number.isFinite(latitude)||latitude < -90||latitude>90||typeof longitude!=='number'||!Number.isFinite(longitude)||longitude< -180||longitude>180)throw new Error('Invalid coordinates');
 return {latitude,longitude};
}
export function validateGeoEvidence(evidence,{maxAccuracyMeters=10000,allowMocked=false}={}){
 if(!evidence||typeof evidence!=='object')throw new Error('Location evidence required');
 const {latitude,longitude}=validateCoordinates(evidence.latitude,evidence.longitude);
 if(typeof evidence.accuracyMeters!=='number'||!Number.isFinite(evidence.accuracyMeters)||evidence.accuracyMeters<0||evidence.accuracyMeters>maxAccuracyMeters)throw new Error('Location accuracy not acceptable');
 const timestamp=Date.parse(evidence.capturedAt);
 if(!Number.isFinite(timestamp))throw new Error('Location capture timestamp required');
 if(evidence.mocked===true&&!allowMocked)throw new Error('Mock locations require manual review');
 return Object.freeze({latitude,longitude,accuracyMeters:evidence.accuracyMeters,capturedAt:new Date(timestamp).toISOString(),source:String(evidence.source||'unknown').slice(0,40),mocked:Boolean(evidence.mocked)});
}
export function distanceMeters(a,b){const x=validateCoordinates(a.latitude,a.longitude),y=validateCoordinates(b.latitude,b.longitude),r=Math.PI/180;
 const dLat=(y.latitude-x.latitude)*r,dLon=(y.longitude-x.longitude)*r;
 const h=Math.sin(dLat/2)**2+Math.cos(x.latitude*r)*Math.cos(y.latitude*r)*Math.sin(dLon/2)**2;
 return 6371000*2*Math.atan2(Math.sqrt(h),Math.sqrt(Math.max(0,1-h)));
}
/** Nodes = [{id,parentId,tenantId,level}]. A parent scope includes its descendants, never its ancestors. */
export function geographyContains(nodes,scope,target){
 if(!scope?.id||!target?.id||!scope.tenantId||scope.tenantId!==target.tenantId)return false;
 const lookup=new Map(nodes.filter(n=>n.tenantId===scope.tenantId).map(n=>[n.id,n]));
 let current=lookup.get(target.id),visited=new Set();
 while(current){if(visited.has(current.id))return false;visited.add(current.id);
   if(current.id===scope.id)return current.level===scope.level;
   current=lookup.get(current.parentId);
 }
 return false;
}
/** Ordered most-specific active geographical rule wins; priority breaks same-specificity ties. */
export function resolveServiceability(rules,location){
 const fields=['state','district','taluk','pincode'];
 return (rules||[]).filter(r=>r.active!==false&&fields.every(f=>!r[f]||String(r[f]).toLowerCase()===String(location?.[f]||'').toLowerCase()))
 .sort((a,b)=>fields.filter(f=>b[f]).length-fields.filter(f=>a[f]).length||(a.priority??0)-(b.priority??0))[0]??null;
}

/** Captures a location audit for every event, including unavailable coordinates with explicit reason. */
export function normalizeEventLocation(input){
 if(!input||typeof input!=='object')throw new Error('Event location required');
 if(['UNAVAILABLE','SYSTEM'].includes(input.source)){
   if(typeof input.unavailableReason!=='string'||!input.unavailableReason.trim()||!['DENIED','NOT_REQUESTED','NOT_APPLICABLE'].includes(input.consentStatus))throw new Error('Location unavailable reason and consent required');
   return {source:input.source,latitude:null,longitude:null,accuracyMeters:null,capturedAt:null,consentStatus:input.consentStatus,unavailableReason:input.unavailableReason.trim().slice(0,160)};
 }
 if(!['DEVICE_GPS','DEVICE_NETWORK','ADDRESS_GEOCODE','MANUAL'].includes(input.source)||!['GRANTED','NOT_APPLICABLE'].includes(input.consentStatus))throw new Error('Invalid location source or consent');
 const {latitude,longitude}=validateCoordinates(input.latitude,input.longitude);
 if(input.accuracyMeters!==undefined&&(!Number.isFinite(input.accuracyMeters)||input.accuracyMeters<0))throw new Error('Invalid accuracy');
 if(typeof input.capturedAt!=='string'||!Number.isFinite(Date.parse(input.capturedAt)))throw new Error('Location capture time required');
 return {source:input.source,latitude,longitude,accuracyMeters:input.accuracyMeters??null,capturedAt:new Date(input.capturedAt).toISOString(),consentStatus:input.consentStatus,unavailableReason:null};
}
