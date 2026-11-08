export function publishRelease({platform,versionName,versionCode,downloadUrl,sha256,mandatory=false,enabled=true}){
 if(!['android','ios'].includes(platform)||!/^\d+\.\d+\.\d+(?:[-+][a-zA-Z0-9.-]+)?$/.test(versionName)||!Number.isSafeInteger(versionCode)||versionCode<1)throw new Error('Invalid app version');
 if(typeof downloadUrl!=='string'||!downloadUrl.startsWith('https://')||!/^[a-f0-9]{64}$/i.test(sha256))throw new Error('HTTPS artifact and SHA-256 required');
 return {platform,versionName,versionCode,downloadUrl,sha256:sha256.toLowerCase(),mandatory:Boolean(mandatory),enabled:Boolean(enabled)};
}
export function updateDecision(currentCode,release){
 if(!Number.isSafeInteger(currentCode)||currentCode<0||!release?.enabled)return {update:false,mandatory:false};
 const update=release.versionCode>currentCode;return {update,mandatory:update&&release.mandatory,release:update?release:null};
}
