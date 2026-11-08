# authorization

Simple RBAC, feature/action permissions, functional assignments and hierarchical geography scopes.

- Category: **foundation**
- Required modules: **geo, tenant**
- Status: **runnable reference contracts and pure logic; persistence/providers must be integrated**

## Public surface

- `scoped.mjs`: `allowedScoped`, `requireScoped`
- `role-service.mjs`: `createRoleService`
- `simple.mjs`: `ACTIONS`, `allowedSimple`, `requireSimple`
- `index.mjs`: re-exports submodules

Import from `./modules/authorization/index.mjs` after generating a project. For submodules, use their direct `.mjs` paths.

## Integration requirements

Authenticate and authorize calls in the backend, validate all external inputs, bind `tenantId` to the verified principal, and persist changes atomically. Running the included unit tests is necessary but not sufficient for production readiness.
