-- Migration: allow_umkm_orphan + 1 NIK = 1 UMKM
-- Jalankan di Supabase Dashboard -> SQL Editor ATAU via `npx prisma migrate dev` setelah isi DATABASE_URL
-- php artisan migrate equivalent: npx prisma migrate dev --name allow_umkm_orphan

-- 1. Owner boleh null (untuk UMKM yang dibuat admin tanpa user)
ALTER TABLE umkm ALTER COLUMN owner_id DROP NOT NULL;

-- 2. 1 NIK = 1 UMKM (unique). Hanya untuk nik yang terisi.
CREATE UNIQUE INDEX IF NOT EXISTS uq_umkm_nik ON umkm(nik) WHERE nik IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_users_nik ON users(nik) WHERE nik IS NOT NULL;

-- 3. Index bantu query orphan
CREATE INDEX IF NOT EXISTS idx_umkm_owner_null ON umkm(owner_id) WHERE owner_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_umkm_nik ON umkm(nik);

-- 4. Backfill nik dari users ke umkm yang belum punya nik (opsional, 1x jalan)
-- UPDATE umkm SET nik = users.nik FROM users WHERE umkm.owner_id = users.id AND umkm.nik IS NULL;
