# Integrating skeleton modules

Run `node tools/create-app.mjs --list`, select the required modules and generate into a **new** project directory. Optional `--adapters postgres,d1,node-http,java`, `--db postgres|d1` and `--ui next-admin` copy integration examples and starter code. Import the chosen module with `import { ... } from './modules/<id>/index.mjs'`; pure ESM works in modern Node and transpiler-enabled TypeScript projects.

**NestJS / Express / Hono:** map authenticated claims from a verified backend token into a server-owned `actor` object; pass that to authorization/tenant checks in request guards. Keep database access behind repositories and wrap approvals, payments and identity writes in transactions. Wire notification providers through dependency injection; no runtime secrets in source.

**Next.js / React:** use `templates/next-admin/AdminSidebar.tsx` as a simple reference for a permission-based menu. The backend remains authoritative; the sidebar only improves UX. React 18+ and Next.js are provided by the consuming application.

**Spring Boot / Java:** model contracts (module IDs, roles, scope types, status/state machines, event GPS and money minor units) rather than importing JavaScript into the JVM. Build Spring services implementing the same conditions and run contract parity tests.

**Postgres / Neon:** start from `sql/postgres/0001_core.sql` in a new database and add business-specific tables. For **Cloudflare D1**, start from `sql/d1/0001_core.sql`. Do not apply either baseline to an existing app without a schema diff and migration plan. Tenant-bound DB policies or query predicates are mandatory in shared SaaS. Keep D1 and Postgres migrations distinct.

**Verification:** `npm test` is pure local Node. `npm run coverage` measures the reference library's unit tests; it is not application end-to-end coverage. Automated Foundation CI runs on pull requests and main. See docs/QUALITY_GATES.md and docs/RELEASE_UAT.md. The CI suite does not replace real database, provider or customer E2E tests.

**TypeScript:** accompanying `.d.mts` declarations resolve `.mjs` imports in `moduleResolution: NodeNext` and support type-aware consumers. Core authorization/geo/billing/notification/tenant contracts have stronger types; remaining declarations are reference signatures and should be narrowed in domain APIs. Try `tsc -p tsconfig.types.json` if TypeScript is installed; no TypeScript dependency is needed for Node tests.


## Executable integration adapters (reference)

- NestJS: `adapters/nestjs/index.mjs` exports `createNestGuard`. Inject cryptographically verified session and RBAC services; the consuming NestJS project owns dependency injection and middleware.
- Next.js: `adapters/nextjs/index.mjs` exports `createNextRoute`, which denies anonymous/unauthorized requests and disables private response caching.
- Expo: `adapters/expo/index.mjs` and `adapters/expo/secure-session.mjs` support HTTPS API calls and `expo-secure-store` via injection. Backend-enforced permissions remain mandatory.
- PostgreSQL: apply `sql/postgres/0003_idempotency.sql` in a NEW database and inject a real `pg.Pool` into `createPgIdempotencyStore`. Every business write triggered by the callback must use the **supplied transaction client**, with tenant verified by the server.
- Providers: `adapters/providers/notifications.mjs` contains Resend and Twilio sender adapters and `adapters/providers/razorpay.mjs` contains server-side Razorpay REST calls. Secrets must be server environment values. Wrap notification submissions with a durable outbox; payment adapter REST responses need a mapping layer into `confirmCapturedPayment` contracts.

**Do not use a sample client or provider directly as a complete live payment, messaging, or identity system.** See `docs/RELEASE_UAT.md` for the required real-provider and customer signoff gates.


## Durable notifications (PostgreSQL)

Apply `sql/postgres/0004_outbox_leases.sql` after the baseline schema, then use `adapters/postgres/outbox.mjs` to claim, deliver and acknowledge records. The tenant must be server-verified; the worker uses `FOR UPDATE SKIP LOCKED`, attempt counters, bounded leases and a `dead_letter` state. Message delivery remains **at least once**: a crash after provider acceptance but before DB acknowledgement may redeliver. Use provider-supported idempotency keys where available, alert on dead-letter rows, and carefully monitor claim expiration. Do not include raw provider errors or OTPs in the persisted failure code.
