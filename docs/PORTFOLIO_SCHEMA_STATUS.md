# Portfolio database and ER documentation status

> Verified documentation source paths, 2026-11-09. **Source scan and GitHub links confirmed; production database schemas not independently verified.**

| Repository | Source migrations | Engine | Detailed ER / schema catalog | Notes |
|---|---|---|---|---|
| [`bv-prasanna/jnapanam-sports-zone`](https://github.com/bv-prasanna/jnapanam-sports-zone) | 60 Flyway SQL | PostgreSQL | [Open schema index](https://github.com/bv-prasanna/jnapanam-sports-zone/blob/main/docs/architecture-kt/SCHEMA_INDEX.md) | 5-part catalog |
| [`varadatechworks/play-nexa`](https://github.com/varadatechworks/play-nexa) | 59 Flyway SQL | PostgreSQL | [Open schema index](https://github.com/varadatechworks/play-nexa/blob/main/docs/architecture-kt/SCHEMA_INDEX.md) | 5-part catalog; SaaS gate |
| [`bv-prasanna/build-pro`](https://github.com/bv-prasanna/build-pro) | 31 Flyway SQL | PostgreSQL | [Open schema index](https://github.com/bv-prasanna/build-pro/blob/main/docs/architecture-kt/SCHEMA_INDEX.md) | 3-part catalog |
| [`SS-trust/sstseva-web`](https://github.com/SS-trust/sstseva-web) | 26 migrations | Cloudflare D1 | [Open schema index](https://github.com/SS-trust/sstseva-web/blob/main/docs/architecture-kt/SCHEMA_INDEX.md) | 2-part catalog |
| [`bv-prasanna/SRC`](https://github.com/bv-prasanna/SRC) | 21 numbered SQL | PostgreSQL | [Open schema index](https://github.com/bv-prasanna/SRC/blob/main/docs/architecture-kt/SCHEMA_INDEX.md) | 2-part catalog; payment restrictions |
| [`bv-prasanna/wedplan`](https://github.com/bv-prasanna/wedplan) | 8 Flyway SQL | PostgreSQL | [Open schema index](https://github.com/bv-prasanna/wedplan/blob/main/docs/architecture-kt/SCHEMA_INDEX.md) | single catalog |
| [`bv-prasanna/ad-server`](https://github.com/bv-prasanna/ad-server) | 1 Flyway SQL | PostgreSQL | [Open schema index](https://github.com/bv-prasanna/ad-server/blob/main/docs/architecture-kt/SCHEMA_INDEX.md) | single catalog |
| [`varadatechworks/design-pro`](https://github.com/varadatechworks/design-pro) | DB model in JS | Local SQLite | [Open schema index](https://github.com/varadatechworks/design-pro/blob/main/docs/architecture-kt/SCHEMA_INDEX.md) | UAT only |
| [`varadatechworks/app-skeleton`](https://github.com/varadatechworks/app-skeleton) | 4 SQL template files | Postgres/D1 alternatives | [Open schema index](https://github.com/varadatechworks/app-skeleton/blob/main/docs/architecture-kt/SCHEMA_INDEX.md) | module templates only |

## Unverified or not-applicable physical schemas
- `bv-prasanna/SevaMitra`: no authoritative SQL schema on inspected `main`; full application source absent.
- `bv-prasanna/cut-vegetables`: no authoritative SQL schema on inspected `main`; full application source absent.
- `bv-prasanna/job-pilot`: README describes browser-local storage; no versioned DDL on default branch.
- `bv-prasanna/sscp`, `bv-prasanna/my-profile`: static/content sites; no verified SQL database.
- `bv-prasanna/core-build-docs`: historical architecture/reference documentation, not an active database service.
- `varadatechworks/ssv-decors`: empty application repository at time of inventory.

## What completion means
**Completed at repository-source level:** architecture and deployment reference, Mermaid ER where source supports it, migration inventory/catalog, guarded migration operator script for 8 DB-backed projects, maintenance SOP, UAT/KT plan, incident and signoff checklists.

**Cannot be marked complete from repository alone:** actual runtime topology, DNS/cloud account mapping, secrets ownership, physically exported schema (including all ALTER/DROP/RENAME/indexes/triggers), migration applied/checksum history, backup restoration, code coverage/security testing, real payment reconciliation, live platform readiness or customer UAT approval.

The source catalog names/column definitions come from static SQL scans; they are not a cumulative execution engine. Always compare to the deployed schema and migration history before making DB changes.

Related: [16-project portfolio index](PORTFOLIO_TECHNICAL_HANDOVER.md).