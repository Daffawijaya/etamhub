import Link from "next/link";
import { umkms } from "@/data/umkm";
import { slugify } from "@/lib/slugify";
import UmkmCard from "@/components/UmkmCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Props = {
  params: Promise<{
    district: string;
  }>;
};

export default async function KecamatanPage({ params }: Props) {
  const { district } = await params;

  const data = umkms.filter((item) => slugify(item.kecamatan) === district);

  const districtName = (data[0]?.kecamatan ?? district ?? "Tidak Diketahui")
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="w-full max-w-7xl mx-auto px-6 py-20">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500 pt-8">
          <Link href="/" className="hover:text-[#9764dc] transition-colors">
            Dashboard
          </Link>

          <span>›</span>

          <span className="font-medium text-gray-900">{districtName}</span>
        </nav>

        {data.length === 0 ? (
          <div className="py-5 rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">
              Belum ada data UMKM di kecamatan ini.
            </p>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {data.map((item) => (
              <UmkmCard
                key={item.id}
                id={item.id}
                nama={item.nama}
                kategori={item.kategori}
                gambar={item.gambar}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
