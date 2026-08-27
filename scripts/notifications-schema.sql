-- Add user_id to notifications (target who receives the notification)
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS admin_id uuid REFERENCES admins(id) ON DELETE CASCADE;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS link text;

-- Index for fast lookup per user
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_admin ON notifications(admin_id) WHERE admin_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_unread_user ON notifications(user_id, read) WHERE user_id IS NOT NULL AND read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_unread_admin ON notifications(admin_id, read) WHERE admin_id IS NOT NULL AND read = false;
