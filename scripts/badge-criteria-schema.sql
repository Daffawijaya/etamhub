-- Tabel konfigurasi kriteria badge monitoring
CREATE TABLE IF NOT EXISTS badge_criteria (
  id text PRIMARY KEY DEFAULT 'default',
  updated_at timestamptz DEFAULT now(),

  -- Silver criteria
  silver_omzet_min bigint DEFAULT 5000000,
  silver_tk_min integer DEFAULT 1,
  silver_legalitas_min integer DEFAULT 0,
  silver_sosmed_min integer DEFAULT 0,

  -- Gold criteria
  gold_omzet_min bigint DEFAULT 10000000,
  gold_tk_min integer DEFAULT 3,
  gold_legalitas_min integer DEFAULT 1,
  gold_sosmed_min integer DEFAULT 1,

  -- Platinum criteria
  platinum_omzet_min bigint DEFAULT 25000000,
  platinum_tk_min integer DEFAULT 5,
  platinum_legalitas_min integer DEFAULT 2,
  platinum_sosmed_min integer DEFAULT 2,

  -- Label keterangan untuk admin
  silver_label text DEFAULT 'Perkembangan positif',
  gold_label text DEFAULT 'Pertumbuhan signifikan',
  platinum_label text DEFAULT 'UMKM Naik Kelas!'
);

-- Insert default config
INSERT INTO badge_criteria (id) VALUES ('default') ON CONFLICT DO NOTHING;
