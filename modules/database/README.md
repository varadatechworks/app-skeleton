# database

Database interfaces, safe identifiers, transaction contracts and SQL migrations.

- Category: **foundation**
- Required modules: **none**
- Status: **runnable reference contracts and pure logic; persistence/providers must be integrated**

## Public surface

- `index.mjs`: `sqlIdentifier`, `parameterizedInsert`, `inTransaction`, `requireTenantRepository`

Import from `./modules/database/index.mjs` after generating a project. For submodules, use their direct `.mjs` paths.

## Integration requirements

Authenticate and authorize calls in the backend, validate all external inputs, bind `tenantId` to the verified principal, and persist changes atomically. Running the included unit tests is necessary but not sufficient for production readiness.
