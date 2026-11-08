/** Channel adapters receive a supplied transport. No secrets or network SDK hardwired into the skeleton. */
export function channelProvider(channel,transport){
 if(!['email','sms','whatsapp','push','in_app'].includes(channel)||typeof transport!=='function')throw new Error('Channel transport required');
 return Object.freeze({channel,send:async payload=>transport(payload)});
}
export function consoleProvider(logger=()=>{}){return Object.freeze({send:async payload=>{logger({id:payload.id,channel:payload.channel,status:'dry_run'});return {reference:`dry-${payload.id}`};}});}
export const emailProvider=transport=>channelProvider('email',transport);
export const smsProvider=transport=>channelProvider('sms',transport);
export const whatsappProvider=transport=>channelProvider('whatsapp',transport);
export const pushProvider=transport=>channelProvider('push',transport);
export const inAppProvider=transport=>channelProvider('in_app',transport);
