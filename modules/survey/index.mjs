import {validateGeoEvidence} from '../geo/index.mjs';
export const FIELD_TYPES=['short_text','long_text','number','amount','date','yes_no','dropdown','multi_select','mobile','photo'];
export function createFormVersion({formId,version,fields,targets=[],requireLocation=false,opensAt,closesAt,submissionMode='once'}){
 if(!formId||!Number.isSafeInteger(version)||version<1||!Array.isArray(fields)||fields.length===0)throw new Error('Invalid form definition');
 if(!['once','multiple'].includes(submissionMode))throw new Error('Invalid submission mode');
 if(opensAt&&closesAt&&Date.parse(opensAt)>=Date.parse(closesAt))throw new Error('Invalid submission window');
 const keys=new Set();for(const f of fields){if(!f.key||!FIELD_TYPES.includes(f.type)||keys.has(f.key))throw new Error('Invalid or duplicate field');keys.add(f.key);if(['dropdown','multi_select'].includes(f.type)&&(!Array.isArray(f.options)||!f.options.length))throw new Error('Options required');}
 return Object.freeze({formId,version,fields:structuredClone(fields),targets:structuredClone(targets),requireLocation,opensAt,closesAt,submissionMode});
}
function checkValue(f,v){
 switch(f.type){
  case 'short_text':case 'long_text':case 'mobile':case 'photo':return typeof v==='string'&&v.trim().length>0&&v.length<=(f.maxLength??5000);
  case 'date':{if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v))return false;const d=new Date(v+'T00:00:00Z');return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===v;}
  case 'number':case 'amount':return typeof v==='number'&&Number.isFinite(v)&&(f.type!=='amount'||v>=0)&&(f.min===undefined||v>=f.min)&&(f.max===undefined||v<=f.max);
  case 'yes_no':return typeof v==='boolean';
  case 'dropdown':return f.options.includes(v);
  case 'multi_select':return Array.isArray(v)&&v.every(x=>f.options.includes(x))&&new Set(v).size===v.length;
  default:return false;
 }
}
export function validateSubmission(form,submission,{at=new Date(),previousCount=0,authorizedTarget=false}={}){
 if(!form?.formId||submission?.formId!==form.formId||submission.version!==form.version)throw new Error('Form version mismatch');
 if(!authorizedTarget)throw new Error('Survey audience not authorized');
 const now=at.getTime();if(form.opensAt&&now<Date.parse(form.opensAt)||form.closesAt&&now>Date.parse(form.closesAt))throw new Error('Form not open');
 if(form.submissionMode==='once'&&previousCount>0)throw new Error('Already submitted');
 if(!submission.actorId||!submission.tenantId)throw new Error('Actor and tenant required');
 const allowed=new Set(form.fields.map(f=>f.key));
 if(!submission.answers||Object.keys(submission.answers).some(k=>!allowed.has(k)))throw new Error('Unknown answer field');
 for(const f of form.fields){const v=submission.answers[f.key];if((v===undefined||v===null||v==='')&&!f.required)continue;if(!checkValue(f,v))throw new Error(`Invalid answer: ${f.key}`);}
 const location=form.requireLocation?validateGeoEvidence(submission.location):submission.location?validateGeoEvidence(submission.location):null;
 return {formId:form.formId,version:form.version,actorId:submission.actorId,tenantId:submission.tenantId,answers:structuredClone(submission.answers),location,validatedAt:new Date(now).toISOString()};
}
