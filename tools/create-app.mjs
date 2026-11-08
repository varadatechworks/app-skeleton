#!/usr/bin/env node
import {readFile,cp,mkdir,writeFile,access} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname,resolve,join} from 'node:path';
const base=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const catalog=JSON.parse(await readFile(join(base,'catalog/modules.json'),'utf8'));
const adapters=JSON.parse(await readFile(join(base,'catalog/adapters.json'),'utf8'));
function argsOf(argv){const args={};for(let i=0;i<argv.length;i++){
 const a=argv[i];if(['--list','--all','--help'].includes(a))args[a.slice(2)]=true;
 else if(['--project','--out','--modules','--adapters','--db','--ui'].includes(a)){if(!argv[i+1]||argv[i+1].startsWith('--'))throw new Error(`${a} requires a value`);args[a.slice(2)]=argv[++i];}
 else throw new Error(`Unknown option: ${a}`);
}return args;}
function resolveModules(names){const output=new Set();function add(name){if(!Object.hasOwn(catalog,name))throw new Error(`Unknown module: ${name}`);if(output.has(name))return;output.add(name);catalog[name].depends.forEach(add);}names.forEach(add);return [...output];}
const a=argsOf(process.argv.slice(2));
if(a.help){console.log('Usage: node tools/create-app.mjs --project <slug> (--modules identity,authorization | --all) [--adapters postgres,d1,node-http,java] [--db postgres|d1] [--ui next-admin] [--out <parent-directory>] | --list');process.exit(0)}
if(a.list){for(const [id,v] of Object.entries(catalog))console.log(`${id.padEnd(19)} ${v.group.padEnd(11)} ${v.description}`);for(const [id,v] of Object.entries(adapters))console.log(`adapter:${id.padEnd(11)} ${v.description}`);process.exit(0)}
if(!/^[a-z][a-z0-9-]{1,63}$/.test(a.project??''))throw new Error('Project must be a safe, lower-case slug of at least two characters');
if(Boolean(a.all)===Boolean(a.modules))throw new Error('Choose exactly one of --modules or --all');
const selectedAdapters=(a.adapters??'').split(',').map(x=>x.trim()).filter(Boolean);for(const name of selectedAdapters)if(!Object.hasOwn(adapters,name))throw new Error('Unknown adapter: '+name);
const requested=a.all?Object.keys(catalog):a.modules.split(',').map(s=>s.trim());const picked=resolveModules([...requested,...selectedAdapters.flatMap(x=>adapters[x].depends)]);
if(a.db&&!['postgres','d1'].includes(a.db))throw new Error('Unknown DB template');if(a.ui&&a.ui!=='next-admin')throw new Error('Unknown UI template');
const root=resolve(a.out??process.cwd(),a.project);
try{await access(root);throw new Error('Refusing to overwrite existing directory: '+root);}catch(e){if(e.code!=='ENOENT')throw e;}
await mkdir(join(root,'modules'),{recursive:true});await mkdir(join(root,'tests'),{recursive:true});if(selectedAdapters.length)await mkdir(join(root,'adapters'),{recursive:true});
for(const id of picked){
 await cp(join(base,'modules',id),join(root,'modules',id),{recursive:true});
 for(const file of [id+'.test.mjs',...(id==='identity'?['user-service.test.mjs']:id==='authorization'?['role-service.test.mjs']:[])]){
  try{await cp(join(base,'tests',file),join(root,'tests',file));}catch(e){if(e.code!=='ENOENT')throw e;}
 }
}
for(const id of selectedAdapters){await cp(join(base,'adapters',id),join(root,'adapters',id),{recursive:true});try{await cp(join(base,'tests',id+'-adapter.test.mjs'),join(root,'tests',id+'-adapter.test.mjs'));}catch(e){if(e.code!=='ENOENT')throw e;}}
if(a.db){await mkdir(join(root,'sql'),{recursive:true});await cp(join(base,'sql',a.db),join(root,'sql',a.db),{recursive:true});}
if(a.ui){await mkdir(join(root,'templates'),{recursive:true});await cp(join(base,'templates','next-admin'),join(root,'templates','next-admin'),{recursive:true});}
await writeFile(join(root,'package.json'),JSON.stringify({name:a.project,version:'0.1.0',private:true,type:'module',engines:{node:'>=20'},scripts:{test:'node --test tests/*.test.mjs',coverage:'node --experimental-test-coverage --test tests/*.test.mjs'}},null,2)+'\n');
await writeFile(join(root,'modules.json'),JSON.stringify({project:a.project,modules:picked,adapters:selectedAdapters,db:a.db??null,ui:a.ui??null,source:'varadatechworks/app-skeleton',generatedAt:new Date().toISOString()},null,2)+'\n');
await writeFile(join(root,'README.md'),`# ${a.project}\n\nSelected reference modules: ${picked.join(', ')}.\n\nRun \`npm test\`. Implement backend identity, persistence, tenant/geography guards, providers and end-to-end tests before production.\n\nThe contents are modular building blocks, **not** an automatically deployed application.\n`);
console.log(`Created ${root} with ${picked.length} modules and ${selectedAdapters.length} adapters: ${picked.join(', ')}`);
