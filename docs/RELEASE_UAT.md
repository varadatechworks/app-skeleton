# Release acceptance and UAT checklist — app-skeleton

This repository is an integration library and UI reference, **not a deployed application**. No real payment, message delivery, security certification, production hosting or customer UAT is asserted by source-only validation.

## Reproducible release gates

1. PR: run Foundation CI on Node 22, including unit, negative, types, D1 migrations. Protect main with required checks and security review.
2. In isolated PostgreSQL: apply 0001, 0002, 0003 in order. Verify tenant RLS with an actual **non-owner, non-BYPASSRLS** role; test rollback and concurrent duplicate webhook delivery with 10+ workers.
3. In NestJS/Next.js: JWT signature, audience, expiration, revocation, clock skew, MFA, CORS and CSRF controls configured by the consumer; exercise 401, 403 and cross-tenant requests on every handler.
4. Expo: use expo-secure-store for tokens, prove unauthorized callbacks, device back-button behavior, background/resume login and token rotation. Verify production signing, app links, Android permissions and offline state.
5. Providers: create isolated provider sandbox credentials via environment secret stores. Send consented email and SMS and record actual message IDs. Exercise 429, network timeout, invalid templates, opt-out and retry.
6. Razorpay: test signed checkout, raw-body webhooks, capture lookup (map fields/status with provider contract), duplicate/out-of-order events, partial refunds, fee deductions, reconciliation and settlement snapshots. Never infer success from browser redirects.
7. Admin: check keyboard navigation, empty/error/loading states, mobile viewport, WCAG contrasts, bilingual copy, paging, tenant-bound reports, and unauthorized menu/API access.
8. Operations: verify migrations/backups restore, retention, audit evidence, failure alerts, payment/notification incident playbooks, rollback and secret rotation.
9. Customer UAT signoff requires named tenant, environment, build SHA, test results, known defects, responsible approver and timestamp; **no signoff is generated automatically**.

## Result matrix

| Area | Repository status | Customer production/UAT status |
|---|---|---|
| NestJS/Next.js/Expo | Reference executable adapters and negative tests | Not integrated into consuming apps |
| PostgreSQL | Transactional idempotency schema/adapter + mock tests | Real Postgres race/RLS tests required |
| Notifications | Server-side Resend and Twilio request adapters | Live credentials, real delivery, consent/outbox required |
| Payments | Razorpay request adapter and existing signature/flow logic | Sandbox reconciliation/refunds and production authorization required |
| Admin | Responsive operations dashboard template | End-to-end UI, accessibility and tenant data tests required |
| Deploy | GitHub CI and release checklist | No production deployment or customer signoff |

Do not label the platform production-ready until all application-specific gates pass.
