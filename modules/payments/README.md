# Payments — provider-neutral reference module

**Status:** working pure-logic and provider contracts. NOT a live payment gateway, merchant integration, or settlement service. Use backend-owned tenant ID, order ID, pricing/tax snapshot and provider credentials.

## Building blocks

- `index.mjs` — SHA-256 raw-body webhook signature validation; durable transaction-level `runOnce` idempotency adapter.
- `checkout.mjs` — Razorpay-style `orderId|paymentId` signature verification; injectable provider registry; independently query and verify captured payment status, amount, currency and order.
- `refunds.mjs` — partial/full refund guard, reserved pending refunds, authorized fee deduction, refund approval lifecycle.
- `reconciliation.mjs` — payment reconciliation and fee/payout split in integer minor units.
- `sql/{postgres,d1}/0002_payments.sql` — optional tenant-scoped intent/capture, refund, ledger, settlement and gateway-webhook schemas.

## Required integrations before production

1. Server-side order creation and validated server quote snapshot. Never accept checkout amount, payment state, merchant ID or scope from the browser.
2. Live gateway SDK/API, secure secret storage, sandbox tests, gateway fetch for capture verification, webhooks with raw body and durable idempotency in one database transaction.
3. Database-backed state transitions with uniqueness of (tenant, provider, external reference). Never mark payment succeeded on client redirect.
4. Refund permissions, maker-checker when required, deductions clearly disclosed, idempotent provider refund requests, provider acknowledgement, gateway reconciliation, credit notes and tax treatment.
5. Settlements/payouts, platform fees, disputes, chargebacks, failed/late events, outbox notifications, webhook retry and operations dashboard.
6. Do not activate regulated or prohibited payment categories; gateway/merchant policy and Indian regulatory/tax review required for each application.

**Accounting:** examples use integer paise/cents, not JavaScript floating-point currency. Adapt split rounding and high-value overflow policies for your merchant's rules. Mandates/subscriptions should be a separate application-level extension with provider-verified consent and payment authorization.
