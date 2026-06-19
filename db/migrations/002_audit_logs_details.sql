-- Allow multiple lifecycle entries per ticket and store extra context (e.g. assignee id).
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS details VARCHAR(255);
