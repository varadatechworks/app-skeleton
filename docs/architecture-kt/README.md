# Varada reusable app skeleton - Architecture, Deployment, ER, Database, Migration & KT Guide
> **Code snapshot:** 2026-11-09, `main` branch of [varadatechworks/app-skeleton](https://github.com/varadatechworks/app-skeleton). **Repository-derived reference**; cloud environment and deployed DB must be verified separately.
**Library gate:** no production deployment or persisted schema is implied by these templates.
## 1. System context and component architecture
**Stack observed / documented:** Node.js modular library; PostgreSQL/D1 example DDL. Source has no verified web app, no verified mobile app and no verified backend source.

```mermaid
flowchart LR
    Operator[Customers / Staff] --> UI[Web or module consumer]

    UI --> Service[Library / Browser logic]

    Service --> Security[Auth / policy / validation]
    Security --> DB[(Persisted data store - verify env)]

    Service -.-> Provider[External adapters / payment / mail]
    QA[Tests / CI] -. checks .-> Service
```
**Cross-cutting contracts:** server-validated inputs; least-privilege RBAC; concurrency/idempotency; customer vs admin isolation; audit IDs; non-secret config; appropriate geo evidence and billing snapshots where applicable.

## 2. Deployment diagram (logical reference, not production verification)
```mermaid
flowchart TB
    Git[GitHub main / tagged release] --> QA[CI / build checks]
    QA -. approved artifact .-> Front[Frontend / CDN / HTTPS]

    Front --> DB[(Database instance)]

    Vault[Managed secrets / environment] -. injected .-> Front
    Monitor[Logs / metrics / alerts] -. monitors .-> Front
```
**Complete for each environment:** cloud project/region, DNS and custom domain, static/web deployment, API container/function, environment names, database identity, secret manager, backup owner, health check, rollback release, CI status and contact matrix. Diagram does **not** establish a running deployment.

## 3. ER diagram - representative source-verified baseline
The ER uses `CREATE TABLE` and declared `REFERENCES` found in **2 selected baseline file(s)**, not every subsequent migration. It is not a complete physical ER; export the current database catalog for authoritative tables, columns and foreign keys.

```mermaid
erDiagram
    TENANTS {
        string id PK
        string name
        string deployment_mode
        string active
        string created_at
    }
    APP_USERS {
        string id PK
        string tenant_id
        string email
        string mobile
        string display_name
    }
    ROLES {
        string id PK
        string tenant_id
        string code
        string name
        string active
    }
    ROLE_PERMISSIONS {
        string id PK
        string tenant_id
        string role_id
        string feature_code
        string action
    }
    USER_ROLE_ASSIGNMENTS {
        string id PK
        string tenant_id
        string user_id
        string role_id
        string function_code
    }
    GEOGRAPHY_NODES {
        string id PK
        string tenant_id
        string parent_id
        string level
        string name
    }
    USER_GEOGRAPHY_SCOPES {
        string id PK
        string tenant_id
        string user_id
        string geography_id
        string function_code
    }
    APPROVAL_REQUESTS {
        string id PK
        string tenant_id
        string entity_type
        string entity_id
        string maker_id
    }
    NOTIFICATION_TEMPLATES {
        string id PK
        string tenant_id
        string code
        string channel
        string locale
    }
    NOTIFICATION_PREFERENCES {
        string id PK
        string tenant_id
        string user_id
        string channel
        string consent
    }
    NOTIFICATION_OUTBOX {
        string id PK
        string tenant_id
        string user_id
        string channel
        string status
    }
    SURVEY_FORMS {
        string id PK
        string tenant_id
        string title
        string status
        string current_version
    }
    SURVEY_FORM_VERSIONS {
        string id PK
        string form_id
        string tenant_id
        string version
        string created_at
    }
    SURVEY_TARGETS {
        string id PK
        string tenant_id
        string form_id
        string target_type
        string target_id
    }
    SURVEY_SUBMISSIONS {
        string id PK
        string tenant_id
        string form_id
        string form_version
        string actor_id
    }
    CMS_ITEMS {
        string id PK
        string tenant_id
        string author_id
        string category
        string locale
    }
    REPORT_DEFINITIONS {
        string id PK
        string tenant_id
        string code
        string name
        string active
    }
    AUDIT_EVENTS {
        string id PK
        string tenant_id
        string actor_id
        string action
        string resource
    }
    TENANTS ||--o{ APP_USERS : references
    TENANTS ||--o{ ROLES : references
    TENANTS ||--o{ ROLE_PERMISSIONS : references
    ROLES ||--o{ ROLE_PERMISSIONS : references
    TENANTS ||--o{ USER_ROLE_ASSIGNMENTS : references
    APP_USERS ||--o{ USER_ROLE_ASSIGNMENTS : references
    ROLES ||--o{ USER_ROLE_ASSIGNMENTS : references
    TENANTS ||--o{ GEOGRAPHY_NODES : references
    TENANTS ||--o{ USER_GEOGRAPHY_SCOPES : references
    APP_USERS ||--o{ USER_GEOGRAPHY_SCOPES : references
    GEOGRAPHY_NODES ||--o{ USER_GEOGRAPHY_SCOPES : references
    TENANTS ||--o{ APPROVAL_REQUESTS : references
    APP_USERS ||--o{ APPROVAL_REQUESTS : references
    APP_USERS ||--o{ APPROVAL_REQUESTS : references
    TENANTS ||--o{ NOTIFICATION_TEMPLATES : references
    TENANTS ||--o{ NOTIFICATION_PREFERENCES : references
    APP_USERS ||--o{ NOTIFICATION_PREFERENCES : references
    TENANTS ||--o{ NOTIFICATION_OUTBOX : references
    APP_USERS ||--o{ NOTIFICATION_OUTBOX : references
    TENANTS ||--o{ SURVEY_FORMS : references
```

## 4. Database schema and migration registry
**DDL/migration sources detected:** 4. **Baseline tables detected:** 22. The full and exact schema is defined by the ordered source SQL and later ALTERs, plus the deployed migration history; this table-name view is intentionally limited to inspected baseline files.

Baseline tables: `tenants`, `app_users`, `roles`, `role_permissions`, `user_role_assignments`, `geography_nodes`, `user_geography_scopes`, `approval_requests`, `notification_templates`, `notification_preferences`, `notification_outbox`, `survey_forms`, `survey_form_versions`, `survey_targets`, `survey_submissions`, `cms_items`, `report_definitions`, `audit_events`, `feature_flags`, `app_releases`, `commerce_rules`, `payment_webhook_events`.

**Versioned SQL / schema paths:**
- [`sql/d1/0001_core.sql`](../../sql/d1/0001_core.sql)
- [`sql/d1/0002_payments.sql`](../../sql/d1/0002_payments.sql)
- [`sql/postgres/0001_core.sql`](../../sql/postgres/0001_core.sql)
- [`sql/postgres/0002_payments.sql`](../../sql/postgres/0002_payments.sql)

These are **multiple alternative database templates**, not a single cumulative migration series.


For a verified PostgreSQL schema snapshot: `pg_dump --schema-only --no-owner --no-privileges "$DATABASE_URL" > schema-only.sql`. For SQLite/D1, inspect `sqlite_master` and `PRAGMA table_info` in the correct environment. Never upload production PII or credentials to docs.

## 5. Safe migration script and procedures
**Repository-native migration:** No live migration: DDL is templates applied by consumer projects only. Copy/adapt this guarded operator wrapper into the deployment runbook; it performs **no migration by default**.

```bash
#!/usr/bin/env bash
set -euo pipefail
if [[ "${1:-plan}" != "apply" ]]; then
  echo 'PLAN ONLY: verify target branch/SHA, migration history, pending DDL and permissions'
  echo 'Back up, restore-test, dry-run in staging and record release/backup references.'
  exit 0
fi
[[ "${CONFIRM_DB_MIGRATION:-}" == "BACKUP_VERIFIED" ]] || exit 3
: "${BACKUP_REFERENCE:?Verified backup/snapshot reference required}"
: "${MIGRATION_APPLY_CMD:?Provide the reviewed repository-native migration command}"
bash -lc "$MIGRATION_APPLY_CMD"
echo 'Verify migration tracking table, API health, smoke tests, reconciliation and audit.'
```
**Process:** (1) compare applied versions/checksums; (2) review forward/backward compatibility; (3) backup + actual restoration rehearsal; (4) staging migration/test; (5) review/approve; (6) production apply once; (7) verify health, business smoke and data; (8) record release; (9) recover using tested restore or forward-fix, never blindly undo destructive SQL. Production seeding is prohibited by default.

## 6. Build, release and deployment KT
- Check out the exact release SHA, supported runtime from `package.json` / `pom.xml` and documented local dependencies.
- Run repository tests/build/coverage as configured, inspect CI workflow failures, artifacts, lint/typecheck and vulnerability scans.
- Configure HTTPS, tenant/role/OTP modes, CORS and sessions; keep third-party secrets and payment credentials out of GitHub.
- Validate database connectivity, migration record, app health, cron/background jobs, callback signature verification, logs and alert routes.
- For web/mobile releases verify required version controls, app signing, staging-only toggles and rollback compatibility when present.

## 7. Support, maintenance and incident runbook
**Daily:** health/error rates, auth errors, queue/jobs, webhook exceptions, failed payment/invoice notifications and CI deploy status. **Weekly:** DB backup checks, restore sample, retention, storage growth, payment/reconciliation where relevant, access review. **Monthly:** dependency patching, cert renewals, DR drill, audit review and architecture drift.  
**Incident:** establish scope/last-good SHA; protect logs; disable unsafe writes; compare current vs expected config; use tested rollback/restore; verify with smoke tests; record RCA and corrective test cases.

## 8. KT and customer UAT demo script
**Show:** Select modules -> generate sample project -> validate adapter integration.
| Minutes | What to demonstrate |
|---|---|
| 0-10 | Product scope, stakeholders, roles, current maturity |
| 10-25 | Main happy path + real error/success messages |
| 25-40 | Architecture, data flows, DB, RBAC and integrations |
| 40-50 | Local build, CI/deploy, migration and rollback |
| 50-60 | Backups, monitoring, admin operations, UAT gaps and contacts |

**Negative tests:** bad credentials, expired session, forbidden role, bad input, duplicate submission, concurrent operation/stock conflict, offline/timeouts, provider failures, duplicate webhook if used, failed refund, DB loss, location missing (where relevant), invalid migration and tenant leak. Demonstrate only sandbox transactions unless deployment approval is recorded.

## 9. Handover checklist and known evidence gaps
- [ ] Production/staging service URLs, domains, hosting region, owner and runtime version documented
- [ ] Secrets access handed over via vault (NO values committed)
- [ ] Build and CI evidence, test report/coverage and open defects acknowledged
- [ ] Current database schema-only export and ER reconciled to deployed SHA
- [ ] Migration history, checksum changes and backup/restore evidence signed
- [ ] Health, logs, monitoring thresholds and escalation contact operational
- [ ] Application walkthrough, operational SOP and security/negative UAT approved
- [ ] Release steps, rollback/forward-fix plan and next maintenance window owned

**Other source documentation:**
- [`docs/ARCHITECTURE.md`](../../docs/ARCHITECTURE.md)
- CI: [`.github/workflows/manual-quality.yml`](../../.github/workflows/manual-quality.yml)

*This guide is a source-derived starting point for KT. Do not claim that source presence means production deployment, a passing CI run or an accurate live-schema export.*
