# Integrating skeleton modules

Run `node tools/create-app.mjs --list`, select the required modules and generate into a **new** project directory. Optional `--adapters postgres,d1,node-http,java`, `--db postgres|d1` and `--ui next-admin` copy integration examples and starter code. Import the chosen module with `import { ... } from './modules/<id>/index.mjs'`; pure ESM works in modern Node and transpiler-enabled TypeScript projects.

**NestJS / Express / Hono:** map authenticated claims from a verified backend token into a server-owned `actor` object; pass that to authorization/tenant checks in request guards. Keep database access behind repositories and wrap approvals, payments and identity writes in transactions. Wire notification providers through dependency injection; no runtime secrets in source.

**Next.js / React:** use `templates/next-admin/AdminSidebar.tsx` as a simple reference for a permission-based menu. The backend remains authoritative; the sidebar only improves UX. React 18+ and Next.js are provided by the consuming application.

**Spring Boot / Java:** model contracts (module IDs, roles, scope types, status/state machines, event GPS and money minor units) rather than importing JavaScript into the JVM. Build Spring services implementing the same conditions and run contract parity tests.

**Postgres / Neon:** start from `sql/postgres/0001_core.sql` in a new database and add business-specific tables. For **Cloudflare D1**, start from `sql/d1/0001_core.sql`. Do not apply either baseline to an existing app without a schema diff and migration plan. Tenant-bound DB policies or query predicates are mandatory in shared SaaS. Keep D1 and Postgres migrations distinct.

**Verification:** `npm test` is pure local Node. `npm run coverage` measures the reference library's unit tests; it is not application end-to-end coverage. No GitHub Actions are included to avoid unnecessary CI minutes.

**TypeScript:** accompanying `.d.mts` declarations resolve `.mjs` imports in `moduleResolution: NodeNext` and support type-aware consumers. Core authorization/geo/billing/notification/tenant contracts have stronger types; remaining declarations are reference signatures and should be narrowed in domain APIs. Try `tsc -p tsconfig.types.json` if TypeScript is installed; no TypeScript dependency is needed for Node tests.
