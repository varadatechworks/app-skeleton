# Reusable payment module — onboarding contract

The `payments` module is intended for all commerce applications: sports bookings, service marketplaces, construction material orders, print quotations, wedding vendors, and other *permitted* categories. **Do not enable live payments by merely selecting this module.**

## Reuse flow

1. Create a server-verified, expiring quote with validated currency and amount in integer minor units using the billing module. Record an immutable snapshot and tenant-bound payment intent.
2. Create an order with a provider adapter from `checkout.mjs`. Credential configuration lives in the secrets manager; provider settings stay server-side.
3. Collect checkout result on the client **as a pending assertion**. Verify the signature with server secret and query provider for `captured` status, matching order and amount before fulfillment.
4. Receive raw-body signed webhooks, apply durable idempotency `(tenant,provider,event_id)`, and perform ledger/outbox updates atomically. Event order and concurrent captures must be reconciled, never assumed.
5. Process refunds through `refunds.mjs` using a server-side authorization check and optionally maker/checker approval. Apply settled+reserved refund accounting to avoid duplicate/over refund. Provider refund only occurs via server-side gateway request with idempotency key and status verification.
6. Use `reconciliation.mjs` on a schedule to compare internal ledger/payment records against provider capture and settlement reports. Surface failures, chargebacks, partial settlements, fees and outstanding payouts in an admin report.
7. Model recurring payments, UPI mandates, credits, platform commission, split settlements, TCS/TDS/GST, credit notes and region restrictions as separately governed extensions.

## Provider adapter shape

The dependency-injected adapter must implement `createOrder`, `refund` and `fetchPayment`, and should supply `fetchRefund`, `fetchSettlement` and key rotation as needed. Validate every provider response and log only a redacted correlation reference.

## Persistence starter

`sql/postgres/0002_payments.sql` and `sql/d1/0002_payments.sql` provide example intents, transactions, refunds, ledger and settlements. For PostgreSQL, tenant RLS is enabled. For D1, manually enforce tenant predicates on *every* query. These are **starting schemas for new applications**, not safe retroactive migrations for existing production databases.

## QA gates

Positive and negative webhook signatures, replay and concurrency, late events, full and partial captures, refund cancellation, no-show deductions, provider outages, failed and retrying refunds, reconciliation mismatches, chargebacks, customer notifications, merchant settlement and accounting review. Use official sandbox accounts before live credentials.
