import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import DetailNavbar from "@/components/navbar/DetailNavbar";
import Breadcrumb from "@/components/Breadcrumb";
import ProductDetailPage from "@/components/products/ProductDetailPage";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function getProduct(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/products/${id}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    return null;
  }

  const result = await res.json();
  return result.success ? result.data : null;
}

async function getUmkm(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/umkm/${id}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

async function getOtherProducts(umkmId: string, excludeProductId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/products?umkm_id=${umkmId}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    return [];
  }

  const result = await res.json();
  if (!result.success) {
    return [];
  }

  return result.data.filter(
    (p: { id: string; is_available: boolean }) =>
      p.id !== excludeProductId && p.is_available,
  );
}

export default async function ProdukPage({ params }: Props) {
  const { id } = await params;

  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const umkm = await getUmkm(product.umkm_id);
  const otherProducts = await getOtherProducts(product.umkm_id, product.id);

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
                      href: `/umkm/${umkm.id}`,
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
