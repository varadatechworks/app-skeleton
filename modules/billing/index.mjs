/** Money in integer minor units (paise for INR); rates in basis points. */
const specificity={tenant:0,site:1,section:2,category:3,product:4,item:5,slot:6};
export function selectRule(rules,context,{at=new Date()}={}){
 if(!Array.isArray(rules))throw new Error('Rules array required');
 const time=at.getTime();if(!Number.isFinite(time))throw new Error('Invalid quote time');
 return rules.filter(r=>r.active!==false&&r.tenantId===context.tenantId&&Object.hasOwn(specificity,r.scope)
   &&(r.scope==='tenant'||String(r.targetId)===String(context[r.scope+'Id']))
   &&(!r.validFrom||Date.parse(r.validFrom)<=time)&&(!r.validTo||Date.parse(r.validTo)>=time)
   &&(r.minQuantity===undefined||context.quantity>=r.minQuantity)
 ).sort((a,b)=>specificity[b.scope]-specificity[a.scope]||(b.priority??0)-(a.priority??0)||String(a.id).localeCompare(String(b.id)))[0]??null;
}
export function roundBasisPoints(minor,bps){if(!Number.isSafeInteger(minor)||minor<0||!Number.isSafeInteger(bps)||bps<0||bps>100000)throw new Error('Invalid money or rate');const result=(BigInt(minor)*BigInt(bps)+5000n)/10000n;if(result>BigInt(Number.MAX_SAFE_INTEGER))throw new Error('Amount too large');return Number(result);}
export function calculateQuote({tenantId,unitPriceMinor,quantity=1,currency='INR',priceRule=null,discountBps=0,taxes=[]}){
 if(!tenantId||!Number.isSafeInteger(unitPriceMinor)||unitPriceMinor<0||!Number.isSafeInteger(quantity)||quantity<1||quantity>100000||!Number.isSafeInteger(discountBps)||discountBps<0||discountBps>10000||!Array.isArray(taxes))throw new Error('Invalid quote');
 if(priceRule&&priceRule.tenantId!==tenantId)throw new Error('Pricing tenant mismatch');
 let unit=unitPriceMinor;
 if(priceRule){if(priceRule.type==='fixed')unit=priceRule.valueMinor;else if(priceRule.type==='adjustment_bps'){const adjustment=priceRule.bps;if(!Number.isSafeInteger(adjustment)||adjustment < -10000||adjustment>100000)throw new Error('Invalid price adjustment');unit=Number((BigInt(unit)*BigInt(10000+adjustment)+5000n)/10000n);}else throw new Error('Unknown price rule');}
 if(!Number.isSafeInteger(unit)||unit<0)throw new Error('Invalid final price');
 const subtotal=unit*quantity;if(!Number.isSafeInteger(subtotal))throw new Error('Amount too large');
 const discount=roundBasisPoints(subtotal,discountBps);const taxable=subtotal-discount;
 const codes=new Set();for(const t of taxes){if(!t||t.tenantId!==tenantId||!['CGST','SGST','IGST','CESS','OTHER'].includes(t.component)||codes.has(t.component))throw new Error('Invalid tax component');codes.add(t.component);}
 if(codes.has('IGST')&&(codes.has('CGST')||codes.has('SGST')))throw new Error('Conflicting tax components');
 const taxLines=taxes.map(t=>({component:t.component,rateBps:t.rateBps,amountMinor:roundBasisPoints(taxable,t.rateBps)}));
 const tax=taxLines.reduce((s,t)=>s+t.amountMinor,0);const total=taxable+tax;if(!Number.isSafeInteger(total))throw new Error('Amount too large');
 return Object.freeze({tenantId,currency,quantity,unitMinor:unit,subtotalMinor:subtotal,discountMinor:discount,taxableMinor:taxable,taxMinor:tax,totalMinor:total,taxes:taxLines,priceRuleId:priceRule?.id??null});
}
