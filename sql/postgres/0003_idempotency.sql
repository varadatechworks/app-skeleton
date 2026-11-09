-- Apply separately after 0001_core.sql and 0002_payments.sql, on a NEW database.
-- UNIQUE prevents concurrent duplicates: the losing INSERT waits on the winning transaction.
CREATE TABLE IF NOT EXISTS skeleton_idempotency (
  tenant_id text NOT NULL,
  namespace text NOT NULL,
  key_digest text NOT NULL,
  result_json jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, namespace, key_digest),
  CONSTRAINT skeleton_idempotency_result_object CHECK (result_json IS NULL OR jsonb_typeof(result_json) IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS skeleton_idempotency_created_idx ON skeleton_idempotency(created_at);
ALTER TABLE skeleton_idempotency ENABLE ROW LEVEL SECURITY;
ALTER TABLE skeleton_idempotency FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS skeleton_idempotency_tenant ON skeleton_idempotency;
CREATE POLICY skeleton_idempotency_tenant ON skeleton_idempotency
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));
-- Deploy with a non-owner, non-BYPASSRLS application role; test actual database grants.
