export type Channel='email'|'sms'|'whatsapp'|'push'|'in_app';
export interface NotificationMessage {id:string;tenantId:string;userId:string;channel:Channel;template:string;variables?:Record<string,string|number|boolean>}
export declare const CHANNELS:readonly Channel[];
export declare function renderTemplate(template:string,variables?:Record<string,string|number|boolean>):string;
export declare function createDispatcher(options:{providers:Partial<Record<Channel,{send:(record:object)=>Promise<{reference?:string}>>>;now?:()=>Date}):(message:NotificationMessage,policy?:{consent?:Record<string,boolean>;preferences?:Record<string,boolean>;dryRun?:boolean})=>Promise<Record<string,unknown>>;
export declare function outboxEnvelope(message:NotificationMessage,options?:{attempt?:number;nextAttemptAt?:string|null}):Record<string,unknown>;
