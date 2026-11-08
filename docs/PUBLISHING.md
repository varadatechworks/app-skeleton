# Publishing and consuming Varada App Skeleton

**Repository:** https://github.com/varadatechworks/app-skeleton

**Status:** foundation v0.2.0 pushed to `main` on 2026-11-09 after GitHub installation access was enabled. Modules are independently selectable; this is a reusable library reference, not a live application.

## Use in a new project

```bash
git clone https://github.com/varadatechworks/app-skeleton.git
cd app-skeleton
npm test
node tools/create-app.mjs --list
node tools/create-app.mjs --project your-project --modules identity,authorization,notifications,billing,payments --adapters postgres,node-http --db postgres --out /tmp
```

Run generated project tests before app integration. Integrate authentication, RLS/tenant predicates, webhook transactions, real merchant adapters and external providers separately. **Never commit merchant keys or database secrets.**

## Updating the foundation

Changes to shared modules should include source/reference attribution, API compatibility notes, negative-path tests, schema migration notes, security review, and consumer integration guidance. Manual GitHub Actions workflow (`.github/workflows/manual-quality.yml`) is opt-in to conserve CI minutes. Production apps should pin a reviewed commit/tag; never silently consume floating `main`.

## Ownership

The library is a clean reusable implementation informed by the `bv-prasanna`, `varadatechworks` and `SS-trust` repositories. Confirm source ownership/licensing before commercial redistribution. Domain-specific implementations remain in their original repositories.
