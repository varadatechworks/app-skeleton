# Reusable deployment, maintenance and knowledge-transfer templates

> Apply per project and release; do not fill in actual secret values. Revision: 2026-11-09.

## 1. Environment register
| Field | DEV | UAT | PROD |
|---|---|---|---|
| Repository and deployed SHA | | | |
| Frontend / API hostnames | | | |
| Cloud account, service, region | | | |
| Runtime and rollback image | | | |
| Database engine, logical binding, migration version | | | |
| Backup policy and restore-test ticket | | | |
| Vault entry identifiers (no values) | | | |
| OTP/payment mode + webhook owner | | | |
| Monitoring/log/alert owner | | | |
| Certificate/DNS and escalation owner | | | |
| Customer UAT evidence | | | |

## 2. Migration review and change record
- [ ] Select exact repository SHA, DB target and least-privileged role.
- [ ] Compare migration files with version/checksum tracking; do not edit applied SQL.
- [ ] Review locks, destructive DDL, data conversion, backward compatibility and provider contract changes.
- [ ] Take a backup and **restore it** in a disposable environment; record reference.
- [ ] Apply in staging, run regression/negative cases and validate schema/index constraints.
- [ ] Approve production window; use repository-native migration tool with controlled environment.
- [ ] Capture target migration history, audit/health, failed jobs, payment/refund/booking reconciliation.
- [ ] Record rollback compatibility or forward-fix/restore plan; obtain DBA and application-owner signoff.

## 3. KT/demo - suggested 90 minutes
| Time | Topic and expected proof |
|---|---|
| 0-15m | Business purpose, users/roles, in-scope modules and exclusions |
| 15-35m | Customer, provider/agent/operator/admin workflows; real success/error state |
| 35-50m | Component/deployment diagram, API roles, ER, external integrations |
| 50-65m | CI, environment variables without secrets, migrations/backup/restore and rollback |
| 65-80m | Logs, monitoring, reconciliation, alerts, incident escalation and patch cadence |
| 80-90m | New owner's independent walkthrough, questions, remaining gaps and signoff |

**Negative/UAT:** wrong credentials, expired session/MFA, forbidden tenant/geography, malformed/duplicate request, race, timeout, failed payment, replayed webhook, partial refund, failed notification, DB outage, wrong schema, offline and location/attachment permission issues when applicable.

## 4. Maintenance calendar
- **Daily:** availability, 5xx/latency, auth anomalies, provider callbacks, queue errors, storage pressure and customer support tickets.
- **Weekly:** verified DB backup/restore sample, migration drift, access privilege review, reconciliation, provider retry and certificate checks.
- **Monthly:** CVE/dependency updates, DR rehearsal, retention/privacy review, UX/a11y and UAT regression, runbook and documentation updates.
- **During incident:** classify scope; preserve correlation IDs; contain unsafe writes; check last-good SHA/DB history; use tested rollback/restore or forward-fix; run smoke and RCA.

## 5. Ownership and signoff
| Area | Assigned owner | Evidence | Accepted |
|---|---|---|---|
| Business/UAT | | | |
| Application/backend | | | |
| UI and mobile | | | |
| Database and migrations | | | |
| Cloud/CI/security | | | |
| Payments/notification providers | | | |
| Monitoring/on-call | | | |
| Release/cutover/rollback | | | |

## 6. Additional release gates
- Confirm production records and user access are isolated from staging/demo fixtures.
- Require actual physical schema export and reconciliation with DDL before calling an ER complete.
- Require tested restore, not only a successful backup or declarative backup policy.
- Treat shared SaaS isolation, regulated payments and local-only persistence as explicit blocked release modes until demonstrated.
- Store no PAN, payment tokens, customer files, production dumps or passwords in a technical handover document.
