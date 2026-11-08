# Suggested module selections for future projects

Run from this repository root. The generator creates a new directory and never modifies existing applications.

## Hyperlocal marketplace (SevaMitra-like)

```bash
node tools/create-app.mjs --project local-services --modules identity,authorization,tenant,geo,approvals,notifications,cms,reporting,admin,audit,feature-flags,billing,payments,storage,app-management,i18n --adapters postgres,node-http --db postgres --ui next-admin
```

Keep service catalogue, providers, agents, booking lifecycle, commissions, GST and settlements in the domain app, adapting the shared contracts.

## Sports arena operations (Jnapanam / PlayNexa-like)

```bash
node tools/create-app.mjs --project sports-operations --modules identity,authorization,tenant,notifications,admin,reporting,billing,payments,app-management,audit,workflow,storage --adapters java --db postgres --ui next-admin
```

The Java file is a contract reference only; build Spring Boot implementations and reuse existing booking engines rather than rewriting them in JavaScript. Customer-hosted, managed single-tenant and shared SaaS need the **same** user-visible features. Shared SaaS is not enabled without verified isolation.

## Trust / NGO / field survey app (SST Seva-like)

```bash
node tools/create-app.mjs --project field-impact --modules identity,authorization,geo,survey,cms,approvals,reporting,admin,audit,notifications,i18n,import-export,storage --adapters d1,node-http --db d1 --ui next-admin
```

Choose `authorization/scoped` for combined functional and geography responsibility. Add dynamic versioned forms with user/role/geography targeting and event GPS or explicit unavailable reason. Set approval before publishing reports/content.

## Supplier / order commerce (BuildPro, SRC, FreshPrep)

```bash
node tools/create-app.mjs --project supplier-ops --modules identity,authorization,tenant,geo,admin,workflow,notifications,reporting,billing,payments,audit,storage,import-export --adapters postgres,node-http --db postgres --ui next-admin
```

Inventory, production, packing, driver deliveries, schemes, stock reservations, third-party payout and product/service legal restrictions remain domain modules. Do not reuse online-checkout code for regulated or prohibited product categories.

## Printing / customized packaging (PrintPro)

```bash
node tools/create-app.mjs --project print-pro --modules identity,authorization,tenant,storage,cms,workflow,notifications,reporting,admin,billing,payments,audit,geo --adapters postgres,node-http --db postgres --ui next-admin
```

Add custom quoting/BOQ, materials, dimension-based estimation, 2D/3D preview, proof approval, production machines, logistics and job costing as new app-specific modules. Existing reusable billing/storage/approvals cover only common parts.

**Reminder:** Add real identity/MFA, database connections, media storage, provider transports, service authorization, UAT and deployment workflows in each new application. No generated project is production-ready just by selecting modules.
