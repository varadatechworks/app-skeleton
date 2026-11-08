export interface Coordinates{latitude:number;longitude:number}
export interface GeoEvidence extends Coordinates{accuracyMeters:number;capturedAt:string;source?:string;mocked:boolean}
export declare function validateCoordinates(latitude:number,longitude:number):Coordinates;
export declare function validateGeoEvidence(evidence:GeoEvidence,options?:{maxAccuracyMeters?:number;allowMocked?:boolean}):GeoEvidence;
export declare function distanceMeters(a:Coordinates,b:Coordinates):number;
export declare function geographyContains(nodes:Array<{id:string;parentId?:string;tenantId:string;level:string}>,scope:{id:string;tenantId:string;level?:string},target:{id:string;tenantId:string;level?:string}):boolean;
export declare function resolveServiceability<T extends {active?:boolean;priority?:number;state?:string;district?:string;taluk?:string;pincode?:string}>(rules:T[],location:{state?:string;district?:string;taluk?:string;pincode?:string}):T|null;
export declare function normalizeEventLocation(input:Record<string,unknown>):Record<string,unknown>;
