'use client';
import React,{useMemo,useState} from 'react';
export type OperationalKpi={id:string;label:string;value:string;change?:string;description?:string};
export type OperationalTask={id:string;title:string;module:string;status:'pending'|'in_progress'|'completed'|'failed';owner?:string;updatedAt:string;href?:string};
export type OperationsDashboardProps={brand:string;subtitle?:string;kpis:OperationalKpi[];tasks:OperationalTask[];loading?:boolean;error?:string;onRetry?:()=>void};
/** Accessible, responsive, presentation-only admin dashboard. Never place secrets or raw PII in props. */
export function OperationsDashboard({brand,subtitle='Operations overview',kpis,tasks,loading=false,error,onRetry}:OperationsDashboardProps){
 const [status,setStatus]=useState('all');
 const filtered=useMemo(()=>tasks.filter(t=>status==='all'||t.status===status),[tasks,status]);
 const stateClass:Record<OperationalTask['status'],string>={pending:'bg-amber-50 text-amber-800 ring-amber-200',in_progress:'bg-sky-50 text-sky-800 ring-sky-200',completed:'bg-emerald-50 text-emerald-800 ring-emerald-200',failed:'bg-rose-50 text-rose-800 ring-rose-200'};
 return <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-10">
  <div className="mx-auto max-w-7xl space-y-7">
   <header className="flex flex-wrap items-end justify-between gap-4"><div className="space-y-2">
    <p className="text-xs font-bold uppercase tracking-[.22em] text-indigo-600">Varada Techworks / Control Center</p>
    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{brand}</h1><p className="text-sm text-slate-500">{subtitle}</p>
   </div><span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm">Tenant-scoped operational view</span></header>
   {error&&<div role="alert" className="flex items-center justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900"><span>{error}</span>{onRetry&&<button onClick={onRetry} className="rounded-lg border border-rose-300 px-3 py-2 font-semibold focus-visible:outline-2 focus-visible:outline-indigo-600">Retry</button>}</div>}
   <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {kpis.map(k=><article key={k.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-medium text-slate-500">{k.label}</p><p className="mt-3 text-3xl font-bold tracking-tight">{loading?'—':k.value}</p>{k.change&&<p className="mt-2 text-xs font-semibold text-indigo-700">{k.change}</p>}{k.description&&<p className="mt-2 text-xs text-slate-500">{k.description}</p>}</article>)}
   </section>
   <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-label="Operational tasks">
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5"><div><h2 className="text-lg font-bold">Work queue</h2><p className="text-sm text-slate-500">Recent tasks, exceptions and approvals</p></div>
    <label className="text-sm font-medium text-slate-700">Status <select aria-label="Filter tasks by status" className="ml-2 rounded-lg border border-slate-300 bg-white px-3 py-2" value={status} onChange={e=>setStatus(e.target.value)}>{['all','pending','in_progress','completed','failed'].map(s=><option key={s} value={s}>{s.replace('_',' ')}</option>)}</select></label></div>
    <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th scope="col" className="px-5 py-3">Task</th><th scope="col" className="px-5 py-3">Module</th><th scope="col" className="px-5 py-3">Owner</th><th scope="col" className="px-5 py-3">Status</th><th scope="col" className="px-5 py-3">Updated</th></tr></thead>
    <tbody className="divide-y divide-slate-100">{filtered.map(t=><tr key={t.id} className="hover:bg-slate-50"><td className="px-5 py-4 font-semibold">{t.href?<a href={t.href} className="text-indigo-700 underline-offset-2 hover:underline focus-visible:outline-2">{t.title}</a>:t.title}</td><td className="px-5 py-4">{t.module}</td><td className="px-5 py-4 text-slate-600">{t.owner??'Unassigned'}</td><td className="px-5 py-4"><span className={'inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ring-1 '+stateClass[t.status]}>{t.status.replace('_',' ')}</span></td><td className="px-5 py-4 text-slate-500">{t.updatedAt}</td></tr>)}</tbody></table></div>
    {!loading&&filtered.length===0&&<div role="status" className="p-10 text-center text-sm text-slate-500">No tasks match this filter.</div>}
    {loading&&<div role="status" className="p-10 text-center text-sm text-slate-500">Loading task queue…</div>}
   </section>
  </div>
 </main>;
}
