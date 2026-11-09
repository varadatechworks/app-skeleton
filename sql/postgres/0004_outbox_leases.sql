-- Add durable notification dispatch leases to the new-app baseline.
-- This is an additive migration for notification_outbox from 0001_core.sql.
ALTER TABLE notification_outbox
 ADD COLUMN IF NOT EXISTS claim_token text,
 ADD COLUMN IF NOT EXISTS locked_until timestamptz,
 ADD COLUMN IF NOT EXISTS last_error_code text;
CREATE INDEX IF NOT EXISTS idx_outbox_lease
 ON notification_outbox(tenant_id, status, next_attempt_at, locked_until);
