import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import UmkmDetail from "@/components/Umkm/UmkmDetail";
import { umkms } from "@/data/umkm";
import Footer from "@/components/Footer";

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
        <div className="max-w-7xl mx-auto px-5 pt-8 md:px-6">
          <nav className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-500">
            <Link
              href="/"
              className="hover:text-[#9764dc] transition-colors"
            >
              Dashboard
            </Link>

            <span>›</span>

            <Link
              href={`/kecamatan/${kecamatanSlug}`}
              className="hover:text-[#9764dc] transition-colors"
            >
              {umkm.kecamatan}
            </Link>

            <span>›</span>

            <span className="font-medium text-gray-900 truncate max-w-[180px] md:max-w-none">
              {umkm.nama}
            </span>
          </nav>
        </div>

        <UmkmDetail {...umkm} />
      </main>

      <Footer />
    </div>
  );
}