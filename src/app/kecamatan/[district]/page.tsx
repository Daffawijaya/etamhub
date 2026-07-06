import { umkms } from "@/data/umkm";
import { slugify } from "@/lib/slugify";
import UmkmCard from "@/components/UmkmCard";
import Navbar from "@/components/Navbar";

type Props = {
  params: Promise<{
    district: string;
  }>;
};

export default async function KecamatanPage({ params }: Props) {
  const { district } = await params;

  const data = umkms.filter((item) => slugify(item.kecamatan) === district);

  const districtName = (data[0]?.kecamatan || district)
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return (
    <div className="min-h-screen ">
      <Navbar />
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-violet-400/15 blur-3xl" />

        <div className="absolute top-[400px] right-0 w-[600px] h-[600px] rounded-full bg-blue-400/15 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full bg-pink-400/15 blur-3xl" />
      </div>
      <main className="w-full max-w-7xl mx-auto px-6 py-10 mt-20">
        <h1 className="text-3xl font-bold">Kecamatan {districtName}</h1>

        <p className="mt-2 text-slate-600">Total UMKM: {data.length}</p>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {data.map((item) => (
            <UmkmCard
              key={item.id}
              nama={item.nama}
              kategori={item.kategori}
              gambar={item.gambar}
              slug={item.slug}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
