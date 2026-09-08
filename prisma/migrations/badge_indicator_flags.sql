-- Migration: badge_indicator_flags
-- Dijalankan via `npx tsx scripts/apply-badge-flags-migration.ts`
-- (DB tidak dikelola Prisma Migrate, ikut preseden slug_umkm_products.sql)
--
-- 4 switch global: indikator badge yang OFF diabaikan total di perhitungan.
-- Default ON semua = perilaku lama tidak berubah.

ALTER TABLE badge_criteria ADD COLUMN IF NOT EXISTS omzet_on BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE badge_criteria ADD COLUMN IF NOT EXISTS tk_on BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE badge_criteria ADD COLUMN IF NOT EXISTS legalitas_on BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE badge_criteria ADD COLUMN IF NOT EXISTS sosmed_on BOOLEAN NOT NULL DEFAULT true;
