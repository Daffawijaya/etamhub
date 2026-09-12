import type { Metadata } from "next";
import Footer from "@/components/Footer";
import FooterBrand from "@/components/FooterBrand";
import Navbar from "@/components/navbar/Navbar";
import ListingHero from "@/components/news/HeroNews";
import ProductCatalog from "@/components/products/ProductCatalog";
import UmkmCatalog from "@/components/products/UmkmCatalog";
import type { CatalogProduct } from "@/lib/products/catalog";
import type { CatalogUmkm } from "@/lib/umkm/catalog";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { attachBadges } from "@/lib/monitoring/badges";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Produk UMKM Kutai Kartanegara",
  description:
    "Jelajahi produk lokal dari UMKM Kutai Kartanegara berdasarkan kategori, kecamatan, dan harga.",
  alternates: { canonical: "/produk" },
  openGraph: {
    title: "Produk UMKM Kutai Kartanegara",
    description:
      "Temukan produk unggulan dan pelaku UMKM lokal di Kutai Kartanegara.",
    type: "website",
  },
};

type Props = {
  searchParams: Promise<{ search?: string }>;
};

type ProductRow = Omit<CatalogProduct, "harga" | "umkm"> & {
  harga: number | string | null;
  umkm:
    | (CatalogProduct["umkm"] & { published: boolean | null })
    | (CatalogProduct["umkm"] & { published: boolean | null })[]
    | null;
};

async function getCatalogProducts(): Promise<CatalogProduct[]> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select(
      `
        id,
        slug,
        nama,
        deskripsi,
        harga,
        satuan,
        gambar,
        created_at,
        product_legalitas (id, jenis, kode),
        umkm:umkm_id!inner (
          id,
          slug,
          nama,
          kecamatan,
          kategori,
          subkategori,
          published
        )
      `,
    )
    .eq("is_available", true)
    .not("slug", "is", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil katalog produk:", error.message);
    return [];
  }

  return ((data ?? []) as unknown as ProductRow[]).flatMap((row) => {
    const umkm = Array.isArray(row.umkm) ? row.umkm[0] : row.umkm;

    if (!umkm?.published || !row.slug) return [];

    return [
      {
        ...row,
        slug: row.slug,
        harga: row.harga === null ? null : Number(row.harga),
        gambar: Array.isArray(row.gambar) ? row.gambar : [],
        product_legalitas: Array.isArray(row.product_legalitas)
          ? row.product_legalitas
          : [],
        umkm: {
          id: umkm.id,
          slug: umkm.slug,
          nama: umkm.nama,
          kecamatan: umkm.kecamatan,
          kategori: umkm.kategori,
          subkategori: umkm.subkategori,
          badge: null,
        },
      },
    ];
  });
}

type UmkmRow = {
  id: string;
  slug: string | null;
  nama: string;
  deskripsi: string | null;
  kecamatan: string | null;
  kategori: string | null;
  subkategori: string | null;
  gambar: string[] | null;
  created_at: string;
  omzet: number | null;
  jumlah_tenaga_kerja: number | null;
  nib: string | null;
  halal: string | null;
  pirt: string | null;
  haki: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
};

async function getCatalogUmkms(
  productCounts: Map<string, number>,
): Promise<CatalogUmkm[]> {
  const { data, error } = await supabaseAdmin
    .from("umkm")
    .select(
      "id, slug, nama, deskripsi, kecamatan, kategori, subkategori, gambar, created_at, omzet, jumlah_tenaga_kerja, nib, halal, pirt, haki, instagram, facebook, tiktok",
    )
    .eq("published", true)
    .not("slug", "is", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil katalog UMKM:", error.message);
    return [];
  }

  const withBadges = await attachBadges((data ?? []) as unknown as UmkmRow[]);

  return withBadges
    .filter((row) => row.slug)
    .map((row) => ({
      id: row.id,
      slug: row.slug as string,
      nama: row.nama,
      deskripsi: row.deskripsi,
      kecamatan: row.kecamatan,
      kategori: row.kategori,
      subkategori: row.subkategori,
      gambar: Array.isArray(row.gambar) ? row.gambar : [],
      created_at: row.created_at,
      productCount: productCounts.get(row.id) ?? 0,
      badge: row.badge ?? null,
    }));
}

export default async function ProdukPage({ searchParams }: Props) {
  const [{ search }, products] = await Promise.all([
    searchParams,
    getCatalogProducts(),
  ]);
  const query = search?.trim() ?? "";
  const productCounts = new Map<string, number>();
  for (const product of products) {
    productCounts.set(
      product.umkm.id,
      (productCounts.get(product.umkm.id) ?? 0) + 1,
    );
  }
  const umkms = await getCatalogUmkms(productCounts);
  const badgeMap = new Map(umkms.map((umkm) => [umkm.id, umkm.badge]));
  const productsWithBadges = products.map((product) => ({
    ...product,
    umkm: { ...product.umkm, badge: badgeMap.get(product.umkm.id) ?? null },
  }));

  return (
    <>
      <Navbar />
      <main className="overflow-hidden bg-light-bg transition-colors dark:bg-dark">
        <ListingHero
          badge="Produk Lokal"
          title="Produk UMKM"
          description="Temukan produk unggulan dari UMKM Kutai Kartanegara"
          placeholder="Cari produk atau nama UMKM"
          searchLabel="Cari produk UMKM"
          basePath="/produk"
        />

        <div className="mx-auto max-w-7xl space-y-20 px-4 pb-24 pt-22 sm:px-6 lg:px-8">
          <UmkmCatalog key={`umkm-${query}`} umkms={umkms} search={query} />
          <ProductCatalog key={`produk-${query}`} products={productsWithBadges} search={query} />
        </div>

        <Footer
          title={<>Temukan dan dukung produk lokal terbaik bersama etamhub.</>}
        />
        <FooterBrand />
      </main>
    </>
  );
}
