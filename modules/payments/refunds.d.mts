export declare function remainingRefundableMinor(input:{capturedMinor:number;settledRefundsMinor?:number;pendingRefundsMinor?:number}):number;
export declare function planRefund(input:{capturedMinor:number;settledRefundsMinor?:number;pendingRefundsMinor?:number;requestedMinor:number;feeDeductionMinor?:number;reason:string;actorId:string}):any;
export declare function nextRefundState(current:string,next:string):string;
