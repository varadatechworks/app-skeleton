# Security and production integration gates

1. Authenticate and authorize every server request. `identity` does not issue sessions or passwords; integrate a tested identity backend (JWT validation, OTP/MFA, refresh-token revocation, throttling, reset controls, session rotation). Never trust client supplied user/role/tenant identifiers.
2. Use `authorization` + `tenant` + `geo` checks at **service and database boundaries**. Cross-tenant rows and nested geographic resources must not be returned just because a menu item is hidden.
3. All writes must be transactional and check state at commit time. Use immutable event IDs, idempotency keys, optimistic versions, race handling and appropriate concurrency locks; examples are *in-memory reference policies*.
4. Encrypt secrets outside Git, enforce least-privilege, secure CORS, CSRF as relevant, input size caps, rate limiting and permission-change audit. Redact OTP, passwords, auth headers and payment data from logs.
5. Delivery consent is channel-specific: WhatsApp/SMS templates and local regulations require provider approval. The reference notification dispatcher does not send real messages by default.
6. Survey media and GPS can be sensitive personal data. Record consent, source, capture time and accuracy, limit retention, validate uploaded files and consider location fuzzing for public reports.
7. Billing is a *calculator reference*; reconcile actual GST/TCS/TDS/coupon/refund/credit note rules with legal/tax advisors and final invoice snapshots. Never calculate settled money with floating-point currency.
8. Validate payment webhook signatures using **raw** request bodies, check event IDs, timestamps/provider semantics and idempotency inside a durable transaction. Never treat a redirect as proof of payment.
9. Upgrade release artifacts must have persistent Android signing keys, hash-verified downloads, app version metadata, privacy-policy link and authenticated admin update controls.
10. Before deploying: audit dependencies, test migrations on an isolated database, load test, run security/negative/integration/UAT suites, verify live provider sandbox, data backups and recovery, verify worker retries, and instrument alerts.
