-- Tabel KBLI
CREATE TABLE IF NOT EXISTS kbli (
  kode text PRIMARY KEY,
  nama_id text NOT NULL,
  nama_en text
);

-- Index untuk pencarian
CREATE INDEX IF NOT EXISTS idx_kbli_nama ON kbli USING gin (nama_id gin_trgm_ops);

-- Aktifkan ekstensi pg_trgm jika belum ada
CREATE EXTENSION IF NOT EXISTS pg_trgm;
