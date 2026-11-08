'use client';
import React,{useState} from 'react';
type User={id:string;displayName:string;email?:string|null;mobile?:string|null;status:'pending'|'active'|'suspended'|'deactivated'};
type Props={users:User[];loading?:boolean;canCreate:boolean;canEdit:boolean;onCreate:(x:{displayName:string;email:string})=>Promise<void>;onStatus:(id:string,to:User['status'],reason:string)=>Promise<void>};
/** UI reference: backend owns access checks, permission approvals, persistence and paging. */
export function UsersPage({users,loading=false,canCreate,canEdit,onCreate,onStatus}:Props){
 const [search,setSearch]=useState(''),[name,setName]=useState(''),[email,setEmail]=useState(''),[error,setError]=useState(''),[saving,setSaving]=useState(false);
 const filtered=users.filter(u=>[u.displayName,u.email,u.mobile].some(v=>(v??'').toLowerCase().includes(search.toLowerCase())));
 async function create(e:React.FormEvent){e.preventDefault();if(!canCreate)return;setSaving(true);setError('');try{await onCreate({displayName:name,email});setName('');setEmail('');}catch(ex){setError(ex instanceof Error?ex.message:'Unable to create user');}finally{setSaving(false);}}
 async function update(u:User,to:User['status']){const reason=window.prompt(`Reason to change ${u.displayName} to ${to}?`);if(!reason?.trim())return;setSaving(true);setError('');try{await onStatus(u.id,to,reason);}catch(ex){setError(ex instanceof Error?ex.message:'Unable to update account');}finally{setSaving(false);}}
 return <section className="space-y-5" aria-label="User management">
   <header><h1 className="text-xl font-semibold">Users & staff</h1><p className="text-sm text-slate-500">Tenant-scoped accounts and lifecycle</p></header>
   {error&&<p role="alert" className="text-red-700">{error}</p>}
   {canCreate&&<form onSubmit={create} className="flex flex-wrap gap-2 rounded-xl border p-3">
      <input aria-label="Full name" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required className="rounded border px-3 py-2"/>
      <input aria-label="Email" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required className="rounded border px-3 py-2"/>
      <button disabled={saving} className="rounded bg-slate-900 px-4 py-2 text-white">Add user</button>
   </form>}
   <input value={search} onChange={e=>setSearch(e.target.value)} aria-label="Search users" placeholder="Search name, email or phone" className="w-full rounded border p-2" />
   <div className="overflow-x-auto rounded-xl border"><table className="min-w-full text-left text-sm"><thead className="bg-slate-100"><tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead>
   <tbody>{filtered.map(u=><tr key={u.id} className="border-t"><td className="p-3">{u.displayName}</td><td className="p-3">{u.email||'—'}</td><td className="p-3">{u.status}</td><td className="p-3">{canEdit&&u.status!=='deactivated'&&<button disabled={saving} onClick={()=>update(u,u.status==='active'?'suspended':'active')} className="rounded border px-3 py-1">{u.status==='active'?'Suspend':'Activate'}</button>}</td></tr>)}</tbody></table>
   {!loading&&!filtered.length&&<p className="p-4 text-sm text-slate-500">No matching users</p>}{loading&&<p className="p-4">Loading users…</p>}</div>
 </section>;
}
