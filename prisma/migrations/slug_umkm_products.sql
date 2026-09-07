-- Migration: slug_umkm_products
-- Dijalankan via `npx tsx scripts/apply-slug-migration.ts`
-- (DB tidak dikelola Prisma Migrate, ikut preseden allow_umkm_orphan.sql)
--
-- Aturan slug:
--   umkm    : slug(nama) + "-" + slug(kecamatan), tabrakan -> tambah -2, -3, ...
--   products: slug(nama), tabrakan -> tambah -2, -3, ...
-- Trigger BEFORE INSERT/UPDATE menjaga slug otomatis (ikut nama),
-- slug lama yang tergantikan dicatat ke slug_history untuk redirect 301.

-- 1. Helper slugify (tanpa extension tambahan)
CREATE OR REPLACE FUNCTION app_slugify(txt TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT NULLIF(
    regexp_replace(
      regexp_replace(lower(coalesce(txt, '')), '[^a-z0-9]+', '-', 'g'),
      '(^-+|-+$)', '', 'g'
    ),
    ''
  )
$$;

-- 2. Riwayat slug lama untuk redirect
CREATE TABLE IF NOT EXISTS slug_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('umkm', 'product')),
  entity_id UUID NOT NULL,
  old_slug TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (entity_type, old_slug)
);
CREATE INDEX IF NOT EXISTS idx_slug_history_entity ON slug_history (entity_type, entity_id);

-- 3. Kolom slug
ALTER TABLE umkm ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug TEXT;

-- 4. Trigger UMKM
CREATE OR REPLACE FUNCTION umkm_set_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  base TEXT;
  cand TEXT;
  n INT := 1;
  needs_recalc BOOL;
BEGIN
  needs_recalc :=
    TG_OP = 'INSERT'
    OR NEW.slug IS NULL
    OR NEW.nama IS DISTINCT FROM OLD.nama
    OR NEW.kecamatan IS DISTINCT FROM OLD.kecamatan;

  IF NOT needs_recalc THEN
    RETURN NEW;
  END IF;

  base := coalesce(
    NULLIF(
      concat_ws('-', app_slugify(NEW.nama), app_slugify(NEW.kecamatan)),
      '-'
    ),
    'umkm'
  );
  cand := base;

  WHILE EXISTS (
    SELECT 1 FROM umkm WHERE slug = cand AND id IS DISTINCT FROM NEW.id
  ) LOOP
    n := n + 1;
    cand := base || '-' || n;
  END LOOP;

  IF TG_OP = 'UPDATE'
    AND OLD.slug IS NOT NULL
    AND OLD.slug IS DISTINCT FROM cand THEN
    INSERT INTO slug_history (entity_type, entity_id, old_slug)
    VALUES ('umkm', NEW.id, OLD.slug)
    ON CONFLICT DO NOTHING;
  END IF;

  NEW.slug := cand;
  RETURN NEW;
END
$$;

DROP TRIGGER IF EXISTS trg_umkm_slug ON umkm;
CREATE TRIGGER trg_umkm_slug
  BEFORE INSERT OR UPDATE ON umkm
  FOR EACH ROW EXECUTE FUNCTION umkm_set_slug();

-- 5. Trigger products
CREATE OR REPLACE FUNCTION product_set_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  base TEXT;
  cand TEXT;
  n INT := 1;
  needs_recalc BOOL;
BEGIN
  needs_recalc :=
    TG_OP = 'INSERT'
    OR NEW.slug IS NULL
    OR NEW.nama IS DISTINCT FROM OLD.nama;

  IF NOT needs_recalc THEN
    RETURN NEW;
  END IF;

  base := coalesce(app_slugify(NEW.nama), 'produk');
  cand := base;

  WHILE EXISTS (
    SELECT 1 FROM products WHERE slug = cand AND id IS DISTINCT FROM NEW.id
  ) LOOP
    n := n + 1;
    cand := base || '-' || n;
  END LOOP;

  IF TG_OP = 'UPDATE'
    AND OLD.slug IS NOT NULL
    AND OLD.slug IS DISTINCT FROM cand THEN
    INSERT INTO slug_history (entity_type, entity_id, old_slug)
    VALUES ('product', NEW.id, OLD.slug)
    ON CONFLICT DO NOTHING;
  END IF;

  NEW.slug := cand;
  RETURN NEW;
END
$$;

DROP TRIGGER IF EXISTS trg_product_slug ON products;
CREATE TRIGGER trg_product_slug
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION product_set_slug();

-- 6. Backfill data lama (menyalakan trigger per baris)
UPDATE umkm SET nama = nama WHERE slug IS NULL;
UPDATE products SET nama = nama WHERE slug IS NULL;

-- 7. Pengaman unique + index lookup
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_umkm_slug'
  ) THEN
    ALTER TABLE umkm ADD CONSTRAINT uq_umkm_slug UNIQUE (slug);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_products_slug'
  ) THEN
    ALTER TABLE products ADD CONSTRAINT uq_products_slug UNIQUE (slug);
  END IF;
END
$$;
CREATE INDEX IF NOT EXISTS idx_umkm_slug ON umkm (slug);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug);
