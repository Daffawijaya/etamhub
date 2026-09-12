import type { BadgeResult } from "@/lib/monitoring/badges";

export type CatalogUmkm = {
  id: string;
  slug: string;
  nama: string;
  deskripsi: string | null;
  kecamatan: string | null;
  kategori: string | null;
  subkategori: string | null;
  gambar: string[];
  created_at: string;
  productCount: number;
  badge: BadgeResult | null;
};

export type CatalogUmkmFilters = {
  search: string;
  category: string;
  district: string;
  sort: string;
};

const normalize = (value: string | null | undefined) =>
  value?.toLocaleLowerCase("id-ID").trim() ?? "";

export function filterCatalogUmkms(
  umkms: CatalogUmkm[],
  filters: CatalogUmkmFilters,
) {
  const terms = normalize(filters.search).split(/\s+/).filter(Boolean);

  const filtered = umkms.filter((umkm) => {
    const searchable = normalize(
      [umkm.nama, umkm.deskripsi, umkm.kecamatan, umkm.kategori, umkm.subkategori]
        .filter(Boolean)
        .join(" "),
    );

    return (
      terms.every((term) => searchable.includes(term)) &&
      (!filters.category || umkm.kategori === filters.category) &&
      (!filters.district || umkm.kecamatan === filters.district)
    );
  });

  return [...filtered].sort((a, b) => {
    if (filters.sort === "name") return a.nama.localeCompare(b.nama, "id");
    if (filters.sort === "products") return b.productCount - a.productCount;

    return Date.parse(b.created_at) - Date.parse(a.created_at);
  });
}
