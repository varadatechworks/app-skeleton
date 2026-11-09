# Portfolio technical architecture, deployment, database and KT hub

> **Scope:** all repositories visible on 2026-11-09 under `bv-prasanna`, `SS-trust` and `varadatechworks`. **16 repositories**; source-derived documentation, not certification of production availability. New repositories after this inventory require separate onboarding.

## One-click project index
| Owner | Project / source | Deployment & architecture | Database | Evidence gap / gate |
|---|---|---|---|---|
| `bv-prasanna` | [jnapanam-sports-zone](https://github.com/bv-prasanna/jnapanam-sports-zone) — Sports arena booking | [KT handover](https://github.com/bv-prasanna/jnapanam-sports-zone/blob/main/docs/architecture-kt/README.md) | Flyway/PostgreSQL: migrations present | main + staging environment |
| `bv-prasanna` | [SevaMitra](https://github.com/bv-prasanna/SevaMitra) — Hyperlocal services | [KT handover](https://github.com/bv-prasanna/SevaMitra/blob/main/docs/architecture-kt/README.md) | Unknown on default branch: no main-branch DDL | recover full source/release SHA |
| `bv-prasanna` | [build-pro](https://github.com/bv-prasanna/build-pro) — Building materials commerce | [KT handover](https://github.com/bv-prasanna/build-pro/blob/main/docs/architecture-kt/README.md) | Flyway/PostgreSQL: migrations present | verify DB staging migrations |
| `bv-prasanna` | [core-build-docs](https://github.com/bv-prasanna/core-build-docs) — BuildPro reference archive | [KT handover](https://github.com/bv-prasanna/core-build-docs/blob/main/docs/architecture-kt/README.md) | N/A: documents only | historical design vs implementation |
| `bv-prasanna` | [ad-server](https://github.com/bv-prasanna/ad-server) — Multi-tenant advertising | [KT handover](https://github.com/bv-prasanna/ad-server/blob/main/docs/architecture-kt/README.md) | Flyway/PostgreSQL: migrations present | real tenant keys/hosting |
| `bv-prasanna` | [wedplan](https://github.com/bv-prasanna/wedplan) — Wedding planning | [KT handover](https://github.com/bv-prasanna/wedplan/blob/main/docs/architecture-kt/README.md) | Flyway/PostgreSQL: migrations present | runtime UAT evidence |
| `bv-prasanna` | [job-pilot](https://github.com/bv-prasanna/job-pilot) — Recruiter outreach and JD match | [KT handover](https://github.com/bv-prasanna/job-pilot/blob/main/docs/architecture-kt/README.md) | Client-side (verify API functions): no versioned DDL | storage/backup integration |
| `bv-prasanna` | [my-profile](https://github.com/bv-prasanna/my-profile) — Portfolio | [KT handover](https://github.com/bv-prasanna/my-profile/blob/main/docs/architecture-kt/README.md) | No verified DB: no versioned DDL | email enquiry ownership |
| `bv-prasanna` | [SRC](https://github.com/bv-prasanna/SRC) — SRC Enterprises | [KT handover](https://github.com/bv-prasanna/SRC/blob/main/docs/architecture-kt/README.md) | Node/Postgres SQL: migrations present | regulatory/payment approval |
| `bv-prasanna` | [cut-vegetables](https://github.com/bv-prasanna/cut-vegetables) — FreshPrep Veggies | [KT handover](https://github.com/bv-prasanna/cut-vegetables/blob/main/docs/architecture-kt/README.md) | Unknown on default branch: no main-branch DDL | recover app source and schema |
| `bv-prasanna` | [sscp](https://github.com/bv-prasanna/sscp) — SS Circuit Products | [KT handover](https://github.com/bv-prasanna/sscp/blob/main/docs/architecture-kt/README.md) | Cloudflare Pages/Worker, no SQL DB: no versioned DDL | verify mail delivery |
| `SS-trust` | [sstseva-web](https://github.com/SS-trust/sstseva-web) — SST Trust, field/finance | [KT handover](https://github.com/SS-trust/sstseva-web/blob/main/docs/architecture-kt/README.md) | Cloudflare D1: migrations present | remote D1 binding and privacy |
| `varadatechworks` | [play-nexa](https://github.com/varadatechworks/play-nexa) — White-label arena platform | [KT handover](https://github.com/varadatechworks/play-nexa/blob/main/docs/architecture-kt/README.md) | Flyway/PostgreSQL: migrations present | single-tenant UAT; SaaS isolation gate |
| `varadatechworks` | [app-skeleton](https://github.com/varadatechworks/app-skeleton) — Reusable application modules | [KT handover](https://github.com/varadatechworks/app-skeleton/blob/main/docs/architecture-kt/README.md) | Postgres/D1 example DDL: templates only | not a running application |
| `varadatechworks` | [design-pro](https://github.com/varadatechworks/design-pro) — Printing and packaging | [KT handover](https://github.com/varadatechworks/design-pro/blob/main/docs/architecture-kt/README.md) | SQLite local UAT: development DB schema | production data adapter gate |
| `varadatechworks` | [ssv-decors](https://github.com/varadatechworks/ssv-decors) — Decor brand | [KT handover](https://github.com/varadatechworks/ssv-decors/blob/main/README.md) | None: empty repository | requirements + product design |

## What each handover contains
- Logical architecture and deployment diagrams with explicit **observed vs reference** qualification.
- ER overview and a schema/migration inventory when source supports them; ER for a project with **no schema** is intentionally not invented.
- Deployment/release checklist, integration boundaries, secret handling, database-migration controls and schema-export instructions.
- Daily/weekly/monthly maintenance runbook; incident and disaster-recovery checklist.
- Knowledge-transfer agenda, customer/UAT demo scenario, positive/negative test checklist and responsibility-transfer gates.
- Links to existing architecture, release and CI sources.

Eight migration-backed projects also have a guarded `docs/architecture-kt/migrate-safe.sh` script for plan/schema export and controlled application of an **operator-approved native command**. It defaults to **plan only**; never call it a successful production migration without verifying logs and the actual database.

## Portfolio architecture standards
1. **Public/client interface:** HTTPS/TLS, responsive UI, accessibility, friendly success/error messages, localization where applicable; no sensitive operational data in client storage when server persistence is required.
2. **Identity and authorization:** authenticated sessions/JWT lifecycle, server-side deny-by-default permission enforcement, tenant/organization/geography scoping, privileged MFA, audit and incident logs.
3. **Business transactions:** database transaction isolation, idempotency keys, optimistic/concurrency checks, status transition rules, money in minor currency units or fixed-precision decimal, snapshot of taxation/pricing as applicable.
4. **External integrations:** server-side secrets, signature validation, replay protection, webhook queue/retries, reconciliation reports; provider configuration per environment.
5. **Database:** source-controlled forward-only migrations, build artifact + migration checksum, staging rehearsal, backup and **tested restore**, point-in-time recovery and retention. D1, Postgres and local SQLite are different environments, not interchangeable.
6. **Operations:** dashboards with metrics, structured correlation IDs, least-privilege access, encrypted backups, monitoring owners, CI gates, release logs and rollback/forward-fix playbooks.
7. **Geo/privacy:** collect location evidence only when needed and with user permission, store accuracy/source/timestamp, enforce purpose-based retention; avoid sensitive data in reports and demo accounts.
8. **Documentation:** keep diagrams and runbooks in the same PR as schema/runtime changes; never represent a conceptual ER as an exported physical database model.

## KT delivery standard (suggested 90 minutes per application)
| Time | Presenter | Objective | Proof |
|---|---|---|---|
| 0–15m | Product owner | Business scope, actor roles, constraints | Approved BRD/UAT scope |
| 15–35m | Developer | Guided customer/operator journeys; statuses and errors | UAT checklist and sandbox data |
| 35–50m | Lead developer | Component/data-flow/security architecture | Source paths and diagrams |
| 50–65m | DevOps/DBA | CI, env vars (no secret values), migration and deployment | Staging release SHA, migration status |
| 65–80m | Operations | Logs, alerts, backup/restore, rollback, on-call | Dashboard and restore evidence |
| 80–90m | Receiver | Questions, issue register, accept ownership | Signoff / unresolved risks |

## Cross-project deployment / maintenance signoff
- [ ] Correct deployed SHA; passing build, relevant automated tests, and negative-path/UAT reports.
- [ ] Environment inventory (hosts, domain, region, CI, DB provider, service-account owners).
- [ ] Secrets transferred using vault; no credentials or PII in documentation/demo recording.
- [ ] Diagram validated against running staging/production topology; including webhook destinations.
- [ ] Physical schema exported from correct database and reconciled with versioned migrations.
- [ ] Data backup verified and **restore performed**; rollback tested against schema compatibility.
- [ ] Operations escalation, owner matrix, monitoring/logs, incident playbook and SLA documented.
- [ ] Customer-facing messages, onboarding, refund/cancellation exceptions, notifications and localization UAT validated where applicable.
- [ ] Known unimplemented parts explicitly marked; no unsupported "production ready" claims.

## Prioritized issues to close
- **SevaMitra / FreshPrep:** main branch does not contain complete app/DB source; locate authoritative feature/release branch or real deployed schema before claiming a physical ER or reproducible migrations.
- **PlayNexa:** shared multi-tenant SaaS isolation has not passed release gates; do not merge deployment modes on paper with validated data isolation.
- **DesignPro:** SQLite is a local UAT store; production needs reviewed PostgreSQL or other durable adapter, migrations, backup, secrets and release tests.
- **SRC:** payment and online fireworks workflows have legal and payment-processor restrictions; do not enable without documented specialist clearance.
- **JobPilot:** browser-local data has limited durability; verify backend capabilities and user-consent boundaries before selling multiuser/sync.
- **SSV Decors:** empty repo; business requirements and technical design are still outstanding.
- **All projects:** confirm live schema/deploy environment; source analysis alone cannot prove operations, tests, migration results or readiness.

## Governance
**Repository-specific source of truth:** `docs/architecture-kt/README.md` plus `migrate-safe.sh` and original migration files. **Reusable reference:** this portfolio index and `varadatechworks/app-skeleton`. The schema exporter must run only against the approved repository revision; no automated destructive database action.

*Revision: 2026-11-09. This index does not disclose account credentials, API keys, or production data.*
