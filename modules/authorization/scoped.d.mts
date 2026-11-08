import type {Action,RoleGrants} from './simple.mjs';
export interface GeographyScope {tenantId:string;level:string;id:string}
export interface ScopedActor {verified:true;userId:string;tenantId:string;roles:string[];assignments:{active:boolean;tenantId:string;level:string;geographyId:string;roleCode:string;functionCode:string}[]}
export interface ScopedInput {actor:ScopedActor;resource:string;action:Action;roleGrants:RoleGrants;target:{tenantId:string;level:string;geographyId:string};containsGeography:(a:GeographyScope,b:GeographyScope)=>boolean}
export declare function allowedScoped(input:ScopedInput):boolean;
export declare function requireScoped(input:ScopedInput):true;
