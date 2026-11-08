'use client';
import React,{useMemo,useState} from 'react';
export type PermissionRow={feature:string;actions:string[]};
type Props={roleCode:string;features:PermissionRow[];grants:Record<string,string[]>;canEdit:boolean;onPropose:(roleCode:string,grants:Record<string,string[]>)=>Promise<void>};
/** Includes permission matrix for SST-like scopes; saving must go through maker-checker on backend. */
export function RoleMatrix({roleCode,features,grants,canEdit,onPropose}:Props){
 const [draft,setDraft]=useState<Record<string,string[]>>(structuredClone(grants));const [saving,setSaving]=useState(false);const [error,setError]=useState('');
 const actions=useMemo(()=>[...new Set(features.flatMap(f=>f.actions))], [features]);
 function toggle(feature:string,action:string,enabled:boolean){setDraft(s=>({...s,[feature]:enabled?[...new Set([...(s[feature]??[]),action])]:(s[feature]??[]).filter(a=>a!==action)}));}
 async function save(){setSaving(true);setError('');try{await onPropose(roleCode,draft);}catch(e){setError(e instanceof Error?e.message:'Permission request failed');}finally{setSaving(false);}}
 return <section className="space-y-3" aria-label="Role permission matrix"><h2 className="text-xl font-semibold">Permissions for {roleCode}</h2><p className="text-sm text-slate-500">Role changes require independent approval. Geography and functional assignments are configured separately.</p>
 {error&&<p role="alert" className="text-red-700">{error}</p>}
 <div className="overflow-x-auto rounded-xl border"><table className="min-w-full text-sm"><thead className="bg-slate-100"><tr><th className="p-3 text-left">Feature</th>{actions.map(a=><th key={a} className="p-3 capitalize">{a}</th>)}</tr></thead><tbody>{features.map(f=><tr key={f.feature} className="border-t"><th scope="row" className="p-3 text-left font-medium">{f.feature}</th>{actions.map(a=><td key={a} className="p-3 text-center">{f.actions.includes(a)&&<input type="checkbox" aria-label={`${f.feature}: ${a}`} disabled={!canEdit||saving} checked={(draft[f.feature]??[]).includes(a)} onChange={e=>toggle(f.feature,a,e.target.checked)}/>}</td>)}</tr>)}</tbody></table></div>
 {canEdit&&<button disabled={saving} onClick={save} className="rounded bg-slate-900 px-4 py-2 text-white">Submit for approval</button>}</section>;
}
