# Varada Techworks — App Skeleton

**An opt-in module library, not a monolith or a deployed application.** It lets you bootstrap a new Next.js / NestJS / Node.js / Expo / Spring Boot project by selecting common concepts and incorporating only the modules needed. Reference design was compared against publicly readable and connected GitHub repositories under `bv-prasanna`, `varadatechworks` and `SS-trust` (snapshot 2026-11-09).

## Fast start

Requires **Node.js 20+**; the JavaScript reference modules have **no install-time dependencies**.

```bash
npm test
node tools/create-app.mjs --list
node tools/create-app.mjs --project sample-marketplace --modules identity,authorization,geo,notifications,reporting,admin --adapters postgres,node-http --db postgres --ui next-admin --out /tmp
node tools/create-app.mjs --project sample-field-app --modules survey,cms,approvals,reporting --out /tmp
node tools/create-app.mjs --project sample-platform --all --out /tmp
```

The generated project contains only selected modules and their transitive dependencies, chosen adapters/database/UI templates, local tests, manifest, and integration notes. No live database, cloud account, payments, vendor keys or demo superadmin is provisioned. **Installing/selecting modules does not enforce backend security on its own**: see [integration contract](docs/INTEGRATION.md).

## Selectable modules

| Area | Main choices / submodules |
|---|---|
| Identity & authorization | User profiles, account lifecycle, **simple RBAC** or **multi-role functional + geography-scoped RBAC**, organizational/tenant isolation |
| Field data & location | Hierarchy trees, GPS/accuracy/mock-location evidence, serviceability, versioned form builder / Varadi-style surveys, geographic assignment |
| Communication | Email, SMS, WhatsApp, push, in-app; templates, consent/preferences, adapters and delivery policy |
| Administration | Jnapanam-style operational console, SST-style governance console, feature-driven menu, approval inbox |
| Reporting & CMS | Predefined KPIs, safe ad hoc aggregate reports, CSV, localized/versioned content and publishing approvals |
| Commerce | Tax, discount, dynamic pricing, quote snapshots, payment checkout signatures, webhook idempotency, refunds and reconciliation/settlement helpers |
| Cross-cutting | Audit trails, workflow, feature flags, object storage, database contracts/migrations, localization, imports, observability, app-release metadata |

See [`catalog/modules.json`](catalog/modules.json) and [`docs/MODULE_CATALOG.md`](docs/MODULE_CATALOG.md) for the complete 21-module list, support status and examples.

## Conventions

- All modules export pure functions or injected adapters. Domain apps supply repositories, identity/session authentication, providers and persistence.
- **Deny by default** for permission, tenant and geography checks. No privileged role is implicitly trusted across tenant or location scope.
- Secrets are never committed; notification and payment adapters do not send real messages without explicit transports/credentials.
- Money is represented in integer minor units; coordinates are validated and stored with source, accuracy and capture time.
- Database integrations for PostgreSQL and Cloudflare D1 are **schema starting points**, not drop-in migrations for existing applications.
- `examples/demo.mjs` exercises modules without network services. `templates/next-admin/` contains an optional React/Next.js UI reference, not a packaged app.

## Review and attribution

The code in this repository is a **clean reusable implementation based on observed patterns**, not a bulk copy from source products or an assertion that extracted project code can run alone. Existing project repositories remain unchanged. See also [new-project recipes](docs/NEW_PROJECT_RECIPES.md). The detailed [source audit](docs/SOURCE_AUDIT.md) distinguishes inspected branches and unverified functionality. Since this library is intended as an internal Varada reusable asset, confirm ownership and licensing before making production or third-party distributions.

## Security and readiness

This is an audited **starter reference**, not a security-certified, production-complete backend. Wire trusted authentication, real persistence, transactions, authorization checks on every server operation, tenant-bound queries, audit persistence, replay protection, webhook idempotency, rate limits, consent and secret management before launch. Tests cover library-level behavior; they do not prove a full application integration. See [security gate](docs/SECURITY.md) and [implementation roadmap](docs/ROADMAP.md).

## Build verification and publishing

See [verification results](docs/VERIFICATION.md) and [GitHub publishing instructions](docs/PUBLISHING.md). GitHub publication is performed through an authorized repository connection. See the latest commit and verification report for exact published status.

**Windows PowerShell wrapper:** `./scripts/new-app.ps1 -Project sample-app -Modules 'identity,authorization,notifications' -Adapters 'postgres,node-http' -Db postgres -AdminUi`.