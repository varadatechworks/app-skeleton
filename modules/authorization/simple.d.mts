export type Action='view'|'create'|'edit'|'delete'|'approve'|'export'|'manage';
export type RoleGrants=Record<string,Record<string,Action[]>>;
export declare const ACTIONS:readonly Action[];
export declare function allowedSimple(input:{roles:string[];roleGrants:RoleGrants;resource:string;action:Action}):boolean;
export declare function requireSimple(input:{roles:string[];roleGrants:RoleGrants;resource:string;action:Action}):true;
