# Source inspection register — 2026-11-09

Read-only repository review. The following items are evidence of *patterns* and not assertions of production correctness. Reference code in this skeleton is independently written and decoupled from project-specific data/credentials.

| Owner/repo | Observed branch | Relevant extracted design pattern |
|---|---|---|
| SS-trust/sstseva-web | main | `db/migrations/0010_platform_v3_rbac.sql` multi-geography assignments and feature/action permissions; `lib/access-control.ts`, `components/AdminTopNav.tsx`; maker-checker, `db/migrations/0019_varadi_field_reports.sql` form versions/targets/responses; admin CMS and ad-hoc reports; activity GPS evidence |
| bv-prasanna/SevaMitra | develop | NestJS IAM assignments/authorization, OTP providers, geography, services, audit location and notification outbox; `main` was README-only at review |
| bv-prasanna/jnapanam-sports-zone | main | Spring Boot identity, operations console, `AdminReportingController`, notification-provider registry (email/SMS/WA/in-app), audit/telemetry, pricing/taxes, refunds, APK release lifecycle |
| varadatechworks/play-nexa | main | Jnapanam-derived modules, three deployment choices, customer-specific branding, feature parity, intentionally closed shared SaaS mode |
| bv-prasanna/build-pro | main | Role authorization, GST, inventory/order workflows, warehouse serviceability hierarchy, reports and flexible pricing rules |
| bv-prasanna/SRC | main | Node/TypeScript scoped-staff permissions, session lifecycle, price/tax rule specificity, modular operations/admin pages |
| bv-prasanna/wedplan | main | Audit event GPS record, notification outbox/worker, Flyway transactions, payments and refund workflow |
| bv-prasanna/job-pilot | main | Vite/React application, email workflow and job/metadata data sources |
| bv-prasanna/ad-server | main | Spring Boot admin operations and Postgres migration |
| bv-prasanna/sscp | main | Lightweight Cloudflare Worker/static marketing site and contact workflows |
| bv-prasanna/my-profile | main | Static portfolio and Cloudflare functions |
| bv-prasanna/core-build-docs | main | Construction commerce documentation and architecture references |
| bv-prasanna/cut-vegetables | `feat/typescript-platform-foundation` (main README only) | Hono role/organization scoping, 16+ production/operations roles, event location with unavailable-reason alternative, admin routes, recurring orders, mobile role menus |
| varadatechworks/ssv-decors | main | Empty repository at review time |
| varadatechworks/app-skeleton | main | Empty destination when first checked |

**Scope:** Reviewed default-branch trees for available repositories, source files for major reusable components, `SevaMitra`'s `develop` tree and FreshPrep's foundation branch. Not every line, feature branch, CI run, private repo, and historical PR was inspected. No integrations were executed and no current live service was changed. In particular, multiple product implementations have known release gates (shared tenancy, notifications, billing, auth and operational UAT). This catalog records designs, not certification.

**Sensitive data protection:** Source migrations may contain product-specific bootstrap identity information; it is never included in the clean skeleton. Do not copy secrets, production user data, personal phone numbers, developer-only OTP bypasses, or private tenant resources into starter projects.
