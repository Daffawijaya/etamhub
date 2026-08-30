import { notFound } from "next/navigation";
import type { Metadata } from "next";
import UmkmDetail from "@/components/Umkm/UmkmDetail";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import DetailNavbar from "@/components/navbar/DetailNavbar";
import PublicProductList from "@/components/Umkm/PublicProductList";
import { getBaseUrl } from "@/lib/api";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function getUmkm(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/umkm/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const umkm = await getUmkm(id);
    if (!umkm) {
      return { title: "UMKM Tidak Ditemukan" };
    }

    const baseUrl = getBaseUrl();
    const description =
      umkm.deskripsi ||
      `${umkm.nama} — UMKM di Kecamatan ${umkm.kecamatan}, Kutai Kartanegara. Kategori: ${umkm.kategori}${umkm.subkategori ? ` · ${umkm.subkategori}` : ""}.`;

    return {
      title: `${umkm.nama} — ${umkm.kecamatan}`,
      description: description.slice(0, 160),
      alternates: {
        canonical: `/umkm/${umkm.id}`,
      },
      openGraph: {
        type: "website",
        title: `${umkm.nama} — ${umkm.kecamatan}`,
        description: description.slice(0, 160),
        ...(umkm.gambar?.[0] && {
          images: [
            {
              url: umkm.gambar[0],
              width: 1200,
              height: 630,
              alt: umkm.nama,
            },
          ],
        }),
      },
      twitter: {
        card: "summary_large_image",
        title: `${umkm.nama} — ${umkm.kecamatan}`,
        description: description.slice(0, 160),
        ...(umkm.gambar?.[0] && {
          images: [umkm.gambar[0]],
        }),
      },
    };
  } catch {
    return { title: "UMKM Tidak Ditemukan" };
  }
}

export default async function UmkmPage({ params }: Props) {
  const { id } = await params;

  const umkm = await getUmkm(id);

  if (!umkm) {
    notFound();
  }

  const kecamatanSlug = umkm.kecamatan
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

  const baseUrl = getBaseUrl();

  // Breadcrumb JSON-LD
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: umkm.kecamatan,
        item: `${baseUrl}/kecamatan/${kecamatanSlug}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: umkm.nama,
        item: `${baseUrl}/umkm/${umkm.id}`,
      },
    ],
  };

  // LocalBusiness JSON-LD
  const localBusinessLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: umkm.nama,
    description: umkm.deskripsi || undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: umkm.kecamatan,
      addressRegion: "Kutai Kartanegara",
      addressCountry: "ID",
      streetAddress: umkm.alamat || undefined,
    },
    ...(umkm.lat &&
      umkm.lng && {
        geo: {
          "@type": "GeoCoordinates",
          latitude: umkm.lat,
          longitude: umkm.lng,
        },
      }),
    ...(umkm.gambar?.[0] && {
      image: umkm.gambar[0],
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessLd),
        }}
      />

      <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark">
        <DetailNavbar />

        <main className="relative flex-1 overflow-hidden py-20">
          <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-6">
            <Breadcrumb
              items={[
                {
                  label: "Dashboard",
                  href: "/",
                },
                {
                  label: umkm.kecamatan,
                  href: `/kecamatan/${kecamatanSlug}`,
                },
                {
                  label: umkm.nama,
                },
              ]}
            />
          </div>

          <div className="relative z-10">
            <UmkmDetail {...umkm} />
          </div>
          <PublicProductList umkmId={umkm.id} />
        </main>

        <Footer />
      </div>
    </>
  );
}
