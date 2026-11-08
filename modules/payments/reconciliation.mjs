function currencyAmount(n){if(!Number.isSafeInteger(n)||n<0)throw new Error('Invalid minor-unit amount');return n;}
/** Reconcile settlement reports from a provider against internal immutable transaction rows. */
export function reconcilePayments({internal,provider,currency}) {
 if(!currency||!Array.isArray(internal)||!Array.isArray(provider))throw new Error('Invalid reconciliation input');
 const key=x=>{if(!x?.providerReference||x.currency!==currency)throw new Error('Reference or currency mismatch');currencyAmount(x.amountMinor);return x.providerReference;};
 const left=new Map(),right=new Map();
 for(const item of internal){const k=key(item);if(left.has(k))throw new Error('Duplicate internal payment reference');left.set(k,item.amountMinor);}
 for(const item of provider){const k=key(item);if(right.has(k))throw new Error('Duplicate provider payment reference');right.set(k,item.amountMinor);}
 const missingInProvider=[],missingInternally=[],amountMismatches=[];
 for(const [k,amount] of left){if(!right.has(k))missingInProvider.push(k);else if(right.get(k)!==amount)amountMismatches.push({reference:k,internalMinor:amount,providerMinor:right.get(k)});}
 for(const k of right.keys())if(!left.has(k))missingInternally.push(k);
 return {currency,matched:left.size-missingInProvider.length-amountMismatches.length,missingInProvider,missingInternally,amountMismatches,balanced:!missingInProvider.length&&!missingInternally.length&&!amountMismatches.length};
}
/** Platform commission and partner payout; sum of all amounts exactly equals net captured. */
export function calculateSettlementSplit({capturedMinor,refundMinor=0,platformFeeBps=0,processingFeeMinor=0}) {
 currencyAmount(capturedMinor);currencyAmount(refundMinor);currencyAmount(processingFeeMinor);
 if(!Number.isSafeInteger(platformFeeBps)||platformFeeBps<0||platformFeeBps>10000||refundMinor>capturedMinor)throw new Error('Invalid settlement policy');
 const netMinor=capturedMinor-refundMinor;
 const feeBig=(BigInt(netMinor)*BigInt(platformFeeBps)+5000n)/10000n;
 if(feeBig>BigInt(Number.MAX_SAFE_INTEGER))throw new Error('Settlement amount exceeds safe integer');
 const platformFeeMinor=Number(feeBig);
 if(platformFeeMinor+processingFeeMinor>netMinor)throw new Error('Settlement fees exceed net');
 return Object.freeze({netMinor,platformFeeMinor,processingFeeMinor,partnerPayoutMinor:netMinor-platformFeeMinor-processingFeeMinor});
}
