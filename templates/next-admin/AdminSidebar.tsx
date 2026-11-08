'use client';
import React from 'react';
/** Copy into a Next.js/React application. Menu grants are for UX only: backend must reauthorize. */
export type MenuItem={id:string;title:string;href:string;feature:string};
export type AdminSidebarProps={items:MenuItem[];grants:Record<string,string[]>;activeId?:string;brand?:string;onNavigate?:(id:string)=>void};
export function AdminSidebar({items,grants,activeId,brand='Admin',onNavigate}:AdminSidebarProps){
 const visible=items.filter(x=>Array.isArray(grants[x.feature])&&grants[x.feature].includes('view'));
 return <nav aria-label="Administration" className="w-full rounded-xl border border-slate-200 bg-white p-3 shadow-sm md:w-64">
   <div className="px-3 pb-4 text-lg font-semibold text-slate-900">{brand}</div>
   <ul className="grid grid-cols-2 gap-1 md:grid-cols-1">{visible.map(item=><li key={item.id}>
      <a href={item.href} onClick={()=>onNavigate?.(item.id)} aria-current={activeId===item.id?'page':undefined}
         className={'block rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 '+(activeId===item.id?'bg-sky-100 font-semibold text-sky-900':'text-slate-700 hover:bg-slate-100')}>
        {item.title}</a></li>)}</ul>
 </nav>;
}
