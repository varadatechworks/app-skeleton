# notifications

Email, SMS, WhatsApp, push and in-app transport adapters with consent and templates.

- Category: **engagement**
- Required modules: **none**
- Status: **runnable reference contracts and pure logic; persistence/providers must be integrated**

## Public surface

- `index.mjs`: `CHANNELS`, `renderTemplate`, `createDispatcher`, `outboxEnvelope`
- `providers/index.mjs`: `channelProvider`, `consoleProvider`, `emailProvider`, `smsProvider`, `whatsappProvider`, `pushProvider`, `inAppProvider`

Import from `./modules/notifications/index.mjs` after generating a project. For submodules, use their direct `.mjs` paths.

## Integration requirements

Authenticate and authorize calls in the backend, validate all external inputs, bind `tenantId` to the verified principal, and persist changes atomically. Running the included unit tests is necessary but not sufficient for production readiness.
