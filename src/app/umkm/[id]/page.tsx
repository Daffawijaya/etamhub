import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import UmkmDetail from "@/components/Umkm/UmkmDetail";
import { umkms } from "@/data/umkm";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UmkmPage({ params }: Props) {
  const { id } = await params;

  const umkm = umkms.find((item) => item.id === Number(id));

  if (!umkm) {
    notFound();
  }

  const kecamatanSlug = umkm.kecamatan
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
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

        <UmkmDetail {...umkm} />
      </main>

      <Footer />
    </div>
  );
}
