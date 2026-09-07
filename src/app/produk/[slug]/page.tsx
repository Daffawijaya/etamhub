import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import DetailNavbar from "@/components/navbar/DetailNavbar";
import Breadcrumb from "@/components/Breadcrumb";
import ProductDetailPage from "@/components/products/ProductDetailPage";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getBaseUrl } from "@/lib/api";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function getProduct(slug: string) {
  const baseSelect =
    "*, umkm:umkm_id (id, nama, slug, kecamatan), product_legalitas (*)";

  const bySlug = await supabaseAdmin
    .from("products")
    .select(baseSelect)
    .eq("slug", slug)
    .maybeSingle();

  if (!bySlug.error && bySlug.data) {
    return bySlug.data;
  }

  let id: string | null = null;

  if (UUID_RE.test(slug)) {
    id = slug;
  } else {
    const hist = await supabaseAdmin
      .from("slug_history")
      .select("entity_id")
      .eq("entity_type", "product")
      .eq("old_slug", slug)
      .maybeSingle();

    id = (hist.data as { entity_id: string } | null)?.entity_id ?? null;
  }

  if (!id) {
    return null;
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .select(baseSelect)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

async function getUmkm(id: string) {
  const { data } = await supabaseAdmin
    .from("umkm")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return data;
}

async function getOtherProducts(umkmId: string, excludeProductId: string) {
  const { data } = await supabaseAdmin
    .from("products")
    .select("*, product_legalitas (*)")
    .eq("umkm_id", umkmId)
    .eq("is_available", true)
    .neq("id", excludeProductId)
    .order("created_at", { ascending: false })
    .limit(10);

  return data ?? [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await getProduct(slug);
    if (!product) {
      return { title: "Produk Tidak Ditemukan" };
    }

    const umkm = product.umkm as any;
    const description =
      product.deskripsi ||
      `${product.nama} — Produk dari ${umkm?.nama || "UMKM"} di Kecamatan ${umkm?.kecamatan || ""}.`;
    const imageUrl = product.gambar?.[0];

    return {
      title: `${product.nama}${umkm?.nama ? ` — ${umkm.nama}` : ""}`,
      description: description.slice(0, 160),
      alternates: {
        canonical: `/produk/${product.slug}`,
      },
      openGraph: {
        type: "website",
        title: `${product.nama}${umkm?.nama ? ` — ${umkm.nama}` : ""}`,
        description: description.slice(0, 160),
        ...(imageUrl && {
          images: [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: product.nama,
            },
          ],
        }),
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.nama}${umkm?.nama ? ` — ${umkm.nama}` : ""}`,
        description: description.slice(0, 160),
        ...(imageUrl && {
          images: [imageUrl],
        }),
      },
    };
  } catch {
    return { title: "Produk Tidak Ditemukan" };
  }
}

export default async function ProdukPage({ params }: Props) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  if (slug !== product.slug) {
    permanentRedirect(`/produk/${product.slug}`);
  }

  // Parallel fetch: umkm and other products
  const [umkm, otherProducts] = await Promise.all([
    getUmkm(product.umkm_id),
    getOtherProducts(product.umkm_id, product.id),
  ]);

  const kecamatanSlug =
    umkm?.kecamatan
      ?.toLowerCase()
      .trim()
      .replace(/\s+/g, "-") ?? "";

  return (
    <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark">
      <DetailNavbar />

      <main className="relative flex-1 overflow-hidden pt-20 pb-12">
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-6">
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/" },
              ...(umkm
                ? [
                    {
                      label: umkm.kecamatan,
                      href: `/kecamatan/${kecamatanSlug}`,
                    },
                    {
                      label: umkm.nama,
                      href: `/umkm/${umkm.slug}`,
                    },
                  ]
                : []),
              { label: product.nama },
            ]}
          />
        </div>

        <ProductDetailPage
          product={product}
          umkm={umkm}
          otherProducts={otherProducts}
        />
      </main>

      <Footer />
    </div>
  );
}
