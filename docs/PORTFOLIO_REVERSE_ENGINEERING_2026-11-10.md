# Portfolio reverse-engineering completion and evidence register

**Date:** 10 Nov 2026 · **Coverage:** 16 repositories across 3 GitHub accounts. **Source scope:** available default branches plus explicitly identified feature/develop branches for SevaMitra and FreshPrep. This is engineering documentation, not a production-readiness certification.

## Executive overview
Every accessible repository has a committed source-derived [`docs/architecture-kt/REVERSE_ENGINEERING.md`] section. Previously missing application source was found in SevaMitra's `develop` and FreshPrep's `feat/typescript-platform-foundation` branches. The remaining repositories were mapped to their actual code, build systems, APIs, SQL models, deployment config and UAT runbooks. **SSV Decors is empty**; no physical architecture/database can be reverse-engineered honestly.

## Repository-by-repository inventory
| Owner / repository | Code evidence | Data model | Outstanding release caveat | Source dossier |
|---|---|---|---|---|
| [`bv-prasanna/core-build-docs`](https://github.com/bv-prasanna/core-build-docs) | Historical reference docs; no runtime | N/A | Archive linked to active BuildPro | [Reverse engineering](https://github.com/bv-prasanna/core-build-docs/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| [`bv-prasanna/jnapanam-sports-zone`](https://github.com/bv-prasanna/jnapanam-sports-zone) | 69 controllers, 60 Flyway SQL | PostgreSQL | UAT/refunds/booking and real release validation | [Reverse engineering](https://github.com/bv-prasanna/jnapanam-sports-zone/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| [`bv-prasanna/ad-server`](https://github.com/bv-prasanna/ad-server) | 2 REST controllers, 1 Flyway SQL | PostgreSQL | Tenant key isolation & campaigns smoke | [Reverse engineering](https://github.com/bv-prasanna/ad-server/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| [`bv-prasanna/build-pro`](https://github.com/bv-prasanna/build-pro) | 51 controllers, 31 Flyway SQL | PostgreSQL | GST/cess invoicing, supplier and negative UAT | [Reverse engineering](https://github.com/bv-prasanna/build-pro/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| [`bv-prasanna/SevaMitra`](https://github.com/bv-prasanna/SevaMitra) | 57 controllers, 52 Prisma models, 26 migrations on develop | PostgreSQL/Prisma | Full source off main; reconcile PR and deploy SHA | [Reverse engineering](https://github.com/bv-prasanna/SevaMitra/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| [`bv-prasanna/wedplan`](https://github.com/bv-prasanna/wedplan) | 15 controllers, 10 Flyway SQL | PostgreSQL | Web deployment and UAT not certified | [Reverse engineering](https://github.com/bv-prasanna/wedplan/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| [`bv-prasanna/job-pilot`](https://github.com/bv-prasanna/job-pilot) | Browser app, API/public job feeds, PDF/DOCX, Gmail opt-in | Browser / API optional | No SQL; external OAuth & feed verification | [Reverse engineering](https://github.com/bv-prasanna/job-pilot/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| [`bv-prasanna/my-profile`](https://github.com/bv-prasanna/my-profile) | Static web, Cloudflare enquiry function | No SQL | Email delivery, origin and privacy acceptance | [Reverse engineering](https://github.com/bv-prasanna/my-profile/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| [`bv-prasanna/SRC`](https://github.com/bv-prasanna/SRC) | Node Docker API + static web; legacy Java; 21 SQL | PostgreSQL | Payments/schemes disabled and regulated gate | [Reverse engineering](https://github.com/bv-prasanna/SRC/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| [`bv-prasanna/cut-vegetables`](https://github.com/bv-prasanna/cut-vegetables) | Feature branch Hono/Expo/React; 8 migrations, 36 tables | PostgreSQL | Full source off main; production UAT blocked | [Reverse engineering](https://github.com/bv-prasanna/cut-vegetables/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| [`bv-prasanna/sscp`](https://github.com/bv-prasanna/sscp) | Cloudflare Worker RFQ mail + static pages | No SQL | Live mail/Turnstile and attachment UAT | [Reverse engineering](https://github.com/bv-prasanna/sscp/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| [`SS-trust/sstseva-web`](https://github.com/SS-trust/sstseva-web) | Next.js, Cloudflare D1, 26 migrations | D1 | Actual remote D1, payments & privacy signoff | [Reverse engineering](https://github.com/SS-trust/sstseva-web/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| [`varadatechworks/play-nexa`](https://github.com/varadatechworks/play-nexa) | 68 controllers, 59 Flyway SQL | PostgreSQL | SaaS multi-tenant isolation not production certified | [Reverse engineering](https://github.com/varadatechworks/play-nexa/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| [`varadatechworks/app-skeleton`](https://github.com/varadatechworks/app-skeleton) | 21 modules, 4 catalog adapters, 6 SQL templates | Postgres/D1 templates | Consumer implementation & parity tests needed | [Reverse engineering](https://github.com/varadatechworks/app-skeleton/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| [`varadatechworks/design-pro`](https://github.com/varadatechworks/design-pro) | Node v0.3, 26 API literal paths, 19 SQLite tables | Local SQLite | Production database/provider/manufacturing gates | [Reverse engineering](https://github.com/varadatechworks/design-pro/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| [`varadatechworks/ssv-decors`](https://github.com/varadatechworks/ssv-decors) | Empty application source; only planning/KT docs | Not applicable | Requirements and code missing | [Reverse engineering](https://github.com/varadatechworks/ssv-decors/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |

## Deliverable locations by project
Every repository has a handover entry; SSV Decors uses its root `README.md` because there is no application source yet. Source-bearing repositories generally have:
- `docs/architecture-kt/README.md`: logical architecture, deployment, operations/maintenance, data-model applicability and KT demo.
- `docs/architecture-kt/REVERSE_ENGINEERING.md`: exact code/source evidence, entrypoints, modules, API/controller inventory, CI/config and explicit unverified deployment claims.
- `docs/architecture-kt/SCHEMA_INDEX.md` where source DDL or template models exist (**11 repos**); ER diagrams and migrations are linked from the index. Static/no-code projects are intentionally **not** assigned invented physical SQL tables.
- Guarded `docs/architecture-kt/migrate-safe.sh` in database-backed main-branch applications (eight existing scripts), with plan-only default. SevaMitra/FreshPrep have source-branch-native Prisma/Node migration references; do not execute an unmerged branch's SQL as a generic main-branch migration.

## Project groups and sequencing
- **Current product applications**: Jnapanam, PlayNexa, BuildPro, SevaMitra, WedPlan, FreshPrep, SRC, SST and DesignPro. Use business-specific role/UAT and finance rules.
- **Shared infrastructure**: App Skeleton and Ad Server. Validate consumer responsibility for auth, tenant isolation, application-level tests and provider integration.
- **Content and individual workflows**: JobPilot, SSCP and personal portfolio; verify client storage, API/feed/mail-provider contracts and privacy.
- **Historical reference**: CoreBuild docs (map to current BuildPro).
- **No code**: SSV Decors; must create product requirements/code before architecture, ER, migrations or demo can be considered implemented.

## End-to-end release and KT gate
1. Locate the **deployed SHA** (not just `main` or feature branch); record hosting/DB account, URLs, region, CI build and secrets owner in a private environment register.
2. Regenerate live API/route manifest and **physical schema** from the actual release. Compare PostgreSQL `pg_catalog`/`flyway_schema_history`/`_prisma_migrations` or D1 SQLite catalog with committed SQL and diagram. No guessing.
3. Review data classifications/PII, provider OTP/email/WhatsApp and payment signatures, refund/settlement/invoice reconciliation and role/tenant/location scoping.
4. Back up and perform **isolated restore**; stage and dry-run migrations, check idempotency and transactional race cases; approve rollback/forward fix.
5. Verify GitHub CI (exact SHA), integration/security test report, real browser/mobile UI, accessibility, Kannada or other language where applicable, negative/error/success messages, location consent and QR flows.
6. Conduct a 90-minute KT/demo, then hand over logs, alerts, owners, SOP, secrets-vault pointers, service registry and open UAT defects. Record customer signoff or explicit blockers.

## Evidence and known gaps
- **Code/documentation complete at source-inspection level:** source paths and links successfully saved to all 16 default branches; database schema/ER indexes for all 11 projects with code-supported models/templates.
- **Not verified:** production deployment URL/host, database migration state/backup restoration, true CI status, production payment or message delivery, customer UAT and external/legal approval.
- **Branch divergence:** SevaMitra and FreshPrep code not in default `main`; branch is specified and pinned in each source map. BuildPro and PlayNexa have additional docs/QA branches; review before incorporating runtime changes.
- **Do not enable** PlayNexa shared SaaS, SRC regulated fireworks checkout/mandates, DesignPro live payments/local SQLite production, or unprotected FreshPrep `/dev/*` endpoints on the basis of documentation alone.

## Portfolio indexes
- [Portfolio handover](PORTFOLIO_TECHNICAL_HANDOVER.md)
- [Schema and ER/source status](PORTFOLIO_SCHEMA_STATUS.md)
- [Environment, migration, KT, maintenance and acceptance templates](HANDOVER_TEMPLATES.md)

**Owner review:** source-backed technical preparation is complete for accessible code. Infrastructure and product stakeholders must fill real release evidence before an external customer receives a production-acceptance certificate.
