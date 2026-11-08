/** In-memory reference aggregator. Real reporting must use secured tenant-scoped datasets / materialized views. */
export function aggregateRows(rows,{dimension,metric='count',measure,allowedDimensions,allowedMeasures=[]}){
 if(!Array.isArray(rows)||!Array.isArray(allowedDimensions)||!allowedDimensions.includes(dimension))throw new Error('Unsupported report dimension');
 if(!['count','sum','average'].includes(metric))throw new Error('Unsupported metric');
 if(metric!=='count'&&(!allowedMeasures.includes(measure)||typeof measure!=='string'))throw new Error('Unsupported measure');
 const buckets=new Map();for(const row of rows){const key=String(row[dimension]??'(unknown)');const cur=buckets.get(key)??{count:0,sum:0};
  if(metric!=='count'&&(typeof row[measure]!=='number'||!Number.isFinite(row[measure])))continue;
  cur.count++;cur.sum+=metric==='count'?0:row[measure];buckets.set(key,cur);
 }
 return [...buckets.entries()].map(([name,{count,sum}])=>({name,value:metric==='count'?count:metric==='sum'?sum:sum/count,count})).sort((a,b)=>b.value-a.value||a.name.localeCompare(b.name));
}
export function csvCell(value){let s=String(value??'');if(/^[\s\uFEFF]*[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';}
export function csvExport(rows,columns,{maxRows=100000}={}){
 if(!Array.isArray(rows)||rows.length>maxRows||!Array.isArray(columns)||!columns.length||columns.some(c=>!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(c)))throw new Error('Invalid CSV export');
 return [columns.map(csvCell).join(','),...rows.map(r=>columns.map(c=>csvCell(r?.[c])).join(','))].join('\r\n')+'\r\n';
}
export function operationalMetrics(rows,{statusKey='status',amountKey='amountMinor'}={}){
 if(!Array.isArray(rows))throw new Error('Rows required');
 return {total:rows.length,successful:rows.filter(x=>x[statusKey]==='success').length,failed:rows.filter(x=>x[statusKey]==='failed').length,amountMinor:rows.reduce((s,x)=>s+(Number.isSafeInteger(x[amountKey])?x[amountKey]:0),0)};
}
