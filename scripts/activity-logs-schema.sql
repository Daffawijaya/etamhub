-- Activity Logs table
-- Menyimpan semua aktivitas admin kecamatan dan admin

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL,
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  target_name TEXT,
  detail JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index untuk query cepat
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_actor_id ON activity_logs (actor_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs (action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_target_type ON activity_logs (target_type);

-- RLS (Row Level Security)
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Admin bisa baca semua log
CREATE POLICY "Admin can read activity logs"
  ON activity_logs FOR SELECT
  USING (true);

-- Service role bisa insert log
CREATE POLICY "Service role can insert activity logs"
  ON activity_logs FOR INSERT
  WITH CHECK (true);
