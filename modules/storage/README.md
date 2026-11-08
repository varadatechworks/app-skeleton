# storage

Validated object keys and injectable private upload/download signing.

- Category: **foundation**
- Required modules: **none**
- Status: **runnable reference contracts and pure logic; persistence/providers must be integrated**

## Public surface

- `index.mjs`: `objectKey`, `validateUpload`, `signedPrivateUpload`

Import from `./modules/storage/index.mjs` after generating a project. For submodules, use their direct `.mjs` paths.

## Integration requirements

Authenticate and authorize calls in the backend, validate all external inputs, bind `tenantId` to the verified principal, and persist changes atomically. Running the included unit tests is necessary but not sufficient for production readiness.
