export declare function reconcilePayments(input:{internal:Array<{providerReference:string;currency:string;amountMinor:number}>;provider:Array<{providerReference:string;currency:string;amountMinor:number}>;currency:string}):any;
export declare function calculateSettlementSplit(input:{capturedMinor:number;refundMinor?:number;platformFeeBps?:number;processingFeeMinor?:number}):any;
