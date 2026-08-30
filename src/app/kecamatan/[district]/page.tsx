import { notFound } from "next/navigation";
import type { Metadata } from "next";
import KecamatanPageClient from "@/components/district/KecamatanPageClient";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type Props = {
  params: Promise<{
    district: string;
  }>;
};

function formatDistrictName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function getUmkmByDistrict(districtSlug: string) {
  const districtName = formatDistrictName(districtSlug);

  const { data, error, count } = await supabaseAdmin
    .from("umkm")
    .select("*", { count: "exact" })
    .eq("published", true)
    .eq("kecamatan", districtName)
    .order("created_at", { ascending: false })
    .range(0, 7);

  if (error) {
    throw new Error(error.message);
  }

  return {
    data: data ?? [],
    total: count ?? 0,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { district } = await params;
  const districtName = formatDistrictName(district);

  try {
    const { total } = await getUmkmByDistrict(district);

    return {
      title: `UMKM Kecamatan ${districtName}`,
      description:
        `Daftar UMKM di Kecamatan ${districtName}, Kutai Kartanegara. ${total} UMKM terdaftar dengan berbagai kategori usaha.`,
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

export default async function KecamatanPage({ params }: Props) {
  const { district } = await params;

  try {
    const { data, total } = await getUmkmByDistrict(district);

    if (data.length === 0) {
      notFound();
    }

    return (
      <KecamatanPageClient
        district={district}
        initialData={data as any}
        initialTotal={total}
      />
    );
  } catch {
    notFound();
  }
}
