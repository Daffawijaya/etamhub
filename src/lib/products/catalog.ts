export type CatalogLegalitas = {
  id: string;
  jenis: string;
  kode: string | null;
};

import type { BadgeResult } from "@/lib/monitoring/badges";

export type CatalogProduct = {
  id: string;
  slug: string;
  nama: string;
  deskripsi: string | null;
  harga: number | null;
  satuan: string | null;
  gambar: string[];
  created_at: string;
  product_legalitas: CatalogLegalitas[];
  umkm: {
    id: string;
    slug: string | null;
    nama: string;
    kecamatan: string | null;
    kategori: string | null;
    subkategori: string | null;
    badge: BadgeResult | null;
  };
};

export type CatalogFilters = {
  search: string;
  category: string;
  district: string;
  price: string;
  sort: string;
};

const normalize = (value: string | null | undefined) =>
  value?.toLocaleLowerCase("id-ID").trim() ?? "";

const isInPriceRange = (price: number | null, range: string) => {
  if (!range) return true;
  if (range === "unpriced") return price === null;
  if (price === null) return false;
  if (range === "under-25") return price < 25_000;
  if (range === "25-50") return price >= 25_000 && price <= 50_000;
  if (range === "50-100") return price > 50_000 && price <= 100_000;
  if (range === "above-100") return price > 100_000;
  return true;
};

export function filterCatalogProducts(
  products: CatalogProduct[],
  filters: CatalogFilters,
) {
  const terms = normalize(filters.search).split(/\s+/).filter(Boolean);

  const filtered = products.filter((product) => {
    const searchable = normalize(
      [
        product.nama,
        product.deskripsi,
        product.umkm.nama,
        product.umkm.kecamatan,
        product.umkm.kategori,
        product.umkm.subkategori,
      ]
        .filter(Boolean)
        .join(" "),
    );

    return (
      terms.every((term) => searchable.includes(term)) &&
      (!filters.category || product.umkm.kategori === filters.category) &&
      (!filters.district || product.umkm.kecamatan === filters.district) &&
      isInPriceRange(product.harga, filters.price)
    );
  });

  return [...filtered].sort((a, b) => {
    if (filters.sort === "name") return a.nama.localeCompare(b.nama, "id");
    if (filters.sort === "price-low") {
      return (a.harga ?? Number.POSITIVE_INFINITY) -
        (b.harga ?? Number.POSITIVE_INFINITY);
    }
    if (filters.sort === "price-high") {
      if (a.harga === null) return 1;
      if (b.harga === null) return -1;
      return b.harga - a.harga;
    }

    return Date.parse(b.created_at) - Date.parse(a.created_at);
  });
}
