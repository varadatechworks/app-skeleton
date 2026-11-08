'use client';
import React,{useState} from 'react';
type Row={name:string;value:number};
type Props={title:string;rows:Row[];canExport:boolean;onExport:()=>Promise<void>;subtitle?:string};
/** Chart and CSV action UI only; backend must derive reports from tenant-scoped, allowlisted queries. */
export function ReportsPanel({title,rows,canExport,onExport,subtitle}:Props){const [busy,setBusy]=useState(false),[error,setError]=useState('');const max=Math.max(1,...rows.map(r=>Math.max(0,r.value)));
 async function exportRows(){setBusy(true);setError('');try{await onExport();}catch(e){setError(e instanceof Error?e.message:'Export failed');}finally{setBusy(false);}}
 return <section aria-label="Report" className="space-y-4 rounded-xl border p-5"><div className="flex items-start justify-between gap-2"><div><h2 className="text-lg font-semibold">{title}</h2>{subtitle&&<p className="text-sm text-slate-500">{subtitle}</p>}</div>{canExport&&<button disabled={busy} onClick={exportRows} className="rounded border px-3 py-2 text-sm">Download CSV</button>}</div>
 {error&&<p role="alert" className="text-red-700">{error}</p>}{!rows.length&&<p>No results for this period</p>}
 <div className="space-y-3">{rows.map(r=><div key={r.name} className="grid grid-cols-[minmax(90px,1fr)_3fr_auto] items-center gap-3 text-sm"><span className="truncate" title={r.name}>{r.name}</span><div className="h-4 rounded bg-slate-100"><div className="h-full rounded bg-sky-600" style={{width:`${Math.min(100,Math.max(0,r.value)/max*100)}%`}}/></div><span className="tabular-nums">{r.value.toLocaleString()}</span></div>)}</div></section>;
}
