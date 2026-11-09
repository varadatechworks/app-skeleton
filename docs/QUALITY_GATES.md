# Foundation quality and integration gates

## Automatic verification

`.github/workflows/ci.yml` runs on every pull request, on pushes to `main`, and when dispatched manually. It runs Node.js unit and negative-path tests, Node coverage collection, TypeScript contract checking, and isolated Cloudflare D1 migration validation. CI failure blocks readiness; repository administrators should additionally **enable branch protection requiring the Foundation CI check**, which needs GitHub settings permissions.

## Webhook replay invariant

`modules/payments/index.mjs` verifies the HMAC against the **unaltered raw request bytes** before parsing the body. The durable idempotency key is the signed raw body SHA-256 digest scoped to the **server-resolved** tenant and payment provider. A caller-supplied event identifier is still required for the integration contract, but changing that identifier does **not** permit reprocessing the same signed payload.

The injected `idempotencyStore.runOnce(key, callback)` must implement a persistent unique constraint and an atomic transaction encompassing the business operation and replay marker. An in-memory map or a read-then-insert sequence is **not** safe across workers or concurrent requests. Distinct signed payloads remain distinct; confirm actual provider event semantics and correlate provider IDs against server-owned payment intents before creating business effects.

Important: replay-proofing is not a substitute for checking the request's provider origin, secret rotation process, whether provider webhooks include delivery timestamps, nor for enforcing allowed payment state transitions. Do not expose a webhook endpoint that trusts a tenant ID or provider selection from the untrusted request body. Resolve it from your webhook endpoint/configuration.

## Remaining production acceptance criteria

1. Implement and test transaction-safe PostgreSQL/D1 idempotency repositories and crash/retry behavior.
2. Add live provider sandbox integration and reconcile payment/refund/settlement state with actual provider records.
3. Add standardized NestJS/Next.js/Expo adapters, including secure authentication, MFA, refresh/session revocation, role/location/tenant predicates.
4. Add database-backed outbox, notifications, consent, retry and DLQ handling.
5. Add CI security advisories, secret scanning, dependency pinning, backup-restore drills, migration rollback rehearsals, and end-to-end UAT.

The app skeleton remains a **reference library** until each consuming application passes its own integration and security tests. Passing foundation CI does not certify any deployed customer application.
