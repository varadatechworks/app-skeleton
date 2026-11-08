# Reusable module catalog

All modules contain runnable JavaScript references under `modules/<id>/` and can be copied separately. Migrations and React admin components are integration references, not independently runnable services.

| Module | Variants / responsibilities | Level |
|---|---|---|
| `identity` | Profile validation, lifecycle and normalized identifiers; pluggable authenticated principal | Core reference |
| `authorization` | `simple` RBAC, `scoped` multi-role feature/action grants, functional duties, geographic hierarchy | Core reference |
| `tenant` | Single tenant, dedicated managed or shared tenant context; deny cross-tenant | Core reference |
| `database` | Parameterized SQL contracts, identifier validation; PostgreSQL and D1 starter schemas | Core reference |
| `geo` | GPS coordinates/evidence, geographic hierarchy, serviceability rules | Core reference |
| `survey` | Versioned forms, dynamic question validation, targeted submission windows | Core reference |
| `notifications` | Provider registry, email, SMS, WhatsApp, push, in-app, consent and dry-run | Core reference; live delivery requires provider |
| `approvals` | Maker-checker, reviewer separation and state validation | Core reference |
| `cms` | Localized content, draft/review/published lifecycle, versions | Core reference |
| `reporting` | Allowlisted group/metric aggregations, operational metrics, CSV | Core reference |
| `admin` | `operational` and `governance` navigation presets; permission-driven visibility | Core reference; UI reference separate |
| `audit` | Append-only audit event shape, safe metadata, event GPS | Core reference; persistence injected |
| `billing` | Dynamic rule precedence, discount, taxes, integer-minor-unit quotes | Core reference; regulatory review required |
| `workflow` | Named states, allowed transitions and guard policy | Core reference |
| `feature-flags` | Module visibility per tenant and role, fail-closed | Core reference |
| `storage` | Object key validation, pre-signed upload/download via provider | Core reference |
| `i18n` | Translation dictionary and fallback | Core reference |
| `import-export` | Bulk validation, duplicate detection and safe CSV export | Core reference |
| `observability` | Correlation IDs, safe external messages | Core reference |
| `app-management` | APK version/release mandatory and optional policies | Core reference |
| `payments` | Checkout signature verification, provider registry, webhook HMAC + idempotency, partial/full refunds with fee deduction, reconciliation, settlement split, optional DB migrations | Core reference; live gateway integration still required |

**Future adapters:** NestJS decorator/guard, Hono/Express routes, Spring Boot starter, React/Expo reusable UI components, PostgreSQL repositories, Cloudflare D1 repositories, object storage, SMTP/WhatsApp/SMS live providers, live Razorpay payment/refund service adapters, chart/map UI, streaming/report workers, multi-tenant provisioning. These remain *planned*, not represented as complete merely because an abstraction exists.

## Optional integration adapters

`--adapters postgres` includes a tenant-scoped PostgreSQL repository plus RLS transaction wrapper; `--adapters d1` includes a Cloudflare D1 query adapter; `--adapters node-http` shows a verified-principal route guard; `--adapters java` adds a dependency-free JDK policy reference. `--ui next-admin` includes eight React/Next.js screens/components for users, roles, field surveys, notifications, reporting, CMS, geographical assignments and navigation. `--db postgres|d1` adds starter migrations for new databases. These adapters are code examples: wire them into the consuming framework and run integration/UAT tests.
