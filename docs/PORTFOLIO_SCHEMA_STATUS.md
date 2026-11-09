# Portfolio database, ER and migration audit — all three GitHub accounts

> **Verified:** 10 Nov 2026 against available GitHub branch/file source. **This is a source/branch audit**, not a live schema extraction or an applied migration report. Covers all **16 repositories** visible under `bv-prasanna`, `SS-trust`, and `varadatechworks`.

## Code-backed schema references (11)
| Repository | Database | Source model / migration files | Code branch observed | Qualification |
|---|---|---|---|---|
| [`bv-prasanna/SevaMitra`](https://github.com/bv-prasanna/SevaMitra) | PostgreSQL / Prisma 7 | 26 migration SQL files and 52 Prisma models | `develop e6dbddcf84d0` | [Schema / ER](https://github.com/bv-prasanna/SevaMitra/blob/main/docs/architecture-kt/SCHEMA_INDEX.md) · Not on main; full handbook on docs branch |
| [`bv-prasanna/cut-vegetables`](https://github.com/bv-prasanna/cut-vegetables) | PostgreSQL / Hono | 8 SQL migration files, 36 SQL tables | `feat/typescript-platform-foundation a4ebfc20329e` | [Schema / ER](https://github.com/bv-prasanna/cut-vegetables/blob/main/docs/architecture-kt/SCHEMA_INDEX.md) · Not on main; UAT only |
| [`bv-prasanna/jnapanam-sports-zone`](https://github.com/bv-prasanna/jnapanam-sports-zone) | PostgreSQL / Flyway | 60 Flyway SQL files | `main` | [Schema / ER](https://github.com/bv-prasanna/jnapanam-sports-zone/blob/main/docs/architecture-kt/SCHEMA_INDEX.md) · Schema catalog parts 1–5 |
| [`varadatechworks/play-nexa`](https://github.com/varadatechworks/play-nexa) | PostgreSQL / Flyway | 59 Flyway SQL files | `main` | [Schema / ER](https://github.com/varadatechworks/play-nexa/blob/main/docs/architecture-kt/SCHEMA_INDEX.md) · Shared SaaS isolation not certified |
| [`bv-prasanna/build-pro`](https://github.com/bv-prasanna/build-pro) | PostgreSQL / Flyway | 31 Flyway SQL files | `main` | [Schema / ER](https://github.com/bv-prasanna/build-pro/blob/main/docs/architecture-kt/SCHEMA_INDEX.md) · Schema catalog parts 1–3 |
| [`SS-trust/sstseva-web`](https://github.com/SS-trust/sstseva-web) | Cloudflare D1 | 26 D1 SQL migrations | `main` | [Schema / ER](https://github.com/SS-trust/sstseva-web/blob/main/docs/architecture-kt/SCHEMA_INDEX.md) · Remote D1 target not verified |
| [`bv-prasanna/SRC`](https://github.com/bv-prasanna/SRC) | PostgreSQL / Node | 21 numbered SQL migrations | `main` | [Schema / ER](https://github.com/bv-prasanna/SRC/blob/main/docs/architecture-kt/SCHEMA_INDEX.md) · Regulated payment/mandate features gated |
| [`bv-prasanna/wedplan`](https://github.com/bv-prasanna/wedplan) | PostgreSQL / Flyway | 10 Flyway SQL migrations | `main` | [Schema / ER](https://github.com/bv-prasanna/wedplan/blob/main/docs/architecture-kt/SCHEMA_INDEX.md) · V9 login abuse and V10 HTTP audit added |
| [`bv-prasanna/ad-server`](https://github.com/bv-prasanna/ad-server) | PostgreSQL / Flyway | 1 Flyway SQL migration | `main` | [Schema / ER](https://github.com/bv-prasanna/ad-server/blob/main/docs/architecture-kt/SCHEMA_INDEX.md) · Tenant & cap behavior need staging proof |
| [`varadatechworks/design-pro`](https://github.com/varadatechworks/design-pro) | Node 22 local SQLite | 19 CREATE TABLE statements in db.mjs | `main v0.3.0` | [Schema / ER](https://github.com/varadatechworks/design-pro/blob/main/docs/architecture-kt/SCHEMA_INDEX.md) · Local UAT only; production Postgres pending |
| [`varadatechworks/app-skeleton`](https://github.com/varadatechworks/app-skeleton) | PostgreSQL and D1 templates | 6 SQL files: PG 0001–0004, D1 0001–0002 | `main` | [Schema / ER](https://github.com/varadatechworks/app-skeleton/blob/main/docs/architecture-kt/SCHEMA_INDEX.md) · Library templates; not applied database |

Each project also has [code-source reverse engineering](#all-project-reverse-engineering-refs) and [technical handover](PORTFOLIO_TECHNICAL_HANDOVER.md) references.

## No verified physical SQL schema (5)
- [`bv-prasanna/job-pilot`](https://github.com/bv-prasanna/job-pilot/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md): Browser-local versions and optional Node/Cloudflare APIs; no SQL migrations
- [`bv-prasanna/my-profile`](https://github.com/bv-prasanna/my-profile/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md): Static website and Cloudflare Pages enquiry function; no SQL schema
- [`bv-prasanna/sscp`](https://github.com/bv-prasanna/sscp/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md): Static website + Cloudflare Worker RFQ email; no SQL schema
- [`bv-prasanna/core-build-docs`](https://github.com/bv-prasanna/core-build-docs/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md): Historical reference documents, not a current runtime database
- [`varadatechworks/ssv-decors`](https://github.com/varadatechworks/ssv-decors/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md): No app source, DB or migration; only planning documentation

## Authoritative-source rule
- **Default branch vs feature branch:** SevaMitra's 52-model Prisma database is in `develop`, FreshPrep's eight migrations in its feature branch. A source branch is neither a merge nor a deployment. Any newly generated script must use the same approved revision, not a guessed combination.
- **SQL source vs deployed database:** the only certifiable physical ER is one reconciled against actual PostgreSQL `pg_catalog` / `pg_dump --schema-only` or correct remote D1 `sqlite_master` and migration history. SQL parser summaries can omit later constraints/ALTER/RENAME/indexes/triggers; never use a rendered ER to mutate live data.
- **Template vs runtime:** App Skeleton D1/Postgres migrations are alternative **template dialects**; DesignPro uses a local UAT SQLite store and has no approved production database migration.
- **Migration safety:** use the repository-native Prisma/Flyway/Node/D1 migration mechanism; inspect checksums and pending versions; back up and restore-test; apply to staging first. The existing guarded `migrate-safe.sh` wrappers default to plan only; using them does not constitute an executed migration.

## All-project reverse engineering refs
| Organization | Repository | Source dossier |
|---|---|---|
| `SS-trust` | `sstseva-web` | [Source code, APIs, deployment, tests, KT](https://github.com/SS-trust/sstseva-web/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| `bv-prasanna` | `SRC` | [Source code, APIs, deployment, tests, KT](https://github.com/bv-prasanna/SRC/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| `bv-prasanna` | `SevaMitra` | [Source code, APIs, deployment, tests, KT](https://github.com/bv-prasanna/SevaMitra/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| `bv-prasanna` | `ad-server` | [Source code, APIs, deployment, tests, KT](https://github.com/bv-prasanna/ad-server/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| `bv-prasanna` | `build-pro` | [Source code, APIs, deployment, tests, KT](https://github.com/bv-prasanna/build-pro/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| `bv-prasanna` | `core-build-docs` | [Source code, APIs, deployment, tests, KT](https://github.com/bv-prasanna/core-build-docs/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| `bv-prasanna` | `cut-vegetables` | [Source code, APIs, deployment, tests, KT](https://github.com/bv-prasanna/cut-vegetables/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| `bv-prasanna` | `jnapanam-sports-zone` | [Source code, APIs, deployment, tests, KT](https://github.com/bv-prasanna/jnapanam-sports-zone/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| `bv-prasanna` | `job-pilot` | [Source code, APIs, deployment, tests, KT](https://github.com/bv-prasanna/job-pilot/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| `bv-prasanna` | `my-profile` | [Source code, APIs, deployment, tests, KT](https://github.com/bv-prasanna/my-profile/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| `bv-prasanna` | `sscp` | [Source code, APIs, deployment, tests, KT](https://github.com/bv-prasanna/sscp/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| `bv-prasanna` | `wedplan` | [Source code, APIs, deployment, tests, KT](https://github.com/bv-prasanna/wedplan/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| `varadatechworks` | `app-skeleton` | [Source code, APIs, deployment, tests, KT](https://github.com/varadatechworks/app-skeleton/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| `varadatechworks` | `design-pro` | [Source code, APIs, deployment, tests, KT](https://github.com/varadatechworks/design-pro/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| `varadatechworks` | `play-nexa` | [Source code, APIs, deployment, tests, KT](https://github.com/varadatechworks/play-nexa/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |
| `varadatechworks` | `ssv-decors` | [Source code, APIs, deployment, tests, KT](https://github.com/varadatechworks/ssv-decors/blob/main/docs/architecture-kt/REVERSE_ENGINEERING.md) |

## Production certification gates — not asserted complete
1. Actual running SHA, cloud account/service, app URL, DNS, TLS, secrets owner and CI artifact identity.
2. Real migration history/checksums and authoritative schema export (including actual FK/indexes), reviewed by a DBA.
3. Approved non-production backup restoration and rollback/forward-fix rehearsals.
4. Security/negative tests for all roles, network failures, idempotency, replay, refund/cancellation and audit.
5. Real device/browser UAT, business pricing and provider configuration, accessibility/language acceptance.
6. Written approval for financial, legal, privacy, PSP and tenant-isolation controls where relevant.

**Completion status:** project-source technical documentation and schema indexes for every source-bearing database have been prepared. Live environment validation, branch merges, delivery build verification, production migrations and customer UAT remain independently required.

Related: [portfolio KT hub](PORTFOLIO_TECHNICAL_HANDOVER.md) · [standard runbook templates](HANDOVER_TEMPLATES.md).
