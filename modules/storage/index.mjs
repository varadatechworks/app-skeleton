export function objectKey({tenantId,category,id,fileName}){
 const safe=x=>typeof x==='string'&&/^[a-zA-Z0-9_-]{1,80}$/.test(x);
 if(!safe(tenantId)||!safe(category)||!safe(id)||typeof fileName!=='string'||!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,120}$/.test(fileName)||fileName==='.'||fileName==='..')throw new Error('Invalid storage key');
 return `${tenantId}/${category}/${id}/${fileName}`;
}
export function validateUpload({sizeBytes,mimeType},{maxBytes=10_000_000,allowedMimeTypes=['image/jpeg','image/png','application/pdf']}={}){
 if(!Number.isSafeInteger(sizeBytes)||sizeBytes<1||sizeBytes>maxBytes||!allowedMimeTypes.includes(mimeType))throw new Error('Upload is not allowed');
 return true;
}
export async function signedPrivateUpload(storage,{key,mimeType,expiresInSeconds=300}){
 if(typeof storage?.signUpload!=='function'||!key||!mimeType||!Number.isSafeInteger(expiresInSeconds)||expiresInSeconds<1||expiresInSeconds>900)throw new Error('Private signing adapter required');
 return storage.signUpload({key,mimeType,expiresInSeconds});
}
