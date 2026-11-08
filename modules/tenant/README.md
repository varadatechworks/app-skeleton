# tenant

Single-tenant and shared SaaS tenant guardrails.

- Category: **foundation**
- Required modules: **none**
- Status: **runnable reference contracts and pure logic; persistence/providers must be integrated**

## Public surface

- `index.mjs`: `DEPLOYMENT_MODES`, `tenantContext`, `assertSameTenant`, `requireTenantFilter`

Import from `./modules/tenant/index.mjs` after generating a project. For submodules, use their direct `.mjs` paths.

## Integration requirements

Authenticate and authorize calls in the backend, validate all external inputs, bind `tenantId` to the verified principal, and persist changes atomically. Running the included unit tests is necessary but not sufficient for production readiness.
