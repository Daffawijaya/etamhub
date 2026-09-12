import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import FooterBrand from "@/components/FooterBrand";
import Breadcrumb from "@/components/Breadcrumb";
import DetailNavbar from "@/components/navbar/DetailNavbar";
import DistrictHero from "@/components/district/DistrictHero";
import UmkmCatalog from "@/components/products/UmkmCatalog";
import type { CatalogUmkm } from "@/lib/umkm/catalog";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { attachBadges, byBadgeThenName } from "@/lib/monitoring/badges";

type Props = {
  params: Promise<{
    district: string;
  }>;
  searchParams: Promise<{
    search?: string;
  }>;
};

function formatDistrictName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function getDistrictUmkms(districtSlug: string): Promise<CatalogUmkm[]> {
  const districtName = formatDistrictName(districtSlug);

  const [{ data, error }, { data: products }] = await Promise.all([
    supabaseAdmin
      .from("umkm")
      .select("*")
      .eq("published", true)
      .eq("kecamatan", districtName)
      .order("created_at", { ascending: false }),
    supabaseAdmin.from("products").select("umkm_id").eq("is_available", true),
  ]);

  if (error) {
    throw new Error(error.message);
  }

  const productCounts = new Map<string, number>();
  for (const product of (products ?? []) as { umkm_id: string }[]) {
    productCounts.set(
      product.umkm_id,
      (productCounts.get(product.umkm_id) ?? 0) + 1,
    );
  }

  // Badge dihitung di SSR + urut global (badge dulu) — sama seperti halaman produk & admin.
  const withBadges = await attachBadges(data ?? []);
  withBadges.sort(byBadgeThenName);

  return withBadges
    .filter((row) => row.slug)
    .map((row) => ({
      id: row.id,
      slug: row.slug as string,
      nama: row.nama,
      deskripsi: (row.deskripsi as string | null) ?? null,
      kecamatan: (row.kecamatan as string | null) ?? null,
      kategori: (row.kategori as string | null) ?? null,
      subkategori: (row.subkategori as string | null) ?? null,
      gambar: Array.isArray(row.gambar) ? row.gambar : [],
      created_at: row.created_at,
      productCount: productCounts.get(row.id) ?? 0,
      badge: row.badge ?? null,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { district } = await params;
  const districtName = formatDistrictName(district);

  try {
    const umkms = await getDistrictUmkms(district);

    return {
      title: `UMKM Kecamatan ${districtName}`,
      description: `Daftar UMKM di Kecamatan ${districtName}, Kutai Kartanegara. ${umkms.length} UMKM terdaftar dengan berbagai kategori usaha.`,
      alternates: {
        canonical: `/kecamatan/${district}`,
      },
      openGraph: {
        type: "website",
        title: `UMKM Kecamatan ${districtName}`,
        description: `Daftar UMKM di Kecamatan ${districtName}, Kutai Kartanegara.`,
      },
      twitter: {
        card: "summary",
        title: `UMKM Kecamatan ${districtName}`,
        description: `Daftar UMKM di Kecamatan ${districtName}, Kutai Kartanegara.`,
      },
    };
  } catch {
    return {
      title: `Kecamatan ${districtName}`,
      description: `Informasi UMKM di Kecamatan ${districtName}.`,
    };
  }
}

export default async function KecamatanPage({
  params,
  searchParams,
}: Props) {
  const [{ district }, { search }] = await Promise.all([
    params,
    searchParams,
  ]);

  let umkms: CatalogUmkm[];
  try {
    umkms = await getDistrictUmkms(district);
  } catch {
    notFound();
  }

  if (umkms.length === 0) {
    notFound();
  }

  const districtName = formatDistrictName(district);
  const query = search?.trim() ?? "";
  const totalSubkategori = new Set(
    umkms.map((umkm) => umkm.subkategori).filter(Boolean),
  ).size;

  return (
    <>
      <DetailNavbar />

      <main className="min-h-screen bg-light-bg text-zinc-900 dark:bg-dark dark:text-white">
        <div className="mx-auto w-full max-w-7xl px-5 pt-20 md:px-6">
          <Breadcrumb
            items={[
              {
                label: "Dashboard",
                href: "/",
              },
              {
                label: districtName,
              },
            ]}
          />

          <div className="mt-6">
            <DistrictHero
              districtName={districtName}
              totalSubkategori={totalSubkategori}
              totalUmkm={umkms.length}
            />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
          <UmkmCatalog key={`umkm-${query}`} umkms={umkms} search={query} />
        </div>

        <Footer
          title={<>Jelajahi UMKM Kecamatan {districtName} bersama etamhub.</>}
        />
        <FooterBrand />
      </main>
    </>
  );
}
