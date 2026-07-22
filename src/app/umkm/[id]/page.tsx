import { notFound } from "next/navigation";
import UmkmDetail from "@/components/Umkm/UmkmDetail";
import umkms from "@/data/umkm.json";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import DetailNavbar from "@/components/navbar/DetailNavbar";

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
    <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark">
      <DetailNavbar />

      <main
        className="
          relative
          flex-1
          overflow-hidden
          py-20
        "
      >
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
