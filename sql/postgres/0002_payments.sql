-- Optional new application migration; run AFTER 0001_core.sql (not on existing production DBs).
-- Hard rule: all changes happen in tenant-verified, serializable/locked database transactions.
CREATE TABLE IF NOT EXISTS payment_intents (
 id TEXT PRIMARY KEY,tenant_id TEXT NOT NULL REFERENCES tenants(id),provider TEXT NOT NULL,
 provider_order_id TEXT,order_id TEXT NOT NULL,amount_minor BIGINT NOT NULL CHECK(amount_minor>0),
 currency CHAR(3) NOT NULL,status TEXT NOT NULL CHECK(status IN ('created','pending','authorized','captured','failed','cancelled')),
 quote_snapshot JSONB NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT now(),updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 UNIQUE(tenant_id,id),UNIQUE(tenant_id,provider,provider_order_id),UNIQUE(tenant_id,order_id,provider)
);
CREATE TABLE IF NOT EXISTS payment_transactions (
 id TEXT PRIMARY KEY,tenant_id TEXT NOT NULL REFERENCES tenants(id),intent_id TEXT NOT NULL,
 provider TEXT NOT NULL,provider_payment_id TEXT NOT NULL,amount_minor BIGINT NOT NULL CHECK(amount_minor>0),
 currency CHAR(3) NOT NULL,status TEXT NOT NULL CHECK(status IN ('authorized','captured','failed','reversed')),
 occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),UNIQUE(tenant_id,id),UNIQUE(tenant_id,provider,provider_payment_id),
 FOREIGN KEY(tenant_id,intent_id) REFERENCES payment_intents(tenant_id,id)
);
CREATE TABLE IF NOT EXISTS payment_refunds (
 id TEXT PRIMARY KEY,tenant_id TEXT NOT NULL REFERENCES tenants(id),transaction_id TEXT NOT NULL,
 provider_refund_id TEXT,client_idempotency_key TEXT NOT NULL,requested_minor BIGINT NOT NULL CHECK(requested_minor>0),
 fee_deduction_minor BIGINT NOT NULL DEFAULT 0 CHECK(fee_deduction_minor>=0),
 provider_refund_minor BIGINT NOT NULL CHECK(provider_refund_minor>=0),
 reason TEXT NOT NULL,requested_by TEXT NOT NULL,approved_by TEXT,
 status TEXT NOT NULL CHECK(status IN ('requested','approved','rejected','submitted','succeeded','failed')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 CHECK(fee_deduction_minor+provider_refund_minor=requested_minor),
 UNIQUE(tenant_id,id),UNIQUE(tenant_id,client_idempotency_key),UNIQUE(tenant_id,provider_refund_id),
 FOREIGN KEY(tenant_id,transaction_id) REFERENCES payment_transactions(tenant_id,id)
);
CREATE TABLE IF NOT EXISTS payment_ledger (
 id TEXT PRIMARY KEY,tenant_id TEXT NOT NULL REFERENCES tenants(id),transaction_id TEXT,
 refund_id TEXT,entry_type TEXT NOT NULL CHECK(entry_type IN ('capture','refund','chargeback','gateway_fee','platform_fee','payout','adjustment')),
 amount_minor BIGINT NOT NULL,currency CHAR(3) NOT NULL,external_event_key TEXT NOT NULL,
 recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),recorded_by TEXT NOT NULL,reason TEXT,
 UNIQUE(tenant_id,external_event_key),
 FOREIGN KEY(tenant_id,transaction_id) REFERENCES payment_transactions(tenant_id,id),
 FOREIGN KEY(tenant_id,refund_id) REFERENCES payment_refunds(tenant_id,id)
);
CREATE TABLE IF NOT EXISTS payment_settlements (
 id TEXT PRIMARY KEY,tenant_id TEXT NOT NULL REFERENCES tenants(id),provider TEXT NOT NULL,
 settlement_ref TEXT NOT NULL,transaction_id TEXT NOT NULL,net_minor BIGINT NOT NULL CHECK(net_minor>=0),
 platform_fee_minor BIGINT NOT NULL DEFAULT 0 CHECK(platform_fee_minor>=0),
 processing_fee_minor BIGINT NOT NULL DEFAULT 0 CHECK(processing_fee_minor>=0),
 partner_payout_minor BIGINT NOT NULL CHECK(partner_payout_minor>=0),currency CHAR(3) NOT NULL,
 status TEXT NOT NULL CHECK(status IN ('pending','confirmed','reconciled','disputed')),
 CHECK(net_minor=platform_fee_minor+processing_fee_minor+partner_payout_minor),
 UNIQUE(tenant_id,provider,settlement_ref,transaction_id),UNIQUE(tenant_id,id),
 FOREIGN KEY(tenant_id,transaction_id) REFERENCES payment_transactions(tenant_id,id)
);
CREATE INDEX IF NOT EXISTS idx_payment_intents_order ON payment_intents(tenant_id,order_id);
CREATE INDEX IF NOT EXISTS idx_payment_refunds_transaction ON payment_refunds(tenant_id,transaction_id,status);
CREATE INDEX IF NOT EXISTS idx_payment_ledger_time ON payment_ledger(tenant_id,recorded_at DESC);
DO $rls$ DECLARE tbl TEXT; BEGIN
 FOREACH tbl IN ARRAY ARRAY['payment_intents','payment_transactions','payment_refunds','payment_ledger','payment_settlements'] LOOP
  EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY',tbl);
  EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY',tbl);
  EXECUTE format('CREATE POLICY tenant_isolation ON %I USING (tenant_id = current_setting(''app.tenant_id'', true)) WITH CHECK (tenant_id = current_setting(''app.tenant_id'', true))',tbl);
 END LOOP;
END $rls$;
-- No UPDATE/DELETE grant on payment_ledger to runtime role; use database roles/permissions to enforce append-only.
