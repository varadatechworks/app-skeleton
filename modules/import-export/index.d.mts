export {csvExport} from '../reporting/index.mjs';
export declare function validateBulk(rows:Record<string,unknown>[],options?:{required?:string[];keyFields?:string[];maxRows?:number}):{accepted:Record<string,unknown>[];errors:{row:number;error:string;fields?:string[]}[];total:number;valid:number};
