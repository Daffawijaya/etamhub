-- Tabel monitoring UMKM
CREATE TABLE IF NOT EXISTS umkm_monitoring (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  umkm_id uuid REFERENCES umkm(id) ON DELETE CASCADE,
  admin_id uuid REFERENCES admins(id),
  created_at timestamptz DEFAULT now(),

  -- Data saat monitoring
  jumlah_tenaga_kerja integer,
  omzet bigint,

  -- Legalitas & Usaha
  halal text,
  pirt text,
  haki text,
  nib text,
  kbli text[],

  -- Sosmed
  instagram text,
  facebook text,
  tiktok text,

  -- Kebutuhan utama
  kebutuhan_utama text,

  -- Catatan
  catatan text
);

-- Index
CREATE INDEX IF NOT EXISTS idx_monitoring_umkm ON umkm_monitoring(umkm_id);
CREATE INDEX IF NOT EXISTS idx_monitoring_created ON umkm_monitoring(created_at DESC);
