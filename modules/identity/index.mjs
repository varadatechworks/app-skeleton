/** Identity contracts only: session issuance, passwords, OTP and MFA stay in the app's trusted provider. */
export const USER_STATUSES = Object.freeze(['pending','active','suspended','deactivated']);
const transitions = {pending:['active','deactivated'],active:['suspended','deactivated'],suspended:['active','deactivated'],deactivated:[]};
export function normalizeIdentifier(value) {
  if (typeof value !== 'string' || !value.trim()) throw new TypeError('Identifier required');
  const s=value.trim();
  if(s.includes('@')) { if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s))throw new Error('Invalid email');return s.toLowerCase(); }
  const digits=s.replace(/[\s()+-]/g,'');
  if(!/^\d+$/.test(digits)||digits.length<7||digits.length>15)throw new Error('Invalid phone');
  return s.startsWith('+')?`+${digits}`:digits;
}
export function assertActiveUser(user){if(!user||!user.id||user.status!=='active')throw new Error('Active user required');return user;}
export function transitionUser(user,to,{actorId,reason}={}){
  if(!user?.id||!USER_STATUSES.includes(user.status)||!transitions[user.status].includes(to))throw new Error('Invalid account transition');
  if(!actorId || typeof reason!=='string'||!reason.trim())throw new Error('Actor and reason required');
  return {...user,status:to,updatedBy:actorId,statusReason:reason.trim()};
}
export function publicProfile(user){if(!user?.id)throw new Error('User required'); const {id,displayName,email,phone,status,locale}=user;return {id,displayName,email,phone,status,locale};}
export function requireTrustedPrincipal(principal){if(!principal?.verified||!principal?.userId||!principal?.tenantId)throw new Error('Verified principal required');return principal;}
