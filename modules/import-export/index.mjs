import {csvExport} from '../reporting/index.mjs';
export {csvExport};
/** Validate a bulk import before any write; caller handles transaction and error report. */
export function validateBulk(rows,{required=[],keyFields=[],maxRows=1000}={}){
 if(!Array.isArray(rows)||rows.length>maxRows||!Array.isArray(required)||!Array.isArray(keyFields))throw new Error('Invalid import');
 const seen=new Set();const errors=[];
 const accepted=rows.filter((r,i)=>{
  if(!r||typeof r!=='object'||Array.isArray(r)){errors.push({row:i+1,error:'invalid_row'});return false;}
  const missing=required.filter(k=>r[k]===undefined||r[k]===null||String(r[k]).trim()==='');
  if(missing.length){errors.push({row:i+1,error:'missing_required',fields:missing});return false;}
  const key=keyFields.map(k=>String(r[k]??'').trim().toLowerCase()).join('\u001f');
  if(keyFields.length&&seen.has(key)){errors.push({row:i+1,error:'duplicate'});return false;}
  if(keyFields.length)seen.add(key);return true;
 });
 return {accepted,errors,total:rows.length,valid:accepted.length};
}
