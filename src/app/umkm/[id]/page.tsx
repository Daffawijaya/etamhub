import { notFound } from "next/navigation";
import UmkmDetail from "@/components/Umkm/UmkmDetail";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import DetailNavbar from "@/components/navbar/DetailNavbar";

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

  return (
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
      </main>

      <Footer />
    </div>
  );
}
